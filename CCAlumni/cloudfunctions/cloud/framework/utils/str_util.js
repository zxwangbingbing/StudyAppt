 /**
  * Notes: 字符相关操作函数
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
  * Date: 2020-09-05 04:00:00
  * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
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
  * 把字符串格式化为数组
  * @param {*} str 
  * @param {*} sp 
  */
 function str2Arr(str, sp) {
 	if (str && Array.isArray(str)) return str;

 	if (sp == undefined) sp = ',';

 	str = str.replace(/，/g, ",");
 	let arr = str.split(',');
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
  * 提取对象数组的某个属性数组
  * @param {*} arr 
  * @param {*} key 
  */
 function getArrByKey(arr, key) {
 	if (!Array.isArray(arr)) return;
 	return arr.map((item) => {
 		return item[key]
 	});
 }

 /**
  * 文本内容格式化处理
  * @param {*} content 
  * @param {*} len 截取长度 -1不截取
  */
 function fmtText(content, len = -1) {
 	let str = content.replace(/[\r\n]/g, ""); //去掉回车换行
 	if (len > 0) {
 		str = str.substr(0, len);
 	}
 	return str.trim();
 }

 module.exports = {
 	str2Arr,
 	isNumber,
 	getArrByKey,
 	genRandomString, // 随机字符串
 	genRandomNum, // 随机数字 
 	fmtText, // 文本内容格式化处理
 }