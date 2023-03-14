/**
 * Notes: 字符相关操作函数
 * Ver : CCMiniCloud Framework 2.5.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-09-05 04:00:00 
 */


/**
 * 生成一个特定范围内的随机数
 */
const genRandomNum = (min, max) => (Math.random() * (max - min + 1) | 0) + min;

/**
 * 生成一个随机的数字字母字符串 
 */
const genRandomString = len => {
	const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const rdmIndex = text => Math.random() * text.length | 0;
	let rdmString = '';
	for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
	return rdmString;
}

/**
 * 生成一个随机的字母字符串 
 */
const genRandomAlpha = len => {
	const text = 'abcdefghijklmnopqrstuvwxyz';
	const rdmIndex = text => Math.random() * text.length | 0;
	let rdmString = '';
	for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
	return rdmString;
}

// 标签格式化
function fmtTag(tag) {
	if (!tag || tag.constructor != String) return '';
	tag = tag.trim();
	tag = tag.replace(/，/g, ',');

	let arr = tag.split(',');
	let newArr = [];
	for (let k = 0; k < arr.length; k++) {
		arr[k] = arr[k].trim();
		if (arr[k].length > 0) newArr.push(arr[k]);
	}
	return newArr.join(',');
}

// 拆分一维数组为二维数组
function spArr(arr, size) {
	if (!arr || !Array.isArray(arr) || arr.length == 0) return arr;

	let newArray = [];
	let index = 0;
	while (index < arr.length) {
		newArray.push(arr.slice(index, index += size));
	}
	return newArray;
}

/**
 * 把字符串格式化为数组
 * @param {*} str 
 * @param {*} sp 
 */
function str2Arr(str, sp = ',') {
	if (str && Array.isArray(str)) return str;

	str = str.replace(/，/g, sp);
	let arr = str.split(sp);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].trim();

		if (isNumber(arr[i])) {
			arr[i] = Number(arr[i]);
		}

	}
	return arr;
}

/**
 *  校验只要是数字（包含正负整数，0以及正负浮点数）就返回true 
 * @param {*} val 
 * @returns bool
 */
