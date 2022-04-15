/**
 * Notes: 定时任务
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-10-20 04:00:00 
 */


const timeUtil = require('../utils/time_util.js');
const LogUtil = require('../utils/log_util.js');

class AppJob {

	constructor() {
		/* 当前需要执行的任务(name)
		{
			name:'名称',
			mode:'模式 circle/时间点 point',
			time:'时间点',
		}*/
		this.task = [];
		this.logger = new LogUtil();
	}

	// 任务执行
	execute() {

		let start = timeUtil.time();

		this.logger.info('');
		this.logger.info('-----------------------------------');
		this.logger.info('[JOB] Begin....');

		this.logger.info('[JOB] SET JOB begin...');
		this.setJob();
		this.logger.info('[JOB] SET JOB END.');

		this.logger.info('[JOB] DO JOB Begin...');
		this.doJob();
		this.logger.info('[JOB] DO JOB END.');

		let end = timeUtil.time();
		let duration = (end - start) / 1000;
		this.logger.info('[JOB] END, duration=' + duration + 's');

		return this.logger.getLogOut();
	}

	// 任务执行
	doJob() {
		let task = this.task;
		this.logger.info('[JOB] TASK LIST ', task);
		for (let k in task) {
			let taskTime = task[k].time;
			if (this.getNowMinute() != taskTime) continue;

			this.logger.info('');

			let taskName = task[k].name;
			let taskDesc = task[k].desc;

			let start = timeUtil.time();
			this.logger.info('>>>>[' + taskName + ' (' + taskDesc + ', ' + taskTime + ')]Now begin job...')
			this[taskName]();
			let end = timeUtil.time();
			let duration = (end - start) / 1000;
			this.logger.info('<<<<[' + taskName + ' (' + taskDesc + ', ' + taskTime + ')]END, duration=' + duration + 's.');

			this.logger.info('');
		}
	}

	// 任务设置
	setJob() {
		this.logger.error('No any jobs TO DO');
	}

	//  构造任务列表
	makeJobList(subTask) {
		this.task.push(subTask);

	}

	// 马上执行
	every(name, desc = '无描述') {

		let time = this.getNowMinute();
		let subTask = {
			name,
			desc,
			mode: 'every',
			time
		}
		this.makeJobList(subTask);
	}

	// 按天循环执行 格式 hh:mm （某天内的某时间点)
	daily(name, desc = '无描述', hour = '00:00') {
		if (hour.length == 4) hour = '0' + hour;

		let time = this.getNowDay() + ' ' + hour;
		let subTask = {
			name,
			desc,
			mode: 'daily',
			time
		}
		this.makeJobList(subTask);
	}

	// 按小时执行格式 mm （某小时内的某分钟)
	hourly(name, desc = '无描述', minute = '00') {
		if (minute.length == 1) minute = '0' + minute;

		let time = this.getNowHour() + ':' + minute;
		let subTask = {
			name,
			desc,
			mode: 'hourly',
			time
		}
		this.makeJobList(subTask);
	}

	// 按分钟执行
	minutely(name, desc = '无描述') {

		let time = this.getNowMinute();
		let subTask = {
			name,
			desc,
			mode: 'minutely',
			time
		}
		this.makeJobList(subTask);
	}

	// 当前天
	getNowDay() {
		return timeUtil.time('Y-M-D');
	}

	// 当前小时
	getNowHour() {
		return timeUtil.time('Y-M-D h');
	}

	// 当前分钟
	getNowMinute() {
		return timeUtil.time('Y-M-D h:m');
	}


}

module.exports = AppJob;