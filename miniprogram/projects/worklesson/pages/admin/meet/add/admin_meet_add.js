const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');
const AdminMeetBiz = require('../../../../biz/admin_meet_biz.js');
const projectSetting = require('../../../../public/project_setting.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: true,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		wx.setNavigationBarTitle({
			title: projectSetting.MEET_NAME + '-添加'
		});

		this.setData(await AdminMeetBiz.initFormData()); // 初始化表单数据   


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

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		wx.stopPullDownRefresh();
	},


	bindJoinFormsCmpt: function (e) {
		this.setData({
			formJoinForms: e.detail,
		});
	},

	bindFormAddSubmit: async function () {
		pageHelper.formClearFocus(this);

		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;

		if (data.formDaysSet.length <= 0) {
			pageHelper.anchor('formDaysSet', this);
			return pageHelper.formHint(this, 'formDaysSet', '请配置「可预约时段」');
		}
		if (data.formJoinForms.length <= 0) return pageHelper.showModal('请至少设置一项「用户填写资料」');


		data = validate.check(data, AdminMeetBiz.CHECK_FORM, this);
		if (!data) return;


		if (data.cateId == 1 && data.phone && data.password.length == 0) {
			pageHelper.anchor('formPassword', this);
			return pageHelper.formHint(this, 'formPassword', '请设置登陆密码');
		}


		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms;

		data.cateName = AdminMeetBiz.getCateName(data.cateId);

		try {
			// 先创建，再上传 
			let result = await cloudHelper.callCloudSumbit('admin/meet_insert', data);
			let meetId = result.data.id;

			// 图片
			await cloudHelper.transFormsTempPics(forms, 'meet/', meetId, 'admin/meet_update_forms');


			let callback = async function () {
				PublicBiz.removeCacheList('admin-meet');
				PublicBiz.removeCacheList('meet-list');
				wx.navigateBack();

			}
			pageHelper.showSuccToast('添加成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},

	url: function (e) {
		pageHelper.url(e, this);
	},


	bindCateIdSelect: function (e) {
		this.setData({
			formCateId: e.detail,
		});
		if (e.detail != 1) {
			this.setData({
				formPhone: '',
				formPassword: ''
			});
		}
	}


})