/**
 * Notes: 后台管理模块业务基类
 * Date: 2021-03-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.8 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseService = require('./base_service.js');

const timeUtil = require('../../../framework/utils/time_util.js');
const appCode = require('../../../framework/core/app_code.js');

const config = require('../../../config/config.js');

const AdminModel = require('../model/admin_model.js');
const LogModel = require('../model/log_model.js'); 

class BaseAdminService extends BaseService {


	/** 是否管理员 */
	async isAdmin(token) {

		if (config.IS_DEMO) { // 演示版本
			let admin = {};
			admin.ADMIN_NAME = 'demo-admin';
			admin.ADMIN_DESC = '体验用户';
			admin.ADMIN_ID = '1';
			admin.ADMIN_PHONE = '13900000000';
			admin.ADMIN_LOGIN_CNT = 0;
			admin.ADMIN_LOGIN_TIME = '';
			admin.ADMIN_TYPE = 0;
			admin.ADMIN_STATUS = 1;
			return admin;
		}

		let where = {
			ADMIN_TOKEN: token,
			ADMIN_TOKEN_TIME: ['>', timeUtil.time() - config.ADMIN_LOGIN_EXPIRE * 1000], // token有效时间
			ADMIN_STATUS: 1,
		}
		let admin = await AdminModel.getOne(where, 'ADMIN_ID,ADMIN_PHONE,ADMIN_NAME,ADMIN_TYPE,ADMIN_DESC');
		if (!admin)
			this.AppError('管理员不存在', appCode.ADMIN_ERROR);

		return admin;
	}

	/** 是否超级管理员 */
	async isSuperAdmin(token) {

		let where = {
			ADMIN_TOKEN: token,
			ADMIN_TOKEN_TIME: ['>', timeUtil.time() - config.ADMIN_LOGIN_EXPIRE * 1000], // token有效时间
			ADMIN_STATUS: 1,
			ADMIN_TYPE: 1
		}
		let admin = await AdminModel.getOne(where, 'ADMIN_ID,ADMIN_PHONE,ADMIN_NAME,ADMIN_TYPE');
		if (!admin)
			this.AppError('超级管理员不存在', appCode.ADMIN_ERROR);

		return admin;
	}

	/** 写入日志 */
	async insertLog(content, admin, type) {
		if (!admin) return;

		let data = {
			LOG_CONTENT: content,
			LOG_ADMIN_ID: admin._id,
			LOG_ADMIN_NAME: admin.ADMIN_NAME,
			LOG_ADMIN_DESC: admin.ADMIN_DESC,
			LOG_TYPE: type
		}
		await LogModel.insert(data);
	} 

}

module.exports = BaseAdminService;