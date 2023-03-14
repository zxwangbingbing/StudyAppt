/**
 * 
 */
Component({
	/**
	 * 外部样式类
	 */
	externalClasses: ['header-row-class-name', 'row-class-name', 'cell-class-name'],

	/**
	 * 组件样式隔离
	 */
	options: {
		styleIsolation: "isolated",
		multipleSlots: true // 支持多个slot
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		data: {
			type: Array,
			value: []
		},
		headers: {
			type: Array,
			value: []
		},
		// table的高度, 溢出可滚动
		height: {
			type: String,
			value: 'auto'
		},
		width: {
			type: Number || String,
			value: '100%'
		},
		// 单元格的宽度
		tdWidth: {
			type: Number,
			value: 35
		},
		// 固定表头 thead达到Header的位置时就应该被fixed了
		offsetTop: {
			type: Number,
			value: 150
		},
		// 是否带有纵向边框
		stripe: {
			type: Boolean,
			value: false
		},
		// 是否带有纵向边框
		border: {
			type: Boolean,
			value: false
		},
		msg: {
			type: String,
			value: '暂无数据~'
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		scrolWidth: '20%'
	},

	lifetimes: {
		attached: function () {

		},
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

	}
})