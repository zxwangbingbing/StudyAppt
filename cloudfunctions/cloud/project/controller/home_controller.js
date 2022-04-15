/**
 * Notes: 全局或者主页模块控制器 
 * Date: 2020-11-05 10:20:00 
 */

const BaseController = require('./base_controller.js');
const HomeService = require('../service/home_service.js');
const timeUtil = require('../../framework/utils/time_util.js');
const config = require('../../config/config.js');

class HomeController extends BaseController {

	/** 获取所有配置 */
	async getSetupAll() {

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new HomeService();
		let result = await service.getSetup('SETUP_ABOUT,SETUP_ABOUT_PIC,SETUP_ADDRESS,SETUP_OFFICE_PIC,SETUP_PHONE,SETUP_SERVICE_PIC');

		return result;

	}
}

module.exports = HomeController;