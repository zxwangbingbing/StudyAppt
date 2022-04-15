/**
 * Notes: 注册登录模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const AdminBiz = require('./admin_biz.js');
const setting = require('../setting/setting.js');
const dataHelper = require('../helper/data_helper.js');
const cloudHelper = require('../helper/cloud_helper.js');

class PassportBiz extends BaseBiz {

	/**
	 * 页面初始化 分包下使用
	 * @param {*} skin   
	 * @param {*} that 
	 * @param {*} isLoadSkin  是否skin加载为data
	 * @param {*} tabIndex 	是否修改本页标题为设定值
	 * @param {*} isModifyNavColor 	是否修改头部导航颜色
	 */
	static async initPage({
		skin,
		that,
		isLoadSkin = false,
		tabIndex = -1,
		isModifyNavColor = true
	}) {

		if (isModifyNavColor) {
			wx.setNavigationBarColor({ //顶部
				backgroundColor: skin.NAV_BG,
				frontColor: skin.NAV_COLOR,
			});
		}


		if (tabIndex > -1) {
			wx.setNavigationBarTitle({
				title: skin.MENU_ITEM[tabIndex]
			});
		}

		skin.IS_SUB = setting.IS_SUB;
		if (isLoadSkin) {
			skin.newsCateArr = dataHelper.getSelectOptions(skin.NEWS_CATE);
			skin.meetTypeArr = dataHelper.getSelectOptions(skin.MEET_TYPE);
			that.setData({
				skin
			});
		}
	}

	static async adminLogin(name, pwd, that) {
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
				if (res && res.data && res.data.name) AdminBiz.adminLogin(res.data);

				wx.reLaunch({
					url: '/pages/admin/index/home/admin_home',
				});
			});
		} catch (e) {
			console.log(e);
		}

	}

}

module.exports = PassportBiz;