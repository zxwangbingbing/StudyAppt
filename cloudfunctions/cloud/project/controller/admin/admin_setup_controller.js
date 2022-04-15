/**
 * Notes: 设置控制模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-07-11 10:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');
const AdminSetupService = require('../../service/admin/admin_setup_service.js');

const contentCheck = require('../../../framework/validate/content_check.js');

class AdminSetupController extends BaseAdminController {


	/**  关于我们 */
	async setupAbout() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			about: 'must|string|min:10|max:50000|name=关于我们',
			aboutPic: 'array|name=介绍图片',
		};

		// 取得数据
		let input = this.validateData(rules);
		let service = new AdminSetupService();
		await service.setupAbout(input);

	}

	/**  联系我们 */
	async setupContact() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			phone: 'string|name=电话',
			address: 'string|name=地址',
			servicePic: 'array|name=客服二维码图片',
			officePic: 'array|name=官微二维码图片',
		};

		// 取得数据
		let input = this.validateData(rules);
		let service = new AdminSetupService();
		await service.setupContact(input);

	} 
 
	async genMiniQr() {
		await this.isAdmin(); 
		let service = new AdminSetupService();
		return await service.genMiniQr(); 
	} 
}

module.exports = AdminSetupController;