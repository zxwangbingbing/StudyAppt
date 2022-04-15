/**
 * Notes: 本业务基本控制器
 * Date: 2021-03-15 19:20:00 
 */

const timeUtil = require('../../framework/utils/time_util.js');
const Controller = require('../../framework/client/controller.js');
const dataCheck = require('../../framework/validate/data_check.js');
const config = require('../../config/config.js');
const util = require('../../framework/utils/util.js');
const AppError = require('../../framework/core/app_error.js');
const appCode = require('../../framework/core/app_code.js');
const BaseService = require('../service/base_service.js');

global.PID = 'unknown';

class BaseController extends Controller {

	constructor(route, openId, event) {
		super(route, openId, event);

		if (config.TEST_MODE)
			openId = config.TEST_TOKEN_ID;

		if (!openId) {
			console.error('OPENID is unfined');
			throw new AppError('OPENID is unfined', appCode.SVR);
		}

		// 模板判定
		if (config.PID) {
			global.PID = config.PID;
		} else {
			if (event.PID) global.PID = event.PID;
		}

		console.log(`【↘event.PID=${event.PID}, global.PID=${global.PID}】`);

		let userId = openId;

		this._token = event.token || '';

		this._userId = userId;

		// 当前时间戳
		this._timestamp = timeUtil.time();
		let time = timeUtil.time('Y-M-D h:m:s');

		console.log('------------------------');
		console.log(`【${time}】【Request -- ↘↘↘】\n【↘Token = ${this._token}】\n【↘USER-ID = ${userId}】\n【↘↘IN DATA】=\n`, JSON.stringify(this._request, null, 4));



	}

	/**
	 * 数据校验
	 * @param {*} rules 
	 */
	validateData(rules = {}) {
		let input = this._request;
		return dataCheck.check(input, rules);
	}

	// 取得某个具体的参数值
	getParameter(name) {
		let input = this._request;
		if (util.isDefined(input[name]))
			return input[name];
		else
			return '';
	}

	async initSetup() {
		let service = new BaseService();
		await service.initSetup();
	}
}

module.exports = BaseController;