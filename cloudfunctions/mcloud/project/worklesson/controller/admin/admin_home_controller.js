/**
 * Notes: 后台登录与首页模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-03-15 19:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');
const AdminHomeService = require('../../service/admin/admin_home_service.js');

class AdminHomeController extends BaseProjectAdminController {


	// 管理首页 
	async adminHome() {
		await this.isAdmin();

		// 数据校验
		let rules = {

		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminHomeService();
		return await service.adminHome();
	}


	// 清除首页推荐
	async clearVouchData() {
		await this.isAdmin();

		// 数据校验
		let rules = {

		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminHomeService();
		return await service.clearVouchData();
	}

}

module.exports = AdminHomeController;