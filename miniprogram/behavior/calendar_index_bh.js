const cloudHelper = require('../helper/cloud_helper.js');
const pageHelper = require('../helper/page_helper.js');
const timeHelper = require('../helper/time_helper.js');
const setting = require('../setting/setting.js');

module.exports = Behavior({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		list: [],

		day: '',
		hasDays: []
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {
			if (setting.IS_SUB) wx.hideHomeButton();
		},

		_loadList: async function () {
			let params = {
				day: this.data.day
			}
			let opts = {
				title: this.data.isLoad ? 'bar' : 'bar'
			}
			try {
				this.setData({
					list: null
				});
				await cloudHelper.callCloudSumbit('meet/list_by_day', params, opts).then(res => {
					this.setData({
						list: res.data,
						isLoad: true
					});
				});
			} catch (err) {
				console.error(err);
			}
		},

		_loadHasList: async function () {
			let params = {
				day: timeHelper.time('Y-M-D')
			}
			let opts = {
				title: 'bar'
			}
			try {
				await cloudHelper.callCloudSumbit('meet/list_has_day', params, opts).then(res => {
					this.setData({
						hasDays: res.data,
					});
				});
			} catch (err) {
				console.error(err);
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
		onShow: async function () {
			this.setData({
				day: timeHelper.time('Y-M-D')
			}, async () => {
				await this._loadHasList();
				await this._loadList();
			});
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
			await this._loadHasList();
			await this._loadList();
			wx.stopPullDownRefresh();
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function () {

		},

		bindClickCmpt: async function (e) {
			let day = e.detail.day;
			this.setData({
				day
			}, async () => {
				await this._loadList();
			})

		},

		bindMonthChangeCmpt: function (e) {
			console.log(e.detail)
		},

		url: async function (e) {
			pageHelper.url(e, this);
		},
	}
})