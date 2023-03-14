// cmpts/public/modal/modal.js
Component({
	options: {
		addGlobalClass: true,
		multipleSlots: true
	},

	externalClasses: ['slot-class'],

	/**
	 * 组件的属性列表
	 */
	properties: {
		type: { // 类型 comm/bottom/dialog/image
			type: String,
			value: 'comm'
		},
		title: {
			type: String,
			value: '温馨提示'
		},
		subtitle: {
			type: String,
			value: ''
		},
		subtitleAlign: {
			type: String,
			value: 'center'
		},
		show: {
			type: Boolean,
			value: true
		},
		cancelText: {
			type: String,
			value: '取消'
		},
		confirmText: {
			type: String,
			value: '确定'
		},
		showConfirm: {
			type: Boolean,
			value: true
		},
		imgURL: {
			type: String,
			value: ''
		},

		height: {
			type: Number,
			value: 600
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
		bindHideModalTap: function (e) {
			this.setData({
				show: ''
			})
		},

		nomove: function () {},

		bindComfirmTap: function (e) {
			this.triggerEvent('click', {});
		}
	}
})