/**
 * Notes: passport模块业务逻辑 
 * Date: 2020-10-14 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectService = require('./base_project_service.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');
const UserModel = require('../model/user_model.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const LessonLogModel = require('../model/lesson_log_model.js');
const MeetService = require('../service/meet_service.js');

class PassportService extends BaseProjectService {

	// 注册
	async register(userId, {
		mobile,
		name,
		forms,
		userCheck
	}) {
		// 判断是否存在
		let where = {
			USER_MINI_OPENID: userId,
		}
		let cnt = await UserModel.count(where);
		if (cnt > 0)
			return await this.login(userId);

		if (!userCheck) {
			where = {
				USER_MOBILE: mobile
			}
			cnt = await UserModel.count(where);
			if (cnt > 0) this.AppError('该手机已注册');

			// 入库
			let data = {
				USER_TYPE: 1,
				USER_MINI_OPENID: userId,
				USER_MOBILE: mobile,
				USER_NAME: name,
				USER_OBJ: dataUtil.dbForms2Obj(forms),
				USER_FORMS: forms,
				USER_REG_TIME: this._timestamp,
				USER_LESSON_TOTAL_CNT: 30
			}
			await UserModel.insert(data);

			let meetService = new MeetService();
			meetService.editUserMeetLesson(null, userId, 30, LessonLogModel.TYPE.INIT);

			return await this.login(userId);
		}


		// 是否在校验库里
		where = {
			USER_TYPE: 0,
			USER_NAME: name,
			USER_MOBILE: mobile
		}
		cnt = await UserModel.count(where);
		if (cnt == 0)
			this.AppError('该“姓名与手机”未登记为学员，请修改或者联系管理员~');

		// 入库
		let data = {
			USER_TYPE: 1,
			USER_MINI_OPENID: userId,
			USER_OBJ: dataUtil.dbForms2Obj(forms),
			USER_FORMS: forms,
			USER_REG_TIME: this._timestamp
		}
		await UserModel.edit(where, data);

		// 更新课时记录
		LessonLogModel.edit(
			{ LESSON_LOG_USER_ID: mobile },
			{ LESSON_LOG_USER_ID: userId }
		);

		return await this.login(userId);
	}

	/** 获取手机号码 */
	async getPhone(cloudID) {
		let cloud = cloudBase.getCloud();
		let res = await cloud.getOpenData({
			list: [cloudID], // 假设 event.openData.list 是一个 CloudID 字符串列表
		});
		if (res && res.list && res.list[0] && res.list[0].data) {

			let phone = res.list[0].data.phoneNumber;

			return phone;
		} else
			return '';
	}

	/** 取得我的用户信息 */
	async getMyDetail(userId) {
		let where = {
			USER_MINI_OPENID: userId
		}
		let fields = 'USER_LESSON_TOTAL_CNT,USER_LESSON_USED_CNT,USER_MOBILE,USER_NAME,USER_FORMS,USER_OBJ,USER_STATUS,USER_CHECK_REASON'
		return await UserModel.getOne(where, fields);
	}

	/** 修改用户资料 */
	async editBase(userId, {
		mobile,
		name,
		forms,
		userCheck
	}) {
		let user = await UserModel.getOne({ USER_MINI_OPENID: userId });
		if (!user) return;

		if (!userCheck) {
			// 不校验
			let whereMobile = {
				USER_MOBILE: mobile,
				USER_MINI_OPENID: ['<>', userId]
			}
			let cnt = await UserModel.count(whereMobile);
			if (cnt > 0) this.AppError('该手机已注册，请更换');

			let data = {
				USER_MOBILE: mobile,
				USER_NAME: name,
				USER_OBJ: dataUtil.dbForms2Obj(forms),
				USER_FORMS: forms,
			};
			await UserModel.edit({ USER_MINI_OPENID: userId }, data);
			return;

		}

		if (user.USER_MOBILE != mobile || user.USER_NAME != name) { // 手机号码+姓名 出现变更 

			// 是否在校验库里
			let where = {
				USER_TYPE: 0,
				USER_NAME: name,
				USER_MOBILE: mobile
			}
			let cnt = await UserModel.count(where);
			if (cnt == 0)
				this.AppError('该“姓名与手机”未登记为学员，请修改或者联系管理员~');

			// 退出老数据
			let data = {
				USER_TYPE: 0,
				USER_MINI_OPENID: user.USER_MOBILE
			};
			await UserModel.edit(
				{ USER_MINI_OPENID: userId, USER_TYPE: 1 },
				data);

			// 赋予新数据
			data = {
				USER_TYPE: 1,
				USER_MINI_OPENID: userId,
				USER_OBJ: dataUtil.dbForms2Obj(forms),
				USER_FORMS: forms,
			};
			await UserModel.edit(
				{ USER_MINI_OPENID: mobile, USER_TYPE: 0 },
				data);

			// 退出旧课时记录
			await LessonLogModel.edit(
				{ LESSON_LOG_USER_ID: userId },
				{ LESSON_LOG_USER_ID: user.USER_MOBILE }
			);

			// 赋予新课时记录
			await LessonLogModel.edit(
				{ LESSON_LOG_USER_ID: mobile },
				{ LESSON_LOG_USER_ID: userId }
			);
		}
		else {
			// 手机号码+姓名未出现变更
			let data = {
				USER_OBJ: dataUtil.dbForms2Obj(forms),
				USER_FORMS: forms,
			};


			await UserModel.edit(
				{ USER_MINI_OPENID: userId, USER_TYPE: 1 },
				data);
		}



	}

	/** 登录 */
	async login(userId) {

		let where = {
			USER_MINI_OPENID: userId,
			USER_TYPE: 1
		};
		let fields = 'USER_ID,USER_MINI_OPENID,USER_NAME,USER_PIC,USER_STATUS';
		let user = await UserModel.getOne(where, fields);
		let token = {};
		if (user) {

			// 正常用户
			token.id = user.USER_MINI_OPENID;
			token.key = user.USER_ID;
			token.name = user.USER_NAME;
			token.pic = user.USER_PIC;
			token.status = user.USER_STATUS;

			// 异步更新最近更新时间
			let dataUpdate = {
				USER_LOGIN_TIME: this._timestamp
			};
			UserModel.edit(where, dataUpdate);
			UserModel.inc(where, 'USER_LOGIN_CNT', 1);

		} else
			token = null;

		return {
			token
		};
	}



}

module.exports = PassportService;