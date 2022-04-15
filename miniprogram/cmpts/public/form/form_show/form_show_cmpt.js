const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
const cacheHelper = require('../../../../helper/cache_helper.js');
const formSetHelper = require('../form_set_helper.js');
const validate = require('../../../../helper/validate.js');

const CACHE_FORM_SHOW_KEY = 'FORM_SHOW_CMPT';
const CACHE_FORM_SHOW_TIME = 86400 * 365;

Component({
	options: {
		addGlobalClass: true
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		fields: { // 表单属性{mark,val,type,must,selectOptions,desc,title}
			type: Array,
			value: [],
		},
		forms: { //表单值
			type: Array,
			value: [], // {mark,title,val,type}
		},
		isConfirm: { //是否显示核对信息modal
			type: Boolean,
			value: true,
		},
		isCacheMatch: { //是否开启缓存匹配
			type: Boolean,
			value: true,
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		isLoad: false,
		showCheckModal: false,
	},

	/**
	 * 生命周期方法
	 */
	lifetimes: {
		attached: function () {

		},

		ready: function () {
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
		_init: function () {
			let fields = this.data.fields;
			let newForms = [];

			for (let k in fields) {
				let node = {};
				node.mark = fields[k].mark;
				node.title = fields[k].title;
				node.type = fields[k].type;

				// 判断是否有表单值
				let val = this._getOneValForm(fields[k].mark, fields[k].title, fields[k].type);
				if (val === null) val = '';

				// 类型修正
				val = this._fixType(fields[k].type, val);
				node.val = val;
				fields[k].val = val;

				newForms.push(node);
			}

			this.setData({
				forms: newForms,
				fields,
				isLoad: true
			});
			//this.triggerEvent('forms', newForms);
		},

		// 根据mark和type获取上次值或者缓存值
		_getOneValForm: function (mark, title, type) {
			let ret = null;

			// **** 对传入的默认值匹配
			let forms = this.data.forms;
			for (let k in forms) {
				if (forms[k].mark == mark) { // 优先匹配mark
					ret = forms[k].val;
					break;
				}

				if (forms[k].title == title) { // 再则匹配名称
					ret = forms[k].val;
					break;
				}

				if (type == 'mobile' && forms[k].type == 'mobile') {
					ret = forms[k].val;
					break;
				}

				if (type == 'idcard' && forms[k].type == 'idcard') {
					ret = forms[k].val;
					break;
				}
			}


			// **** 对缓存匹配
			let caches = cacheHelper.get(CACHE_FORM_SHOW_KEY);
			if (caches && Array.isArray(caches) && !ret) {
				for (let k in caches) {
					if (caches[k].mark == mark) { // 优先匹配mark
						ret = caches[k].val;
						break;
					}

					if (caches[k].title == title) { // 再则匹配名称
						ret = caches[k].val;
						break;
					}

					if (type == 'mobile' && caches[k].type == 'mobile') {
						ret = caches[k].val;
						break;
					}

					if (type == 'idcard' && caches[k].type == 'idcard') {
						ret = caches[k].val;
						break;
					}
				}
			}

			return ret;
		},

		// 原始form没有对应值, 给予默认值; 或者类型不对，修正
		_fixType: function (type, val) {
			if (type != 'switch' && type != 'checkbox' && type != 'area') {
				if (typeof val === 'object' && !Array.isArray(val))
					val = ''; // [object Object]需要转换
				else
					val = String(val).trim(); // 前后去空格
			}


			// 原始form 有对应值，但是类型不正确
			switch (type) {
				case 'area': {
					if (!Array.isArray(val) || val.length != 3) return '';
					break;
				}
				case 'switch': {
					if (typeof (val) != 'boolean') return true;
					break;
				}
				case 'checkbox': {
					if (!Array.isArray(val)) return [String(val).trim()]; //尝试转为数组来匹配
					break;
				}
				case 'year': {
					if (!val || validate.checkYear(val)) return '';
					break;
				}
				case 'month': {
					if (!val || validate.checkYearMonth(val)) return '';
					break;
				}
				case 'date': {
					if (!val || validate.checkDate(val)) return '';
					break;
				}
				case 'hourminute': {
					if (!val || validate.checkHourMinute(val)) return '';
					break;
				}
				case 'number': { // 整数(字符形式)
					if (!val || validate.checkInt(val)) return '';
					break;
				}
				case 'digit': { // 小数(字符形式)
					if (!val || validate.checkDigit(val)) return '';
					break;
				}
				default: {

				}
			}

			return val;
		},

		_setForm: function (idx, val) {
			let forms = this.data.forms;
			let fields = this.data.fields;
			fields[idx].val = val;
			forms[idx].val = val;
			this.setData({
				forms,
				fields
			}); 

			//this.triggerEvent('forms', forms);
		},

		bindLineBlur: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let val = e.detail.value.trim(); 
			this._setForm(idx, val);
		},

		bindDayChange: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let val = e.detail.value.trim();
			this._setForm(idx, val);
		},

		bindAreaChange: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let val = e.detail.value;
			this._setForm(idx, val);
		},

		bindSelectCmpt: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let val = e.detail.trim();
			this._setForm(idx, val);
		},

		bindCheckBoxCmpt: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let val = e.detail;
			this._setForm(idx, val);
		},

		switchModel: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let val = e.detail.value;
			this._setForm(idx, val);
		},

		bindGetPhoneNumber: async function (e) {
			if (e.detail.errMsg == "getPhoneNumber:ok") {

				let cloudID = e.detail.cloudID;
				let params = {
					cloudID
				};
				let opt = {
					title: '手机验证中'
				};
				await cloudHelper.callCloudSumbit('passport/phone', params, opt).then(res => {
					let phone = res.data;
					if (!phone || phone.length < 11)
						wx.showToast({
							title: '手机号码获取失败，请重新绑定手机号码',
							icon: 'none',
							duration: 2000
						});
					else {
						let idx = pageHelper.dataset(e, 'idx');
						this._setForm(idx, phone);
					}
				});
			} else
				wx.showToast({
					title: '手机号码获取失败，请重新绑定手机号码',
					icon: 'none'
				});
		},

		checkForms: function () {
			// 写缓存
			if (this.data.isCacheMatch) {
				cacheHelper.set(CACHE_FORM_SHOW_KEY, this.data.forms, CACHE_FORM_SHOW_TIME);
			}

			let ret = formSetHelper.checkForm(this.data.fields, this.data.forms);

			this.setData({
				fields: this.data.fields
			});

			if (!ret) return;

			if (this.data.isConfirm) { //是否显示确认信息
				this.setData({
					showCheckModal: true
				});
			} else {
				this.triggerEvent('submit', this.data.forms);
			}

		},

		bindSubmitCmpt: function () {
			this.setData({
				showCheckModal: false
			});
			this.triggerEvent('submit', this.data.forms);
		},

		getForms: function () {
			return this.data.forms;
		}
	},

})