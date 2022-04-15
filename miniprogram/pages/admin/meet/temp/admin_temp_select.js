const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
const AdminMeetBiz = require('../../../../biz/admin_meet_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		temps: [],

		curIdx: -1,

		curTimeModalShow: false,
		curTimeIsLimit: false, // 当前操作是否限制人数
		curTimeLimit: 50, // 当前时段人数限制

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		await this._loadList();
	},

	switchModel: function (e) {
		pageHelper.switchModel(this, e, 'bool');
	},

	bindAllLimitSetCmpt: async function (e) {
		if (this.data.curIdx <= -1) return;
		let temp = this.data.temps[this.data.curIdx];

		try {
			let opts = {
				title: '批量修改中'
			}
			let params = {
				id: temp._id,
				limit: this.data.curTimeLimit,
				isLimit: this.data.curTimeIsLimit
			}
			await cloudHelper.callCloudSumbit('admin/temp_edit', params, opts).then(res => {
				this.setData({
					temps: res.data,
					curTimeModalShow: false,
					curTimeIsLimit: false,
					curTimeLimit: 50,
				});
				pageHelper.showSuccToast('修改成功');
			})
		} catch (err) {
			console.log(err);
		};

	},

	_loadList: async function () {
		try {
			let opts = {
				title: 'bar'
			}
			await cloudHelper.callCloudSumbit('admin/temp_list', {}, opts).then(res => {
				this.setData({
					isLoad: res.data.length == 0 ? null : true,
					temps: res.data
				})
			})
		} catch (err) {
			console.log(err);
		};
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

	onPullDownRefresh: async function () {
		await this._loadList();
		wx.stopPullDownRefresh();
	},

	bindSelectTap: function (e) {
		let curIdx = pageHelper.dataset(e, 'idx');
		let temps = this.data.temps[curIdx].TEMP_TIMES;
		let name = this.data.temps[curIdx].TEMP_NAME;

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;
		let days = parent.data.days;
		let day = days[parent.data.curIdx].day;

		let callback = () => {
			let times = [];
			for (let k in temps) {
				let node = AdminMeetBiz.getNewTimeNode(day);
				node.start = temps[k].start;
				node.end = temps[k].end;
				node.limit = temps[k].limit;
				node.isLimit = temps[k].isLimit;
				times.push(node);
			}
			days[parent.data.curIdx].times = times;
			parent.setData({
				days
			});
			wx.navigateBack({
				delta: 0,
			});
		}

		pageHelper.showConfirm('确认要选用模板 「' + name + '」配置到日期 「' + day + '」下吗?', callback);
	},

	_delTemp: async function (curIdx, id) {
		try {
			let opts = {
				title: '删除中'
			}
			let params = {
				id
			}
			await cloudHelper.callCloudSumbit('admin/temp_del', params, opts).then(res => {
				let temps = this.data.temps;
				temps.splice(curIdx, 1);
				this.setData({
					temps
				});
			})
		} catch (err) {
			console.log(err);
		};
	},

	bindOprtTap: function (e) {
		let curIdx = pageHelper.dataset(e, 'idx');

		let itemList = ['删除模板', '批量设置人数上限'];
		wx.showActionSheet({
			itemList,
			success: async res => {
				let idx = res.tapIndex;
				if (idx == 0) { // 删除
					let temps = this.data.temps;
					let name = temps[curIdx].TEMP_NAME;
					let callback = () => {
						this._delTemp(curIdx, temps[curIdx]._id);
					}

					pageHelper.showConfirm('确认要删除模板 「' + name + '」吗?', callback);
				}
				if (idx == 1) {
					this.setData({
						curIdx,
						curTimeModalShow: true
					});
				}


			},
			fail: function (res) {}
		})
	}

})