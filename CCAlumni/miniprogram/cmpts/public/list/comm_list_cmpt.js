const cloudHelper = require('../../../helper/cloud_helper.js');
const bizHelper = require('../../../helper/biz_helper.js');
const pageHelper = require('../../../helper/page_helper.js');
const helper = require('../../../helper/helper.js');
const PassportBiz = require('../../../biz/passport_biz.js');

Component({
	options: {
		pureDataPattern: /^_dataList/, // 指定所有 _ 开头的数据字段为纯数据字段
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
		isTotalMenu: {
			type: Boolean, //是否整个搜索菜单显示
			value: true
		},
		_items: { // 下拉菜单基础数据
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {
				if (newVal) this._fmtSearchData();
			}
		},
		_menus: { // 非下拉菜单基础数据 
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {
				if (newVal) this._fmtSearchData(); //置为纯数据字段则不触发
			}
		},
		_dataList: {
			type: Object,
			value: null
		},
		type: {
			type: String, //业务类型 info,user,well
			value: ''
		},
		placeholder: {
			type: String,
			value: '搜索关键字'
		},
		search: {
			type: String, //搜索框关键字
			value: '',
			observer: function (newVal, oldVal) {
				// 清空当前选择
				if (newVal) this._fmtSearchData();

				this.data._dataList = null;
				this.triggerEvent('myCommListEvent', { //TODO 考虑改为双向数据绑定model 
					dataList: this.data._dataList
				});
				this._getList(1);
			}
		},
		whereEx: {
			type: Object, // 附加查询条件
			value: null,
		},
		returnUrl: {
			type: String, // 搜索完返回页面
			value: '',
		},
		topBottom: {
			type: String, // 回顶部按钮的位置
			value: '50'
		},

		isCache: {
			type: Boolean, //是否cache
			value: true
		},
		skin:{
			type: String, // 皮肤
			value: ''
		}

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		refresherTriggered: false, //下拉刷新是否完成

		sortItems: [], //下拉
		sortMenus: [], //一级菜单非下拉

		sortType: '', //回传的类型
		sortVal: '', //	回传的值

		sortItemIndex: -1,
		sortIndex: -1,

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
			if (this.data.router.indexOf('admin') == -1) //后台不加载皮肤
				PassportBiz.initPage(this);   

			// 组件布局完成，这时可以获取节点信息，也可以操作节点
			this._fmtSearchData();
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

			// 搜索关键字
			if (this.data.search)
				params.search = this.data.search;

			// 搜索菜单
			if (this.data.sortType && helper.isDefined(this.data.sortVal)) {
				params.sortType = this.data.sortType;
				params.sortVal = this.data.sortVal;
			}

			if (page == 1 && !this.data._dataList){
				this.triggerEvent('myCommListEvent', {
					dataList: null //第一页面且没有数据提示加载中
				});
			}
		

			let opt = {};
			//if (this.data._dataList && this.data._dataList.list && this.data._dataList.list.length > 0)
			opt.title = 'bar'; 
			await cloudHelper.dataList(this, '_dataList', this.data.router, params, opt);
	  
			this.triggerEvent('myCommListEvent', { //TODO 考虑改为双向数据绑定model
				sortType: this.data.sortType,
				dataList: this.data._dataList
			});

			if (this.data.isCache)
				bizHelper.setCacheList(this.data.type);
			if (page == 1) this.bindTopTap();


		},

		bindReachBottom: function () {
			// 上拉触底 
			this._getList(this.data._dataList.page + 1);
		},

		bindPullDownRefresh: async function () {
			// 下拉刷新
			this.setData({
				refresherTriggered: true
			});
			await this._getList(1);
			this.setData({
				refresherTriggered: false
			});

		},

		/**
		 * 顶部位置
		 * @param {*} e 
		 */
		bindScrollTop: function (e) {
			if (e.detail.scrollTop > 100) {
				this.setData({
					topShow: true
				});
			} else {
				this.setData({
					topShow: false
				});
			}
		},

		/**
		 * 一键回到顶部
		 */
		bindTopTap: function () {
			this.setData({
				topNum: 0
			});
		},

		// 初始化搜索
		_fmtSearchData: function () {
			let data = {};
			let sortItems = [];
			let items = this.data._items;
			for (let k in items) {
				let item = {
					show: false,
					items: items[k]
				};
				sortItems.push(item);
			}
			data.sortItems = sortItems;
			data.sortMenus = this.data._menus;

			data.sortItemIndex = -1;
			data.sortIndex = -1;

			data.sortType = '';
			data.sortVal = '';
			this.setData(data);

		},

		/**
		 * 清除搜索条件
		 */
		bindSearchClearTap: function () {
			// 请求父页面清空搜索
			if (this.data.search) {
				this.triggerEvent('myCommListEvent', {
					search: ''
				});
			}
		},

		/**
		 * 分类&排序一级菜单选择 
		 */
		bindSortTap: function (e) {
			let sortIndex = e.currentTarget.dataset.index;
			let sortItems = this.data.sortItems;

			// 换了下拉菜单
			let sortItemIndex = (sortIndex != this.data.sortIndex) ? -1 : this.data.sortItemIndex;

			if (sortIndex < 5) {
				// 有下拉
				for (let i = 0; i < sortItems.length; i++) {
					if (i != sortIndex)
						sortItems[i].show = false;
					else
						sortItems[i].show = !sortItems[i].show;
				}
				this.setData({
					sortItems,
					sortIndex,
					sortItemIndex
				});
			} else {
				//无下拉
				for (let i = 0; i < sortItems.length; i++) {
					sortItems[i].show = false;
				}
				this.setData({
					sortItems,
					sortIndex,
					sortItemIndex
				});

				this._getSortKey();
			}
		},

		/**
		 * 下拉菜单选择
		 */
		bindSortItemTap: function (e) {
			let sortItemIndex = e.target.dataset.idx;
			let sortItems = this.data.sortItems;
			for (let i = 0; i < sortItems.length; i++) {
				sortItems[i].show = false;
			}
			this.setData({
				sortItemIndex,
				sortItems
			});
			this._getSortKey();

		},

		// 获得排序关键字
		_getSortKey: function () {
			let sortVal = '';
			let sortType = '';

			let oldSortVal = this.data.sortVal;
			let oldSortType = this.data.sortType;

			if (this.data.sortIndex < 5) {
				sortVal = this.data.sortItems[this.data.sortIndex].items[this.data.sortItemIndex].value;
				sortType = this.data.sortItems[this.data.sortIndex].items[this.data.sortItemIndex].type;
			} else {
				sortVal = this.data.sortMenus[this.data.sortIndex - 5].value;
				sortType = this.data.sortMenus[this.data.sortIndex - 5].type;
			}
			this.setData({
				sortVal,
				sortType
			});

			if (sortVal != oldSortVal || sortType != oldSortType) {
				// 点击分类 

				if (this.data.search) {
					//清空搜索
					this.triggerEvent('myCommListEvent', {
						search: ''
					});
				} else
					this._getList(1);

			}

		},

		// 搜索跳转
		bindSearchTap: function (e) {
			wx.navigateTo({
				url: '/pages/search/search?type=' + this.data.type + '&returnUrl=' + this.data.returnUrl
			});
		},


	}
})