/**
 * Notes: 云函数业务主逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */
const util = require('../utils/util.js');
const config = require('../../comm/config.js');
const router = require('../../comm/router.js');
const cloudBase = require('../cloud/cloud_base.js');
const appCode = require('./app_code.js');
const timeUtil = require('../utils/time_util.js');


async function app(event, context) {

	// 取得openid
	const cloud = cloudBase.getCloud();
	const wxContext = cloud.getWXContext();
	let r = '';

	try {

		if (!util.isDefined(event.router)) {
			console.error('Router Not Defined');
			return handlerSvrErr();
		}

		r = event.router.toLowerCase();

		// 路由不存在
		if (!util.isDefined(router[r])) {
			console.error('Router [' + r + '] Is Not Exist');
			return handlerSvrErr();
		}

		let routerArr = router[r].split('@');

		let controllerName = routerArr[0];
		let actionName = routerArr[1];
		let token = event.token || '';
		let params = event.params;

		console.log('');
		console.log('');
		let time = timeUtil.time('Y-M-D h:m:s');
		console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
		console.log('[' + time + '][Request][Route=' + r + '], Controller=[' + controllerName + '], Action=[' + actionName + '], Token=[' + token + '], ###IN DATA=\r\n', JSON.stringify(params, null, 4));


		let openId = wxContext.OPENID;

		if (!openId) {
			console.error('OPENID is unfined');
			if (config.TEST_MODE)
				openId = config.TEST_TOKEN_ID;
			else
				return handlerSvrErr();
		}

		// 引入逻辑controller
		controllerName = controllerName.toLowerCase().replace('controller', '').trim();
		const ControllerClass = require('controller/' + controllerName + '_controller.js');
		const controller = new ControllerClass(openId, params, r, token);

		// 调用方法    
		let result = await controller[actionName]();

		// 返回值处理
		if (!result)
			result = handlerSucc(r); // 无数据返回
		else
			result = handlerData(result, r); // 有数据返回

		console.log('------');
		time = timeUtil.time('Y-M-D h:m:s');
		console.log('[' + time + '][Response][Route=' + r + '], ###OUT DATA=', result);
		console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
		console.log('');
		console.log('');

		return result;


	} catch (ex) {
		const log = cloud.logger();

		if (ex.name == 'AppError') {
			log.warn({
				router: r,
				errCode: ex.code,
				errMsg: ex.message
			});
			// 自定义error处理
			return handlerAppErr(ex.message, ex.code);
		} else {
			console.log(ex);
			log.error({
				router: r,
				errCode: ex.code,
				errMsg: ex.message,
				errStack: ex.stack
			});

			// 系统error
			return handlerSvrErr();
		}
	}
}

function handlerBasic(code, msg = '', data = {}) {

	switch (code) {
		case appCode.SUCC:
			msg = (msg) ? msg + ':ok' : 'ok';
			break;
		case appCode.SVR:
			msg = '服务器繁忙，请稍后再试';
			break;
		case appCode.LOGIC:
			break;
		case appCode.DATA:
			break;
		case appCode.USER_EXCEPTION:
			msg = msg || '用户状态异常';
			break;
		case appCode.NOT_USER:
			msg = msg || '用户不存在';
			break;
		case appCode.MUST_LOGIN:
			msg = msg || '需要登录';
			break;
		case appCode.USER_CHECK:
			msg = msg || '用户审核中';
			break;
		case appCode.ADMIN_ERROR:
			msg = msg || '管理员错误';
			break;
		default:
			msg = '服务器开小差了，请稍后再试';
			break;
	}

	return {
		code: code,
		msg: msg,
		data: data
	}

}

function handlerSvrErr(msg = '') {
	return handlerBasic(appCode.SVR, msg);
}

function handlerSucc(msg = '') {
	return handlerBasic(appCode.SUCC, msg);
}

function handlerAppErr(msg = '', code = appCode.LOGIC) {
	return handlerBasic(code, msg);
}


function handlerData(data, msg = '') {
	return handlerBasic(appCode.SUCC, msg, data);
}


module.exports = {
	app,
	handlerBasic,
	handlerData,
	handlerSucc,
	handlerSvrErr,
	handlerAppErr
}