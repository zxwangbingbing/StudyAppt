const cloudHelper = require('../helper/cloud_helper.js');
const pageHelper = require('../helper/page_helper.js');
const setting = require('../setting/setting.js');
const MeetBiz = require('../biz/meet_biz.js');

module.exports = Behavior({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		forms: [{
			mark: 'PCERZITIQH',
			val: [2, 1],
			title: 't111',
			type: 'line'
		}, {
			mark: 'SDFHUJWMLF',
			val: [false],
			title: 't111',
			type: 'line'
		}, {
			mark: 'KWTHSZLIVF1',
			val: '555',
			title: '电话1',
			type: 'line'
		}, {
			mark: 'ccc',
			val: ['广东省', '深圳市', ''],
			title: '地区1',
			type: 'mobile'
		}, {
			mark: 'ALETOSCFPZ',
			val: '777',
			title: '女朋友',
			type: 'idcard'
		}],
	},

	methods: {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: async function (options) {
			if (!pageHelper.getOptions(this, options)) return;
			if (!pageHelper.getOptions(this, options, 'timeMark')) return;

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
		onReady: function () {},

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

		bindCheckTap: async function (e) {
			this.selectComponent("#form-show").checkForms();
		},

		bindSubmitCmpt: async function (e) {
			let forms = e.detail;

			let callback = async () => {
				try {
					let opts = {
						title: '提交中'
					}
					let params = {
						meetId: this.data.id,
						timeMark: this.data.timeMark,
						forms
					}
					await cloudHelper.callCloudSumbit('meet/join', params, opts).then(res => {
						let content = '预约成功！'

						let joinId = res.data.joinId;
						wx.showModal({
							title: '温馨提示',
							showCancel: false,
							content,
							success() {
								let ck = () => {
									wx.reLaunch({
										url: pageHelper.fmtURLByPID('/pages/my/join_detail/my_join_detail?flag=home&id=' + joinId),
									})
								}
								ck();
							}
						})
					})
				} catch (err) {
					console.log(err);
				};
			}

			// 消息订阅
			await MeetBiz.subscribeMessageMeet(callback);

		}
	}
})