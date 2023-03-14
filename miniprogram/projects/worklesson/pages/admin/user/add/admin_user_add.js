const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js'); 

Page({

	/** 
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;
 
		this.setData({
			isLoad: true
		});

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

	model: function (e) {
		pageHelper.model(this, e);
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;

		let rules = {
			name: 'formName|must|string|min:2|max:20|name=姓名',
			mobile: 'formMobile|must|string|len:11|name=手机',
			lessonCnt: 'formLessonCnt|must|int|name=课时数',
		}
		data = validate.check(data, rules, this);

		if (!data) return;

		try {
			await cloudHelper.callCloudSumbit('admin/user_insert', data).then(res => {

				let callback = async function () {
					PublicBiz.removeCacheList('admin-user-list');
					wx.navigateBack();

				}
				pageHelper.showSuccToast('添加成功', 2000, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},


})