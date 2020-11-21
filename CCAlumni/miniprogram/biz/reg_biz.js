/**
 * Notes: 注册模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../helper/cache_helper.js');
const cloudHelper = require('../helper/cloud_helper.js');
const helper = require('../helper/helper.js');
const validate = require('../helper/validate.js');
const pageHelper = require('../helper/page_helper.js');

/**
 * 
 */
class RegBiz extends BaseBiz {
	/**
	 * 判断第一步是否完成
	 */
	static isStep1() {
		let cache = cacheHelper.get(RegBiz.CACHE_REG);
		if (!cache || !cache['phone'])
			return false;
		else
			return true;
	}

	/**
	 * 判断第2步是否完成
	 */
	static isStep2() {
		let cache = cacheHelper.get(RegBiz.CACHE_REG);
		if (!cache || !cache['user'])
			return false;
		else
			return true;
	}

	static clearRegCache() {
		cacheHelper.remove(RegBiz.CACHE_REG);
	}

	/**
	 * 保存已授权或者填写的信息 phone=电话 user=微信资料 form=填写的表单 invite=邀请信息
	 * @param {*} key 
	 * @param {*} val 
	 */
	static setRegCache(key, val) {
		let cache = cacheHelper.get(RegBiz.CACHE_REG);
		if (!cache) cache = {};
		cache[key] = val;
		cacheHelper.set(RegBiz.CACHE_REG, cache, 3600 * 30);
	}

	/**
	 * 获取授权或者填写的信息
	 * @param {*} key  
	 */
	static getRegCache(key) {
		let cache = cacheHelper.get(RegBiz.CACHE_REG);
		if (cache && cache[key]) return cache[key];
		return null;
	}

	/**
	 * 邀请判断
	 * @param {*} options 
	 */
	static async checkInvite(options) {

		// 判断参数
		let code = options.code; 

		if (options && options.scene) { 
			code = options.scene; 
		}
		if (!validate.isCheckId(code, 15, 20)) return; 
 
		RegBiz.setRegCache('invite', {
			code 
		}); 
	}

	/**
	 * 注册第二步
	 * @param {*} e 
	 */
	static async registerStep2(e) {
		if (e.detail.errMsg == "getUserInfo:ok") {
			let userInfo = e.detail.userInfo;
			if (!helper.isDefined(userInfo) || !userInfo)
				wx.showToast({
					title: '授权失败，请重新授权',
					icon: 'none',
					duration: 4000
				});
			else { 

				// 存储 用户信息
				RegBiz.setRegCache('user', userInfo);
				wx.navigateTo({
					url: 'reg_step3',
				})
			}
		} else
			wx.showToast({
				title: '授权失败，请重新授权',
				icon: 'none'
			});
	}

	/**
	 * 注册第一步
	 * @param {*} e 
	 */
	static async registerStep1(e) {
		if (e.detail.errMsg == "getPhoneNumber:ok") {
			let cloudID = e.detail.cloudID;
			let params = {
				cloudID
			};
			let opt = {
				title: '验证中'
			};
			let phone = await cloudHelper.callCloudData('passport/phone', params, opt);
			if (!phone || phone.length < 11)
				wx.showToast({
					title: '手机号码获取失败，请重新绑定手机号码',
					icon: 'none',
					duration: 4000
				});
			else {
				// 存储 手机号码
				RegBiz.setRegCache('phone', phone);
				// 判断是否手机授权

				wx.navigateTo({
					url: 'reg_step2',
				})
			}
		} else
			wx.showToast({
				title: '手机号码获取失败，请重启绑定手机号码',
				icon: 'none'
			});

	}
}
RegBiz.CACHE_REG = 'CACHE_REG_INFO';

module.exports = RegBiz;