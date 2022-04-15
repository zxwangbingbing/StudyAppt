const helper = require('../../../helper/helper.js');
const dataHelper = require('../../../helper/data_helper.js');
const pageHelper = require('../../../helper/page_helper.js');

Component({
	externalClasses: ['outside-picker-class'],

	options: {
		//addGlobalClass: true
	},

	/**
	 * 一维格式： 可以通过model返回
	 * 对象格式： {label:'对象A',val:'5'}, {label:'对象B',val:'12'}, {label:'对象C',val:'99'}
	 * 简单形式：['形式1','形式2','形式33'] 
	 * 字符串形式
	 */

	/**
	 * N维格式： 只能通过trigger返回
	 * 对象格式： {label:'对象A',val:'5'}, {label:'对象B',val:'12'}, {label:'对象C',val:'99'}
	 * 简单形式：['形式1','形式2','形式33'] 
	 * 
	 */
	properties: {
		mark: {
			type: String,
			value: '',
		},
		isSlot: { //是否开启slot
			type: Boolean,
			value: false,
		},
		sourceData: { //源数组，sourceData有几维，Picker就可以有几阶 简单形式待选项,,,
			type: Array,
			value: [],
		},

		sourceDataStr: { //源数组，sourceData有几维，Picker就可以有几阶 简单形式待选项,,,
			type: String,
			value: '',
		},

		// key
		labelKey: {
			type: String,
			value: ''
		},

		// 阶数
		steps: {
			type: Number,
			value: 1
		},

		noDataHint: { // 无数据的提示语
			type: String,
			value: '请选择',
		},

		// 选中项的下标数组 1维
		index: {
			type: Number,
			value: 0
		},
		// 选中项的下标数组 N维
		indexMulti: {
			type: Array,
			value: []
		},
		// 默认选中项的值数组 1维
		item: {
			type: String,
			value: '',
			observer: function (newVal, oldVal) {
			//	console.log('one observer', this.data.mark);
				if (newVal != oldVal) {
					let options = this.data.options;
					if (!options || options.length == 0) this._init();
					if (options && options.length > 0) this.selected(newVal);
				}
			}
		},
		// 默认选中项的值数组 N维
		itemMulti: {
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {
			//	console.log('multi observer', this.data.mark);
				if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
					let options = this.data.options;
					if (!options || options.length == 0) this._init();
					if (options && options.length > 0) this.selected(newVal);
				}
			}
		},

		// 是否禁用
		disabled: {
			type: Boolean,
			value: false,
		},

		disabledHint: { //  禁用提示
			type: String,
			value: '',
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		options: null,
		idx: 0,
		multiDesc: '', // 多选的显示文字
	},

	/**
	 * 生命周期方法
	 */
	lifetimes: {
		attached: function () {},

		ready: function () {
			if (!this.data.options || this.data.options.length == 0) this._init();
		},

		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		_init: function () {
			let sourceData = this.data.sourceData;
			let labelKey = this.data.labelKey;
			let idx = this.data.idx;

			// 字符串形式
			if (this.data.steps == 1 &&
				this.data.sourceDataStr &&
				(!sourceData || sourceData.length == 0)
			) {
				sourceData = dataHelper.getSelectOptions(this.data.sourceDataStr);
				this.setData({
					sourceData
				});
			}

			if (!sourceData || sourceData.length == 0) return;

			if (this.data.steps == 1) {
				if (sourceData.length > 0 && helper.isDefined(sourceData[0]['label'])) {
					labelKey = 'label';
				}
				idx = this.data.index;
			} else if (this.data.steps > 1) {
				if (sourceData.length > 0 && helper.isDefined(sourceData[0][0]['label'])) {
					labelKey = 'label';
				}
				idx = this.data.indexMulti;
			}

			this.setData({
				idx,
				labelKey,
				options: sourceData
			});
			this._getMultiDesc();

			if (this.data.steps == 1)
				this.selected(this.data.item);
			else
				this.selected(this.data.itemMulti);
		},

		_getMultiDesc: function () {
			let idx = this.data.idx;
			let options = this.data.options;
			if (idx.length != options.length) return;

			let multiDesc = [];
			if (this.data.labelKey) {
				for (let k in options) {
					multiDesc[k] = options[k][idx[k]].label;
				}
			} else {
				for (let k in options) {
					multiDesc[k] = options[k][idx[k]];
				}
			}
			this.setData({
				multiDesc
			});
		},

		bindTap: function (e) { // 点击行为
			if (this.data.disabled && this.data.disabledHint) {
				pageHelper.showModal(this.data.disabledHint, '提示', null, '知道了');
			}
		},

		// 触发改变
		bindChange: function (e) {
			let idx = e.detail.value;
			let val = null;

			if (this.data.steps == 1) {
				val = this.data.labelKey ? this.data.options[idx].val : this.data.options[idx];
				this.setData({
					item: val,
					index: idx
				});
			} else {
				val = [];
				let options = this.data.options;
				if (this.data.labelKey) {
					for (let k in options) {
						val[k] = options[k][idx[k]].val;
					}
				} else {
					for (let k in options) {
						val[k] = options[k][idx[k]];
					}
				}
				this._getMultiDesc();
			}

			this.triggerEvent('select', val); 
		},

		// 一维数组根据val获取lable
		getLabelOneStep: function (val) {
			for (let k in this.data.sourceData) {
				if (this.data.sourceData[k].val == val) return this.data.sourceData[k].label;
			}
			return 'unknown';
		},

		// 选中值 
		selected: function (val) {
			let options = this.data.options;
			let labelKey = this.data.labelKey;
			if (this.data.steps == 1) {
				for (let k in options) {
					if (labelKey && val == options[k].val) {
						this.setData({
							idx: k
						});
						return;
					} else if (!labelKey && val == options[k]) {

						this.setData({
							idx: k
						});
						return;
					}
				}
				this.setData({
					idx: -1
				});

				//传入数据不匹配的时候，修正父页面传入的的默认值
				this.triggerEvent('select', '');

			} else if (this.data.steps > 1) {
				let idx = [];
				for (let k in options) {
					let levelTwo = options[k];
					for (let j in levelTwo) {
						if (labelKey && val[k] == options[k][j].val) {
							idx.push(j);
						} else if (!labelKey && val[k] == options[k][j]) {
							idx.push(j);
						}
					}
				}

				if (idx.length != options.length) idx = [];
				this.setData({
					idx
				});
				this._getMultiDesc();

				//传入数据不匹配的时候，修正父页面传入的的数组默认值 TODO
			}


		}
	}
})