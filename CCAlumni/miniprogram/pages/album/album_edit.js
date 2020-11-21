const cloudHelper = require('../../helper/cloud_helper.js');
const helper = require('../../helper/helper.js');
const validate = require('../../helper/validate.js');
const AlbumBiz = require('../../biz/album_biz.js');
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

		this._loadDetail(this.data.id);

	},

	_loadDetail: async function (id) {
		if (!this.data.isLoad) this.setData(AlbumBiz.initFormData(id)); // 初始化表单数据

		let params = {
			id
		};
		let opt = {
			hint: false
		};
		let album = await cloudHelper.callCloudData('album/my_detail', params, opt);
		if (!album) {
			return;
		};

		let formTypeIndex = AlbumBiz.TYPE_OPTIONS.indexOf(album.ALBUM_TYPE);
		formTypeIndex = (formTypeIndex < 0) ? 0 : formTypeIndex;

		this.setData({
			isLoad: true,

			imgList: album.ALBUM_PIC,

			// 表单数据 
			formType: album.ALBUM_TYPE,
			formTypeIndex,
			
			formTitle: album.ALBUM_TITLE,
			formContent: album.ALBUM_CONTENT,  
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
		await this._loadDetail(this.data.id);
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
		data.formType = AlbumBiz.TYPE_OPTIONS[data.formTypeIndex];

		// 数据校验 
		data = validate.check(data, AlbumBiz.CHECK_FORM, this);
		if (!data) return;
		data.desc = helper.fmtText(data.content, 100);

		try {
			let albumId = this.data.id;
			data.id = albumId;

			// 图片 提交处理
			let imgList = this.data.imgList;
			if (imgList.length == 0)
			{ 
				pageHelper.showModal('至少需要上传一张图片');
				return;
			}
			

			// 先修改，再上传 
			await cloudHelper.callCloudSumbit('album/edit', data);

			// 图片 提交处理
			wx.showLoading({
				title: '提交中...',
				mask: true
			}); 
		
			await AlbumBiz.updateAlbumPic(albumId, imgList);

			let callback = function () {

				// 更新列表页面数据
				pageHelper.modifyPrevPageListNode(albumId, 'ALBUM_TITLE', data.title);
				pageHelper.modifyPrevPageListNode(albumId, 'ALBUM_DESC', data.desc);
				pageHelper.modifyPrevPageListNode(albumId, 'ALBUM_PIC', imgList);

				wx.redirectTo({
					url: "album_detail?id=" + albumId
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