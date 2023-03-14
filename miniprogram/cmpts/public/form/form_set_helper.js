/**
 * 配置格式
 * mark
 * title:
 * type:
 * desc: 
 * min:
 * max:
 * must:
 * checkBoxLimit:2
 * onlySet:{mode:'all',cnt:-1}
 * selectOptions:['',''] 
 * def
 */
const dataHelper = require('../../../helper/data_helper.js');
const pageHelper = require('../../../helper/page_helper.js');
const helper = require('../../../helper/helper.js');
const validate = require('../../../helper/validate.js');

function initFieldOne(field) {
	return initFields([field])[0];
}

function initFields(defaultFields = null) {
	let fields = dataHelper.deepClone(defaultFields);
	if (fields && Array.isArray(fields)) {
		for (let k = 0; k < fields.length; k++) {
			let curForm = fields[k];
			// 补充编号
			if (!curForm['mark']) curForm['mark'] = mark();
 
			// 常规属性
			if (!helper.isDefined(curForm['type'])) curForm['type'] = 'text';
			if (!helper.isDefined(curForm['title'])) curForm['title'] = '姓名';
			if (!helper.isDefined(curForm['desc'])) curForm['desc'] = '';
			if (!helper.isDefined(curForm['must'])) curForm['must'] = false;
			if (!helper.isDefined(curForm['def'])) curForm['def'] = null; //默认值
			if (!helper.isDefined(curForm['edit'])) curForm['edit'] = true; //是否可编辑删除
 
			// 扩展属性
			if (!helper.isDefined(curForm['ext'])) curForm['ext'] = {};

			// 默认长度
			let max = 50;
			let min = 0;
			switch (fields[k].type) {
				case 'textarea':
					max = 500;
					break;
				case 'image':
					max = 8;
					break;
				case 'digit':
				case 'int':
					max = 10;
					break;
			}

			// 长度
			if (!helper.isDefined(curForm['max'])) curForm['max'] = max;
			if (!helper.isDefined(curForm['min'])) curForm['min'] = min;

			// 固定长度
			if (helper.isDefined(curForm['len'])) {
				curForm['max'] = curForm['len'];
				curForm['min'] = curForm['len'];
				delete curForm['len'];
			}

			// 图片张数不超过8
			if (fields[k].type == 'image') {
				if (curForm['max'] > 8) curForm['max'] = 8;
				if (curForm['min'] > 8) curForm['min'] = 8;
			}

			if (fields[k].type == 'mobile') {
				curForm['max'] = 11;
				curForm['min'] = 11;
			}

			// 唯一性
			if (!helper.isDefined(curForm['onlySet'])) curForm['onlySet'] = {
				mode: 'all',
				cnt: -1
			};

			// 可选项
			if (!helper.isDefined(curForm['selectOptions'])) {
				if (fields[k].type == 'select' || fields[k].type == 'checkbox' || fields[k].type == 'radio')
					curForm['selectOptions'] = ['是', '否'];
				else
					curForm['selectOptions'] = ['', ''];
			} 
			 
			
			if (!helper.isDefined(curForm['checkBoxLimit'])) curForm['checkBoxLimit'] = 2;
		}
	}

	return fields || [
		{
			mark: mark(),
			type: 'text',
			title: '姓名',
			desc: '您的姓名',
			must: true,
			min: 0,
			max: 30,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''], 
			checkBoxLimit: 2,
			def: null,
			edit:false
		},
	];
}


// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
// 详情查看javascript的数值范围
function checkIDCard(idcode) {
	if (idcode.length != 18) return false;

	// 加权因子
	var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	// 校验码
	var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

	var code = idcode + "";
	var last = idcode[17]; //最后一位

	var seventeen = code.substring(0, 17);

	// ISO 7064:1983.MOD 11-2
	// 判断最后一位校验码是否正确
	var arr = seventeen.split("");
	var len = arr.length;
	var num = 0;
	for (var i = 0; i < len; i++) {
		num = num + arr[i] * weight_factor[i];
	}

	// 获取余数
	var resisue = num % 11;
	var last_no = check_code[resisue];

	// 格式的正则
	// 正则思路
	/*
	第一位不可能是0
	第二位到第六位可以是0-9
	第七位到第十位是年份，所以七八位为19或者20
	十一位和十二位是月份，这两位是01-12之间的数值
	十三位和十四位是日期，是从01-31之间的数值
	十五，十六，十七都是数字0-9
	十八位可能是数字0-9，也可能是X
	*/
	var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

	// 判断格式是否正确
	var format = idcard_patter.test(idcode);

	// 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
	return last === last_no && format ? true : false;
}

// 必填提示
function getMustHint(type) {
	if (type == 'image') return '请上传';

	let arr = ['select', 'date', 'month', 'hourminute', 'time', 'checkbox', 'radio','switch', 'area'];
	if (arr.includes(type))
		return '请选择';
	else
		return '请填写';
}

// form 数据校验
function checkForm(fields, forms, that) {
	for (let k = 0; k < fields.length; k++) {
		delete fields[k].focus;
	}

	for (let k = 0; k < fields.length; k++) {
		let type = fields[k].type;
		let title = '「' + fields[k].title + '」';
		let val = forms[k].val;

		// 必填
		let hintOprt = getMustHint(type); //提示动作

		if (fields[k].must && type != 'switch' && (!helper.isDefined(val) || val.length == 0)) {
			fields[k].focus = hintOprt + title;
			pageHelper.anchor('form' + forms[k].mark, that);
			return pageHelper.showModal(hintOprt + '' + title);
		}

		// 填写后，字符串最大长度 
		if (val.length > 0 && (type == 'text' || type == 'textarea' || type == 'int' || type == 'digit')) {
			if (fields[k].max == fields[k].min) {
				let len = fields[k].max;
				if (val.length != len) {
					fields[k].focus = title + ' 字数必须为' + len + '位';
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal(title + ' 字数必须为' + len + '位');
				}
			}
			else {
				if (val.length > fields[k].max) {
					fields[k].focus = title + ' 字数不能多于' + fields[k].max + '位';
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal(title + ' 字数不能多于' + fields[k].max + '位');
				}

				if (val.length < fields[k].min) {
					fields[k].focus = title + ' 字数不能少于' + fields[k].min + '位';
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal(title + ' 字数不能少于' + fields[k].min + '位');
				}
			}
		}

		// 传图后，字符串最大长度 
		if (val.length > 0 && (type == 'image')) {
			if (fields[k].max == fields[k].min) {
				let len = fields[k].max;
				if (val.length != len) {
					fields[k].focus = title + ' 张数必须为' + len + '张';
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal(title + ' 张数必须为' + len + '张');
				}
			}
			else {
				if (val.length > fields[k].max) {
					fields[k].focus = title + ' 张数不能多于' + fields[k].max + '张';
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal(title + ' 张数不能多于' + fields[k].max + '张');
				}

				if (val.length < fields[k].min) {
					fields[k].focus = title + ' 张数不能少于' + fields[k].min + '张';
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal(title + ' 张数不能少于' + fields[k].min + '张');
				}
			}
		}


		switch (type) {
			case 'rows': {
				// 多条目的数据校验
				let ret = that.selectComponent('#rows' + k).checkForms();
				if (ret !== true) return;
				break;
			}
			case 'tag': { // 标签格式化
				forms[k].val = dataHelper.fmtTag(val);
				break;
			}
			case 'mobile': {
				if (val.length > 0 && val.length != 11) {
					fields[k].focus = '请填写正确的 ' + title;
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal('请填写正确的 ' + title);
				}
				break;
			}
			case 'switch': {
				// TODO 是否要做判断
				break;
			}
			case 'idcard': {
				if (val.length > 0 && !checkIDCard(val)) {
					fields[k].focus = '请填写正确的 ' + title;
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal('请填写正确的 ' + title);
				}
				break;
			}
			case 'checkbox': {
				if (val.length > 0 && val.length < fields[k].checkBoxLimit) {
					fields[k].focus = title + ' 至少选中' + fields[k].checkBoxLimit + '项';
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal(title + ' 至少选中' + fields[k].checkBoxLimit + '项');
				}
				break;
			}
			case 'date': {
				if (validate.checkDate(val)) {
					fields[k].focus = '请填写正确的 ' + title;
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal('请填写正确的 ' + title);
				}
				break;
			}
			case 'year': {
				if (validate.checkYear(val)) {
					fields[k].focus = '请填写正确的 ' + title;
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal('请填写正确的 ' + title);
				}
				break;
			}
			case 'month': {
				if (validate.checkYearMonth(val)) {
					fields[k].focus = '请填写正确的 ' + title;
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal('请填写正确的 ' + title);
				}
				break;
			}
			case 'hourminute': {
				if (validate.checkHourMinute(val)) {
					fields[k].focus = '请填写正确的 ' + title;
					pageHelper.anchor('form' + forms[k].mark, that);
					return pageHelper.showModal('请填写正确的 ' + title);
				}
				break;
			}
			case 'int': {
				if (validate.checkInt(val)) {
					fields[k].focus = title + '必须为数字';
					return pageHelper.showModal(title + '必须为数字');
				}
				break;
			}
			case 'digit': {
				if (validate.checkDigit(val)) {
					fields[k].focus = title + '必须为数字或小数';
					return pageHelper.showModal(title + '必须为数字或小数');
				}
				break;
			}
		}

	}
	return true;
}

