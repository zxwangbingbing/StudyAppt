const pageHelper = require('../../../helper/page_helper.js');
Component({
	options: {
		addGlobalClass: true,
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		images: {
			type: Array,
			value: []
		},
		height: {
			type: Number,
			value: 350
		},
		mode: {
			type: String,
			value: 'aspectFill'
		},
		indicatorActiveColor: {
			type: String,
			value: '#000000'
		},
		interval: {
			type: Number,
			value: 3000
		},
		duration: {
			type: Number,
			value: 500
		},
		previousMargin: {
			type: Number,
			value: 0
		},
		nextMargin: {
			type: Number,
			value: 0
		},
		indicatorDots: {
			type: Boolean,
			value: true
		},
		autoplay: {
			type: Boolean,
			value: true
		},
		circular: {
			type: Boolean,
			value: true
		},
		vertical: {
			type: Boolean,
			value: false
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		url: function (e) {
			pageHelper.url(e, this);
		}
	}
})