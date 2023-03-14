const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const fileHelper = require('../../../../../../helper/file_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		url: '',
		time: '',
		condition: '',

		isLoad: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		if (options && options.condition) {
			this.setData({
				condition: options.condition
			})
		}

		this._loadDetail(1);
	},

	_loadDetail: async function (isDel) {
		if (!AdminBiz.isAdmin(this)) return;

		let params = {
			isDel
		}
		let options = {
			title: 'bar'
		}
		let data = await cloudHelper.callCloudData('admin/user_data_get', params, options);

		if (!data) return;

		this.setData({
			isLoad: true,
			url: data.url,
			time: data.time
		})

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
		await this._loadDetail(1);
		wx.stopPullDownRefresh();
	},

	bindOpenTap: function (e) {
		fileHelper.openDoc('客户数据', this.data.url);
	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	bindExportTap: async function (e) {
		try {
			let options = {
				title: '数据生成中'
			}

			let params = {
				condition: this.data.condition,
				fields: projectSetting.USER_FIELDS
			}

			await cloudHelper.callCloudData('admin/user_data_export', params, options).then(res => {

				this._loadDetail(0);
				pageHelper.showModal('数据文件生成成功(' + res.total + '条记录), 请点击「直接打开」按钮或者复制文件地址下载');

			});
		} catch (err) {
			console.log(err);
			pageHelper.showNoneToast('导出失败，请重试');
		}

	},

	bindDelTap: async function (e) {
		try {
			let options = {
				title: '数据删除中'
			}
			await cloudHelper.callCloudData('admin/user_data_del', {}, options).then(res => {
				this.setData({
					url: '',
					time: ''
				});
				pageHelper.showSuccToast('删除成功');
			});
		} catch (err) {
			console.log(err);
			pageHelper.showNoneToast('删除失败，请重试');
		}

	},


})