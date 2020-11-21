const cloudHelper = require('../../helper/cloud_helper.js');
const helper = require('../../helper/helper.js');
const bizHelper = require('../../helper/biz_helper.js');
const pageHelper = require('../../helper/page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		PassportBiz.initPage(this); 
	 
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
})