const cloudHelper = require('../../../helper/cloud_helper.js');
const helper = require('../../../helper/helper.js');
const bizHelper = require('../../../biz/biz_helper.js');
const pageHelper = require('../../../helper/page_helper.js'); 

Component({
	options: {
		addGlobalClass: true,
		pureDataPattern: /^_dataList/, // 指定所有 _ 开头的数据字段为纯数据字段
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		listHeight: { // 列表区高度
			type: String,
			value: ''
		},

		route: { // 业务路由
			type: String,
			value: ''
		},
		_params: { // 路由的附加参数
			type: Object,
			value: null,
			observer: function (newVal, oldVal) { //TODO????
				if (!oldVal || !newVal) return; //页面data里赋值会引起触发，除非在组件标签里直接赋值,或者提前赋值

				// 清空当前选择
				if (newVal) {
					this.setData({
						pulldownMaskShow: false //返回去遮罩
					});
					this._fmtSearchData();
				}

				this.data._dataList = null;
				this.triggerEvent('list', { //TODO 考虑改为双向数据绑定model 
					dataList: this.data._dataList
				});
				this._getList(1);
			}
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
		sortMenusDefaultIndex: {
			type: Number,
			value: -1 //横菜单默认选中的
		},
		search: {
			type: String, //搜索框关键字
			value: '',
			observer: function (newVal, oldVal) {
				// 清空当前选择
				if (newVal) {
					this.setData({
						pulldownMaskShow: false //返回去遮罩
					});
					this._fmtSearchData();
				}

				this.data._dataList = null;
				this.triggerEvent('list', { //TODO 考虑改为双向数据绑定model 
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
		isCache: { // 非缓存状态下或者list缓存过期下onshow加载, 缓存下onload加载
			type: Boolean, //是否cache
			value: true
		},
		pulldownType: {
			type: Array, // 下拉菜单展示模式 list/modal 每个菜单一个
			value: ['list', 'list', 'list', 'list', 'list', 'list']
		},

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

		pulldownMaskShow: false, //下拉菜单遮罩
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

			// 组件布局完成，这时可以获取节点信息，也可以操作节点
			this._fmtSearchData();

			if (this.data.isCache) //缓存状态下加载
				await this._getList(1);

			//取得预置参数_params的选中状态 
			let params = this.data._params;
			if (params && params.sortType && params.sortVal) {
				let sortMenus = this.data._menus;
				for (let k = 0; k < sortMenus.length; k++) {
					if (params.sortType == sortMenus[k].type && params.sortVal == sortMenus[k].value)
						this.setData({
							sortMenusDefaultIndex: k
						});
				}
			}

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
			if (!this.data.isCache || !bizHelper.isCacheList(this.data.type)) {
				// 非缓存状态下或者 list缓存过期下加载
				await this._getList(1);
			}

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

			//if (page == 1 && !this.data._dataList) { TODO???
			if (page == 1) {
				this.triggerEvent('list', {
					dataList: null //第一页面且没有数据提示加载中
				});
			}


			let opt = {};
			//if (this.data._dataList && this.data._dataList.list && this.data._dataList.list.length > 0)
			opt.title = 'bar';
			await cloudHelper.dataList(this, '_dataList', this.data.route, params, opt);

			this.triggerEvent('list', { //TODO 考虑改为双向数据绑定model
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
				this.triggerEvent('list', {
					search: ''
				});
			}
		},


		// 分类&排序一级菜单选择  
		bindSortTap: function (e) {
			let sortIndex = e.currentTarget.dataset.index; 
			let sortItems = this.data.sortItems;

			// 横菜单默认选中取消 TODO
			/*
			this.setData({
				sortMenusDefaultIndex: -1
			});*/

			// 换了下拉菜单
			let sortItemIndex = (sortIndex != this.data.sortIndex) ? -1 : this.data.sortItemIndex;

			if (sortIndex < 5) {
				let pulldownMaskShow = this.data.pulldownMaskShow;

				// 有下拉
				for (let i = 0; i < sortItems.length; i++) {
					if (i != sortIndex)
						sortItems[i].show = false;
					else {
						sortItems[i].show = !sortItems[i].show;
						pulldownMaskShow = sortItems[i].show;
					}

				}
				this.setData({
					pulldownMaskShow, //遮罩

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
					pulldownMaskShow: false,
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
				pulldownMaskShow: false,
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
					this.triggerEvent('list', {
						search: ''
					});
				} else
					this._getList(1);

			}

		},

		// 搜索跳转
		bindSearchTap: function (e) {
			wx.navigateTo({
				url: pageHelper.fmtURLByPID('/pages/search/search?type=' + this.data.type + '&returnUrl=' + this.data.returnUrl)
			});
		},

		getSortIndex: function () { //获得横向菜单
			return this.data.sortIndex;
		},
		setSortIndex: function (sortIndex) { //设置横向菜单
			this.setData({
				sortIndex
			});
		},

	}
})