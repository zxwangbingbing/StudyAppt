const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cacheHelper = require('../../../../helper/cache_helper.js');
const helper = require('../../../../helper/helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');

const CACHE_CANCEL_REASON = 'JOIN_CANCEL_REASON';
const CACHE_REFUSE_REASON = 'JOIN_REFUSE_REASON';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		isAllFold: true,

		parentDayIdx: 0,
		parentTimeIdx: 0,

		menuIdx: 0,

		meetId: '',
		mark: '',

		title: '',
		titleEn: '',

		cancelModalShow: false,
		cancelAllModalShow: false,
		refuseModalShow: false,
		formReason: '',
		curIdx: -1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		// 附加参数 
		if (options && options.meetId && options.mark) {
			//设置搜索菜单 
			this._getSearchMenu();

			this.setData({
				meetId: options.meetId,
				mark: options.mark,
				parentDayIdx: options.dayidx,
				parentTimeIdx: options.timeidx,
				time: options.time,

				_params: {
					meetId: options.meetId,
					mark: options.mark,
				}
			}, () => (
				this.setData({
					isLoad: true
				})
			));
		}

		if (options && options.title) {
			let title = decodeURIComponent(options.title);
			this.setData({
				title,
				titleEn: options.title
			});
			wx.setNavigationBarTitle({
				title: '分时段预约名单 - ' + title
			});
		}
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

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindUnFoldTap: function (e) {
		let idx = pageHelper.dataset(e, 'idx');
		let dataList = this.data.dataList;
		dataList.list[idx].fold = false;
		this.setData({
			dataList
		});
	},

	bindFoldTap: function (e) {
		let idx = pageHelper.dataset(e, 'idx');
		let dataList = this.data.dataList;
		dataList.list[idx].fold = true;
		this.setData({
			dataList
		});
	},

	bindFoldAllTap: function (e) {
		let dataList = this.data.dataList;
		for (let k in dataList.list) {
			dataList.list[k].fold = true;
		}
		this.setData({
			isAllFold: true,
			dataList
		});
	},

	bindUnFoldAllTap: function (e) {
		let dataList = this.data.dataList;
		for (let k in dataList.list) {
			dataList.list[k].fold = false;
		}
		this.setData({
			isAllFold: false,
			dataList
		});
	},

	bindCopyTap: function (e) {
		let idx = pageHelper.dataset(e, 'idx');
		let forms = this.data.dataList.list[idx].JOIN_FORMS;

		let ret = '';

		ret += `项目：${this.data.dataList.list[idx].JOIN_MEET_TITLE}\r`;

		ret += `时段：${this.data.dataList.list[idx].JOIN_MEET_DAY} ${this.data.dataList.list[idx].JOIN_MEET_TIME_START}～${this.data.dataList.list[idx].JOIN_MEET_TIME_END}\r`;
		for (let k in forms) {
			ret += forms[k].title + '：' + forms[k].val + '\r';
		}
		wx.setClipboardData({
			data: ret,
			success(res) {
				wx.getClipboardData({
					success(res) {
						pageHelper.showSuccToast('已复制到剪贴板');
					}
				})
			}
		});

	},

	bindCancelTap: function (e) {
		this.setData({
			formReason: cacheHelper.get(CACHE_CANCEL_REASON) || '',
			curIdx: pageHelper.dataset(e, 'idx'),
			cancelModalShow: true
		});
	},

	bindCancelAllTap: function (e) {
		this.setData({
			formReason: '',
			cancelAllModalShow: true
		});
	},

	bindRefuseTap: function (e) {
		this.setData({
			formReason: cacheHelper.get(CACHE_REFUSE_REASON) || '',
			curIdx: pageHelper.dataset(e, 'idx'),
			refuseModalShow: true
		});
	},

	bindCancelCmpt: async function () {
		let e = {
			currentTarget: {
				dataset: {
					status: 99,
					idx: this.data.curIdx
				}
			}
		}
		cacheHelper.set(CACHE_CANCEL_REASON, this.data.formReason, 86400 * 365);
		await this.bindStatusTap(e);
	},

	bindCancelAllCmpt: async function () {
		try {
			let params = {
				reason: this.data.formReason,
				meetId: this.data.meetId,
				timeMark: this.data.mark
			}
			let opt = {
				title: '预约记录取消中'
			}
			await cloudHelper.callCloudSumbit('admin/meet_cancel_time_join', params, opt).then(res => {
				let callback = () => {
					let parent = pageHelper.getPrevPage(2);
					if (parent) {
						let daysSet = parent.data.daysSet;
						daysSet[this.data.parentDayIdx].times[this.data.parentTimeIdx].stat = res.data;
						parent.setData({
							daysSet
						});
					}

					wx.redirectTo({
						url: `admin_meet_join?meetId=${this.data.meetId}&mark=${this.data.mark}&title=${this.data.titleEn}&time=${this.data.time}&dayidx=${this.data.parentDayIdx}&timeidx=${this.data.parentTimeIdx}`,
					});
				}
				pageHelper.showSuccToast('取消成功', 1500, callback);
			})
		} catch (err) {
			console.log(err);
		};
	},

	bindRefuseCmpt: async function () {
		let e = {
			currentTarget: {
				dataset: {
					status: 8,
					idx: this.data.curIdx
				}
			}
		}
		cacheHelper.set(CACHE_REFUSE_REASON, this.data.formReason, 86400 * 365);
		await this.bindStatusTap(e);
	},

	bindCheckinTap: async function (e) {
		let flag = Number(pageHelper.dataset(e, 'flag'));

		let callback = async () => {
			let idx = Number(pageHelper.dataset(e, 'idx'));
			let dataList = this.data.dataList;
			let joinId = dataList.list[idx]._id;
			let params = {
				joinId,
				flag,
			}
			let opts = {
				title: '处理中'
			}
			try {
				await cloudHelper.callCloudSumbit('admin/join_checkin', params, opts).then(res => {
					let cb = () => {
						let sortIndex = this.selectComponent('#cmpt-comm-list').getSortIndex();
						if (sortIndex >= 10 && !this.data.search) { // 全部或者检索的结果
							dataList.list.splice(idx, 1);
							dataList.total--;
						} else {
							dataList.list[idx].JOIN_IS_CHECKIN = flag;
						}
						this.setData({
							dataList
						});
					}

					pageHelper.showSuccToast('操作成功', 1000, cb);


				});
			} catch (err) {
				console.error(err);
			}
		}
		if (flag == 1)
			pageHelper.showConfirm('确认「签到核销」？', callback);
		else if (flag == 0)
			pageHelper.showConfirm('确认「取消签到」？', callback);

	},

	bindDelTap: async function (e) {

		let callback = async () => {
			let idx = Number(pageHelper.dataset(e, 'idx'));
			let dataList = this.data.dataList;
			let joinId = dataList.list[idx]._id;
			let params = {
				joinId
			}
			let opts = {
				title: '删除中'
			}
			try {
				await cloudHelper.callCloudSumbit('admin/join_del', params, opts).then(res => {

					let cb = () => {
						let dataList = this.data.dataList;
						dataList.list.splice(idx, 1);
						dataList.total--;
						this.setData({
							dataList
						});

						let parent = pageHelper.getPrevPage(2);
						if (parent) {
							let daysSet = parent.data.daysSet;
							daysSet[this.data.parentDayIdx].times[this.data.parentTimeIdx].stat = res.data;
							parent.setData({
								daysSet
							});
						}
					}

					pageHelper.showSuccToast('删除成功', 1000, cb);
				});
			} catch (err) {
				console.error(err);
			}
		}

		pageHelper.showConfirm('确认删除该预约记录？ 删除后用户将无法查询到本预约记录', callback);


	},

	bindStatusTap: async function (e) {
		let status = Number(pageHelper.dataset(e, 'status'));
		let oldStatus = Number(pageHelper.dataset(e, 'old'));

		let callback = async () => {
			let idx = Number(pageHelper.dataset(e, 'idx'));
			let dataList = this.data.dataList;
			let joinId = dataList.list[idx]._id;
			let params = {
				joinId,
				status,
				reason: this.data.formReason
			}
			let opts = {
				title: '处理中'
			}
			try {
				await cloudHelper.callCloudSumbit('admin/join_status', params, opts).then(res => {
					pageHelper.showSuccToast('操作成功', 1000);
					let sortIndex = this.selectComponent('#cmpt-comm-list').getSortIndex();

					if (sortIndex != -1 && sortIndex != 5 && !this.data.search) { // 全部或者检索的结果
						dataList.list.splice(idx, 1);
						dataList.total--;
					} else {
						dataList.list[idx].JOIN_REASON = this.data.formReason;
						dataList.list[idx].JOIN_STATUS = status;
						dataList.list[idx].JOIN_IS_CHECKIN = 0;
					}

					this.setData({
						cancelModalShow: false,
						refuseModalShow: false,
						formReason: '',
						curIdx: -1,
						dataList
					});

					let parent = pageHelper.getPrevPage(2);
					if (parent) {
						let daysSet = parent.data.daysSet;
						daysSet[this.data.parentDayIdx].times[this.data.parentTimeIdx].stat = res.data;
						parent.setData({
							daysSet
						});
					}
				});
			} catch (err) {
				console.error(err);
			}
		}

		switch (status) {
			case 99: //直接取消
				await callback();
				break;
			case 1: {

				if (oldStatus == 10)
					pageHelper.showConfirm('确认变更为「预约成功」？', callback);
				else if (oldStatus == 99)
					pageHelper.showConfirm('确认恢复为「预约成功」状态？', callback);
				break;
			}
		}

	},

	bindCommListCmpt: function (e) {

		if (helper.isDefined(e.detail.search))
			this.setData({
				search: '',
				sortType: '',
			});
		else {
			let dataList = e.detail.dataList;
			if (dataList) {
				for (let k in dataList.list) {
					dataList.list[k].fold = this.data.isAllFold;
				}
			}

			this.setData({
				dataList,
			});
			if (e.detail.sortType)
				this.setData({
					sortType: e.detail.sortType,
				});
		}

	},

	// 修改与展示状态菜单
	_getSearchMenu: function () {

		let sortItems = [];
		let sortMenus = [{
				label: '全部',
				type: '',
				value: ''
			}, {
				label: `成功`,
				type: 'status',
				value: 1
			}, 
			 
			{
				label: `已取消`,
				type: 'status',
				value: 1099
			}, 
			{
				label: `已签到`,
				type: 'checkin',
				value: 1
			},
			{
				label: `未签到`,
				type: 'checkin',
				value: 0
			}

		]
		this.setData({
			sortItems,
			sortMenus
		})


	},

	bindClearReasonTap: function (e) {
		this.setData({
			formReason: ''
		})
	}
})