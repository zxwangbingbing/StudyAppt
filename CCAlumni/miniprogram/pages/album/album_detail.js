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
		isEdit: false,

		auto: true,
		current: 0,
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
		let album = await cloudHelper.callCloudData('album/view', params, opt);
		if (!album) return;

		this.setData({
			isLoad: true,
			album,
			isEdit: (album.ALBUM_USER_ID === PassportBiz.getUserId()),  
		});

		// 足迹
		FootBiz.addFoot(id, bizHelper.TYPE.ALBUM, album.ALBUM_TITLE);
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

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	url: function (e) {
		pageHelper.url(e);
	},

	onPageScroll: function (e) {
		// 回页首按钮
		pageHelper.showTopBtn(e, this);

	},

	/**
	 * 编辑 
	 */
	bindEditTap: function (e) {
		wx.redirectTo({
			url: 'album_edit?id=' + this.data.id,
		});
	},

	top: function (e) {
		// 回页首事件
		pageHelper.top();
	},

	/**
	 * 删除 
	 */
	bindDelTap: async function (e) {
		if (!await PassportBiz.loginMustRegWin(this)) return;

		let id = this.data.id;
		let callback = async function () {
			await cloudHelper.callCloudSumbit('album/del', {
				id
			}).then(res => {
				pageHelper.delPrevPageListNode(id);
				pageHelper.showSuccToast('删除成功', 1500, function () {
					wx.switchTab({
						url: 'album_index',
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
			title: this.data.album.ALBUM_TITLE,
			path: '/pages/album/album_detail?id=' + this.data.id,
		}
	},

	bindAlbumChange: function (e) {
		this.setData({
			current: e.detail.current
		})
	},
	catchPrevImgTap: function () {
		let current = this.data.current;
		current = current < (this.data.album.ALBUM_PIC.length - 1) ? current + 1 : 0;
		this.setData({
			current,
		})
	},

	catchAutoTap: function () {
		this.setData({
			auto: !this.data.auto
		});
	},

	catchNextImgTap: function () {
		let current = this.data.current;
		current = current > 0 ? current - 1 : this.data.album.ALBUM_PIC.length - 1;
		this.setData({
			current,
		})
	},

})