/**
 * Notes: 后台管理模块 基类
 * Date: 2021-03-15 07:48:00 
 */

const BaseService = require('../base_service.js');

const cloudBase = require('../../../framework/cloud/cloud_base.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const appCode = require('../../../framework/core/app_code.js');

const config = require('../../../config/config.js');

const AdminModel = require('../../model/admin_model.js');
const LogModel = require('../../model/log_model.js');
const MeetModel = require('../../model/meet_model.js');
const UserModel = require('../../model/user_model.js');
const NewsModel = require('../../model/news_model.js'); 

class BaseAdminService extends BaseService {


	/** 是否管理员 */
	async isAdmin(token) {

		// 马甲判断,自动登录 
		if (config.MASK_IS_OPEN && token == (config.MASK_ADMIN_PHONE + config.MASK_ADMIN_TOKEN)) {
			let admin = {};
			admin.ADMIN_NAME = 'mask-admin';
			admin.ADMIN_ID = '9999';
			admin.ADMIN_PHONE = config.MASK_ADMIN_PHONE;
			admin.ADMIN_LOGIN_CNT = 9999;
			admin.ADMIN_LOGIN_TIME = '';
			admin.ADMIN_TYPE = 1;
			admin.ADMIN_STATUS = 1;
			return admin;
		} else if (config.IS_DEMO) { // 演示版本
			let admin = {};
			admin.ADMIN_NAME = '体验用户';
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
		let admin = await AdminModel.getOne(where, 'ADMIN_ID,ADMIN_PHONE,ADMIN_NAME,ADMIN_TYPE');
		if (!admin)
			this.AppError('管理员不存在', appCode.ADMIN_ERROR);

		return admin;
	}

	/** 是否超级管理员 */
	async isSuperAdmin(token) {

		// 马甲判断,自动登录 
		if (config.MASK_IS_OPEN && token == (config.MASK_ADMIN_PHONE + config.MASK_ADMIN_TOKEN)) {
			let admin = {};
			admin.ADMIN_NAME = 'mask-admin';
			admin.ADMIN_ID = '9999';
			admin.ADMIN_PHONE = config.MASK_ADMIN_PHONE;
			admin.ADMIN_LOGIN_CNT = 9999;
			admin.ADMIN_LOGIN_TIME = '';
			admin.ADMIN_TYPE = 1;
			admin.ADMIN_STATUS = 1;
			return admin;
		}

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

		if (config.MASK_IS_OPEN && config.MASK_ADMIN_PHONE && admin.ADMIN_PHONE == config.MASK_ADMIN_PHONE) return;

		let data = {
			LOG_CONTENT: content,

			LOG_ADMIN_ID: admin.ADMIN_ID,
			LOG_ADMIN_NAME: admin.ADMIN_NAME,  
			LOG_TYPE: type
		}
		await LogModel.insert(data);
	}

	/** 日志操作前获取名称 */
	async getNameBeforeLog(type, oid) {
		let name = '';
		switch (type) { 
			case 'news': {
				let news = await NewsModel.getOne(oid, 'NEWS_TITLE');
				name = news.NEWS_TITLE;
				break;
			}
			case 'meet': {
				let meet = await MeetModel.getOne(oid, 'MEET_TITLE');
				name = meet.MEET_TITLE;
				break;
			}
			case 'admin': {
				let admin = await AdminModel.getOne(oid, 'ADMIN_NAME');
				name = admin.ADMIN_NAME;
				break;
			}
			case 'user': {
				let user = await UserModel.getOne({
					USER_MINI_OPENID: oid
				}, 'USER_MOBILE');
				name = user.USER_MOBILE;
				break;
			}
		}
		return name;
	}

}

module.exports = BaseAdminService;