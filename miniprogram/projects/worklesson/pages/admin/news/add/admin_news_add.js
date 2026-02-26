const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');
const AdminNewsBiz = require('../../../../biz/admin_news_biz.js');
const projectSetting = require('../../../../public/project_setting.js');

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

		wx.setNavigationBarTitle({
			title: projectSetting.NEWS_NAME + '-添加',
		});

		this.setData(AdminNewsBiz.initFormData()); // 初始化表单数据
		this.setData({
			isLoad: true
		});

		this._setContentDesc();

	},

	_setContentDesc: function () {
		AdminBiz.setContentDesc(this);
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
		if (this.data.formContent.length == 0) {
			return pageHelper.showModal('详细内容不能为空');
		}
		data = validate.check(data, AdminNewsBiz.CHECK_FORM, this);
		if (!data) return;

		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms;

		data.cateName = AdminNewsBiz.getCateName(data.cateId);

		try {
			if (this.data.imgList.length == 0) {
				return pageHelper.showModal('请上传封面图');
			}

			// 提取简介
			data.desc = PublicBiz.getRichEditorDesc(data.desc, this.data.formContent);

			// 先创建，再上传 
			let result = await cloudHelper.callCloudSumbit('admin/news_insert', data);
			let newsId = result.data.id;

			// 封面图片 提交处理 
			wx.showLoading({
				title: '提交中...',
				mask: true
			});
			await cloudHelper.transCoverTempPics(this.data.imgList, 'news/', newsId, 'admin/news_update_pic');

			// 富文本
			let formContent = this.data.formContent;
			if (formContent && formContent.length > 0) {
				wx.showLoading({
					title: '提交中...',
					mask: true
				});
				let content = await cloudHelper.transRichEditorTempPics(formContent, 'news/', newsId, 'admin/news_update_content');
				this.setData({
					formContent: content
				});
			}

			await cloudHelper.transFormsTempPics(forms, 'news/', newsId, 'admin/news_update_forms');

			let callback = async function () {
				PublicBiz.removeCacheList('admin-news-list');
				PublicBiz.removeCacheList('news-list');
				wx.navigateBack();

			}
			pageHelper.showSuccToast('添加成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},


	bindImgUploadCmpt: function (e) {
		this.setData({
			imgList: e.detail
		});
	},

	url: function (e) {
		pageHelper.url(e, this);
	}
})