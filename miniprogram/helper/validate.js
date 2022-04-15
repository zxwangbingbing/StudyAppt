 /**
  * Notes: 数据校验类库
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
  * Date: 2021-01-07 07:48:00 
  * 
1 规则大循环
2 规则内循环，取得数据项说明(默认空串)，缺省值(默认空串)，数据类型(默认String)
3 对比缺省值和数据类型 
4 获取表单名，并取值（若不存在，直接赋予对应的defVal)
5 检查数据类型：
	若传值为undefined/null, 且有默认值，赋予默认值
	Number先做正则判断再转为Num; 
	Arr/Obj/Bool 若不为undefined , 则判断类型; 
	String 包含Number，转为Str
6 规则内循环, 数据校验（服务端从第1位，客户端从第2位开始)
  * object格式(注意双引号) {"cc":"sss"}
  */
 const pageHelper = require('./page_helper.js');

 const CHECK_OPEN = true;
 const CHECK_SOURCE = 'client'; //client/admin 

 /**
  * 判断变量，参数，对象属性是否定义
  * @param {*} val 
  */
 function isDefined(val) {
 	// ==  不能判断是否为null
 	if (val === undefined)
 		return false;
 	else
 		return true;
 }

 function isNull(value) {
 	if (value === null || value === undefined) return true;
 	if (getDataType(value) == String && value === '') return true;
 	return false;
 }

 function isStrAndArrNull(value) {
 	if (value === null || value === undefined) return true;

 	let type = getDataType(value);
 	if (type == String && value === '') return true;
 	if (type == Array && value.length == 0) return true;

 	return false;
 }

 function isRealNull(value) {
 	if (value === null || value === undefined) return true;

 	let type = getDataType(value);
 	if (type == String && value === '') return true;
 	if (type == Array && value.length == 0) return true;
 	if (type == Object && JSON.stringify(value) == '{}') return true;

 	return false;
 }

 function getDataType(value) {
 	if (value === null || value === undefined) return value;
 	return value.constructor;
 }

 // 是否必填
 function checkRequired(value, desc = '') {
 	switch (getDataType(value)) {
 		case Object:
 			if (JSON.stringify(value) == '{}')
 				return desc + '不能为空obj';
 			break;
 		case Array:
 			if (value.length == 0)
 				return desc + '不能为空arr';
 			break;
 		case String:
 			if (value.length == 0)
 				return desc + '不能为空';
 			break;
 		case null:
 		case undefined:
 			return desc + '不能为空';
 	}
 }

 // 校验字符/数组长度，校验数字大小
 function checkMin(value, min, desc = '') {
 	if (isStrAndArrNull(value)) return;

 	min = Number(min);
 	switch (getDataType(value)) {
 		case Array:
 			if (value.length < min)
 				return desc + '不能少于' + min + '项';
 			break;
 		case String:
 			if (value.length < min)
 				return desc + '不能少于' + min + '个字';
 			break;
 		case Number:
 			if (value < min)
 				return desc + '不能小于' + min;
 			break;
 	}
 };

 // 校验字符/数组长度，校验数字大小
 function checkMax(value, max, desc = '') {
 	if (isStrAndArrNull(value)) return;

 	max = Number(max);
 	switch (getDataType(value)) {
 		case Array:
 			if (value.length > max)
 				return desc + '不能多于' + max + '项';
 			break;
 		case String:
 			if (value.length > max)
 				return desc + '不能多于' + max + '个字';
 			break;
 		case Number:
 			if (value > max)
 				return desc + '不能大于' + max;
 			break;
 	}
 };

 // 校验字符/数组长度 
 function checkLen(value, len, desc = '') {
 	if (isStrAndArrNull(value)) return;

 	len = Number(len);
 	switch (getDataType(value)) {
 		case Array:
 			if (value.length != len)
 				return desc + '必须为' + len + '项';
 			break;
 		case String:
 			if (value.length != len)
 				return desc + '必须为' + len + '个字';
 			break;
 	}
 };

 function checkMobile(value, desc = '') {
 	if (isNull(value)) return;

 	if (!/(^1[1|2|3|4|5|6|7|8|9][0-9]{9}$)/.test(value))
 		return desc + '格式不正确';
 }

 function checkInt(value, desc = '') {
 	if (isNull(value)) return;

 	if (!/^[0-9]+$/.test(value))
 		return desc + '必须为数字';
 }

 function checkDigit(value, desc = '') {
 	if (isNull(value)) return;

 	if (!/^\d+(\.\d+)?$/.test(value))
 		return desc + '必须为数字或小数';
 }

 function checkLetter(value, desc = '') {
 	if (isNull(value)) return;

 	if (!/^[A-Za-z]+$/.test(value))
 		return desc + '必须为字母';
 }

 function checkMoney(value, desc = '') {
 	if (isNull(value)) return;

 	if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value))
 		return desc + '必须为金额格式，例如2.00';
 }


 function checkLetterNum(value, desc = '') {
 	if (isNull(value)) return;

 	if (!/^\w+$/.test(value))
 		return desc + '必须为字母，数字和下划线';
 }

 function checkId(value, desc = '', min = 1, max = 32) {
 	if (isNull(value)) return;

 	min = Number(min);
 	max = Number(max);

 	if (getDataType(value) != String) return desc + '必须为ID字符串格式';

 	if (value.length < min || value.length > max) return desc + '必须为ID格式';
	/*if (!/^\w+$/.test(value))
		return desc + '必须为ID格式';*/
 }

 //  邮箱
 function checkEmail(value, desc = '') {
 	if (isNull(value)) return;

 	let reg = /^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/;
 	if (!reg.test(value)) return desc + '必须为邮箱格式';
 }

 // 短日期，形如 (yyyy-mm-dd 2008-07-22)
 function checkDate(value, desc = '') {
 	if (isNull(value)) return;

 	let hint = '请选择' + desc;
 	if (value.length != 10) return hint;
 	let r = value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
 	if (r == null) return hint;
 	let d = new Date(r[1], r[3] - 1, r[4]);
 	let chk = d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4];
 	if (!chk) return hint;
 }

 // 年份，形如 (yyyy 2008)
 function checkYear(value, desc = '') {
 	if (isNull(value)) return;

 	let hint = '请选择' + desc;
 	if (value.length != 4) return hint;
 	value += '-01-01';
 	return checkDate(value, desc);
 }

 // 年月，形如 (yyyy-mm 2008-01)
 function checkYearMonth(value, desc = '') {
 	if (isNull(value)) return;

 	let hint = '请选择' + desc;
 	if (value.length != 7) return hint;

 	value += '-01';
 	return checkDate(value, desc);
 }

 // 短时间(时分秒)，形如 (13:04:06)
 function checkTime(value, desc = '') {
 	if (isNull(value)) return;

 	let hint = desc + '必须为时间格式';
 	if (value.length != 8) return hint;

 	let a = value.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
 	if (a == null) return hint;
 	if (a[1] > 23 || a[3] > 59 || a[4] > 59) return hint;
 }

 // 短时间(时分)，形如 (hh:mm 13:04)
 function checkHourMinute(value, desc = '') {
 	if (isNull(value)) return;

 	let hint = desc + '必须为时分时间格式';
 	if (value.length != 5) return hint;

 	value += ':01';
 	return checkTime(value, desc);
 }

 // 长时间，形如 (2008-07-22 13:04:06)
 function checkDatimeTime(value, desc = '') {
 	if (isNull(value)) return;

 	let hint = desc + '必须为完整时间格式';
 	if (value.length != 19) return hint;

 	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
 	var r = value.match(reg);
 	if (r == null) return hint;
 	var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
 	let chk = d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7];
 	if (!chk) return hint;
 }

 function checkArray(value, desc = '') {
 	if (!Array.isArray(value))
 		return desc + '填写错误arr';
 }

 function checkObject(value, desc = '') {
 	if (value.constructor != Object)
 		return desc + '填写错误obj';
 }

 function checkBoolean(value, desc = '') {
 	if (value.constructor != Boolean)
 		return desc + '填写错误bool';
 }

 // 枚举 ref=1,2,3,4格式
 function checkIn(value, ref, desc = '') {
 	if (isNull(value)) return;

 	let type = getDataType(value);
 	if (type != String && type != Number) return desc + '填写范围错误';

 	let arr = String(ref).split(',');
 	if (!arr.includes(value) && !arr.includes(value + ''))
 		return desc + '填写范围错误';
 }

 function checkIds(value, desc) {}

 function checkString(value, desc) {
 	if (value.constructor != String)
 		return desc + '填写错误';
 }


 function check(data, rules, that) {
 	let returnData = {};
 	for (let k in rules) {
 		let arr = rules[k].split('|');

 		let desc = k; // 字段说明
 		let defVal = undefined; // 缺省值
 		let dataType = 'String'; //数据类型   

 		if (!CHECK_OPEN) { // 不校验
 			// 取值
 			let val = data[formName];
 			returnData[k] = val;
 			continue;
 		}

 		// 小循环获取规则
 		for (let i = 0; i < arr.length; i++) {
 			// 数据项说明  
			if (arr[i].startsWith('name=')) {
				desc = '「' + arr[i].replace('name=', '') + '」';
 				continue;
			 } 

 			// 缺省值 
 			if (arr[i].startsWith('default=')) {
 				defVal = arr[i].replace('default=', '').trim();
 				continue;
 			}

 			// 数据类型 
 			switch (arr[i].toLowerCase()) {
 				case 'int':
 				case 'digit':
 					dataType = 'Number';
 					break;
 				case 'array':
 				case 'arr':
 					dataType = 'Array';
 					break;
 				case 'object':
 				case 'obj':
 					dataType = 'Object';
 					break;
 				case 'bool':
 				case 'boolean':
 					dataType = 'Boolean';
 					break;
 			}
 		}

 		// 校验 
 		let formName = (CHECK_SOURCE == 'admin') ? k : arr[0]; // 表单名  admin/client

 		// 取值
 		let val = data[formName];

 		switch (dataType) {
 			case 'Array': {
				if (defVal !== undefined) {
 					try {
 						defVal = JSON.parse(defVal);

 						if (getDataType(defVal) != Array)
 							return _showError(desc + '默认值数组格式错误', formName, that);
 					} catch (ex) {
 						return _showError(desc + '默认值数组格式错误', formName, that);
 					}
 				}
 				if (val === null || val === undefined) val = defVal;

				if (val !== undefined && getDataType(val) != Array)
 					return _showError(desc + '数组格式错误', formName, that);

 				break;
 			}
 			case 'Object': {
				if (defVal !== undefined) {
 					try {
 						defVal = JSON.parse(defVal);

 						if (getDataType(defVal) != Object)
 							return _showError(desc + '默认值对象格式错误', formName, that);
 					} catch (ex) {
 						return _showError(desc + '默认值对象格式错误', formName, that);
 					}
 				}
 				if (val === null || val === undefined) val = defVal;

				if (val !== undefined && getDataType(val) != Object)
 					return _showError(desc + '对象格式错误', formName, that);

 				break;
 			}
 			case 'Boolean': {
				if (defVal !== undefined) {
 					try {
 						defVal = JSON.parse(defVal);

 						if (getDataType(defVal) != Boolean)
 							return _showError(desc + '默认值布尔格式错误', formName, that);
 					} catch (ex) {
 						return _showError(desc + '默认值布尔格式错误');
 					}
 				}
 				if (val === null || val === undefined) val = defVal;

				if (val !== undefined && getDataType(val) != Boolean)
 					return _showError(desc + '布尔格式错误', formName, that);

 				break;
 			}
 			case 'Number': {
 				if (checkDigit(defVal, desc + '默认值'))
 					return _showError(desc + '默认值格式错误', formName, that);

				if (val === null || val === undefined) val = defVal;

				if (val === undefined) break;

 				if (val === '') //数字不能为空
 					return _showError(desc + '不能为空', formName, that);

 				let dataType = getDataType(val);
 				if (dataType == Object || dataType == Boolean || dataType == Array)
 					return _showError(desc + '必须为数字格式', formName, that);

 				// 数字格式校验
 				let result = checkDigit(val, desc);
 				if (result) return _showError(result, formName, that);

 				val = Number(val);

 				break;
 			}
 			case 'String': {
 				let dataType = getDataType(val);
 				if (dataType == Object || dataType == Boolean || dataType == Array)
 					return _showError(desc + '必须为字符串格式', formName, that);

 				if (val === null || val === undefined) val = defVal;

				if (val === undefined) break;

 				try {
					val = String(val).trim(); // 数字会被转为字符串
 				} catch (ex) {
 					return _showError(desc + '必须为字符串格式', formName, that);
 				}
 				break;
 			}
 		}

 		returnData[k] = val;

 		let fromStep = (CHECK_SOURCE == 'admin') ? 0 : 1; //admin/client
 		for (let i = fromStep; i < arr.length; i++) {
 			let result = '';

 			let rules = arr[i].split(':');
 			let ruleName = rules[0];

			// 空 且非必填的 不校验 
			if (ruleName != 'must' && val === undefined) continue;

 			switch (ruleName) {
 				case 'must':
 					result = checkRequired(val, desc);
 					break;
 				case 'str':
 				case 'string':
 					result = checkString(val, desc);
 					break;
 				case 'arr':
 				case 'array':
 					result = checkArray(val, desc);
 					break;
 				case 'obj':
 				case 'object':
 					result = checkObject(val, desc);
 					break;
 				case 'bool':
 				case 'boolean':
 					result = checkBoolean(val, desc);
 					break;
 				case 'money':
 					result = checkMoney(val, desc);
 					break;
 				case 'year':
 					result = checkYear(val, desc);
 					break;
 				case 'yearmonth':
 					result = checkYearMonth(val, desc);
 					break;
 				case 'date':
 					result = checkDate(val, desc);
 					break;
 				case 'time':
 					result = checkTime(val, desc);
 					break;
 				case 'hourminute':
 					result = checkHourMinute(val, desc);
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
 				case 'int': // 正整数
 					result = checkInt(val, desc);
 					break;
 				case 'digit': // 正小整数
 					result = checkDigit(val, desc);
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
 				_showError(result, formName, that);
 				return false;
 			} else {

 				if (that) {
 					if (CHECK_SOURCE == 'client') {
 						// 删除原有的自动聚焦 //admin/client
 						if (isDefined(that.data[formName + 'Focus'])) {
 							that.setData({ //TODO delete?
 								[formName + 'Focus']: false
 							});
 						}
 					}
 				}
 			}

 		}
 	}
 	return returnData;
 }

 function _showError(result, formName, that) { //admin/client
 	if (CHECK_SOURCE == 'client') {
 		wx.showModal({
 			title: '温馨提示',
 			content: result,
 			showCancel: false,
 			success(res) {
 				// 自动聚焦
 				if (that) {
 					pageHelper.anchor(formName, that);

 					that.setData({
 						[formName + 'Focus']: result,
 					});
 				}

 			}
 		});
 	} else {
 		throw new AppError(result, appCode.DATA);
 	}

 }

 module.exports = {
 	check,

 	checkString,
 	checkArray,
 	checkObject,
 	checkMoney,
 	checkYear,
 	checkYearMonth,
 	checkDate,
 	checkTime,
 	checkHourMinute,
 	checkDatimeTime,
 	checkMin,
 	checkMax,
 	checkLen,
 	checkIn,
 	checkEmail,
 	checkMobile,
 	checkInt, // 正小整数
 	checkDigit,
 	checkId,
 	checkLetter,
 	checkLetterNum,

 }