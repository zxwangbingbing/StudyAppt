const WorkBiz = require('../../../../biz/work_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		phone: '',
		pwd: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		WorkBiz.clearWorkToken();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

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

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindBackTap: function (e) {
		wx.reLaunch({
			url: pageHelper.fmtURLByPID('/pages/my/index/my_index'),
		});
	},

	bindLoginTap: async function (e) {
		return WorkBiz.workLogin(this, this.data.phone, this.data.pwd);
	}

})