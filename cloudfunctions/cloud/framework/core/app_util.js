/**
 * Notes: 云函数业务主逻辑函数
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-02-09 04:00:00 
 */

const appCode = require('./app_code.js');

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

			/*
			default:
				msg = '服务器开小差了，请稍后再试';
				break;*/
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
	handlerBasic,
	handlerData,
	handlerSucc,
	handlerSvrErr,
	handlerAppErr
}