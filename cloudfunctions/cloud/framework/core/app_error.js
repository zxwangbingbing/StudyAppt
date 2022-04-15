/**
 * Notes: 应用异常处理类
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-09-05 04:00:00 
 */


const appCode = require('./app_code.js');

class AppError extends Error {
    constructor(message, code = appCode.LOGIC) {
      super(message);  
	  this.name = 'AppError';  
	  this.code = code;
    }
  }

  module.exports = AppError;