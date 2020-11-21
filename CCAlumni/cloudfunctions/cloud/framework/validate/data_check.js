/**
 * Notes: 数据校验
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const util = require('../utils/util.js');
const AppError = require('../handler/app_error.js');
const appCode = require('../handler/app_code.js');

function checkRequired(value, desc) {
	if (!util.isDefined(value) || value === '')
		return desc + '不能为空';
}

/**
 * 校验字符长度
 * @param {*} value 
 * @param {*} min 
 * @param {*} max 
 */
function isCheckLen(value, min, max) { //TODO 数字怎么处理
	if (!util.isDefined(value)) return false;
	if (typeof (value) != 'string') return false;
	if (value.length < min || value.length > max) return false;
	return true;
}

/**
 * 校验数字大小
 * @param {*} value 
 * @param {*} min 
 * @param {*} max 
 */
function isCheckM(value, min, max) {
	if (!util.isDefined(value)) return false;

	if (typeof (value) == 'string' && /^[0-9]+$/.test(value))
		value = Number(value);
	if (typeof (value) != 'number') return false;

	if (value < min || value > max) return false;
	return true;
}

function checkMin(value, len, desc) {
	if (String(value).length < len)
		return desc + '不能小于' + len + '位';
};

function checkMax(value, len, desc) {
	if (String(value).length > len)
		return desc + '不能大于' + len + '位';
};

function checkLen(value, len, desc) { 
	if (Array.isArray(value) && value.length != len){  
		return desc + '必须为' + len + '位';
	}
	else if (!Array.isArray(value) && String(value).length != len){ 
		return desc + '必须为' + len + '位';
	}
		
};

function checkMobile(value, desc) {
	if (!util.isDefined(value) || value === '') return;
	if (!/(^1[3|5|8][0-9]{9}$)/.test(value))
		return desc + '格式不正确';
}

function checkInt(value, desc) {
	if (!util.isDefined(value) || value === '') return;
	if (!/^[0-9]+$/.test(String(value)))
		return desc + '必须为数字';
}

function checkLetter(value, desc) {
	if (!util.isDefined(value) || value === '') return;
	if (!/^[A-Za-z]+$/.test(value))
		return desc + '必须为字母';
}

function checkLetterNum(value, desc) {
	if (!util.isDefined(value) || value == '') return;
	if (!/^\w+$/.test(value))
		return desc + '必须为字母，数字和下划线';
}

function checkId(value, desc, min = 1, max = 128) {
	if (!util.isDefined(value) || value === '') return;
	if (value.length < min || value.length > max) return desc + '必须为ID格式';
	//if (!/^\w+$/.test(value))
	//	return desc + '必须为ID格式';
}

function isCheckId(value, min = 1, max = 32) {
	if (!util.isDefined(value)) return false;
	if (typeof (value) != 'string') return false;
	if (value.length < min || value.length > max) return false;
	if (!/^\w+$/.test(value))
		return false;
	return true;
}

//  邮箱
function checkEmail(value, desc) {
	if (!util.isDefined(value) || value === '') return;
	let hint = desc + '必须为邮箱格式';
	let reg = /^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/;
	if (!reg.test(value)) return hint;
}

// 短日期，形如 (2008-07-22)
function checkDate(value, desc) {
	if (!util.isDefined(value) || value === '') return;
	let hint = desc + '必须为日期格式';
	if (value.length != 10) return hint;
	let r = value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
	if (r == null) return hint;
	let d = new Date(r[1], r[3] - 1, r[4]);
	let chk = d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4];
	if (!chk)
		return hint;
}

// 短时间，形如 (13:04:06)
function checkTime(value, desc) {
	if (!util.isDefined(value) || value === '') return;
	let hint = desc + '必须为时间格式';
	if (value.length != 8) return hint;

	let a = value.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
	if (a == null) return hint;
	if (a[1] > 24 || a[3] > 60 || a[4] > 60) return hint;
}

// 长时间，形如 (2008-07-22 13:04:06)
function checkDatimeTime(value, desc) {
	if (!util.isDefined(value) || value === '') return;
	let hint = desc + '必须为完整时间格式';
	if (value.length != 19) return hint;

	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	var r = value.match(reg);
	if (r == null) return hint;
	var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
	let chk = d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7];
	if (!chk) return hint;
}

function checkArray(value, desc) {
	if (!util.isDefined(value)) return;
	if (!Array.isArray(value))
		return desc + '填写错误';
}

