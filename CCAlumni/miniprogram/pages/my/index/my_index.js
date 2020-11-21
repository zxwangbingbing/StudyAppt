const PassportBiz = require('../../../biz/passport_biz.js');
const UserBiz = require('../../../biz/user_biz.js');
const cacheHelper = require('../../../helper/cache_helper.js');
const cloudHelper = require('../../../helper/cloud_helper.js');
const comm = require('../../../helper/comm.js');
const pageHelper = require('../../../helper/page_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		user: null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) { 
		PassportBiz.initApp();
		PassportBiz.initPage(this); 

		await this._login();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		PassportBiz.setSetup(this);

		// 小圆点
		//PassportBiz.isChatReadRedDot();
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

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._login();
		wx.stopPullDownRefresh();
	},

	//登录
	_login:async function(){
		await PassportBiz.loginSilence(this);

		// 取得token里的信息
		let token = PassportBiz.getToken();
		if (!token) { 
			return;
		}

		// 先用token里信息渲染
		let user = {};
		user.USER_PIC = token.pic;
		user.USER_NAME = token.name;
		user.USER_ITEM = token.item;
		user.USER_SEX = token.sex;
		user.USER_STATUS = token.status;

		this.setData({
			user
		});

		// 再调用服务器信息渲染
		this._getUserInfo();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	_getUserInfo: async function () {
		if (!PassportBiz.isLogin()) return;

		// 取得用户信息
		let opt = {
			title: 'bar'
		};
		let user = await cloudHelper.callCloudData('user/my_detail', {}, opt);
		if (!user || user.USER_STATUS == 0 || user.USER_STATUS == 9) { 
			pageHelper.reload();
		}
		this.setData({
			user
		});
	},

	url: function (e) {
		pageHelper.url(e);
	},

	bindAvatarTap: async function () {
		UserBiz.chooseAvatar(PassportBiz.getUserKey(), 'my_index');
	},
 
	bindSetTap: async function (e) {
		wx.showActionSheet({
			itemList: ['清除缓存', '重新登录', '退出登录'],
			success: async res => {
				let idx = res.tapIndex;
				if (idx == 0) {
					let token = PassportBiz.getToken(); 
					cacheHelper.clear();
					cacheHelper.set(comm.CACHE_TOKEN, token); 
				}
				if (idx == 1) {
					await this._login();
				}
				if (idx == 2) {
					cacheHelper.clear();
					this.setData({
						user: null
					});
				}

			},
			fail: function (res) {}
		})
	}
})