/**
 * Notes: 时间相关函数
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const util = require('./util.js');


/**
 * 毫秒时间戳转时间格式
 * @param {*} unixtime  毫秒
 * @param {*} format  Y-M-D h:m:s
 * @param {*} diff  时区差异
 */
function timestamp2Time(unixtime, format = 'Y-M-D h:m:s', diff = 0) {
	let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
	let returnArr = [];
	let date = new Date(unixtime + diff);
	returnArr.push(date.getFullYear());
	returnArr.push(formatNumber(date.getMonth() + 1));
	returnArr.push(formatNumber(date.getDate()));
	returnArr.push(formatNumber(date.getHours()));
	returnArr.push(formatNumber(date.getMinutes()));
	returnArr.push(formatNumber(date.getSeconds()));
	for (let i in returnArr) {
		format = format.replace(formateArr[i], returnArr[i]);
	}
	return format;
}


function timestame2Ago(dateTimeStamp, fmt = 'Y-M-D', diff = 0) { //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
	let minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
	let hour = minute * 60;
	let day = hour * 24;
	let week = day * 7;
	let month = day * 30;
	let now = new Date().getTime(); //获取当前时间毫秒

	let diffValue = now - dateTimeStamp; //时间差

	if (diffValue < 0) {
		return;
	}
	let minC = diffValue / minute; //计算时间差的分，时，天，周，月
	let hourC = diffValue / hour;
	let dayC = diffValue / day;

	let result = '';
	
	let weekC = diffValue / week;
	let monthC = diffValue / month;
	if (monthC >= 1 && monthC <= 3) {
		result = ' ' + parseInt(monthC) + '月前'
	} else if (weekC >= 1 && weekC <= 3) {
		result = ' ' + parseInt(weekC) + '周前'
	} else if (dayC >= 1 && dayC <= 6) {
		result = ' ' + parseInt(dayC) + '天前'
	} else if (hourC >= 1 && hourC <= 23) {
		result = ' ' + parseInt(hourC) + '小时前'
	} else if (minC >= 1 && minC <= 59) {
		result = ' ' + parseInt(minC) + '分钟前'
	} else if (diffValue >= 0 && diffValue <= minute) {
		result = '刚刚'
	} else {
		result = timestamp2Time(dateTimeStamp, fmt, diff);

	}
	return result;
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}


/**
 * 时间转时间戳 
 * @param {*} date  Y-M-D h:m:s
 */
function time2Timestamp(date) {
	if (date.length < 10) {
		let arr = date.split('-');
		if (arr[1].length == 1) arr[1] = '0' + arr[1];
		if (arr[2].length == 1) arr[2] = '0' + arr[2];
		date = arr[0] + '-' + arr[1] + '-' + arr[2];
	}
	if (date.length == 10) date = date + ' 00:00:00';
	let d = new Date(date.replace(/-/g, '/'));
	return d.getTime();
}

/**
 *  获取当前时间戳/时间Y-M-D h:m:s
 * @param {*} 时间格式 Y-M-D h:m:s
 * @param {int} 时间步长 (秒)
 */
function time(fmt, step = 0) {
	let t = 0;
	if (util.isDefined(fmt)) {
		let t = new Date().getTime() + step * 1000;
		return timestamp2Time(t, fmt);
	}
	return new Date().getTime() + t * 1000;
}


/**
 * 根据出生日期计算年龄周岁 传参格式为1996-06-08
 * @param {*} birth 
 */
function getAge(birth, isMonth = false) {
	var returnAge = '';
	var mouthAge = '';
	var arr = birth.split('-');
	var birthYear = arr[0];
	var birthMonth = arr[1];
	var birthDay = arr[2];
	var d = new Date();
	var nowYear = d.getFullYear();
	var nowMonth = d.getMonth() + 1;
	var nowDay = d.getDate();
	if (nowYear == birthYear) {
		// returnAge = 0; //同年 则为0岁
		var monthDiff = nowMonth - birthMonth; //月之差 
		if (monthDiff < 0) {} else {
			mouthAge = monthDiff + '个月';
		}
	} else {
		var ageDiff = nowYear - birthYear; //年之差
		if (ageDiff > 0) {
			if (nowMonth == birthMonth) {
				var dayDiff = nowDay - birthDay; //日之差 
				if (dayDiff < 0) {
					returnAge = ageDiff - 1 + '岁';
				} else {
					returnAge = ageDiff + '岁';
				}
			} else {
				var monthDiff = nowMonth - birthMonth; //月之差 
				if (monthDiff < 0) {
					returnAge = ageDiff - 1 + '岁';
				} else {
					mouthAge = monthDiff + '个月';
					returnAge = ageDiff + '岁';
				}
			}
		} else {
			returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
		}
	}
	if (isMonth)
		return returnAge + mouthAge; //返回周岁年龄+月份
	else
		return returnAge;
}

/**
 * 日期计算周几
 * @param {*} day  日期为输入日期，格式为 2013-03-10
 */
function week(day) {
	let arys1 = new Array();
	arys1 = day.split('-'); 
	let ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
	let week1 = String(ssdate.getDay()).replace("0", "日").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六") //就是你要的星期几
	return "周" + week1; //就是你要的星期几 
}

module.exports = {
	timestamp2Time,
	timestame2Ago,
	time2Timestamp,
	time,
	getAge,
	week //星期
}