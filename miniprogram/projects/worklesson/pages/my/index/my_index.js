/** 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-10-29 07:48:00 
 */

const cacheHelper = require('../../../../../helper/cache_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const AdminBiz = require('../../../../../comm/biz/admin_biz.js');
const WorkBiz = require('../../../biz/work_biz.js');
const setting = require('../../../../../setting/setting.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	data: {
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (PassportBiz.isLogin()) {
			let user = {};
			user.USER_NAME = PassportBiz.getUserName();
			this.setData({ user });
		}

		ProjectBiz.initPage(this);

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		PassportBiz.loginSilenceMust(this);
		this._loadUser();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	_loadUser: async function (e) {

		let opts = {
			title: 'bar'
		}
		let user = await cloudHelper.callCloudData('passport/my_detail', {}, opts);
		if (!user) {
			this.setData({
				user: null
			});
			return;
		}

		this.setData({
			user
		})
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadUser();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},


	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () { },

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindSetTap: function (e, skin) {
		let itemList = ['清除缓存', '后台管理', '老师平台'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				let idx = res.tapIndex;
				if (idx == 0) {
					cacheHelper.clear();
					pageHelper.showNoneToast('清除缓存成功');
				}

				if (idx == 1) {
					if (setting.IS_SUB) {
						AdminBiz.adminLogin(this, 'admin', '123456');
					} else {
						wx.reLaunch({
							url: '../../admin/index/login/admin_login',
						});
					}

				}

				if (idx == 2) {
					if (setting.IS_SUB) {
						WorkBiz.workLogin(this, '13700000000', '123456');
					} else {
						wx.reLaunch({
							url: '../../work/index/login/work_login',
						});
					}

				}

			},
			fail: function (res) { }
		})
	}
})