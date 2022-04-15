const cloudHelper = require('../helper/cloud_helper.js');
const pageHelper = require('../helper/page_helper.js');


module.exports = Behavior({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {

			if (!pageHelper.getOptions(this, options)) return;

			this._loadDetail();

		},

		_loadDetail: async function () {
			let id = this.data.id;
			if (!id) return;

			let params = {
				id,
			};
			let opt = {
				title: 'bar'
			};
			let news = await cloudHelper.callCloudData('news/view', params, opt);
			if (!news) {
				this.setData({
					isLoad: null
				})
				return;
			}


			this.setData({
				isLoad: true,
				news,

			});

		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function () {},

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
		onPullDownRefresh: async function () {
			await this._loadDetail();
			wx.stopPullDownRefresh();
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {

		},

		url: function (e) {
			pageHelper.url(e, this);
		},

		onPageScroll: function (e) {
			// 回页首按钮
			pageHelper.showTopBtn(e, this);

		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function (res) {

		}
	}

})