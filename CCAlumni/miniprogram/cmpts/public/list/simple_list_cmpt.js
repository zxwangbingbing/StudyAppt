const cloudHelper = require('../../../helper/cloud_helper.js');
const bizHelper = require('../../../helper/biz_helper.js');
const pageHelper = require('../../../helper/page_helper.js');
const helper = require('../../../helper/helper.js');
const PassportBiz = require('../../../biz/passport_biz.js');

Component({
	options: {
		//pureDataPattern: /^_dataList/, // 指定所有 _ 开头的数据字段为纯数据字段
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		router: { // 业务路由
			type: String,
			value: ''
		},
		_params: { //路由的附加参数
			type: Object,
			value: {}
		},
		_dataList: {
			type: Object,
			value: null
		},
		type: {
			type: String, //业务类型 info,user,well
			value: ''
		},

		whereEx: {
			type: Object, // 附加查询条件
			value: null,
		},

		topBottom: {
			type: String, // 回顶部按钮的位置
			value: '50'
		},

		isCache: {
			type: Boolean, //是否cache
			value: true
		},
		skin: {
			type: String, // 皮肤
			value: ''
		},
		isLoad: {
			type: Boolean, //数据加载中
			value: false
		},
		dataNoHint: {
			type: String, //无数据提示
			value: '暂无数据'
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		refresherTriggered: false, //下拉刷新是否完成  

		topNum: 0, //回顶部
		topShow: false,
	},

	lifetimes: {
		created: function () {
			// 组件实例化，但节点树还未导入，因此这时不能用setData
		},
		attached: function () {
			// 在组件实例进入页面节点树时执行 
			// 节点树完成，可以用setData渲染节点，但无法操作节点 
		},
		ready: async function () {
			PassportBiz.initPage(this);

			// 组件布局完成，这时可以获取节点信息，也可以操作节点 
			await this._getList(1);
		},
		move: function () {
			// 组件实例被移动到树的另一个位置
		},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	pageLifetimes: {
		async show() {
			// 页面被展示   
			if (!this.data.isCache || !bizHelper.isCacheList(this.data.type))
				await this._getList(1);
		},
		hide() {
			// 页面被隐藏
		},
		resize(size) {
			// 页面尺寸变化
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		reload: async function () {
			await this._getList(1);
		},
		// 数据列表
		_getList: async function (page) {

			let params = {
				page: page,
				...this.data._params
			};
			if (this.data.whereEx) params.whereEx = this.data.whereEx;

			if (page == 1 && !this.data._dataList) {
				this.triggerEvent('myCommListEvent', {
					dataList: null //第一页面且没有数据提示加载中
				});
			}


			let opt = {};
			//if (this.data._dataList && this.data._dataList.list && this.data._dataList.list.length > 0)
			opt.title = 'bar';
			await cloudHelper.dataList(this, '_dataList', this.data.router, params, opt);

			this.triggerEvent('myCommListEvent', { //TODO 考虑改为双向数据绑定model 
				dataList: this.data._dataList
			});

			if (this.data.isCache)
				bizHelper.setCacheList(this.data.type);
		},

		bindReachBottom: async function () {
			// 上拉触底 
			this.setData({
				isLoad: true
			});
			await this._getList(this.data._dataList.page + 1);
			this.setData({
				isLoad: false
			});
		},

	}
})