/**
 * Notes: 基本业务控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const timeUtil = require('../framework/utils/time_util.js');
const Controller = require('../framework/client/controller.js');
const dataCheck = require('../framework/validate/data_check.js');

class BaseController extends Controller {

	constructor(miniOpenId, request, router, token) {
		super(miniOpenId, request, router, token); 

		// 云函数入口文件 

		//this._cloud = cloudUtil.getCloud();
		//this._log = this._cloud.logger();
		/*
		this._db = this._cloud.database();
		this._dbCmd = this._db.command;
		this._dbAggr = this._dbCmd.aggregate;*/

		// 微信上下文   OPENID, APPID,UNIONID,CLIENTIP, CLIENTIPV6
		//this._wxContext = this._cloud.getWXContext();    
		this._userId = miniOpenId;

		// 当前时间戳
		this._timestamp = timeUtil.time();


	}

	/**
	 * 数据校验
	 * @param {*} rules 
	 */
	validateData(rules = {}) {
		let input = this._request;
		return dataCheck.check(input, rules);
	}
}

module.exports = BaseController;