function mark() {
	return dataHelper.genRandomAlpha(10).toUpperCase();
};

function getTypeOptions() {
	//return dataHelper.getSelectOptions('text=单行文本,select=单项选择,checkbox=多项选择,switch=开关选择,textarea=多行文本,idcard=身份证号码,mobile=手机号码,date=日期 (年 月 日),month=月份,year=年份,hourminute=时间点,area=省市区,int=整数数字,digit=带小数点的数字');

	return dataHelper.getSelectOptions('text=单行文本,select=单项选择,checkbox=多项选择,switch=开关选择,textarea=多行文本,idcard=身份证号码,date=日期 (年 月 日),month=月份,year=年份,hourminute=时间点,area=省市区,int=整数数字,digit=带小数点的数字');
}

// 重复性规则
function getOnlySetOptions() {
	let mode = dataHelper.getSelectOptions('all=本项目全程重复次数,clock=按每一时段限制重复次数,day=按每天限制重复次数');

	let list = [];
	for (let k = 0; k < mode.length; k++) {
		let node = {};
		node.label = mode[k].label;
		node.val = mode[k].val;

		let children = [];
		if (k == 0) {
			children.push({
				label: '不限制重复次数',
				val: -1
			});
		}
		for (let j = 1; j <= 30; j++) {
			let childNode = {};
			if (j == 1)
				childNode.label = '仅可填写' + j + '次';
			else
				childNode.label = '可重复' + j + '次';
			childNode.val = j
			children.push(childNode);
		}

		node.children = children;

		list.push(node);
	}

	return list;
}

// 重复性规则的表述
function getOnlySetDesc(rule) {
	let ret = '';
	switch (rule.mode) {
		case 'all':
			ret = rule.cnt > 0 ? '本项目全程可重复' + rule.cnt + '次' : '本项目全程不限制重复次数';
			break;
		case 'day':
			ret = '每天可重复' + rule.cnt + '次';
			break;
		case 'clock':
			ret = '每一时段可重复' + rule.cnt + '次';
			break;
	}
	if (rule.cnt == 1) ret = ret.replace(/可重复/g, '仅可填写');
	return ret;
}

module.exports = {
	checkForm,
	mark,

	initFieldOne,
	initFields,

	getTypeOptions,

	getOnlySetOptions,
	getOnlySetDesc
}