const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cacheHelper = require('../../../../../../helper/cache_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

const CACHE_USER_CHECK_REASON = 'CACHE_USER_CHECK_REASON';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		curIdx: -1,

		checkModalShow: false,
		formReason: '',

		lessonModalShow: false,
		lessonType: '增加',
		formLessonChangeCnt: 0,
		formLessonDesc: '',


	},

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
	onShow: async function () { },

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

	bindDelTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');

		let params = {
			id
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/user_del', params, opts).then(res => {

					pageHelper.delListNode(id, this.data.dataList.list, 'USER_MINI_OPENID');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);

	},


	bindClearReasonTap: function (e) {
		this.setData({
			formReason: ''
		})
	},

	bindCheckTap: function (e) {
		let curIdx = pageHelper.dataset(e, 'idx');
		this.setData({
			formReason: cacheHelper.get(CACHE_USER_CHECK_REASON) || '',
			curIdx,
			checkModalShow: true,
		});
	},

	bindCheckCmpt: async function () {
		let e = {
			currentTarget: {
				dataset: {
					status: 8,
					idx: this.data.curIdx
				}
			}
		}
		cacheHelper.set(CACHE_USER_CHECK_REASON, this.data.formReason, 86400 * 365);
		await this.bindStatusTap(e);
	},

	bindStatusTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let status = pageHelper.dataset(e, 'status');

		let idx = Number(pageHelper.dataset(e, 'idx'));

		let dataList = this.data.dataList;
		let id = dataList.list[idx].USER_MINI_OPENID;

		let params = {
			id,
			status,
			reason: this.data.formReason
		}

		let cb = async () => {
			try {
				await cloudHelper.callCloudSumbit('admin/user_status', params).then(res => {
						let data1Name = 'dataList.list[' + idx + '].USER_CHECK_REASON';
						let data2Name = 'dataList.list[' + idx + '].USER_STATUS';
						this.setData({
							[data1Name]: this.data.formReason,
							[data2Name]: status
						});

					this.setData({
						checkModalShow: false,
						formReason: '',
						curIdx: -1,
					});
					pageHelper.showSuccToast('操作成功');
				});
			} catch (e) {
				console.log(e);
			}
		}

		if (status == 8) {
			pageHelper.showConfirm('该用户审核不通过，用户修改资料后可重新提交审核', cb)
		}
		else
			pageHelper.showConfirm('确认执行此操作?', cb);
	},


	bindLessonTap: async function (e) {
		let curIdx = pageHelper.dataset(e, 'idx');
		let lessonType = pageHelper.dataset(e, 'type');

		this.setData({
			formLessonChangeCnt: '',
			curIdx,
			lessonModalShow: true,
			lessonType,
			formLessonDesc: '',
		});

	},


	bindLessonCmpt: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let idx = this.data.curIdx;

		let dataList = this.data.dataList;
		let id = dataList.list[idx].USER_MINI_OPENID;

		let lessonChangeCnt = Math.abs(Number(this.data.formLessonChangeCnt.trim()));
		if (!lessonChangeCnt) return pageHelper.showModal('课时数不能为空或者小于等于0');


		let params = {
			id,
			lessonChangeCnt,
			lessonType: this.data.lessonType,
			lessonDesc: this.data.formLessonDesc
		}

		try {
			await cloudHelper.callCloudSumbit('admin/meet_user_lesson', params).then(res => {
				let lessonType = this.data.lessonType;
				let cnt = 0;
				if (lessonType == '减少')
					cnt = -Number(this.data.formLessonChangeCnt) + Number(this.data.dataList.list[idx].USER_LESSON_TOTAL_CNT);
				else
					cnt = Number(this.data.formLessonChangeCnt) + Number(this.data.dataList.list[idx].USER_LESSON_TOTAL_CNT);


				this.setData({
					['dataList.list[' + idx + '].USER_LESSON_TOTAL_CNT']: cnt,
					lessonModalShow: false,
					formLessonChangeCnt: '',
					curIdx: -1,
					lessonType: '增加',
					formLessonDesc: ''
				});
				pageHelper.showSuccToast('课时' + lessonType + '成功');
			});

		}
		catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: async function () {

		let sortItems1 = [
			{ label: '创建时间', type: '', value: '' },
			{ label: '创建时间正序', type: 'sort', value: 'USER_ADD_TIME|asc' },
			{ label: '创建时间倒序', type: 'sort', value: 'USER_ADD_TIME|desc' },
		];
		let sortItems2 = [
			{ label: '课时数', type: '', value: '' },
			{ label: '课时数正序', type: 'sort', value: 'USER_LESSON_TOTAL_CNT|asc' },
			{ label: '课时数倒序', type: 'sort', value: 'USER_LESSON_TOTAL_CNT|desc' },
		];
		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '正常', type: 'status', value: 1 },
			{ label: '禁用', type: 'status', value: 9 },
			{ label: '已注册', type: 'type', value: 1 },
			{ label: '待注册', type: 'type', value: 0 }

		]


		this.setData({
			search: '',
			sortItems: [sortItems1, sortItems2],
			sortMenus,
			isLoad: true
		})


	}

})