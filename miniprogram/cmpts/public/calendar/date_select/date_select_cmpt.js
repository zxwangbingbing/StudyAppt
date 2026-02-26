const dataHelper = require('../../../../helper/data_helper.js');
const pageHelper = require('../../../../helper/page_helper.js');
const timeHelper = require('../../../../helper/time_helper.js');

Component({
	options: {
		addGlobalClass: true
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		start: { // 开始日期
			type: String,
			value: '',
		},
		end: { // 结束日期
			type: String,
			value: ''
		},
		selected: { // 当前选中日期
			type: String,
			observer: function (newVal, oldVal) {
				if (newVal != oldVal) {
					let month = timeHelper.timestamp2Time(timeHelper.time2Timestamp(newVal), 'Y年M月');
					this.setData({ month });
				}
			}
		},
		toView: {  //跳转到的view
			type: String,
			val: '',
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		range: [],
		month: '',
	},

	/**
	   * 生命周期方法
	   */
	lifetimes: {
		attached: function () { },

		ready: function () {
			if (!this.data.selected)
				this.setData({ selected: timeHelper.time('Y-M-D') });
			else
				this.setData({ toView: 'day-' + this.data.selected });
			this.init();
		},

		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		init: function () {
			let start = this.data.start;
			let end = this.data.end;
			if (!start) start = timeHelper.time('Y-M-D');
			if (!end) end = timeHelper.time('Y-M-D', 86400 * 15);

			let range = [];
			let startTime = timeHelper.time2Timestamp(start);
			let endTime = timeHelper.time2Timestamp(end);

			for (let k = startTime; k <= endTime;) {
				let day = timeHelper.timestamp2Time(k, 'Y-M-D');
				let month = timeHelper.timestamp2Time(k, 'Y年M月');

				let node = {
					day,
					show: this._fmtShow(day),
					week: this._fmtWeek(day),
					month
				}
				range.push(node)
				k += 86400 * 1000
			}

			this.setData({ range });
		},

		bindTap: function (e) {

		},
		_fmtShow: function (day) {
			return day.split('-')[2];
		},
		_fmtWeek: function (day) {
			if (day == timeHelper.time('Y-M-D')) return '今天';
			day = timeHelper.week(day);
			day = day.replace('周', '');
			return day;
		},
		bindTap: function (e) {
			let selected = pageHelper.dataset(e, 'day');
			let month = pageHelper.dataset(e, 'month');
			this.setData({ selected, month });
			this.triggerEvent('select', selected);
		}
	},


})
