const cloudHelper = require('../helper/cloud_helper.js');
const pageHelper = require('../helper/page_helper.js');

module.exports = Behavior({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {
			const accountInfo = wx.getAccountInfoSync();
			this.setData({
				accountInfo
			});

			this._loadDetail();
		},

		_loadDetail: async function () {
			let opts = {
				title: 'bar'
			}
			let about = await cloudHelper.callCloudData('home/setup_all', {}, opts);
			if (!about) {
				this.setData({
					isLoad: null
				});
				return;
			}

			if (about) this.setData({
				about,
				isLoad: true
			});
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () {

		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function () {

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
		onPullDownRefresh: function () {
			this._loadDetail();
			wx.stopPullDownRefresh();
		},


		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function () {

		},

		url: function (e) {
			pageHelper.url(e, this);
		}
	}
})