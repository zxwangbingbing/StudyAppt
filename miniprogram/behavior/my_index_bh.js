const cacheHelper = require('../helper/cache_helper.js');
const pageHelper = require('../helper/page_helper.js');
const cloudHelper = require('../helper/cloud_helper.js');
const timeHelper = require('../helper/time_helper.js');
const PassortBiz = require('../biz/passport_biz.js');
const setting = require('../setting/setting.js');

module.exports = Behavior({
	data: {
		myTodayList: null
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {
			if (setting.IS_SUB) wx.hideHomeButton();
		},

		_loadTodayList: async function () {
			try {
				let params = {
					day: timeHelper.time('Y-M-D')
				}
				let opts = {
					title: 'bar'
				}
				await cloudHelper.callCloudSumbit('my/my_join_someday', params, opts).then(res => {
					this.setData({
						myTodayList: res.data
					});
				});
			} catch (err) {
				console.log(err)
			}
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: async function () {
			await this._loadTodayList();
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
			if (!user) return;

			this.setData({
				user
			})
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: async function () {
			await this._loadTodayList();
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
		onShareAppMessage: function () {},

		url: function (e) {
			pageHelper.url(e, this);
		},

		setTap: function (e, skin) {
			let itemList = ['清除缓存', '后台管理'];
			wx.showActionSheet({
				itemList,
				success: async res => {
					let idx = res.tapIndex;
					if (idx == 0) {
						cacheHelper.clear();
						pageHelper.showNoneToast('清除缓存成功');
					}

					if (idx == 1) {
						pageHelper.setSkin(skin);
						if (setting.IS_SUB) {
							PassortBiz.adminLogin('admin', '123456', this);
						} else {
							wx.reLaunch({
								url: '/pages/admin/index/login/admin_login',
							});
						}

					}

				},
				fail: function (res) {}
			})
		}
	}
})