/**
 * 字符类型和数字类型均可
 * @param {*} value 
 * @param {*} ref 
 * @param {*} desc 
 */
function checkIn(value, ref, desc) {
	if (!util.isDefined(value) || value === '') return;
	let arr = ref.split(',');
	if (!arr.includes(value) && !arr.includes(value + ''))
		return desc + '填写错误';
}

/**
 * 检查枚举类型 
 * @param {*} value 
 * @param {*} ref 格式 1,2,3 
 */
function isCheckIn(value, ref) {
	if (!util.isDefined(value)) return false;
	let arr = ref.split(',');
	if (!arr.includes(value) && !arr.includes(value + '')) return false; //字符，数字都支持
	return true;
}

function checkIds(value, desc) {}

function checkString(value, desc) {}

function checkBool(value, desc) { 
	if (typeof(value) != 'boolean')
		return desc + '填写错误';
}

function check(data, rules) {
	if (data === undefined) return data;

	let returnData = {};
	for (let k in rules) {
		let arr = rules[k].split('|');
		let desc = k;
		let defVal = undefined;

		// 数据项说明 和缺省值
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].indexOf('name=') > -1) {
				desc = arr[i].replace('name=', '');
			}

			if (arr[i].indexOf('default=') > -1) {
				defVal = arr[i].replace('default=', '');
			}
		}


		// 校验 
		let formName = k;
		let val = data[formName];

		// 未填写但是有缺省值
		if (val === undefined && util.isDefined(defVal)) {
			val = defVal;
		}


		if (typeof (val) == 'string')
			val = String(val).trim(); // 前后去空格 

		for (let i = 0; i < arr.length; i++) {
			let result = '';

			let rules = arr[i].split(':');

			// 空不校验
			if (rules[0] != 'required' && val == '') continue;

			switch (rules[0]) {
				case 'required':
					result = checkRequired(val, desc);
					break;
				case 'object':
				case 'obj':
					//对象类型暂不校验 TODO
					break;
				case 'bool':
				case 'boolean':
					if (util.isDefined(val)) {
						if (val === 'true')
							val = true;
						else if (val === 'false')
							val = false; 
						result = checkBool(val, desc);
					}
					break;
				case 'int':
					if (util.isDefined(val)) {
						val = Number(val);
						result = checkInt(val, desc);
					}
					break;
				case 'array':
				case 'arr':
					if (util.isDefined(val)) {
						result = checkArray(val, desc);
					}
					break;
				case 'date':
					if (util.isDefined(val)) {
						val = String(val);
						result = checkDate(val, desc);
					}
					break;
				case 'time':
					if (util.isDefined(val)) {
						val = String(val);
						result = checkTime(val, desc);
					}
					break;
				case 'datetime':
					if (util.isDefined(val)) {
						val = String(val);
						result = checkDatimeTime(val, desc);
					}

					break;
				case 'min':
					if (util.isDefined(val)) {
						result = checkMin(val, Number(rules[1]), desc);
					}
					break;
				case 'max':
					if (util.isDefined(val)) {
						result = checkMax(val, Number(rules[1]), desc);
					}
					break;
				case 'len':
				case 'length':
					if (util.isDefined(val)) {
						result = checkLen(val, Number(rules[1]), desc);
					}
					break;
				case 'in':
					if (util.isDefined(val)) {
						result = checkIn(val, rules[1], desc);
					}
					break;
				case 'email':
					if (util.isDefined(val)) {
						val = String(val);
						result = checkEmail(val, desc);
					}
					break;
				case 'mobile':
					if (util.isDefined(val)) {
						val = String(val);
						result = checkMobile(val, desc);
					}
					break;
				case 'id':
					if (util.isDefined(val)) {
						val = String(val);
						result = checkId(val, desc);
					}
					break;
				case 'letter':
					if (util.isDefined(val)) {
						val = String(val);
						result = checkLetter(val, desc);
					}
					break;
				case 'letter_num':
					if (util.isDefined(val)) {
						val = String(val);
						result = checkLetterNum(val, desc);
					}
					break;
			}

			if (result) {
				throw new AppError(result, appCode.DATA);
				return false;
			} else {

			}

		}

		returnData[k] = val;
	}
	return returnData;
}

module.exports = {
	check,
	isCheckLen,
	isCheckIn,
	isCheckM,
	isCheckId
}