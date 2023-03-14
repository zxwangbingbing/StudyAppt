/**
 * Notes: 后台管理控制器模块
 * Ver : CCMiniCloud Framework 2.0.3 ALL RIGHTS RESERVED BY cclinuX0730 (wechat)
 * Date: 2022-05-26 19:20:00 
 */

const BaseController = require('./base_controller.js');
const BaseAdminService = require('../service/base_admin_service.js');
const LogModel = require('../model/log_model.js');

const timeUtil = require('../../../framework/utils/time_util.js');

class BaseAdminController extends BaseController {

	constructor(route, openId, event) {
		super(route, openId, event);

		// 当前时间戳
		this._timestamp = timeUtil.time();

		this._admin = null;
		this._adminId = '0';

	}

	/** 是否管理员  */
	async isAdmin() {
		// 判断是否管理员
		let service = new BaseAdminService();
		let admin = await service.isAdmin(this._token);
		this._admin = admin;
		this._adminId = admin._id;
	}

	/** 是否超级管理员  */
	async isSuperAdmin() {
		// 判断是否管理员
		let service = new BaseAdminService();
		let admin = await service.isSuperAdmin(this._token);
		this._admin = admin;
		this._adminId = admin._id;
	}

	/** 记录日志 */
	async log(content, type) {
		let service = new BaseAdminService();
		await service.insertLog(content, this._admin, type);
	}

	async logSys(content) {
		await this.log(content, LogModel.TYPE.SYS);
	}

	async logUser(content) {
		await this.log(content, LogModel.TYPE.USER);
	}

	async logOther(content) {
		await this.log(content, LogModel.TYPE.OTHER);
	}

	async logNews(content) {
		await this.log(content, LogModel.TYPE.NEWS);
	}

}

module.exports = BaseAdminController;