const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const timeHelper = require('../../../../../helper/time_helper.js');
const qrcodeLib = require('../../../../../lib/tools/qrcode_lib.js');
const MeetBiz = require('../../../biz/meet_biz.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		isShowHome: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);
		if (!pageHelper.getOptions(this, options)) return;

		if (!await PassportBiz.loginMustBackWin(this)) return;


		this._loadDetail();

		if (options && options.flag == 'home') {
			this.setData({
				isShowHome: true
			});
		}
	},

	_loadDetail: async function (e) {
		let id = this.data.id;
		if (!id) return;

		let params = {
			joinId: id
		}
		let opts = {
			title: 'bar'
		}
		try {
			let join = await cloudHelper.callCloudData('meet/my_join_detail', params, opts);
			if (!join) {
				this.setData({
					isLoad: null
				})
				return;
			}

			let qrImageData = qrcodeLib.drawImg('meet=' + join.JOIN_CODE, {
				typeNumber: 1,
				errorCorrectLevel: 'L',
				size: 100
			});

			this.setData({
				isLoad: true,
				join,
				qrImageData
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
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}, 

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindNoticeTap: function (e) {
		let callback = () => {
			pageHelper.showSuccToast('开启成功');
		}
		MeetBiz.subscribeMessageMeet(callback);
	},

	bindCalendarTap: function (e) {
		let join = this.data.join;
		let title = join.JOIN_MEET_TITLE;

		let startTime = timeHelper.time2Timestamp(join.JOIN_MEET_DAY + ' ' + join.JOIN_MEET_TIME_START + ':00') / 1000;
		let endTime = timeHelper.time2Timestamp(join.JOIN_MEET_DAY + ' ' + join.JOIN_MEET_TIME_END + ':00') / 1000;

		pageHelper.addPhoneCalendar(title, startTime, endTime);
	}
})