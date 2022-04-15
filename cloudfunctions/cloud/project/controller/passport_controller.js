/**
 * Notes: passport模块控制器
 * Date: 2021-03-15 19:20:00 
 */

const BaseController = require('./base_controller.js');
const PassportService = require('../service/passport_service.js');
const contentCheck = require('../../framework/validate/content_check.js');
const timeUtil = require('../../framework/utils/time_util.js');
const util = require('../../framework/utils/util.js');
const config = require('../../config/config.js');

class PassportController extends BaseController {

	/** 取得我的用户信息 */
	async getMyDetail() {
		let service = new PassportService();
		return await service.getMyDetail(this._userId);
	}

	/** 获取手机号码 */
	async getPhone() {

		// 数据校验
		let rules = {
			cloudID: 'must|string|min:1|max:200|name=cloudID',
		};

		// 取得数据
		let input = this.validateData(rules);


		let service = new PassportService();
		return await service.getPhone(input.cloudID);
	}




	/** 修改用户资料 */
	async editBase() {
		// 数据校验
		let rules = {
			name: 'must|string|min:1|max:20',
			mobile: 'must|mobile|name=手机',
			city: 'string|max:100|name=所在城市',
			work: 'string|max:100|name=所在单位',
			trade: 'string|max:100|name=行业领域',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new PassportService();
		return await service.editBase(this._userId, input);
	}

}

module.exports = PassportController;