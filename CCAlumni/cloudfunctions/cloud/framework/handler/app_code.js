/**
 * Notes: 错误代码定义
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */
module.exports = {
	SUCC: 200,
	SVR: 500, //服务器错误  
	LOGIC: 1600, //逻辑错误 
	DATA: 1301, // 数据校验错误 
	HEADER: 1302, // header 校验错误  
	NOT_USER: 1303, // 用户不存在
	USER_EXCEPTION: 1304, // 用户异常 
	MUST_LOGIN: 1305, //需要登录 
	USER_CHECK: 1306, //用户审核中
	
	ADMIN_ERROR: 2001 //管理员错误
}