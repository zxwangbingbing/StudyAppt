const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
const validate = require('../../../../helper/validate.js');
const setting = require('../../../../setting/setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		this._loadDetail();
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

	_loadDetail: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let opts = {
			'title': 'bar'
		};
		let setup = await cloudHelper.callCloudData('home/setup_all', {}, opts);
		if (!setup) {
			return;
		};

		this.setData({
			isLoad: true,

			// 表单数据   
			formAbout: setup.SETUP_ABOUT,
			formAboutPic: setup.SETUP_ABOUT_PIC

		});
	},


	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;

		// 数据校验 
		let rules = {
			about: 'formAbout|must|string|min:10|max:50000|name=关于我们',
		}
		data = validate.check(data, rules, this);
		if (!data) return;

		try {
			// 图片上传到云空间
			let aboutPic = this.data.formAboutPic;
			if (aboutPic.length > 0) {
				wx.showLoading({
					title: '图片上传中',
				});
			}

			aboutPic = await cloudHelper.transTempPics(aboutPic, setting.SETUP_PIC_PATH, '');

			data.aboutPic = aboutPic;
			await cloudHelper.callCloudSumbit('admin/setup_about', data).then(res => {
				let callback = () => {
					wx.navigateBack({
						delta: 0,
					});
				}
				pageHelper.showSuccToast('编辑成功', 1500, callback);
			});



		} catch (err) {
			console.log(err);
		}

	},

	bindUploadCmpt: function (e) {
		let item = pageHelper.dataset(e, 'item');
		this.setData({
			[item]: e.detail
		});
	},


})