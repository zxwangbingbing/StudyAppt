const cloudHelper = require('../../helper/cloud_helper.js');
const helper = require('../../helper/helper.js');
const validate = require('../../helper/validate.js');
var InfoBiz = require('../../biz/info_biz.js');
const setting = require('../../helper/setting.js');
const pageHelper = require('../../helper/page_helper.js');
const bizHelper = require('../../helper/biz_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');

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
		PassportBiz.initPage(this);
		
		if (!await PassportBiz.loginMustRegWin(this)) return; 

		this.setData(InfoBiz.initFormData()); // 初始化表单数据
		let formExpireTime =  helper.timestamp2Time(helper.time() + 86400 * 1000 * 30, 'Y-M-D');
		this.setData({formExpireTime});
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

		let data = this.data;
		data.formType = InfoBiz.TYPE_OPTIONS[data.formTypeIndex];

		// 数据校验 
		data = validate.check(data, InfoBiz.CHECK_FORM, this);
		if (!data) return;

		try {
			// 先创建，再上传 
			let result = await cloudHelper.callCloudSumbit('info/insert', data);

			// 图片 提交处理
			let imgList = this.data.imgList;
			if (imgList.length > 0) {
				wx.showLoading({
					title: '提交中...',
					mask: true
				});

				let infoId = result.data.id;
				await InfoBiz.updateInfoPic(infoId, imgList);
			}

			let callback = async function () {
				bizHelper.removeCacheList('info');
				wx.switchTab({
					url: "info_index"
				});
			}
			pageHelper.showSuccToast('发布成功', 2000, callback);

		} catch (err) {
			console.log(err);
		} 

	},


	bindMyImgUploadListener: function (e) {
		this.setData({
			imgList: e.detail
		});
	}

})