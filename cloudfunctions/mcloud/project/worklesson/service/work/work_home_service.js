/**
 * Notes: 服务者首页管理模块 
 * Date: 2023-01-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.8 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectWorkService = require('./base_project_work_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');

const MeetModel = require('../../model/meet_model.js');

const MeetService = require('../../service/meet_service.js');

class WorkHomeService extends BaseProjectWorkService {


	/**
	 * 首页数据归集
	 */
	async workHome(meetId) {

		let meetService = new MeetService();
		let dayList = await meetService.getDaysSet(meetId, timeUtil.time('Y-M-D'));
		let dayCnt = dayList.length;

		return { dayCnt };
	}


	// 登录  
	async workLogin(phone, password, openId) {


		// 判断是否存在
		let where = {
			MEET_PHONE: phone,
			MEET_PASSWORD: md5Lib.md5(password),
			MEET_STATUS: MeetModel.STATUS.COMM
		}
		let fields = 'MEET_PHONE,MEET_ID,MEET_TITLE,MEET_OBJ,MEET_LOGIN_TIME,MEET_LOGIN_CNT';
		let meet = await MeetModel.getOne(where, fields);
		if (!meet)
			this.AppError('该账号不存在或者密码错误');

		let cnt = meet.MEET_LOGIN_CNT;

		// 生成token
		let token = dataUtil.genRandomString(32);
		let tokenTime = timeUtil.time();
		let data = {
			MEET_MINI_OPENID: openId,
			MEET_TOKEN: token,
			MEET_TOKEN_TIME: tokenTime,
			MEET_LOGIN_TIME: timeUtil.time(),
			MEET_LOGIN_CNT: cnt + 1
		}
		await MeetModel.edit(where, data);

		let name = meet.MEET_TITLE;
		let id = meet._id;
		let last = (!meet.MEET_LOGIN_TIME) ? '尚未登录' : timeUtil.timestamp2Time(meet.MEET_LOGIN_TIME);
		let pic = '';
		if (meet.MEET_OBJ && meet.MEET_OBJ.cover && meet.MEET_OBJ.cover.length > 0)
			pic = meet.MEET_OBJ.cover[0];

		return {
			id,
			token,
			name,
			last,
			cnt,
			pic
		}

	}

	/** 修改自身密码 */
	async pwdWork(workId, oldPassword, password) {
		let where = {
			_id: workId,
			MEET_PASSWORD: md5Lib.md5(oldPassword),
		}
		let work = await MeetModel.getOne(where);
		if (!work)
			this.AppError('旧密码错误');

		let data = {
			MEET_PASSWORD: md5Lib.md5(password),
		}
		return await MeetModel.edit(workId, data);
	}

}

module.exports = WorkHomeService;