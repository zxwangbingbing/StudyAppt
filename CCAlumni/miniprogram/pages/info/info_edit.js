const cloudHelper = require('../../helper/cloud_helper.js');
const helper = require('../../helper/helper.js');
const validate = require('../../helper/validate.js');
const InfoBiz = require('../../biz/info_biz.js');
const pageHelper = require('../../helper/page_helper.js');
const bizHelper = require('../../helper/biz_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false
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

		if (!this.data.isLoad) this.setData(InfoBiz.initFormData(id)); // 初始化表单数据

		let params = {
			id
		};
		let opt = {
			hint: false
		};
		let info = await cloudHelper.callCloudData('info/my_detail', params, opt);
		if (!info) {
			this.setData({
				isLoad: null
			})
			return;
		}

		let formTypeIndex = InfoBiz.TYPE_OPTIONS.indexOf(info.INFO_TYPE);
		formTypeIndex = (formTypeIndex < 0) ? 0 : formTypeIndex;

		this.setData({
			isLoad: true,

			imgList: info.INFO_PIC,

			// 表单数据 
			formType: info.INFO_TYPE,
			formTypeIndex,

			formTitle: info.INFO_TITLE,
			formContent: info.INFO_CONTENT,
			formExpireTime: info.INFO_EXPIRE_TIME,
			formRegion: [info.INFO_REGION_PROVINCE, info.INFO_REGION_CITY, info.INFO_REGION_COUNTY]
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

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
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
		data.desc = helper.fmtText(data.content, 100);

		try {
			let infoId = this.data.id;
			data.id = infoId;

			// 先修改，再上传 
			await cloudHelper.callCloudSumbit('info/edit', data);

			// 图片 提交处理
			wx.showLoading({
				title: '提交中...',
				mask: true
			});

			let imgList = this.data.imgList;
			await InfoBiz.updateInfoPic(infoId, imgList);

			let callback = function () {

				// 更新列表页面数据
				pageHelper.modifyPrevPageListNode(infoId, 'INFO_TITLE', data.title);
				pageHelper.modifyPrevPageListNode(infoId, 'INFO_DESC', data.desc);
				if (imgList)
					pageHelper.modifyPrevPageListNode(infoId, 'INFO_PIC', imgList[0]);

				wx.redirectTo({
					url: "info_detail?id=" + infoId
				});
			}
			pageHelper.showSuccToast('编辑成功', 2000, callback);

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