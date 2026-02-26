const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const MeetBiz = require('../../../biz/meet_biz.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const setting = require('../../../../../setting/setting.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		formsList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		ProjectBiz.initPage(this);
		if (!pageHelper.getOptions(this, options)) return;
		if (!pageHelper.getOptions(this, options, 'timeMark')) return;

		if (!await PassportBiz.loginMustBackWin(this)) return;

		this._loadDetail();

	},

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		let timeMark = this.data.timeMark;
		if (!timeMark) return;

		let params = {
			meetId: id,
			timeMark
		};
		let opt = {
			title: 'bar'
		};
		let meet = await cloudHelper.callCloudData('meet/detail_for_join', params, opt);
		if (!meet) {
			this.setData({
				isLoad: null
			})
			return;
		}


		this.setData({
			isLoad: true,
			meet,
		});

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

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



	url: function (e) {
		pageHelper.url(e, this);
	},

	onPageScroll: function (e) {
		// 回页首按钮
		pageHelper.showTopBtn(e, this);

	},


	bindDel: function (e) {
		let idx = pageHelper.dataset(e, 'idx');

		let cb = () => {
			let formsList = this.data.formsList;
			formsList.splice(idx, 1);
			this.setData({ formsList });
		}
		pageHelper.showConfirm('确认删除该预约人信息?', cb);

	},

	bindSubmitCmpt: async function (e) {
		let formsList = [];
		 
			formsList = [e.detail];
			if (formsList.length == 0) return pageHelper.showModal('请先填写资料');
		 

		let callback = async () => {
			try {
				let opts = {
					title: '提交中'
				}
				let params = {
					meetId: this.data.id,
					timeMark: this.data.timeMark,
					formsList
				}
				await cloudHelper.callCloudSumbit('meet/join', params, opts).then(res => {
					let content = '预约成功！'

					wx.showModal({
						title: '温馨提示',
						showCancel: false,
						content,
						success() {
							let ck = () => {
								if (setting.IS_SUB)
									wx.redirectTo({
										url: pageHelper.fmtURLByPID('/pages/meet/my_join_list/meet_my_join_list')
									});
								else
									wx.reLaunch({
										url: pageHelper.fmtURLByPID('/pages/meet/my_join_list/meet_my_join_list')
									});
							}
							ck();
						}
					})
				})
			} catch (err) {
				console.log(err);
			};
		}
 
		callback();

	},

	bindCheckTap: async function (e) {
		this.selectComponent("#form-show").checkForms();
	},

})