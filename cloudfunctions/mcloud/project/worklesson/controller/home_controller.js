/**
 * Notes: 全局或者主页模块控制器 
 * Date: 2020-11-05 10:20:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectController = require('./base_project_controller.js');
const HomeService = require('../service/home_service.js');

class HomeController extends BaseProjectController {

	async getSetup() {
		// 数据校验
		let rules = {
			key: 'must|string|name=KEY',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new HomeService();
		return await service.getSetup(input.key);

	}


	/** 首页推荐列表 */
	async getHomeList() {
		let service = new HomeService();
		return await service.getHomeList(); 
	}

}

module.exports = HomeController;