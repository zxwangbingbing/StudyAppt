
const pageHelper = require('../../../helper/page_helper.js');
const dataHelper = require('../../../helper/data_helper.js');
const helper = require('../../../helper/helper.js');
const cloudHelper = require('../../../helper/cloud_helper.js');
const rowsSetHelper = require('rows_set_helper.js');

Component({
	options: {
		addGlobalClass: true,
	},
	/**
	 * 组件的属性列表
	 */
	properties: {
		list: {
			type: Array,
			value: []
		},

		ext: { //对于所有参数的集中传入
			type: Object,
			value: {}
		},


		hasPic: { //是否带题图
			type: Boolean,
			value: false
		},
		hasDetail: { //是否带详情
			type: Boolean,
			value: false
		},
		hasVal: { //是否同时填值
			type: Boolean,
			value: false
		},

		checkDetail: { //详情是否校验
			type: Boolean,
			value: false
		},
		checkPic: { //图片是否校验
			type: Boolean,
			value: false
		},

		maxCnt: { //最大数量
			type: Number,
			value: 100
		},
		minCnt: { //最小数量
			type: Number,
			value: 2
		},


		titleName: { //标题
			type: String,
			value: '条目'
		},

		valName: { //内容名
			type: String,
			value: '内容'
		},

		picName: { //题图名
			type: String,
			value: '图片'
		},

		detailName: { //详情名
			type: String,
			value: '详情'
		},



		isDemo: { //是否演示
			type: Boolean,
			value: true
		},
		valMode: { //填值模式 input textarea
			type: String,
			value: 'input'
		},

		mark: { //id标识
			type: String,
			value: 'rows'
		},
		parentMark: { //引用其的父组件id标识 一般为editor
			type: String,
			value: ''
		},
		upDirectDir: { //不为空：则在非测试模式下直接上传
			type: String,
			value: 'rows/', //editor/
		}

	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	lifetimes: {
		attached: function () {

		},
		ready: function () {
			this._init();
		},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		_init: function () {
			let list = rowsSetHelper.fmtRows(this.data.list);
			this.triggerEvent('change', list);
			this.setData({ list });

			// ext集中参数传入
			let entries = Object.entries(this.data.ext);
			for (let k = 0; k < entries.length; k++) {
				this.setData({ [entries[k][0]]: entries[k][1] });
			}
		},

		bindAddTap: function (e) {
			let list = this.data.list;
			//	if (list.length >= this.data.maxCnt) return pageHelper.showModal('最多可以添加' + this.data.maxCnt + '个' + this.data.titleName);

			list.push(dataHelper.deepClone(rowsSetHelper.BASE_ROW));
			this.setData({
				list
			});
			this.triggerEvent('change', list);
		},
		bindDelTap: function (e) {
			let list = this.data.list;
			//	if (list.length <= this.data.minCnt) return pageHelper.showModal('至少填写' + this.data.minCnt + '个' + this.data.titleName);


			let callback = () => {
				let idx = pageHelper.dataset(e, 'idx');
				list.splice(idx, 1);
				this.setData({
					list
				});
				this.triggerEvent('change', list);
			}

			pageHelper.showConfirm('确定删除该项吗？', callback);
		},
		bindTitleBlur: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let val = e.detail.value.trim();
			let list = this.data.list;
			list[idx].title = val;

			/*
			this.setData({
				list
			});*/

			this.triggerEvent('change', list);
		},
		bindValBlur: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let val = e.detail.value.trim();
			let list = this.data.list;
			list[idx].val = val;

			/*
			this.setData({
				list
			});*/

			this.triggerEvent('change', list);
		},
		bindPicTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');

			let cb = () => {
				wx.chooseMedia({
					count: 1,
					mediaType: ['image'],
					sourceType: ['album', 'camera'],
					success: async res => {
						let pic = res.tempFiles[0].tempFilePath;
						let list = this.data.list;

						if (!this.data.isDemo) {
							wx.showLoading({ title: '上传中' });
							list[idx].pic = await cloudHelper.transTempPicOne(pic, 'rows/', '', false);
							wx.hideLoading();
						}
						else
							list[idx].pic = pic;

						this.setData({
							list
						});
						this.triggerEvent('change', list);
					}
				});
			}

			if (this.data.list[idx].pic) {
				wx.showActionSheet({
					itemList: ['更换' + this.data.picName, '删除' + this.data.picName],
					success: async res => {
						switch (res.tapIndex) {
							case 0: {
								cb();
								break;
							}
							case 1: {
								let callback = () => {
									let list = this.data.list;
									list[idx].pic = '';
									this.setData({
										list
									});
									this.triggerEvent('change', list);
								}
								pageHelper.showConfirm('确认删除?', callback);
								break;
							}
						}


					},
					fail: function (res) { }
				})
			}
			else
				cb();
		},

		getOneFormVal: function (idx) { //提供给父节点读取 对应的富文本值
			return this.data.list[idx].detail;
		},
		setOneFormVal: function (idx, detail)   //提供给父节点设定 对应的富文本值
		{
			let list = this.data.list;

			this.data.list[idx].detail = detail;
			this.setData({ list });
			this.triggerEvent('change', list);
		},
		checkForms: function (e) {

			//数据校验

			let list = this.data.list;

			for (let k = 0; k < list.length; k++) {
				delete list[k].focus;
				this.setData({ list });
			}

			let name = this.data.titleName;


			if (list.length > this.data.maxCnt) {
				return pageHelper.showModal(name + '最大可以填写' + this.data.maxCnt + '项，请删减之后再提交', '温馨提示')
			}

			if (list.length < this.data.minCnt) {
				return pageHelper.showModal(name + '至少需要填写' + this.data.minCnt + '项，请增加之后再提交', '温馨提示')
			}

			for (let k = 0; k < list.length; k++) {

				let no = k + 1;
				let node = list[k];
				let focus = '';


				//标题 
				if (node.title.length == 0) {
					if (this.data.hasVal)
						focus = name + no + '标题不能为空';
					else
						focus = name + no + '不能为空';
				}

				//填值
				else if (this.data.hasVal && node.val.length == 0) {
					focus = name + no + this.data.valName + '不能为空';
				}


				// 图片 
				else if (this.data.hasPic && this.data.checkPic && node.pic.length == 0) {
					focus = '请上传' + name + no + this.data.picName;
				}

				// 详情
				else if (this.data.hasDetail && this.data.checkDetail && node.detail.length == 0) {
					focus = '请填写' + name + no + this.data.detailName;
				}

				if (focus) {
					node.focus = focus;
					this.setData({ list });
					return pageHelper.showModal(focus, '温馨提示')
				}

			}


			return true;
		},
		url: function (e) {
			pageHelper.url(e, this);
		}
	}
})
