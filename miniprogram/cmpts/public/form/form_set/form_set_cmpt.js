const pageHelper = require('../../../../helper/page_helper.js');
const dataHelper = require('../../../../helper/data_helper.js');

Component({
	options: {
		addGlobalClass: true
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		fields: {
			type: Array,
			value: [],
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		cur: -1,
	},

	/**
	 * 生命周期方法
	 */
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
		setGlow(cur) {
			this.setData({
				cur
			});
			setTimeout(() => {
				this.setData({
					cur: -1
				});
			}, 800);
		},

		url: function (e) {
			pageHelper.url(e, this);
		},

		set: function (fields) {
			this.setData({
				fields
			});
			this.triggerEvent('formset', fields);
		},

		get: function () {
			return this.data.fields;
		},

		bindEditTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let edit = pageHelper.dataset(e, 'edit'); 
			if (!edit) {
				return pageHelper.showNoneToast('该字段不可编辑和删除');
			}
			wx.navigateTo({
				url: '/cmpts/public/form/form_set/field/form_set_field?idx=' + idx,
			});
		},
		bindUpTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let fields = this.data.fields;
			dataHelper.arraySwap(fields, idx, idx - 1);
			this.setData({
				fields
			});
			this.setGlow(idx - 1);
			this.triggerEvent('formset', fields);
		},

		bindDownTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let fields = this.data.fields;
			dataHelper.arraySwap(fields, idx, idx + 1);
			this.setData({
				fields
			});
			this.setGlow(idx + 1);
			this.triggerEvent('formset', fields);
		}
	}
})