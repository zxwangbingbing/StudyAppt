const cloudHelper = require('../../helper/cloud_helper.js');
const helper = require('../../helper/helper.js');
const bizHelper = require('../../helper/biz_helper.js');
const pageHelper = require('../../helper/page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');
const FootBiz = require('../../biz/foot_biz.js');


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		isEdit: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		PassportBiz.initPage(this);

		if (!await PassportBiz.loginMustRegWin(this)) return;
		if (!pageHelper.getId(this, options)) return;

		this._loadDetail();

	},

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		let params = {
			id,
		};
		let opt = {
			hint: false
		};
		let info = await cloudHelper.callCloudData('info/view', params, opt);
		if (!info) {
			this.setData({
				isLoad: null
			})
			return;
		}

		this.setData({
			isLoad: true,
			info,
			isEdit: (info.INFO_USER_ID === PassportBiz.getUserId()),

		});

		// 足迹
		FootBiz.addFoot(id, bizHelper.TYPE.INFO, info.INFO_TITLE);
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
 

	url: function (e) {
		pageHelper.url(e);
	},

	onPageScroll: function (e) {
		// 回页首按钮
		pageHelper.showTopBtn(e, this);

	},

	top: function (e) {
		// 回页首事件
		pageHelper.top();
	},

	/**
	 * 编辑 
	 */
	bindEditTap: function (e) {
		wx.redirectTo({
			url: 'info_edit?id=' + this.data.id,
		});
	},

	/**
	 * 删除 
	 */
	bindDelTap: async function (e) {
		if (!await PassportBiz.loginMustRegWin(this)) return;

		let id = this.data.id;
		let callback = async function () {
			await cloudHelper.callCloudSumbit('info/del', {
				id
			}).then(res => {
				pageHelper.delPrevPageListNode(id);
				pageHelper.showSuccToast('删除成功', 1500, function () {
					wx.switchTab({
						url: 'info_index',
					});
				})
			}).catch(err => {});
		}

		pageHelper.showConfirm('您确认删除？删除后不可恢复', callback);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		return {
			title: this.data.info.INFO_TITLE,
			path: '/pages/info/info_detail?id=' + this.data.id,
		}
	},
	

})