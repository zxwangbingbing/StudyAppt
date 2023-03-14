/**
 * Notes: 服务者管理模块业务基类
 * Date: 2023-01-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.8 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseService = require('../../../../framework/platform/service/base_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const appCode = require('../../../../framework/core/app_code.js');

const config = require('../../../../config/config.js');
const MeetModel = require('../../model/meet_model.js');

class BaseProjectWorkService extends BaseService { 

	/** 是否登陆 */
	async isWork(token) {

		let where = {
			MEET_TOKEN: token,
			MEET_TOKEN_TIME: ['>', timeUtil.time() - config.WORK_LOGIN_EXPIRE * 1000], // token有效时间
			MEET_STATUS: MeetModel.STATUS.COMM,
		}
		let meet = await MeetModel.getOne(where, '_id,MEET_TITLE');
		if (!meet)
			this.AppError('登录已过期，请重新登录', appCode.WORK_ERROR);

		return meet;
	}

}

module.exports = BaseProjectWorkService;