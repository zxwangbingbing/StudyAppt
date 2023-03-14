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
		day: {
			type: String,
			value: '',  // 当前日期
		},
		startTimeStep: {
			type: Number,
			value: 0,  // 开始时间，把每天划分为48个时间段
		},
		endTimeStep: {
			type: String,
			value: 47,  // 结束时间，把每天划分为48个时间段
		},
		used: { // 已选择
			type: Array,
			value: [], // {title,start,end,url=支持true或者跳转地址}
		},
		usedPos: { // 已约的标题位置 first / mid
			type: String,
			value: 'first'
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		times: [],  //时间段 48个

		selectedStart: '',
		selectedEnd: '',
		selectedEndPoint: '',
	},

	/**
	   * 生命周期方法
	   */
	lifetimes: {
		attached: function () { },

		ready: function () {
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
			let now = timeHelper.time('Y-M-D h:m');

			let times = this.data.times;

			let day = this.data.day;
			if (!day) day = timeHelper.time('Y-M-D');
			this.setData({
				day
			});


			// 初始化
			if (times == 0) {
				for (let k = this.data.startTimeStep; k <= this.data.endTimeStep; k++) {
					let start = '';
					let end = '';
					let title = '';

					let clock = Math.trunc(k / 2);
					if (k % 2 == 0) {
						start = dataHelper.padLeft(clock, 2, '0') + ':00';
						end = dataHelper.padLeft(clock, 2, '0') + ':30';
						title = start;
					}
					else {
						start = dataHelper.padLeft(clock, 2, '0') + ':30';
						end = dataHelper.padLeft(clock + 1, 2, '0') + ':00';
						title = '';
					}
					if (end == '24:00') end = '23:59';

					let node = {
						idx: k,
						title,
						start,
						end,
						used: false,
						selected: false,
						expire: (day + ' ' + start < now), //过期时间 
					}
					times.push(node);
				}
			}

			// 已约时间段
			for (let k = 0; k < this.data.used.length; k++) {
				let usedNode = this.data.used[k];

				// 计算有占有几个时间段
				let usedlen = 0;
				for (let j = 0; j < times.length; j++) {
					let node = times[j];
					if (node.start >= usedNode.start && node.start <= usedNode.end) {
						usedlen++;
					}
				}
				if (usedlen <= 1) usedlen = 2;
				usedlen = Math.round(usedlen / 2);

				if (this.data.usedPos == 'first') usedlen = 1;

				let curLen = 0;
				for (let j = 0; j < times.length; j++) {
					let node = times[j];
					if (node.start == usedNode.start) {
						node.used = usedNode.url || 'no';
						node.usedFirst = true;

						curLen++;
						if (curLen == usedlen) node.usedText = usedNode.title;
					}
					else if (node.start >= usedNode.start && node.start <= usedNode.end) {
						node.used = usedNode.url || 'no';
						node.usedFirst = false;

						curLen++;
						if (curLen == usedlen) node.usedText = usedNode.title;
					}
				}
			}

			this.setData({ times });
		},

		bindSelectTap: function (e) {
			//  选择
			let idx = pageHelper.dataset(e, 'idx');
			let timeNode = this.data.times[idx];


			let selected = timeNode.start;

			// 已选择
			let used = timeNode.used;
			if (used) {
				if (used === true)
					return;
				else {
					return wx.navigateTo({
						url: used, // 跳到详细
					});
				}
			}

			// 过期
			let expire = timeNode.expire;
			if (expire) return;


			let selectedStart = this.data.selectedStart;
			let selectedEnd = this.data.selectedEnd;


			let times = this.data.times;

			// 区间内直接干掉
			if (selected >= selectedStart && selected <= selectedEnd) {
				selectedStart = '';
				selectedEnd = '';
				for (let k = 0; k < times.length; k++) {
					times[k].selected = false;
				}
				this.setData({ times, selectedStart, selectedEnd });
				return;
			}


			if (!selectedStart && !selectedEnd) {
				selectedStart = selected;
				selectedEnd = selected;
			}

			if (selected < selectedStart) selectedStart = selected;
			if (selected > selectedEnd) selectedEnd = selected;


			// 如果包含了已选的，则只保留最后或者最后选择那一个时段
			for (let k = 0; k < times.length; k++) {
				if (times[k].start >= selectedStart && times[k].start <= selectedEnd && times[k].used) {

					if (selected >= selectedEnd) {
						selectedStart = selectedEnd;
					}
					else if (selected <= selectedStart) {
						selectedEnd = selectedStart;
					}

					break;
				}
			}


			// 选中 
			for (let k = 0; k < times.length; k++) {
				if (times[k].start >= selectedStart && times[k].start <= selectedEnd) {
					times[k].selected = true;
				}
				else {
					times[k].selected = false;
				}
			}

			// 取得结束时间点
			let selectedEndPoint = '';
			for (let k = 0; k < times.length; k++) {
				if (times[k].start == selectedEnd) {
					selectedEndPoint = times[k].end;
				}
			}

			this.setData({ times, selectedStart, selectedEnd, selectedEndPoint });

		},

		bindSumbitTap: function (e) {
			let start = this.data.selectedStart;
			let end = this.data.selectedEnd;
			let endPoint = this.data.selectedEndPoint;
			if (!start || !end || !endPoint) return;

			this.triggerEvent('select', { start, end, endPoint });
		}
	}
})
