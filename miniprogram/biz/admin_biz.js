/**
 * Notes: 后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../helper/cache_helper.js'); 
const setting = require('../setting/setting.js');
const constants = require('../biz/constants.js'); 

class AdminBiz extends BaseBiz {

	// 文章内容
	static setContentDesc(that) {
		let contentDesc = '未填写';
		let content = that.data.formContent;
		let imgCnt = 0;
		let textCnt = 0;
		for (let k in content) {
			if (content[k].type == 'img') imgCnt++;
			if (content[k].type == 'text') textCnt++;
		}

		if (imgCnt || textCnt) {
			contentDesc = textCnt + '段文字，' + imgCnt + '张图片';
		}
		that.setData({
			contentDesc
		});
	}

	/**
	 * 管理员登录
	 * @param {*} admin 
	 */
	static adminLogin(admin) {
		cacheHelper.set(constants.CACHE_ADMIN, admin, setting.ADMIN_TOKEN_EXPIRE);
	}

	/**
	 * 清空管理员登录
	 */
	static clearAdminToken() {
		cacheHelper.remove(constants.CACHE_ADMIN);
	}

	/**
	 * 获取管理员信息
	 */
	static getAdminToken() {
		return cacheHelper.get(constants.CACHE_ADMIN);
	}

	/**
	 * 获取管理员电话
	 */
	static getAdminName() {
		let admin = cacheHelper.get(constants.CACHE_ADMIN);
		if (!admin) return '';
		return admin.name;
	}

	/**
	 * 是否超级管理员
	 */
	static isSuperAdmin() {
		let admin = cacheHelper.get(constants.CACHE_ADMIN);
		if (!admin) return false;
		return (admin.type == 1);
	}

	//  登录状态判定
	static isAdmin(that) {
		wx.setNavigationBarColor({ //顶部
			backgroundColor: '#2499f2',
			frontColor: '#ffffff',
		});

		let admin = cacheHelper.get(constants.CACHE_ADMIN);
		if (!admin) {

			return wx.showModal({
				title: '',
				content: '登录已过期，请重新登录',
				showCancel: false,
				confirmText: '确定',
				success: res => {
					wx.reLaunch({
						url: '/pages/admin/index/login/admin_login',
					});
					return false;
				}
			});

		}

		that.setData({
			isAdmin: true
		});
		return true;
	}

}

module.exports = AdminBiz;