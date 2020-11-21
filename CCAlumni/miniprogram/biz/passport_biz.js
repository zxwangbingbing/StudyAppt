/**
 * Notes: 注册登录模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../helper/cache_helper.js');
const cloudHelper = require('../helper/cloud_helper.js');
const setting = require('../helper/setting.js');
const helper = require('../helper/helper.js');
const comm = require('../helper/comm.js');
const pageHelper = require('../helper/page_helper.js');
const bizHelper = require('../helper/biz_helper.js');
const CACHE_SETUP = 'SYS_SETUP';

class PassportBiz extends BaseBiz {

	/**
	 * 获取系统配置
	 */
	static async setSetup(that) { 
		let setup =  {
			SETUP_TITLE : '',
			
		}
	 
			setup.ver = setting.VER;
			that.setData({
				setup,
				skin:'skin1'
			});
		 
	}

	// 清除参数
	static async clearSetup() {
		cacheHelper.remove(CACHE_SETUP);
	}

	/**
	 * 页面初始化
	 * @param {*} that 
	 */
	static initPage(that) {
	 
 
	}

	static initApp() {
		 
	}


	/**
	 * 聊天室是否有小圆点
	 */
	static async isChatReadRedDot() {
		let opt = {
			hint: false
		};
		return await cloudHelper.callCloudSumbit('chat/is_read', {}, opt).then(result => {
			return result.data.count;
		}).catch(err => {
			console.log(err);
		})
	}

	/**
	 * 必须登陆 只能注册(窗口形式)
	 */
	static async loginMustAdminWin(that) {
		that.setData({
			isAdmin: true
		});
		return true;
	}


	/**
	 * 必须登陆 只能取消(窗口形式)
	 */
	static async loginMustCancelWin(that) {
		return await PassportBiz.loginCheck(true, 2, true, '', that);
	}

	/**
	 * 必须登陆 只能返回(窗口形式)
	 */
	static async loginMustReturnWin(that) {
		return await PassportBiz.loginCheck(true, 1, true, '', that);
	}


	/**
	 * 必须登陆 只能注册(窗口形式)
	 */
	static async loginMustRegWin(that) {
		return await PassportBiz.loginCheck(true, 0, true, '', that);
	}


	/**
	 * 必须登陆 只能返回(跳转形式)
	 */
	static async loginMustReturnPage(that) {
		return await PassportBiz.loginCheck(true, 1, false, '', that);
	}

	/**
	 * 必须登陆 只能注册(跳转形式)
	 */
	static async loginMustRegPage(that) {
		return await PassportBiz.loginCheck(true, 0, false, '', that);
	}

	/**
	 * 静默登录
	 */
	static async loginSilence(that) {
		return await PassportBiz.loginCheck(false, 0, false, 'bar', that);
	}


	/**
	 * 是否登录
	 */
	static isLogin() {
		let id = PassportBiz.getUserId();
		return (id.length > 0) ? true : false;
	}

	static getType() {
		let token = cacheHelper.get(comm.CACHE_TOKEN);
		if (!token) return '';
		return token.type || '';
	}



	/**
	 * 是否注册
	 */
	static async isRegister(that) {
		PassportBiz.clearToken();
		
		// 判断用户是否注册
		await PassportBiz.loginCheck(false, 0, false, '校验中', that);
		if (await PassportBiz.isLogin()) {
			wx.reLaunch({
				url: '/pages/my/index/my_index',
			});
			return true;
		}
		return false;

	}

	/**
	 * 获取user id
	 */
	static getUserId() {
		if (setting.TEST_MODE) return setting.TEST_USER_ID;
		let token = cacheHelper.get(comm.CACHE_TOKEN);
		if (!token) return '';
		return token.id || '';
	}

	/**
	 * 获取user name
	 */
	static getUserName() {
		let token = cacheHelper.get(comm.CACHE_TOKEN);
		if (!token) return '';
		return token.name || '';
	}

	/**
	 * 获取user 头像
	 */
	static getUserPic() {
		let token = cacheHelper.get(comm.CACHE_TOKEN);
		if (!token) return '';
		return token.pic || '';
	}

	/**
	 * 获取user KEY
	 */
	static getUserKey() {
		let token = cacheHelper.get(comm.CACHE_TOKEN);
		if (!token) return '';
		return token.key || '';
	}

	/**
	 * 设置user 头像
	 */
	static setUserPic(pic) {
		if (!pic) return;
		let token = cacheHelper.get(comm.CACHE_TOKEN);
		if (!token) return '';
		token.pic = pic;
		cacheHelper.set(comm.CACHE_TOKEN, token, setting.PASSPORT_TOKEN_EXPIRE);
	}

	/**
	 * 获取token
	 */
	static getToken() {
		if (setting.TEST_MODE) return setting.TEST_TOKEN;
		let token = cacheHelper.get(comm.CACHE_TOKEN);
		return token || null;
	}


	/**
	 * 清除登录缓存
	 */
	static clearToken() {
		cacheHelper.remove(comm.CACHE_TOKEN);
	}

	/**
	 * 登录判断及处理
	 * @param {*} mustLogin 
	 * @param {*} returnMethod 返回方式 0=无条件注册 1=返回 2=可取消
	 * @param {*} isWin 是否窗口提示
	 * @param {*} title 是否提示登录中
	 * @param {*} that 当前页面实例，如果存在设置登录标志isLogin=true/false
	 */
	static async loginCheck(mustLogin = false, returnMethod = 0, isWin = true, title = '', that = null) {
		let token = cacheHelper.get(comm.CACHE_TOKEN);
		if (token) {
			if (that)
				that.setData({
					isLogin: true
				});
			return true;
		} else {
			if (that) that.setData({
				isLogin: false
			});
		}

		let opt = {
			title: title || '登录中',
		};

		let res = await cloudHelper.callCloudSumbit('passport/login', {}, opt).then(result => {
			if (result && helper.isDefined(result.data.token) && result.data.token) 
			{ 
				// 正常用户
				cacheHelper.set(comm.CACHE_TOKEN, result.data.token, setting.PASSPORT_TOKEN_EXPIRE);

				if (that) that.setData({
					isLogin: true
				}); 

				return true;
			} else if (mustLogin && isWin) {
				// 需要登录,且窗口提示 返回方式 0=无条件注册 1=返回 2=可取消 
				wx.redirectTo({
					url: '/pages/about/hint?type=0',
				}); 

				return false;
			} else if (mustLogin && !isWin) {

				// 需要登录, 返回方式 0=无条件注册 1=返回 2=可取消  
				if (returnMethod == 0) {
					let callback = function () {
						wx.redirectTo({
							url: '/pages/reg/reg_step1',
						})
					}
					pageHelper.showNoneToast('需要注册后使用', 1500, callback);

				} else {
					let callback = function () {
						wx.navigateBack({
							delta: 0,
						});
					}
					pageHelper.showNoneToast('需要注册后使用', 1500, callback);

				}

				return false;
			}

		}).catch(err => {
			PassportBiz.clearToken();
			let isReg = false;
			if (that) {
				let route = that.route;
				if (route == 'pages/reg/reg_step1' ||
					route == 'pages/reg/reg_step2' ||
					route == 'pages/reg/reg_step3')
					isReg = true; 
			}
			console.log(err);

			// 状态异常，无法登录，跳到错误页面
			if (err.code == cloudHelper.CODE.USER_EXCEPTION && (mustLogin || isReg)) {
				wx.redirectTo({
					url: '/pages/about/hint?type=1',
				})
			}

			// 待审核用户
			if (err.code == cloudHelper.CODE.USER_CHECK && (mustLogin || isReg)) {

				if (isWin || isReg) {
					// 需要登录,且窗口提示 返回方式 0=无条件注册 1=返回 2=可取消 
					if (isReg) { 
						pageHelper.hint('用户正在审核，无须重复注册'); 
					}
					else {
						wx.redirectTo({
							url: '/pages/about/hint?type=2',
						});
					}
					
				} else {
					// 需要登录, 返回方式 0=无条件注册 1=返回 2=可取消  
					if (returnMethod == 0) {
						let callback = function () {
							wx.switchTab({
								url: '/pages/my/index/my_index',
							});
						}
						pageHelper.showNoneToast('正在用户审核，暂无法使用本功能', 1500, callback);

					} else {
						let callback = function () {
							wx.navigateBack({
								delta: 0,
							});
						}
						pageHelper.showNoneToast('正在用户审核，暂无法使用本功能', 1500, callback);

					}
				}

			}


			return false;
		});


		return res;

	}
}

module.exports = PassportBiz;