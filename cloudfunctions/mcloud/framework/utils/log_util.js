 /**
  * Notes: 日志操作函数
  * Ver : CCMiniCloud Framework 2.34.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
  * Date: 2021-06-12 04:00:00 
  */
 const timeUtil = require('./time_util.js');

 class LogUtil {

 	constructor(level = 'info') {
 		this.logOut = ''; // 输出日志内容

 		level = level.toLowerCase();
 		if (level == 'err') level = 'error';

 		switch (level) {
 			case 'debug':
 				level = LogUtil.LEVEL.DEBUG;
 				break;
 			case 'info':
 				level = LogUtil.LEVEL.INFO;
 				break;
 			case 'warn':
 				level = LogUtil.LEVEL.WARN;
 				break;
 			case 'error':
 				level = LogUtil.LEVEL.ERROR;
 				break;
 			case 'fatal':
 				level = LogUtil.LEVEL.FATAL;
 				break;
 			case 'none':
 				level = LogUtil.LEVEL.NONE;
 				break;
 			default:
 				level = LogUtil.LEVEL.INFO;
 		}
 		this.level = level;
 	}

 	debug(str, ex = '') {
 		if (this.level > LogUtil.LEVEL.DEBUG) return;

 		console.debug('[' + this._getTime() + '] DEBUG: ' + str, ex);
 		this.logOut += "######" + '[' + this._getTime() + '] DEBUG: ' + str + (ex ? JSON.stringify(ex) : '');
 	}

 	info(str, ex = '') {
 		if (this.level > LogUtil.LEVEL.INFO) return;

 		console.log('[' + this._getTime() + '] INFO: ' + str, ex);

 		this.logOut += "######" + '[' + this._getTime() + '] INFO: ' + str + (ex ? JSON.stringify(ex) : '');
 	}

 	warn(str, ex = '') {
 		if (this.level > LogUtil.LEVEL.WARN) return;

 		console.warn('[' + this._getTime() + '] WARN: ' + str, ex);
 		this.logOut += "######" + '[' + this._getTime() + '] WARN: ' + str + (ex ? JSON.stringify(ex) : '');
 	}

 	error(str, ex = '') {
 		if (this.level > LogUtil.LEVEL.ERROR) return;

 		console.error('[' + this._getTime() + '] ERROR: ' + str, ex);
 		this.logOut += "######" + '[' + this._getTime() + '] ERROR: ' + str + (ex ? JSON.stringify(ex) : '');
 	}

 	fatal(str, ex = '') {
 		if (this.level > LogUtil.LEVEL.FATAL) return;
 		console.error('[' + this._getTime() + '] FATAL: ' + str, ex);
 		this.logOut += "######" + '[' + this._getTime() + '] FATAL: ' + str + (ex ? JSON.stringify(ex) : '');
 	}


 	_getTime() {
 		return timeUtil.time('Y-M-D h:m:s');
 	}

 	err(str) {
 		error(str);
 	}

 	getLogOut() {
 		return this.logOut;
 	}

 }

 LogUtil.LEVEL = {
 	DEBUG: 10,
 	INFO: 20,
 	WARN: 30,
 	ERROR: 40,
 	FATAL: 50,
 	NONE: 100,
 };

 module.exports = LogUtil;