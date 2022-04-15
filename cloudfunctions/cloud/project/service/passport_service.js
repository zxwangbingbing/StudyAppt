/**
 * Notes: passport模块业务逻辑 
 * Date: 2020-10-14 07:48:00 
 */

const BaseService = require('./base_service.js');

const cloudBase = require('../../framework/cloud/cloud_base.js');
const UserModel = require('../model/user_model.js');

class PassportService extends BaseService {

	// 插入用户
	async insertUser(userId, mobile, name = '', joinCnt = 0) {
		// 判断是否存在
		let where = {
			USER_MINI_OPENID: userId
		}
		let cnt = await UserModel.count(where);
		if (cnt > 0) return;

		// 入库
		let data = {
			USER_MINI_OPENID: userId,
			USER_MOBILE: mobile,
			USER_NAME: name
		}
		await UserModel.insert(data);
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
		let fields = 'USER_MOBILE,USER_NAME,USER_CITY,USER_TRADE,USER_WORK'
		return await UserModel.getOne(where, fields);
	}

	/** 修改用户资料 */
	async editBase(userId, {
		mobile,
		name,
		trade,
		work,
		city
	}) {
		let where = {
			USER_MINI_OPENID: userId
		};
		// 判断是否存在
		let cnt = await UserModel.count(where);
		if (cnt == 0) {
			await this.insertUser(userId, mobile, name, 0);
			return;
		}

		let data = {
			USER_MOBILE: mobile,
			USER_NAME: name,
			USER_CITY: city,
			USER_WORK: work,
			USER_TRADE: trade
		};

		await UserModel.edit(where, data);

	}


}

module.exports = PassportService;