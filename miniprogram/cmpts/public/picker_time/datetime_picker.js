const timeHelper = require('../../../helper/time_helper.js');

function withData(param, unit = '') {
	if (unit) return param;
	return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start, end, unit = '', step = 1) {
	start = start || 0;
	end = end || 1;
	start = parseInt(start);
	end = parseInt(end);

	let array = [];
	let i = 0;
	for (i = start; i <= end;) {
		array.push(withData(i, unit) + unit);
		i += step;
	}

	if (step > 1 && i != 59) {
		array.push(withData(59, unit) + unit);
	}

	return array;
}

function getMonthDay(year, month, unit = '') {
	let flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0),
		array = null;
	month = withData(parseInt(month));
	switch (month) {
		case '01':
		case '03':
		case '05':
		case '07':
		case '08':
		case '10':
		case '12':
			array = getLoopArray(1, 31, unit);
			break;
		case '04':
		case '06':
		case '09':
		case '11':
			array = getLoopArray(1, 30, unit);
			break;
		case '02':
			array = flag ? getLoopArray(1, 29, unit) : getLoopArray(1, 28, unit);
			break;
		default:
			array = '月份格式不正确，请重新输入！'
	}
	return array;
}

function getNewDateArry() {
	// 当前时间的处理
	let newDate = new Date();
	let year = withData(newDate.getFullYear()),
		mont = withData(newDate.getMonth() + 1),
		date = withData(newDate.getDate()),
		hour = withData(newDate.getHours()),
		minu = withData(newDate.getMinutes()),
		seco = withData(newDate.getSeconds());

	return [year, mont, date, hour, minu, seco];
}

function dateTimePicker(startYear, endYear, date, minuStep = 1) {
	// 返回默认显示的数组和联动数组的声明
	let dateTimeIndex = [],
		dateTimeArray = [
			[],
			[],
			[],
			[],
			[],
			[]
		];
	let dateTimeArrayPure = [
		[],
		[],
		[],
		[],
		[],
		[]
	];

	let start = startYear || 1978;
	let end = endYear || 2100;

	if (date && date.length == 4) date += '-01-01 00:00:00';
	if (date && date.length == 7) date += '-01 00:00:00';
	if (date && date.length == 10) date += ' 00:00:00';
	if (date && date.length == 13) date += ':00:00';
	if (date && date.length == 16) date += ':00';

	// 默认开始显示数据
	let defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();

	// 处理联动列表数据
	/*年月日 时分秒*/
	dateTimeArray[0] = getLoopArray(start, end, '年');
	dateTimeArray[1] = getLoopArray(1, 12, '月');
	dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1], '日');
	dateTimeArray[3] = getLoopArray(0, 23, '点');
	dateTimeArray[4] = getLoopArray(0, 59, '分', minuStep);
	dateTimeArray[5] = getLoopArray(0, 59, '秒');

	dateTimeArrayPure[0] = getLoopArray(start, end);
	dateTimeArrayPure[1] = getLoopArray(1, 12);
	dateTimeArrayPure[2] = getMonthDay(defaultDate[0], defaultDate[1]);
	dateTimeArrayPure[3] = getLoopArray(0, 23);
	dateTimeArrayPure[4] = getLoopArray(0, 59, '', minuStep);
	dateTimeArrayPure[5] = getLoopArray(0, 59);

	dateTimeArrayPure.forEach((current, index) => {
		let idx = current.indexOf(defaultDate[index]);
		if (idx < 0) idx = 0;
		dateTimeIndex.push(idx);
	});

	return {
		dateTimeArray,
		dateTimeIndex
	}
}
module.exports = {
	dateTimePicker,
	getMonthDay
}