const dataHelper = require('../../../helper/data_helper.js');
const dateTimePicker = require('./datetime_picker.js');

Component({
	externalClasses: ['picker-class'],

	/**
	 * 组件的属性列表
	 */
	properties: {
		mark: {
			type: String,
			value: ''
		},

		// 特定类型 time  minute=单纯时间分钟选择
		mode: { // year/month/day/hour/minute/fullminute/second
			type: String,
			value: 'second'
		},

		// time特定类型 对应的分钟步长
		timeModeStep: {
			type: Number,
			value: 5
		},

		startYear: {
			type: Number,
			value: 2021
		},
		endYear: {
			type: Number,
			value: 2030
		},
		item: {
			type: String,
			value: '',
			observer: function (newVal, oldVal) {
				if (newVal != oldVal) {
					this._init();
				}
			}
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		multiIndex: [], //  Picker当前所选择的索引数组
		multiArray: [], // Picker当前所展示的数组 
	},

	lifetimes: {
		created: function () {},
		attached: function () {},

		ready: function () {
			// 单纯分钟选择
			if (this.data.mode == 'minute') {
				this.data.startYear = 2021;
				this.data.endYear = 2021;
				if (this.data.item) {
					this.data.item = '2021-01-01 ' + this.data.item;
				}
			}

			this._init();
		},

		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		_fmtTime: function (str) {
			str = str.replace(/[^0-9]/ig, '');
			str = parseInt(str);
			return str < 10 ? '0' + str : '' + str;
		},
		// 根据选择获取时间字符串
		_getTimeStr: function (selIdex) {
			let arr = [];
			let multiArray = this.data.multiArray;
			for (let k in selIdex) {
				let str = this._fmtTime(multiArray[k][selIdex[k]]);
				arr.push(str);
			}

			let mode = this.data.mode;
			switch (mode) {
				case 'year':
					arr = arr[0];
					break;
				case 'month':
					arr = arr[0] + '-' + arr[1];
					break;
				case 'day':
					arr = arr[0] + '-' + arr[1] + '-' + arr[2];
					break;
				case 'hour':
					arr = arr[0] + '-' + arr[1] + '-' + arr[2] + ' ' + arr[3] + ':00';
					break;
				case 'fullminute':
					arr = arr[0] + '-' + arr[1] + '-' + arr[2] + ' ' + arr[3] + ':' + arr[4];
					break;
				case 'minute':
					arr = arr[0] + ':' + arr[1];
					break;
				case 'second':
					arr = arr[0] + '-' + arr[1] + '-' + arr[2] + ' ' + arr[3] + ':' + arr[4] + ':' + arr[5];
					break;
			}

			return arr;
		},

		_init: function () {
			let multiIndex = [];
			let multiArray = [];

			let mode = this.data.mode;

			let obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, this.data.item, this.data.timeModeStep);
			let idx = obj.dateTimeIndex;
			let arr = obj.dateTimeArray;

			switch (mode) {
				case 'year':
					multiIndex = [idx[0]];
					multiArray = [arr[0]];
					break;
				case 'month':
					multiIndex = [idx[0], idx[1]];
					multiArray = [arr[0], arr[1]];
					break;
				case 'day':
					multiIndex = [idx[0], idx[1], idx[2]];
					multiArray = [arr[0], arr[1], arr[2]];
					break;
				case 'hour':
					multiIndex = [idx[0], idx[1], idx[2], idx[3]];
					multiArray = [arr[0], arr[1], arr[2], arr[3]];
					break;
				case 'fullminute':
					idx.pop();
					arr.pop();
					multiIndex = idx;
					multiArray = arr;
					break;
				case 'minute':
					multiIndex = [idx[3], idx[4]];
					multiArray = [arr[3], arr[4]];
					break;
				case 'second':
					multiIndex = idx;
					multiArray = arr;
					break;
			}

			this.setData({
				multiIndex,
				multiArray
			});
		},

		pickerCancel: function (e) {

		},
		// 用户点击了确认
		pickerChange: function (e) {
			let time = this._getTimeStr(e.detail.value);
			this.triggerEvent('select', time);
		},

		// 用户点击了列选择
		pickerColumnChange: function (e) {
			let multiArray = this.data.multiArray;
			let multiIndex = this.data.multiIndex;

			multiIndex[e.detail.column] = e.detail.value;

			let mode = this.data.mode;

			if (mode != 'year' && mode != 'month' && mode != 'minute') {
				let year = (multiArray[0][multiIndex[0]]).replace('年', '');
				let month = (multiArray[1][multiIndex[1]]).replace('月', '');
				multiArray[2] = dateTimePicker.getMonthDay(year, month, '日');
			}


			this.setData({
				multiArray,
				multiIndex
			});
		}
	}
})