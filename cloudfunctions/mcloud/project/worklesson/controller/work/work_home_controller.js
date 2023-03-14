/**
 * Notes:服务者首页控制器模块
 * Ver : CCMiniCloud Framework 2.0.3 ALL RIGHTS RESERVED BY cclinuX0730 (wechat)
 * Date: 2023-01-16 19:20:00 
 */

const BaseProjectWorkController = require('./base_project_work_controller.js');
const WorkHomeService = require('../../service/work/work_home_service.js');

class WorkHomeController extends BaseProjectWorkController {

	// 首页 
	async workHome() {
		await this.isWork();

		// 数据校验
		let rules = {

		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new WorkHomeService();
		return await service.workHome(this._workId);
	}


	// 登录  
	async workLogin() {

		// 数据校验
		let rules = {
			phone: 'string|must|mobile|name=手机',
			pwd: 'string|must|min:6|max:30|name=密码',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new WorkHomeService();
		return await service.workLogin(input.phone, input.pwd, this._openId);
	}


	/** 修改自己的密码 */
	async pwdWork() {
		await this.isWork();

		// 数据校验
		let rules = {
			oldPassword: 'must|string|min:6|max:30|name=旧密码',
			password: 'must|string|min:6|max:30|name=新密码',
			password2: 'must|string|min:6|max:30|name=新密码再次填写',

		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new WorkHomeService();
		await service.pwdWork(this._workId, input.oldPassword, input.password);
	}


}

module.exports = WorkHomeController;