const pageHelper = require('../../../helper/page_helper');
const setting = require('../../../setting/setting.js');

Component({
	options: {
		addGlobalClass: true
	},
	
	/**
	 * 组件的属性列表
	 */
	properties: {
		color: {  
			type: String,
			value: ''
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {

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
			// 当前用户，用于评论删除
			this._loadDetail();
		},
		move: function () {
			// 组件实例被移动到树的另一个位置
		},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		_loadDetail: async function () {
			this.setData({
				company: setting.COMPANY,
				ver: setting.VER
			});
		},
		url: function (e) {
			pageHelper.url(e, this);
		}
	}
})