/**
 * Notes: 设置控制模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');
const AdminSetupService = require('../../service/admin/admin_setup_service.js');
const contentCheck = require('../../../../framework/validate/content_check.js');

class AdminSetupController extends BaseProjectAdminController {

	// 通用setup
	async setSetup() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			key: 'must|string|name=KEY',
			content: 'name=内容',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminSetupService();
		await service.setSetup(input.key, input.content);
	}

	// 富文本setup
	async setContentSetup() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|string|name=KEY',
			content: 'must|array|name=内容'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminSetupService();
		await service.setContentSetup(input.id, input.content, 'content');
	}

	async genMiniQr() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			path: 'must|string',
			sc: 'string',
		};

		// 取得数据
		let input = this.validateData(rules);


		let service = new AdminSetupService();
		return await service.genMiniQr(input.path, input.sc);
	}
}

module.exports = AdminSetupController;