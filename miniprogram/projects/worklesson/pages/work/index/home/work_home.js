const WorkBiz = require('../../../../biz/work_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
	
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	_loadDetail: async function () {
		try {
			let opts = {
				title: 'bar'
			}
			let res = await cloudHelper.callCloudData('work/home', {}, opts);
			this.setData({
				stat: res
			});

		} catch (err) {
			console.log(err);
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
		if (!WorkBiz.isWork(this)) {
			this.setData({
				isLoad:false
			});
			return;
		}
		
		// 用于修改图片后更新展示
		let work = WorkBiz.getWorkToken();
		this.setData({
			isLoad: true,
			work,
			id: work.id
		});

		await this._loadDetail();
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

	url: function (e) {
		pageHelper.url(e, this);
	},



	bindExitTap: function (e) {

		let callback = function () {
			WorkBiz.clearWorkToken();
			wx.reLaunch({
				url: '../../../my/index/my_index',
			});
		}
		pageHelper.showConfirm('您确认退出?', callback);
	},

})