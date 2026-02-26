const FootBiz = require('../biz/foot_biz.js');
const pageHelper = require('../../helper/page_helper.js');

module.exports = Behavior({
	/**
	 * 页面的初始数据
	 */
	data: {
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {
			this._loadList();
		},

		_loadList: async function (e) {
			let footList = FootBiz.getFootList();
			this.setData({
				footList
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
		onPullDownRefresh: async function () {
			await this._loadList();
			wx.stopPullDownRefresh();
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {

		},

		url: function (e) {
			pageHelper.url(e, this);
		}
	}
})