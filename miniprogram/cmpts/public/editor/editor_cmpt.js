const pageHelper = require('../../../helper/page_helper.js');
const dataHelper = require('../../../helper/data_helper.js');
const cloudHelper = require('../../../helper/cloud_helper.js');
const contentCheckHelper = require('../../../helper/content_check_helper.js');
const projectSetting = require('../../../setting/setting.js');

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
		viewMode: { // 整体：编辑还是预览
			type: Boolean,
			value: false,
		},
		isView: { // 编辑时：编辑还是预览
			type: Boolean,
			value: false,
		},
		upDirectDir: { //不为空：则在非测试模式下直接上传
			type: String,
			value: '', //editor/
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		cur: -1,
	},

	lifetimes: {
		attached: function () { },

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
			wx.chooseMedia({
				count: 8,
				mediaType: ['image'],
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: async res => {
					let nodeList = that.data.nodeList;
					for (let k = 0; k < res.tempFiles.length; k++) {
						let path = res.tempFiles[k].tempFilePath;
						let size = res.tempFiles[k].size;

						if (!contentCheckHelper.imgTypeCheck(path)) {
							wx.hideLoading();
							return pageHelper.showNoneToast('只能上传png、jpg、jpeg格式', 3000);
						}

						let maxSize = 20; //TODO setting
						let imageMaxSize = 1024 * 1000 * maxSize;
						console.log('IMGX SIZE=' + size + 'Byte,' + size / 1024 + 'K');
						if (!contentCheckHelper.imgSizeCheck(size, imageMaxSize)) {
							wx.hideLoading();
							return pageHelper.showModal('图片大小不能超过 ' + maxSize + '兆');
						}

						if (!projectSetting.IS_DEMO && this.data.upDirectDir) {
							wx.showLoading({ title: '上传中' });
							path = await cloudHelper.transTempPicOne(path, this.data.upDirectDir, '', false);
							wx.hideLoading();
						}

						let node = {
							type: 'img',
							val: path
						};

						nodeList.splice(idx + 1, 0, node);
					}

					that.setData({
						nodeList
					});
					//that.setGlow(idx + 1);
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
				/*
				this.setData({
					nodeList
				});*/
			}
		},
		getNodeList: function (e) {
			let nodeList = this.data.nodeList;

			// 校验是否填写了内容
			let imgCnt = 0;
			let textCnt = 0;
			for (let k = 0; k < nodeList.length; k++) {
				if (nodeList[k].type == 'img' && nodeList[k].val.trim() != '') imgCnt++;
				if (nodeList[k].type == 'text' && nodeList[k].val.trim() != '') textCnt++;
			}
			if ((imgCnt + textCnt) == 0) {
				return [];
			}

			return this.data.nodeList;
		},
	}
})