/**
 * Notes: 微信缓存二次封装，有设置时效性的封装
 * Ver : CCMiniCloud Framework 3.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-11-14 07:48:00 
 */
const helper = require('./helper.js');

const TIME_SUFFIX = "_deadtime"

/**
 * 设置
 * k 键key
 * v 值value
 * t 秒
 */
function set(k, v, t = 86400 * 30) {
	if (!k) return null;

	wx.setStorageSync(k, v);
	let seconds = parseInt(t);
	if (seconds > 0) {
		let newtime = Date.parse(new Date());
		newtime = newtime / 1000 + seconds;
		wx.setStorageSync(k + TIME_SUFFIX, newtime + "");
	} else {
		wx.removeStorageSync(k + TIME_SUFFIX);
	}
}
 

/**
 * 获取
 * k 键key
 * def 默认值
 */
function get(k, def = null) {
	if (!k) return null;

	let deadtime = wx.getStorageSync(k + TIME_SUFFIX); 
	if (!deadtime) return def;
 
	deadtime = parseInt(deadtime); 
	if (!deadtime) return def;
	
	if (deadtime) {
		if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
			wx.removeStorageSync(k); 
			wx.removeStorageSync(k + TIME_SUFFIX); 
			return def;
		}
	} 

	let res = wx.getStorageSync(k);
 
	if (helper.isDefined(res)) {
		return res;
	} else {
		return def;
	}
}

/**
 * 删除
 */
function remove(k) {
	if (!k) return null;
	
	wx.removeStorageSync(k);
	wx.removeStorageSync(k + TIME_SUFFIX);
}

/**
 * 清除所有key
 */
function clear() {
	wx.clearStorageSync();
}

module.exports = {
	set,
	get,
	remove,
	clear
}