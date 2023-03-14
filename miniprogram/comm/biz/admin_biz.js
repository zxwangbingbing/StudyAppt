/**
 * Notes: 后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../../helper/cache_helper.js');
const cloudHelper = require('../../helper/cloud_helper.js');
const pageHelper = require('../../helper/page_helper.js');
const constants = require('../constants.js');
const setting = require('../../setting/setting.js');

class AdminBiz extends BaseBiz {

	// 文章内容
	static setContentDesc(that) {
		let contentDesc = '未填写';
		let content = that.data.formContent;
		let imgCnt = 0;
		let textCnt = 0;
		for (let k = 0; k < content.length; k++) {
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

	static async adminLogin(that, name, pwd) {
		if (name.length < 5 || name.length > 30) {
			wx.showToast({
				title: '账号输入错误(5-30位)',
				icon: 'none'
			});
			return;
		}

		if (pwd.length < 5 || pwd.length > 30) {
			wx.showToast({
				title: '密码输入错误(5-30位)',
				icon: 'none'
			});
			return;
		}

		let params = {
			name,
			pwd
		};
		let opt = {
			title: '登录中'
		};

		try {
			await cloudHelper.callCloudSumbit('admin/login', params, opt).then(res => {
				if (res && res.data && res.data.name)
					cacheHelper.set(constants.CACHE_ADMIN, res.data, constants.ADMIN_TOKEN_EXPIRE);

				wx.reLaunch({
					url: pageHelper.fmtURLByPID('/pages/admin/index/home/admin_home'),
				});
			});
		} catch (e) {
			console.log(e);
		}

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
	static isAdmin(that, isSuper = false) {
		wx.setNavigationBarColor({ //顶部
			backgroundColor: '#2499f2',
			frontColor: '#ffffff',
		});

		if (setting.IS_SUB) wx.hideHomeButton();

		let admin = cacheHelper.get(constants.CACHE_ADMIN);
		if (!admin) {
			return wx.showModal({
				title: '',
				content: '登录已过期，请重新登录',
				showCancel: false,
				confirmText: '确定',
				success: res => {
					wx.reLaunch({
						url: pageHelper.fmtURLByPID('/pages/admin/index/login/admin_login'),
					});
					return false;
				}
			});

		}

		if (isSuper && admin.type != 1) {
			return wx.showModal({
				title: '',
				content: '此功能需要超级管理员操作',
				showCancel: false,
				confirmText: '确定',
				success: res => {
					wx.reLaunch({
						url: pageHelper.fmtURLByPID('/pages/admin/index/home/admin_home'),
					});
					return false;
				}
			});
		}

		that.setData({
			isAdmin: true,
			isSuperAdmin: this.isSuperAdmin()
		});
		return true;
	}

}

AdminBiz.CHECK_FORM_MGR_ADD = {
	name: 'formName|must|string|min:5|max:30|name=账号',
	desc: 'formDesc|must|string|max:30|name=姓名',
	phone: 'formPhone|string|len:11|name=手机',
	password: 'formPassword|must|string|min:6|max:30|name=密码',
};

AdminBiz.CHECK_FORM_MGR_EDIT = {
	name: 'formName|must|string|min:5|max:30|name=账号',
	desc: 'formDesc|must|string|max:30|name=姓名',
	phone: 'formPhone|string|len:11|name=手机',
	password: 'formPassword|string|min:6|max:30|name=新密码',
};

AdminBiz.CHECK_FORM_MGR_PWD = {
	oldPassword: 'formOldPassword|must|string|min:6|max:30|name=旧密码',
	password: 'formPassword|must|string|min:6|max:30|name=新密码',
	password2: 'formPassword2|must|string|min:6|max:30|name=新密码再次填写',
};


module.exports = AdminBiz;