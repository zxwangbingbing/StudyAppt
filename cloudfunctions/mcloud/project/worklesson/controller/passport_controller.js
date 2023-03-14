/**
 * Notes: passport模块控制器
 * Date: 2021-03-15 19:20:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectController = require('./base_project_controller.js');
const PassportService = require('../service/passport_service.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class PassportController extends BaseProjectController {

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


	/** 注册 */
	async register() {
		// 数据校验
		let rules = {
			name: 'must|string|min:1|max:30|name=昵称',
			mobile: 'must|mobile|name=手机',
			forms: 'array|name=表单',
			userCheck: 'bool|name=校验规则',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new PassportService();
		return await service.register(this._userId, input);
	}

	/** 修改用户资料 */
	async editBase() {
		// 数据校验
		let rules = {
			name: 'must|string|min:1|max:30|name=昵称',
			mobile: 'must|mobile|name=手机',
			forms: 'array|name=表单',
			userCheck: 'bool|name=校验规则',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiClient(input);

		let service = new PassportService();
		return await service.editBase(this._userId, input);
	}

	/** 登录 */
	async login() {
		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new PassportService();
		return await service.login(this._userId);
	}

}

module.exports = PassportController;