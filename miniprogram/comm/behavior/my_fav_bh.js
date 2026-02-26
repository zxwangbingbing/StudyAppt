const pageHelper = require('../../helper/page_helper.js');
const cloudHelper = require('../../helper/cloud_helper.js');

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
		},

		myCommListListener: function (e) {
			pageHelper.commListListener(this, e);
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
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {

		},

		url: function (e) {
			pageHelper.url(e, this);
		},

		bindDelTap: async function (e) {

			let oid = e.currentTarget.dataset.oid;
			if (!oid) return;
			let that = this;
			let callback = async function () {
				await cloudHelper.callCloudSumbit('fav/del', {
					oid
				}).then(res => {
					pageHelper.delListNode(oid, that.data.dataList.list, 'FAV_OID');
					that.data.dataList.total--;
					that.setData({
						dataList: that.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				}).catch(err => {
					console.log(err);
				 });
			}
			pageHelper.showConfirm('您确认删除？', callback);
		}
	}
})