function isNumber(val) {
	var reg = /^[0-9]+.?[0-9]*$/;
	if (reg.test(val)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 提取对象数组的某个属性数组,如[{'x':1},{'x':2}] 提取 x得到[1,2]
 * @param {*} arr 
 * @param {*} key 
 * @returns []
 */
function getArrByKey(arr, key) {
	if (!Array.isArray(arr)) return;
	return arr.map((item) => {
		return item[key]
	});
}

/**
 * 提取对象数组的多个属性数组, 
 * 如 [{'x':1,'y':11,'z':111},{'x':2,'y':22,'z':222}] 
 * 提取 ['x','y'] 得到[{'x':1,'y':11},{'x':2,'y':22}]
 * @param {*} arr 
 * @param {*} keys 
 * @returns []
 */
function getArrByKeyMulti(arr, keys = []) {
	if (!Array.isArray(arr)) return;
	if (!Array.isArray(keys)) return;

	let ret = [];
	for (let k = 0; k < arr.length; k++) {
		let node = {};
		for (let j in keys) {
			node[keys[j]] = arr[k][keys[j]];
		}
		ret.push(node);
	}

	return ret;
}

/**
 * 提取对象数组某个键值等于某值的对象数据
 * @param {*} arr 
 * @param {*} key  
 * @param {*} val 
 * @returns object {}
 */
function getDataByKey(arr, key, val) { 
	if (!Array.isArray(arr)) return null;

	for (let k = 0; k < arr.length; k++) {
		if (arr[k][key] == val)
			return arr[k];
	}

	return null;
}

/**
 * 文本内容格式化处理
 * @param {*} content 
 * @param {*} len 截取长度 -1不截取
 */
function fmtText(content, len = -1) {
	if (!content) return content;
	
	let str = content.replace(/[\r\n]/g, ""); //去掉回车换行
	if (len > 0) {
		str = str.substr(0, len);
	}
	return str.trim();
}

// 下划线转换驼峰
function toHump(name) {
	name = name.replace(/\_(\w)/g, function (all, letter) {
		return letter.toUpperCase();
	});

	// 首字母大写 
	let firstChar = name.charAt(0).toUpperCase();
	return firstChar + name.slice(1);
}

// 驼峰转换下划线
function toLine(name) {
	name = name.replace(/([A-Z])/g, "_$1").toLowerCase();

	//如果首字符为下划线，干掉
	if (name.charAt(0) === '_')
		return name.slice(1);
	else
		return name;
}

// 金额格式化 dot为金额每隔三位用","或" "间隔
function fmtMoney(s, dot = ',', prefix = '¥') {
	if (s === '' || s === null || s === undefined) s = 0;
	
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	t = "";
	for (i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? dot : "");
	}
	return prefix + t.split("").reverse().join("") + "." + r;
}

/**
 *简单数组转对象数组
 * @param {*} arr [1,2,3]
 * @param {*} key [x1,x2,x3]
 * @returns [{x1:1,x2:1,x3:1},{x1:2,x2:2,x3:2},{x1:3,x2:3,x3:3}]
 */
function arr2ObjectArr(arr, key1, key2, key3) {
	let ret = [];
	for (let k = 0; k < arr.length; k++) {
		let obj = {};
		if (key1) obj[key1] = arr[k];
		if (key2) obj[key2] = arr[k];
		if (key3) obj[key3] = arr[k];
		ret.push(obj);
	}
	return ret;
}

/**
 * property
 * @param {*} property 排序属性
 * @returns 排序好的数组 
 * 用法 arr.sort(compare('age'))
 */
function objArrSortAsc(property) {
	return function (a, b) {
		var value1 = a[property];
		var value2 = b[property];
		if (value1 < value2)
			return -1;
		else if (value1 > value2)
			return 1;
		else return 0;
	}
}

/**
 * property
 * @param {*} property 排序属性
 * @returns 排序好的数组 
 * 用法 arr.sort(compare('age'))
 */
function objArrSortDesc(property) {
	return function (a, b) {
		var value1 = a[property];
		var value2 = b[property];
		if (value1 < value2)
			return 1;
		else if (value1 > value2)
			return -1;
		else return 0;
	}
}

/**
 * 数组有则减少，无则增加
 * @param {*} arr 
 * @param {*} data 
 * @param {*} sort 排序方式 asc/desc
 */
function arrAddDel(arr, data, sort = 'asc') {
	if (!arr) return arr;
	if (!Array.isArray(arr)) return arr;

	let idx = arr.indexOf(data);
	if (idx > -1)
		arr.splice(idx, 1);
	else
		arr.push(data)

	if (sort == 'asc')
		return arr.sort();
	else
		return arr.reverse();
} 

//数据深度拷贝
function deepClone(data) {
	if (data === null || typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean' || typeof data === 'undefined') {
		return data;
	}

	return JSON.parse(JSON.stringify(data));
}

function padLeft(str, len, charStr) {
	if (!str)
		str = '';
	else
		str = str + '';
	return new Array(len - str.length + 1).join(charStr || '') + str;
}

function padRight(str, len, charStr) {
	if (!str)
		str = '';
	else
		str = str + '';
	return str + new Array(len - str.length + 1).join(charStr || '');
}


// 选项表单处理
function getSelectOptions(str) {
	if (!str)
		return [];
	else if (str.includes('=')) {
		let arr = str.split(',');
		for (let k = 0; k < arr.length; k++) {
			let node = arr[k].split('=');
			arr[k] = {};

			let labelArr = node[1].split('|');
			arr[k].label = labelArr[0];
			if (labelArr.length > 1) { //扩展属性
				arr[k].ext = labelArr[1];
			}
			arr[k].val = node[0];
		}
		return arr;
	} else {
		return str.split(',');
	}
}

// 数组元素交换位置 index1和index2分别是两个数组的索引值
function arraySwap(arr, index1, index2) {
	arr[index1] = arr.splice(index2, 1, arr[index1])[0];
	return arr;
}

// 数组置顶
function arrayTop(arr, idx) {
	let node = arr.splice(idx, 1)[0];
	arr.unshift(node);
	return arr;
}

// 数组置底
function arrayBottom(arr, idx) {
	let node = arr.splice(idx, 1)[0];
	arr.push(node);
	return arr;
}

/**
 * 把某个值/对象按key插到某个对象数组
 * @param {*} arr  目标数组
 * @param {*} key  键
 * @param {*} val  判断值
 * @param {*} obj  插入对象{}
 */
function insertObjArrByKey(arr, key, val, obj) {
	if (!arr) return arr;

	for (let k = 0; k < arr.length; k++) {
		if (arr[k][key] == val) {
			// 发现存在
			arr[k].list.push(obj);
			return arr;
		}
	}

	// 不存在
	let newObj = {
		[key]: val,
		list: [obj]
	}
	arr.push(newObj);
	return arr;
}

/**
 * 从对象数组中， 根据某个键值 获取满足的对象
 * @param {*} arr 
 * @param {*} key 
 * @param {*} val 
 */
function getValFromArr(arr, key = 'val', val = '') {
	if (!Array.isArray(arr)) return null;
	for (let k = 0; k < arr.length; k++) {
		if (arr[k][key] == val)
			return arr[k];
	}

	return null;
}


module.exports = {
	arrayTop,
	arraySwap,
	arrayBottom,

	fmtTag,

	getValFromArr,
	getArrByKey,
	getArrByKeyMulti, //提取对象数组的多个属性数组
	spArr, //拆分一维数组为二维
	getDataByKey,
	str2Arr,
	arr2ObjectArr,
	insertObjArrByKey,
	arrAddDel,
	objArrSortAsc,
	objArrSortDesc,

	arrAddDel,
	isNumber,

	padLeft,
	padRight,

	genRandomString, // 随机字符串
	genRandomAlpha,
	genRandomNum, // 随机数字 
	fmtText, // 文本内容格式化处理
	fmtMoney, //金额格式化

	toHump,
	toLine,

	getSelectOptions, //选项表单处理

	deepClone

}