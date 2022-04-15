 /**
  * Notes: 通用类库
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
  * Date: 2020-11-14 07:48:00 
  */

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

 /**
  * 判断对象是否为空
  * @param {*} obj 
  */
 function isObjectNull(obj) {
 	return (Object.keys(obj).length == 0);
 }


 function sleep(time) {
 	return new Promise((resolve) => setTimeout(resolve, time));
 };


 function formatNumber(n) {
 	n = n.toString()
 	return n[1] ? n : '0' + n
 }

 /**
  * 从picker options中 获取索引值
  * @param {*} options 
  * [{
 		value: 0,
 		label: '猎头'
 	}]
  * @param {*} val 
  */
 function getOptionsIdx(options, val) {
 	for (let i = 0; i < options.length; i++) {
 		if (options[i].value === val)
 			return i;
 	}
 	return 0;
 }
  
 

 module.exports = {
 	isDefined,
 	isObjectNull,  
 	sleep,
     

 	getOptionsIdx,    
 
 }