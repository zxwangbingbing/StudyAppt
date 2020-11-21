/**
 * Notes: passport模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-10 19:52:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseController = require('./base_controller.js');
const PassportService = require('../service/passport_service.js');
const contentCheck = require('../framework/validate/content_check.js');

class PassportController extends BaseController {

	/**
	 * 获取UnionID 
	 */
	async getUnionId() {

		// 数据校验
		let rules = {
			cloudID: 'required|string|min:1|max:200|name=cloudID',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new PassportService();
		return await service.getUnionId(input.cloudID);
	}

	/**
	 * 获取手机号码 
	 */
	async getPhone() {

		// 数据校验
		let rules = {
			cloudID: 'required|string|min:1|max:200|name=cloudID',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new PassportService();
		return await service.getPhone(input.cloudID);
	}

	/**
	 * 注册
	 * @param {*} formData=表单填写数据,wechatData微信授权数据,phone授权的手机数据
	 */
	async register() {
		// 数据校验
		let rules = {
			phone: 'required|string',
			formData: 'required|object',
			inviteData: 'required|object',
			wechatData: 'required|object',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMulti(input.formData);

		let service = new PassportService();
		return await service.register(this._userId, input);
	}

	/**
	 * 修改用户资料
	 * @param {*} formData=表单填写数据
	 */
	async modifyBase() {
		// 数据校验
		let rules = {
			formData: 'required|object',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMulti(input.formData);

		let service = new PassportService();
		return await service.modifyBase(this._userId, input);
	}

	/**
	 * 登录 
	 */
	async login() {
		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new PassportService();
		return await service.login(this._userId);
	}

	/**
	 * 修改用户头像 
	 */
	async updatePic() {
		// 数据校验
		let rules = {
			fileID: 'required|string',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new PassportService();
		return await service.updatePic(this._userId, input.fileID);
	}

}

module.exports = PassportController;