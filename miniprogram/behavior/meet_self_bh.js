const pageHelper = require('../helper/page_helper.js');
const cloudHelper = require('../helper/cloud_helper.js');

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
			if (options && options.scene) {
				let params = {
					timeMark: options.scene
				};
				let opts = {
					title: 'bar'
				}
				try {
					await cloudHelper.callCloudSumbit('my/my_join_checkin', params, opts).then(res => {
						let cb = () => {
							wx.reLaunch({
								url: pageHelper.fmtURLByPID('/pages/my/index/my_index'),
							});
						}
						pageHelper.showModal(res.data.ret, '温馨提示', cb);
					});
				} catch (err) {
					console.error(err);
				}
			} else {
				pageHelper.showModal('签到码扫描错误，请关闭本小程序，使用「微信›扫一扫」重新扫码');
			}
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

		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {

		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function () {

		}
	}
})