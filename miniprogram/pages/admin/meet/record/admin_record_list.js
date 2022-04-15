const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
const timeHelper = require('../../../../helper/time_helper.js');


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		now: timeHelper.time('Y-M-D'),

		searchDayStart: '',
		searchDayEnd: '',

		daysSet: null,

		title: '',
		titleEn: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!pageHelper.getOptions(this, options, 'meetId')) return;

		if (!AdminBiz.isAdmin(this)) return;

		let searchDayStart = timeHelper.time('Y-M-D');
		let searchDayEnd = timeHelper.time('Y-M-D');
		this.setData({
			searchDayStart,
			searchDayEnd
		}, () => {
			this._loadDetail();
		});

		if (options && options.title) {
			let title = decodeURIComponent(options.title);
			this.setData({
				title,
				titleEn: options.title
			});
			wx.setNavigationBarTitle({
				title: '预约名单统计 - ' + title
			});
		}

	},

	_loadDetail: async function () {
		let meetId = this.data.meetId;
		if (!meetId) return;

		let params = {
			meetId,
			start: this.data.searchDayStart,
			end: this.data.searchDayEnd
		};
		let opt = {
			title: 'bar'
		};
		try {
			this.setData({
				daysSet: null
			});
			await cloudHelper.callCloudSumbit('admin/meet_day_list', params, opt).then(res => {
				this.setData({
					isLoad: true,
					daysSet: res.data
				}); 
			});
		} catch (err) {
			console.error(err); 
		}


	},

	bindSearchTomorrowTap: function (e) {
		this.setData({
			searchDayStart: timeHelper.time('Y-M-D', 86400),
			searchDayEnd: timeHelper.time('Y-M-D', 86400),
		}, () => {
			this._loadDetail();
		});
	},

	bindSearchYesterdayTap: function (e) {
		this.setData({
			searchDayStart: timeHelper.time('Y-M-D', -86400),
			searchDayEnd: timeHelper.time('Y-M-D', -86400),
		}, () => {
			this._loadDetail();
		});
	},


	bindSearchTodayTap: function (e) {
		this.setData({
			searchDayStart: timeHelper.time('Y-M-D'),
			searchDayEnd: timeHelper.time('Y-M-D'),
		}, () => {
			this._loadDetail();
		});
	},

	onPageScroll: function (e) {
		if (e.scrollTop > 100) {
			this.setData({
				topShow: true
			});
		} else {
			this.setData({
				topShow: false
			});
		}
	},

	bindTopTap: function () {
		wx.pageScrollTo({
			scrollTop: 0
		})
	},

	bindSearchTap: function (e) {
		this._loadDetail();
	},

	url: function (e) {
		pageHelper.url(e, this);
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
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},


})