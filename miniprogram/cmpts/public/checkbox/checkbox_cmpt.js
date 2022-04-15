 Component({
 	externalClasses: ['outside-picker-multi-class'],

 	/**
 	 * 组件的属性列表
 	 */
 	properties: {
 		sourceData: { //源数组 
 			type: Array,
 			value: [],
 		},
 		// 默认选中项的值数组  
 		itemMulti: {
 			type: Array,
 			value: [],
 			observer: function (newVal, oldVal) {
 				if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
 					console.log('checkbox observer');
 					this._fixDefaultVal();
 				}
 			}
 		},
 		disabled: { // 是否禁用
 			type: Boolean,
 			value: false,
 		},
 	},

 	/**
 	 * 生命周期方法
 	 */
 	lifetimes: {
 		attached: function () {},

 		ready: function () {
 			this._fixDefaultVal();
 		},

 		detached: function () {
 			// 在组件实例被从页面节点树移除时执行
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
 		bindChange: function (e) {
 			this.triggerEvent('select', e.detail.value);
 		},

 		_fixDefaultVal() { //传入数据不匹配的时候，修正父页面传入的的数组默认值
 			if (!Array.isArray(this.data.itemMulti)) {
 				this.triggerEvent('select', []);
 			}

 			if (this.data.itemMulti.length == 0) return;

 			let ret = [];
 			let sourceData = this.data.sourceData;
 			let itemMulti = this.data.itemMulti;
 			for (let k in sourceData) {
 				for (let j in itemMulti) {
 					if (sourceData[k] == itemMulti[j])
 						ret.push(itemMulti[j]);
 				}
 			}

 			this.triggerEvent('select', ret);
 		}
 	}
 })