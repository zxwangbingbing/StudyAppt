 /**
 * Notes: 数据校验类库
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const helper = require("./helper.js");

function checkRequired(value, desc) {
	if (value == '')
		return desc + '不能为空';
}

/**
 * 校验字符长度
 * @param {*} value 
 * @param {*} min 
 * @param {*} max 
 */
function isCheckLen(value, min, max) { //TODO 数字怎么处理
	if (!helper.isDefined(value)) return false;
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
	if (!helper.isDefined(value)) return false;

	if (typeof (value) == 'string' && /^[0-9]+$/.test(value))
		value = Number(value);
	if (typeof (value) != 'number') return false;

	if (value < min || value > max) return false;
	return true;
}

function checkMin(value, len, desc) {
	if (value.length < len)
		return desc + '不能小于' + len + '位';
};

function checkMax(value, len, desc) {
	if (value.length > len)
		return desc + '不能大于' + len + '位';
};

function checkLen(value, len, desc) {
	if (value.length != len)
		return desc + '必须为' + len + '位';
};

function checkMobile(value, desc) {
	if (value == '') return '';
	if (!/(^1[3|5|8][0-9]{9}$)/.test(value))
		return desc + '格式不正确';
}

function checkInt(value, desc) {
	if (value == '') return '';
	if (!/^[0-9]+$/.test(value))
		return desc + '必须为数字';
}

function checkLetter(value, desc) {
	if (value == '') return;
	if (!/^[A-Za-z]+$/.test(value))
		return desc + '必须为字母';
}

function checkLetterNum(value, desc) {
	if (value == '') return;
	if (!/^\w+$/.test(value))
		return desc + '必须为字母，数字和下划线';
}

function checkId(value, desc, min = 1, max = 32) {
	if (value == '') return;
	if (value.length < min || value.length > max) return false;
	if (!/^\w+$/.test(value))
		return desc + '必须为ID格式';
}

function isCheckId(value, min = 1, max = 32) {
	if (!helper.isDefined(value)) return false;
	if (typeof (value) != 'string') return false;
	if (value.length < min || value.length > max) return false;
	if (!/^\w+$/.test(value))
		return false;
	return true;
}

//  邮箱
function checkEmail(value, desc) {
	if (value == '') return;
	let hint = desc + '必须为邮箱格式';
	let reg = /^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/;
	if (!reg.test(value)) return hint;
}

// 短日期，形如 (2008-07-22)
function checkDate(value, desc) {
	if (value == '') return;
	let hint = '请选择' + desc;
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
	if (value == '') return;
	let hint = desc + '必须为时间格式';
	if (value.length != 8) return hint;

	let a = value.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
	if (a == null) return hint;
	if (a[1] > 24 || a[3] > 60 || a[4] > 60) return hint;
}

// 长时间，形如 (2008-07-22 13:04:06)
function checkDatimeTime(value, desc) {
	if (value == '') return;
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
	if (value == '') return;
	if (!Array.isArray(value))
		return desc + '填写错误';
}

function checkIn(value, ref, desc) {
	if (value == '') return;
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
	if (!helper.isDefined(value)) return false;
	let arr = ref.split(',');
	if (!arr.includes(value) && !arr.includes(value + '')) return false; //字符，数字都支持
	return true;
}

function checkIds(value, desc) {}

function checkString(value, desc) {}

function check(data, rules, that) {
	let returnData = {};
	for (let k in rules) {
		let arr = rules[k].split('|');
		let desc = '';

		// 数据项说明
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].indexOf('name=') > -1) {
				desc = arr[i].replace('name=', '');
				break;
			}
		}

		// 校验 
		let formName = arr[0];
		let val = data[formName];
		if (val === undefined) val = '';
		if (!Array.isArray(val))
			val = String(val).trim(); // 前后去空格
		returnData[k] = val;

		for (let i = 1; i < arr.length; i++) {
			let result = '';

			let rules = arr[i].split(':');

			// 空不校验
			if (rules[0] != 'required' && val == '') continue;

			switch (rules[0]) {
				case 'required':
					result = checkRequired(val, desc);
					break;
				case 'array':
					result = checkArray(val, desc);
					break;
				case 'date':
					result = checkDate(val, desc);
					break;
				case 'time':
					result = checkTime(val, desc);
					break;
				case 'datetime':
					result = checkDatimeTime(val, desc);
					break;
				case 'min':
					result = checkMin(val, Number(rules[1]), desc);
					break;
				case 'max':
					result = checkMax(val, Number(rules[1]), desc);
					break;
				case 'len':
					result = checkLen(val, Number(rules[1]), desc);
					break;
				case 'in':
					result = checkIn(val, rules[1], desc);
					break;
				case 'email':
					result = checkEmail(val, desc);
					break;
				case 'mobile':
					result = checkMobile(val, desc);
					break;
				case 'int':
					result = checkInt(val, desc);
					break;
				case 'id':
					result = checkId(val, desc);
					break;
				case 'letter':
					result = checkLetter(val, desc);
					break;
				case 'letter_num':
					result = checkLetterNum(val, desc);
					break;
			}

			if (result) {
				wx.showModal({
					title: '温馨提示',
					content: result,
					showCancel: false,
					success(res) {
						// 自动聚焦
						if (that)
							that.setData({
								[formName + 'Focus']: true
							});
					}
				});
				return false;
			} else {
				if (that) {
					// 删除原有的自动聚焦
					if (helper.isDefined(that.data[formName + 'Focus'])) {
						that.setData({ //TODO delete?
							[formName + 'Focus']: false
						});
					}
				}
			}

		}
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