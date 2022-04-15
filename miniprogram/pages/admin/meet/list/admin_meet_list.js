const AdminBiz = require('../../../../biz/admin_biz.js');
const AdminMeetBiz = require('../../../../biz/admin_meet_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		//设置搜索菜单
		await this._getSearchMenu();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {},

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


	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindScanTap: function (e) {
		let meetId = pageHelper.dataset(e, 'id');
		let title = encodeURIComponent(pageHelper.dataset(e, 'title'));
		wx.navigateTo({
			url: '../scan/admin_meet_scan?meetId=' + meetId + '&title=' + title,
		});
	},

	bindRecordSelectTap: async function (e) {
		let itemList = ['预约名单', '导出名单Excel文件', '管理员核销预约码', '用户自助签到码'];
		let meetId = pageHelper.dataset(e, 'id');
		let title = encodeURIComponent(pageHelper.dataset(e, 'title'));

		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //预约名单 
						wx.navigateTo({
							url: '../record/admin_record_list?meetId=' + meetId + '&title=' + title,
						});
						break;
					}
					case 1: { //导出 
						wx.navigateTo({
							url: '../export/admin_join_export?meetId=' + meetId + '&title=' + title,
						});
						break;
					}
					case 2: { //核验 
						this.bindScanTap(e);
						break;
					}
					case 3: { //自助签到码 
						pageHelper.showModal('请进入「预约名单->名单」， 查看某一时段的「用户自助签到码」')
						break;
					}
				}


			},
			fail: function (res) {}
		})
	},

	bindMoreSelectTap: async function (e) {
		let itemList = ['预览'];
		let meetId = pageHelper.dataset(e, 'id');
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //预览
						wx.navigateTo({
							url: pageHelper.fmtURLByPID('/pages/meet/detail/meet_detail?id=' + meetId),
						});
						break;
					}
				}


			},
			fail: function (res) {}
		})
	},

	bindStatusSelectTap: async function (e) {
		let itemList = ['启用', '停止预约 (用户可见)', '关闭 (用户不可见)', '删除', '置顶', '取消置顶'];
		let meetId = pageHelper.dataset(e, 'id');
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //启用
						await this._setStatus(meetId, 1, this);
						break;
					}
					case 1: { //停止预约
						await this._setStatus(meetId, 9, this);
						break;
					}
					case 2: { //关闭
						await this._setStatus(meetId, 10, this);
						break;
					}
					case 3: { //删除
						await this._del(meetId, this);
						break;
					}
					case 4: { //置顶
						await this._setSort(meetId, 0, this);
						break;
					}
					case 5: { //取消置顶
						await this._setSort(meetId, 9999, this);
						break;
					}

				}


			},
			fail: function (res) {}
		})
	},

	_setSort: async function (meetId, sort, that) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!meetId) return;

		let params = {
			meetId,
			sort
		}

		try {
			await cloudHelper.callCloudSumbit('admin/meet_sort', params).then(res => {
				pageHelper.modifyListNode(meetId, that.data.dataList.list, 'MEET_ORDER', sort);
				that.setData({
					dataList: that.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_del: async function (meetId, that) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!meetId) return;

		let params = {
			meetId
		}

		let callback = async function () {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/meet_del', params, opts).then(res => {
					pageHelper.delListNode(meetId, that.data.dataList.list, '_id');
					that.data.dataList.total--;
					that.setData({
						dataList: that.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);

	},

	_setStatus: async function (meetId, status, that) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!meetId) return;

		let params = {
			meetId,
			status
		}
		try {
			await cloudHelper.callCloudSumbit('admin/meet_status', params).then(res => {
				pageHelper.modifyListNode(meetId, that.data.dataList.list, 'MEET_STATUS', status, '_id');
				that.setData({
					dataList: that.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: async function () {
		let arr = await AdminMeetBiz.getTypeList();

		let sortItems = [];
		let sortMenus = [{
				label: '全部',
				type: '',
				value: ''
			}, {
				label: '使用中',
				type: 'status',
				value: 1
			},
			{
				label: '已停止',
				type: 'status',
				value: 9
			},
			{
				label: '已关闭',
				type: 'status',
				value: 10
			},

		];
		sortMenus = sortMenus.concat(arr);
		this.setData({
			sortItems,
			sortMenus
		})


	}

})