const pageHelper = require('../../../helper/page_helper.js');
const dataHelper = require('../../../helper/data_helper.js');
const contentCheckHelper = require('../../../helper/content_check_helper.js');

Component({
	options: {
		addGlobalClass: true
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		nodeList: { // [{type:'text/img',val:'txt/cloudId'}]
			type: Array,
			value: [{
				type: 'text',
				val: ''
			}]
		},
		viewMode: {
			type: Boolean,
			value: false,
		},
		isView: {
			type: Boolean,
			value: false,
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		cur: -1,
	},

	lifetimes: {
		attached: function () {},

		ready: function () {

		},

		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		url: function (e) {
			pageHelper.url(e, this);
		},
		setGlow(cur) {
			this.setData({
				cur
			});
			setTimeout(() => {
				this.setData({
					cur: -1
				});
			}, 1000);
		},
		bindAddTextTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let node = {
				type: 'text',
				val: ''
			}
			let nodeList = this.data.nodeList;
			nodeList.splice(idx + 1, 0, node);
			this.setData({
				nodeList
			});

			this.setGlow(idx + 1);
		},
		bindAddImageTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let that = this;
			wx.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success(res) {
					let path = res.tempFilePaths[0];
					let size = res.tempFiles[0].size;

					if (!contentCheckHelper.imgTypeCheck(path)) {
						wx.hideLoading();
						return pageHelper.showNoneToast('只能上传png、jpg、jpeg格式', 3000);
					}

					let maxSize = 10; //TODO setting
					let imageMaxSize = 1024 * 1000 * maxSize;
					console.log('IMGX SIZE=' + size + 'Byte,' + size / 1024 + 'K');
					if (!contentCheckHelper.imgSizeCheck(size, imageMaxSize)) {
						wx.hideLoading();
						return pageHelper.showModal('图片大小不能超过 ' + maxSize + '兆');
					}

					let node = {
						type: 'img',
						val: path
					};
					let nodeList = that.data.nodeList;
					nodeList.splice(idx + 1, 0, node);
					that.setData({
						nodeList
					});
					that.setGlow(idx + 1);
				}
			})
		},

		bidnDeleteNodeTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			if (this.data.nodeList.length == 1) return pageHelper.showNoneToast('至少需要一个内容框');
			nodeList.splice(idx, 1);
			this.setData({
				nodeList
			});
		},
		bindUpTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			nodeList = dataHelper.arraySwap(nodeList, idx, idx - 1);
			this.setData({
				nodeList
			});
			pageHelper.anchor('editor-node-' + (idx - 1), this);
			this.setGlow(idx - 1);
		},
		bindTopTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			nodeList = dataHelper.arrayTop(nodeList, idx);
			this.setData({
				nodeList
			});
			pageHelper.anchor('editor-node-0', this);
			this.setGlow(0);
		},
		bindBottomTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			nodeList = dataHelper.arrayBottom(nodeList, idx);
			this.setData({
				nodeList
			});
			pageHelper.anchor('editor-node-' + (nodeList.length - 1), this);
			this.setGlow(nodeList.length - 1);
		},
		bindDownTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			nodeList = dataHelper.arraySwap(nodeList, idx, idx + 1);
			this.setData({
				nodeList
			});
			pageHelper.anchor('editor-node-' + (idx + 1), this);
			this.setGlow(idx + 1);
		},

		bindTextareaInput: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let nodeList = this.data.nodeList;
			let node = nodeList[idx];
			if (node.type == 'text') {
				node.val = e.detail.value;
				nodeList[idx] = node;
				this.setData({
					nodeList
				});
			}
		},
		getNodeList: function (e) {
			return this.data.nodeList;
		},
	}
})