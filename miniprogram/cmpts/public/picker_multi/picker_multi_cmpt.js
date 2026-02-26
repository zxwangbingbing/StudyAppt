/* 参考文档: https://github.com/IceApriler/miniprogram-picker */
/*
[{
	label:'ddd' // 展示数据的字段名称
	val:'v1',
},
{
	label:'cccc',
	val:'v2'
}]
*/
const dataHelper = require('../../../helper/data_helper.js');

function isExist(field) {
	return field !== null && field !== undefined
}

Component({
	externalClasses: ['outside-picker-multi-class'],
	/**
	 * 组件的属性列表
	 */
	properties: {
		// 特定类型 time
		mode: { // minute
			type: String,
			value: ''
		},

		// time特定类型 对应的分钟步长
		timeModeStep: {
			type: Number,
			value: 1
		},

		// 初始化时，是否需要自动返回结果给开发者
		autoSelect: {
			type: Boolean,
			value: false
		},
		// 源数组，sourceData有几维，Picker就可以有几阶
		sourceData: {
			type: Array,
			value: [],
			observer: 'sourceDataChange'
		},
		// 阶数
		steps: {
			type: Number,
			value: 1
		},

		// 选择了第n列后，是否将大于n的列的选择值自动初始化为0
		initColumnSelectedIndex: {
			type: Boolean,
			value: false,
		},
		// 默认选中项的下标数组
		itemIndex: {
			type: Array,
			value: []
		},
		// 默认选中项的值数组
		itemMulti: {
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {  
				if (JSON.stringify(newVal) != JSON.stringify(oldVal)) { 
					this.sourceDataChange(this.data.sourceData);
				}
			}
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			value: false,
		},
		isSlot: { //是否开启slot
			type: Boolean,
			value: true,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {

		// Picker当前所选择的索引数组 => 比如:[0, 0, 2]，表示第一列选择第0项，第二列选择第0项，第三列选择第2项。
		multiIndex: {
			type: Array,
			value: [],
		},
		// Picker当前所展示的数组 => 比如:[['河北', '山东'], ['石家庄', '保定'], ['桥西区', '裕华区', '长安区']]。
		multiArray: {
			type: Array,
			value: [],
		},
		// 用户点击确定后，所选择的值数组 => 比如:
		// [{name: '河北', id: '3110'}, {name: '石家庄', id: '3110xx'}, {name: '长安区', id: '3110xxx'}]。
		selectedArray: {
			type: Array,
			value: [],
		},

	},
	/**
	 * 生命周期方法
	 */
	lifetimes: {
		created: function () {},
		attached: function () {

			if (this.data.autoSelect) {
				this.processData();
			}
		},

		ready: function () {

		},

		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	pageLifetimes: {
		show: function () {

		},
		hide: function () {
			// 页面被隐藏
		},
		resize: function (size) {
			// 页面尺寸变化
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		/**
		 * 监听源数组更新变化
		 *
		 * @param {Array} newSourceData 源数组，newSourceData有几维，Picker就可以有几阶。
		 */
		sourceDataChange: function (newSourceData) {
			const {
				steps
			} = this.data;
			// 源数组更新，则需要更新multiIndex、multiArray
			const multiIndex = [];
			const multiArray = [];
			newSourceData = this.checkSourceData(newSourceData);

			// console.warn(newSourceData) 
			const itemIndex = this.getDefaultIndex(newSourceData);
			const handle = (source = [], columnIndex = 0) => {
				// 当前遍历Picker的第columnIndex列，
				// 当columnIndex = 0时，source表示sourceData，其它则表示子集subset
				const _multiArrayColumn0 = [];

				source.forEach((item, index) => {
					if (columnIndex === 0) {
						// newSourceData的第0维要单独处理，最后unshift到multiArray中
						_multiArrayColumn0.push(item.label)
					}

					if (isExist(item.label) && index === (itemIndex[columnIndex] || 0)) {
						// 选中的索引和值，默认取每列的第0个
						multiIndex.push(index);

						if (columnIndex < steps - 1) {
							if (isExist(item.children)) {
								// 开始处理下一维的数据
								const _subsetArr = item.children.map(sub => sub.label);
								multiArray.push(_subsetArr);
								handle(item.children, columnIndex + 1);
							}
						}
					}
				})

				if (columnIndex === 0) {
					multiArray.unshift(_multiArrayColumn0);
				}
			}

			handle(newSourceData);

			this.setData({
				multiIndex,
				multiArray
			})

			if (this.data.autoSelect) {
				this.processData();
			} 
 
		},
		/**
		 * 获取默认值index
		 * @param {Array} newSourceData 源数组
		 */
		getDefaultIndex: function (newSourceData) {
			const {
				itemIndex,
				itemMulti,
				steps,
			} = this.data;
			if (itemIndex.length) {
				return itemIndex; // 返回默认选中的下标数据
			} else if (itemMulti.length) {
				if (itemMulti.length !== steps) {
					this.consoleError(new Error('你设置的"itemMulti"字段阶数与"steps"不符，请修改后再试。'));
					return [];
				} else {
					const _defaultIndex = [];
					const handle = (source = [], columnIndex = 0) => {
						// 默认值
						_defaultIndex[columnIndex] = 0;
						source.forEach((item, index) => {
							if (
								(itemMulti[columnIndex]) ===
								(item.val)
							) {
								_defaultIndex[columnIndex] = index;

								if (columnIndex < steps - 1) {
									if (item.children) {
										// 开始处理下一维的数据
										handle(item.children, columnIndex + 1);
									}
								}
							}
						})
					}
					handle(newSourceData);
					return _defaultIndex;
				}
			} else {
				return [];
			}
		},

		/**
		 * 校验源数组是否正确
		 *
		 * @param {Array} sourceData 源数组
		 */
		checkSourceData: function (sourceData) {
			const {
				steps
			} = this.data;
			const handle = (source = [], columnIndex = 0) => {
				// 当前遍历Picker的第columnIndex列，
				// 当columnIndex = 0时，source表示sourceData，其它则表示子集subset
				if (!source.length) {
					const temp = {};
					temp.label = '';
					temp.children = [];
					source.push(temp);
				}
				return source.map((item) => {
					// 有label字段才会去遍历children字段
					if (columnIndex < steps - 1) {
						// 开始处理下一维的数据
						item.children = handle(item.children, columnIndex + 1);
					}
					return item;
				})
			}
			return handle(sourceData);
		},

		/**
		 * 用户点击了确认。
		 *
		 * @param {Object} e 事件对象，具体参考微信小程序api。
		 * @param {Array} e.detail.value 用户选择的下标数组。
		 */
		pickerChange: function (e) {
			// console.log('picker发送选择改变，携带值为', e.detail.value)

			this.setData({
				multiIndex: e.detail.value
			})
			this.processData();
		},

		/**
		 * 处理最终数据，将返回给开发者。
		 *
		 */
		processData: function () {
			const {
				sourceData,
				multiIndex
			} = this.data;
			let selectedArray = [];

			const handle = (source = [], columnIndex = 0) => {
				source.forEach((item, index) => {
					if (index === multiIndex[columnIndex]) {
						let node = dataHelper.deepClone(item);
						delete node.children;
						selectedArray.push(node);
						if (columnIndex < this.data.steps - 1) {
							handle(item.children, columnIndex + 1);
						}
					}
				})
			}
			handle(sourceData);

			this.setData({
				selectedArray
			});

			/*
			const detail = {
				selectedIndex: this.data.multiIndex,
				selectedArray: this.data.selectedArray
			}*/

			let ret = dataHelper.getArrByKey(selectedArray, 'val');

			this.triggerEvent('select', ret);
		},

		/**
		 * 用户滚动了某一列。
		 *
		 * @param {Object} e 事件对象，具体参考微信小程序api。
		 */
		pickerColumnChange: function (e) {
			const {
				multiArray,
				sourceData,
				steps,
				initColumnSelectedIndex
			} = this.data;
			let {
				multiIndex
			} = this.data;
			const {
				column,
				value: changeIndex
			} = e.detail;

			// console.log(`修改了Picker的第${column}列(从0开始计算)，选中了第${changeIndex}个值(从0开始计算)`)

			// multiIndex变化了，所以也要同步更新multiArray
			multiIndex[column] = changeIndex;

			if (initColumnSelectedIndex) {
				// 每次重置之后的index为0，但是有bug，待定。 => 经检查，是编辑器的问题，真机上是没有问题的。
				const _multiIndex = multiIndex.map((item, index) => {
					if (column >= index) {
						return item;
					} else {
						return 0;
					}
				})
				multiIndex = _multiIndex;
			}

			const handle = (source = [], columnIndex = 0) => {
				// 当前遍历第 columnIndex 列
				source.forEach((item, index) => {
					if (index === multiIndex[columnIndex]) {
						if (columnIndex < steps - 1) {
							if (!item.children) {
								item.children = [];
							}
							const multiArrayItem = item.children.map((sub) => sub.label);
							// 从第1列开始，才有可能变化
							multiArray[columnIndex + 1] = multiArrayItem;

							handle(item.children, columnIndex + 1);
						}
					}
				})
			}
			handle(sourceData);

			this.setData({
				multiArray,
				multiIndex,
			})
			this.triggerEvent('columnchange', e);
		},
		/**
		 * 用户点击了取消触发
		 * @param {Object} e 事件对象
		 */
		pickerCancel: function (e) {
			this.triggerEvent('cancel', e);
		},
		/**
		 * 绑定console.error
		 * @param  {...any} arg 打印参数
		 */
		consoleError: function (...arg) {
			console.error(...arg);
		},


	},

})