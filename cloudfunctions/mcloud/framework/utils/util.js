/**
 * Notes: 通用工具函数
 * Ver : CCMiniCloud Framework 2.38.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-09-05 04:00:00 
 */

function getProjectId() {
	if (global.PID)
		return global.PID;
	else
		return 'ONE';
}

/**
 * 判断变量，参数，对象属性是否定义
 * @param {*} val 
 */
function isDefined(val) {
	// ==  不能判断是否为null
	if (val === undefined)
		return false;
	else
		return true;
}

/**
 * 判断对象是否为空
 * @param {*} obj 
 */
function isObjectNull(obj) {
	return (Object.keys(obj).length == 0);
}



/**
 * 休眠时间，配合await使用 
 * @param {*} time 毫秒
 */
function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
};




module.exports = {
	getProjectId,
	isDefined, //判断变量，参数，对象属性是否定义  
	sleep,
	isObjectNull,

}