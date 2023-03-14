const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		formName: '',
		formDesc: '',
		formPhone: '',
		formPassword: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this, true)) return;
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
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this, true)) return;

		let data = this.data;

		// 数据校验 
		data = validate.check(data, AdminBiz.CHECK_FORM_MGR_ADD, this);
		if (!data) return;

		try {
			let adminId = this.data.id;
			data.id = adminId;

			await cloudHelper.callCloudSumbit('admin/mgr_insert', data).then(res => {

				let callback = async function () {
					PublicBiz.removeCacheList('admin-mgr');
					wx.navigateBack();

				}
				pageHelper.showSuccToast('添加成功', 1500, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},
})