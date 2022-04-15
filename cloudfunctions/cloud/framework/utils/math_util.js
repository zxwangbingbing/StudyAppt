 /**
  * Notes: 数学计算相关操作函数
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
  * Date: 2021-10-04 04:00:00 
  */


 /** 获取百分比, 保留2位小数 */
 function percent(num1, num2) {
 	return Math.round(num1 / num2 * 10000) / 100.00;
 }
 
 /** 数组对象排序 */
 function arrayObjecSortAsc(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

 /** 数组对象排序 */
 function arrayObjecSortDesc(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}

 module.exports = {
	 percent, // 百分比，保留2位小数 
	 arrayObjecSortAsc, // 数组对象排序
	 arrayObjecSortDesc, // 数组对象排序
 }