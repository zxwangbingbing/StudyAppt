/**
 * Notes: 各种数据操作业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-03-01 07:48:00 
 */

const BaseService = require('./base_service.js');
const cloudBase = require('../../framework/cloud/cloud_base.js');
const cloudUtil = require('../../framework/cloud/cloud_util.js');
const ExportModel = require('../model/export_model.js');
const timeUtil = require('../../framework/utils/time_util');
const md5Lib = require('../../framework/lib/md5_lib.js');
const config = require('../../config/config.js');


class DataService extends BaseService {

	// 获得当前导出链接
	async getExportDataURL(key) {
		// 取出数据
		let whereExport = {
			EXPORT_KEY: key
		}

		let url = '';
		let time = '';
		let expData = await ExportModel.getOne(whereExport, 'EXPORT_CLOUD_ID,EXPORT_EDIT_TIME');
		if (!expData)
			url = '';
		else {
			url = expData.EXPORT_CLOUD_ID;
			url = await cloudUtil.getTempFileURLOne(url) + '?rd=' + this._timestamp;
			time = timeUtil.timestamp2Time(expData.EXPORT_EDIT_TIME);
		}

		return {
			url,
			time
		}
	}

	// 删除数据文件
	async deleteDataExcel(key) {
		console.log('[deleteExcel]  BEGIN... , key=' + key)

		// 取出数据
		let whereExport = {
			EXPORT_KEY: key
		}
		let expData = await ExportModel.getOne(whereExport);
		if (!expData) return;

		// 文件路径
		let xlsPath = expData.EXPORT_CLOUD_ID;

		console.log('[deleteExcel]  path = ' + xlsPath);

		const cloud = cloudBase.getCloud();
		await cloud.deleteFile({
			fileList: [xlsPath],
		}).then(async res => {
			console.log(res.fileList);
			if (res.fileList && res.fileList[0] && res.fileList[0].status == -503003) {
				console.log('[deleteUserExcel]  ERROR = ', res.fileList[0].status + ' >> ' + res.fileList[0].errMsg);
				this.AppError('文件不存在或者已经删除');
			}

			// 删除导出表 
			await ExportModel.del(whereExport);

			console.log('[deleteExcel]  OVER.');

		}).catch(error => {
			if (error.name != 'AppError') {
				console.log('[deleteExcel]  ERROR = ', error);
				this.AppError('操作失败，请重新删除');
			} else
				throw error;
		});


	}

	// 导出数据  
	async exportDataExcel(key, title, total, data, options = {}) {
		// 删除导出表
		let whereExport = {
			EXPORT_KEY: key
		}
		await ExportModel.del(whereExport);

		let fileName = key + '_' + md5Lib.md5(key + config.CLOUD_ID + this.getProjectId());
		let xlsPath = config.DATA_EXPORT_PATH + fileName + '.xlsx';

		// 操作excel用的类库
		const xlsx = require('node-xlsx');

		// 把数据保存到excel里
		let buffer = await xlsx.build([{
			name: title + timeUtil.timestamp2Time(this._timestamp, 'Y-M-D'),
			data,
			options
		}]);

		// 把excel文件保存到云存储里
		console.log('[ExportData]  Save to ' + xlsPath);
		const cloud = cloudBase.getCloud();
		let upload = await cloud.uploadFile({
			cloudPath: xlsPath,
			fileContent: buffer, //excel二进制文件
		});
		if (!upload || !upload.fileID) return;

		// 入导出表 
		let dataExport = {
			EXPORT_KEY: key,
			EXPORT_CLOUD_ID: upload.fileID
		}
		await ExportModel.insert(dataExport);

		console.log('[ExportData]  OVER.')

		return {
			total
		}
	}
}

module.exports = DataService;