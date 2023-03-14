/**
 * Notes: 数据持久化与操作模块
 * Ver : CCMiniCloud Framework 2.11.1 ALL RIGHTS RESERVED BY ccLinux0730 (wechat)
 * Date: 2020-09-04 04:00:00 
 */

const dbUtil = require('./db_util.js');
const util = require('../utils/util.js');
const timeUtil = require('../utils/time_util.js');
const dataUtil = require('../utils/data_util.js');
const AppError = require('../core/app_error.js');
const cloudBase = require('../cloud/cloud_base.js');

class Model {

	static async getOne(where, fields = '*', orderBy = {}) {
		return await dbUtil.getOne(this.CL, where, fields, orderBy);
	}

	static async edit(where, data) {

		if (this.UPDATE_TIME) {
			let editField = this.FIELD_PREFIX + 'EDIT_TIME';
			if (!util.isDefined(data[editField])) data[editField] = timeUtil.time();
		}

		if (this.UPDATE_IP) {
			let cloud = cloudBase.getCloud();
			let ip = cloud.getWXContext().CLIENTIP;


			let editField = this.FIELD_PREFIX + 'EDIT_IP';
			if (!util.isDefined(data[editField])) data[editField] = ip;
		}

		data = this.clearEditData(data);

		return await dbUtil.edit(this.CL, where, data);
	}

	static async count(where) {
		return await dbUtil.count(this.CL, where);
	}

	static async insert(data) {
		// 自动ID
		if (this.ADD_ID) {
			let idField = this.FIELD_PREFIX + 'ID';
			if (!util.isDefined(data[idField])) data[idField] = dataUtil.makeID();
		}

		// 更新时间
		if (this.UPDATE_TIME) {
			let timestamp = timeUtil.time();
			let addField = this.FIELD_PREFIX + 'ADD_TIME';
			if (!util.isDefined(data[addField])) data[addField] = timestamp;

			let editField = this.FIELD_PREFIX + 'EDIT_TIME';
			if (!util.isDefined(data[editField])) data[editField] = timestamp;
		}

		// 更新IP
		if (this.UPDATE_IP) {
			let cloud = cloudBase.getCloud();
			let ip = cloud.getWXContext().CLIENTIP;

			let addField = this.FIELD_PREFIX + 'ADD_IP';
			if (!util.isDefined(data[addField])) data[addField] = ip;

			let editField = this.FIELD_PREFIX + 'EDIT_IP';
			if (!util.isDefined(data[editField])) data[editField] = ip;
		}

		// 数据清洗
		data = this.clearCreateData(data);

		return await dbUtil.insert(this.CL, data);
	}

	static async insertOrUpdate(where, data) {
		let model = await dbUtil.getOne(this.CL, where, '_id');
		if (model) {
			await this.edit(model._id, data);
			return model._id;
		} else {
			return await this.insert(Object.assign(data, where));
		}
	}

	static async insertBatch(data = [], size = 1000) {
		if (this.ADD_ID) {
			let idField = this.FIELD_PREFIX + 'ID';
			for (let k = 0; k < data.length; k++) {
				if (!util.isDefined(data[k][idField])) data[k][idField] = dataUtil.makeID();
			}
		}

		if (this.UPDATE_TIME) {
			let timestamp = timeUtil.time();
			let addField = this.FIELD_PREFIX + 'ADD_TIME';
			let editField = this.FIELD_PREFIX + 'EDIT_TIME';

			for (let k = 0; k < data.length; k++) {
				if (!util.isDefined(data[k][addField])) data[k][addField] = timestamp;
				if (!util.isDefined(data[k][editField])) data[k][editField] = timestamp;
			}

		}

		if (this.UPDATE_IP) {
			let cloud = cloudBase.getCloud();
			let ip = cloud.getWXContext().CLIENTIP;

			let addField = this.FIELD_PREFIX + 'ADD_IP';
			let editField = this.FIELD_PREFIX + 'EDIT_IP';

			for (let k = 0; k < data.length; k++) {
				if (!util.isDefined(data[k][addField])) data[k][addField] = ip;
				if (!util.isDefined(data[k][editField])) data[k][editField] = ip;
			}

		}

		for (let k = 0; k < data.length; k++) {
			data[k] = this.clearCreateData(data[k]);
		}

		return await dbUtil.insertBatch(this.CL, data, size);
	}

	static async del(where) {
		return await dbUtil.del(this.CL, where);
	}

	static async inc(where, field, val = 1) {
		return await dbUtil.inc(this.CL, where, field, val);
	}

	static async mul(where, field, val = 1) {
		return await dbUtil.mul(this.CL, where, field, val);
	}

	static async groupSum(where, groupField, field) {
		return await dbUtil.groupSum(this.CL, where, groupField, field);
	}

	static async groupCount(where, groupField) {
		return await dbUtil.groupCount(this.CL, where, groupField);
	}

	static async sum(where, field) {
		return await dbUtil.sum(this.CL, where, field);
	}

	static async distinct(where, field) {
		return await dbUtil.distinct(this.CL, where, field);
	}

	static async distinctCnt(where, field) {
		return await dbUtil.distinctCnt(this.CL, where, field);
	}

	static async max(where, field) {
		return await dbUtil.max(this.CL, where, field);
	}

	static async min(where, field) {
		return await dbUtil.min(this.CL, where, field);
	}

	static async clear() {
		return await dbUtil.clear(this.CL);
	}

	static async rand(where = {}, fields = '*', size = 1) {
		return await dbUtil.rand(this.CL, where, fields, size);
	}

	static async getAll(where, fields, orderBy, size = 100) {
		return await dbUtil.getAll(this.CL, where, fields, orderBy, size);
	}

	static async getAllBig(where, fields, orderBy, size = 1000) {
		return await dbUtil.getAllBig(this.CL, where, fields, orderBy, size);
	}

	static async getAllByArray(arrField, where, fields, orderBy, size = 100) {
		return await dbUtil.getAllByArray(this.CL, arrField, where, fields, orderBy, size);
	}

	static async getList(where, fields, orderBy, page, size, isTotal, oldTotal) {
		return await dbUtil.getList(this.CL, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	static async getListJoin(joinParams, where, fields, orderBy, page = 1, size, isTotal = true, oldTotal = 0, is2Many = false) {
		return await dbUtil.getListJoin(this.CL, joinParams, where, fields, orderBy, page, size, isTotal, oldTotal, is2Many);
	}

	static async getListJoinCount(joinParams, where) {
		return await dbUtil.getListJoinCount(this.CL, joinParams, where);
	}

	static async getListByArray(arrField, where, fields, orderBy, page = 1, size, isTotal = true, oldTotal = 0) {
		return await dbUtil.getListByArray(this.CL, arrField, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	static converDBStructure(stru) {
		let newStru = {};
		for (let key in stru) {
			newStru[key] = {};

			let arr = stru[key].split('|');
			for (let k = 0; k < arr.length; k++) {

				// 类型
				let val = arr[k].toLowerCase().trim();
				let orginal = arr[k];

				let type = 'string';
				if (val === 'float' || val === 'int' || val === 'string' || val === 'array' || val === 'object' || val === 'bool') {
					type = val;
					newStru[key]['type'] = type;
					continue;
				}

				// 是否必填
				if (val === 'true' || val === 'false') {
					let required = (val === 'true') ? true : false;
					newStru[key]['required'] = required;
					continue;
				}

				// 默认值
				if (val.startsWith('default=') && util.isDefined(newStru[key]['type'])) {
					let defVal = orginal.replace('default=', '');
					switch (newStru[key]['type']) {
						case 'int':
						case 'float':
							defVal = Number(defVal);
							break;
						case 'bool':
							defVal = defVal.toLowerCase();
							defVal = defVal == 'true' ? true : false;
							break;
						case 'object':
							defVal = defVal.replace('{', '');
							defVal = defVal.replace('}', '').trim();
							if (!defVal)
								defVal = {};
							else {
								let arr = defVal.split(',');
								defVal = {};
								for (let m = 0; m < arr.length; m++) {
									if (arr[m]) defVal[arr[m]] = '';
								}
							}

							break;
						case 'array':
							defVal = defVal.replace('[', '');
							defVal = defVal.replace(']', '').trim();
							if (!defVal)
								defVal = [];
							else
								defVal = defVal.split(',');
							break;
						default:
							defVal = String(defVal);
					}
					newStru[key]['defVal'] = defVal;
					continue;
				}

				// 注释
				if (val.startsWith('comment=')) {
					let comment = orginal.replace('comment=', '');
					newStru[key]['comment'] = comment;
					continue;
				}

				// 长度
				if (val.startsWith('length=')) {
					let length = orginal.replace('length=', '');
					length = Number(length);
					newStru[key]['length'] = length;
					continue;
				}

			}

			// 如果非必填字段没有默认值，则主动赋予一个
			if (!newStru[key]['required'] && !util.isDefined(newStru[key]['defVal'])) {
				let defVal = '';
				switch (newStru[key]['type']) {
					case 'bool':
						defVal = false;
						break;
					case 'int':
					case 'float':
						defVal = Number(0);
						break;
					case 'array':
						defVal = [];
						break;
					case 'object':
						defVal = {};
						break;
					default:
						defVal = String('');
				}
				newStru[key]['defVal'] = defVal;
			}

			// 如果没有长度
			if (!util.isDefined(newStru[key]['length'])) {
				let length = 20;
				switch (newStru[key]['type']) {
					case 'int':
					case 'float':
						length = 30;
						break;
					case 'array':
					case 'object':
						length = 1500;
						break;
					default:
						length = 300;
				}
				newStru[key]['length'] = length;
			}
		}
		return newStru;
	}

	static clearDirtyData(data) {
		for (let key in data) {
			if (!this.DB_STRUCTURE.hasOwnProperty(key) && !key.includes('.')) {
				console.error('脏数据:' + key);
				throw new AppError('脏数据');
			}
		}
	}

	static converDataType(data, dbStructure) {
		for (let key in data) {
			if (dbStructure.hasOwnProperty(key)) {
				let type = dbStructure[key].type.toLowerCase();
				// 字段类型转换
				switch (type) {
					case 'string':
						data[key] = String(data[key]);
						break;
					case 'bool':
						//data[key] = data[key];
						break;
					case 'float':
					case 'int':
						data[key] = Number(data[key]);
						break;
					case 'array':
						if (data[key].constructor != Array)
							data[key] = [];
						break;
					case 'object':
						if (data[key] === undefined || data[key] === null) {
							data[key] = {};
						}
						else if (data[key].constructor != Object)
							data[key] = {};

						//data[key] = dbUtil.getCmd().set(data[key]); // 指定字段等于一个对象 TODO
						break;
					default:
						console.error('字段类型错误：' + key + dbStructure[key].type);
						throw new AppError("字段类型错误");
				}
			}
		}

		return data;
	}


	static clearCreateData(data) {

		let dbStructure = Model.converDBStructure(this.DB_STRUCTURE);

		for (let key in dbStructure) {

			// 数据类型
			if (!util.isDefined(dbStructure[key].type)) {
				console.log('[数据填写错误1]字段类型未定义：' + key);
				throw new AppError('数据填写错误1');
			}

			// 是否定义必填 
			if (!util.isDefined(dbStructure[key].required)) {
				console.log('[数据填写错误2]required未定义：' + key);
				throw new AppError('数据填写错误2');
			}

			//  键值未赋值情况
			if (!data.hasOwnProperty(key)) {
				// 必填
				if (dbStructure[key].required) {
					if (util.isDefined(dbStructure[key].defVal))
						// 必填且有缺省值
						data[key] = dbStructure[key].defVal;
					else {
						// 必填且无缺省值 
						console.log('[数据填写错误3]字段未填写：' + key);
						throw new AppError('数据填写错误3 ' + key);
					}
				} else {
					// 非必填字段必须有缺省值
					if (!util.isDefined(dbStructure[key].defVal)) {
						console.log('[数据填写错误4]非必填字段必须有缺省值：' + key);
						throw new AppError('数据填写错误4');
					}
					data[key] = dbStructure[key].defVal;
				}
			}
		}

		// 去掉脏数据
		this.clearDirtyData(data, dbStructure);

		data = this.converDataType(data, dbStructure);

		return data;
	}

	static clearEditData(data) {
		let dbStructure = Model.converDBStructure(this.DB_STRUCTURE);

		// 去掉脏数据
		this.clearDirtyData(data, dbStructure);

		data = this.converDataType(data, dbStructure);

		return data;
	}

	static getDesc(enumName, val) {
		let baseEnum = this[enumName];
		let descEnum = this[enumName + '_DESC']
		let enumKey = '';

		// 先找出KEY
		for (let key in baseEnum) {
			if (baseEnum[key] === val) {
				enumKey = key;
				break;
			}
		}
		if (enumKey == '') return 'unknown';

		// 再从Desc里找出描述
		return descEnum[enumKey];
	}

}

// 集合名 collection
Model.CL = 'no-collection';

// 集合结构
Model.DB_STRUCTURE = 'no-dbStructure';

// 字段前缀
Model.FIELD_PREFIX = 'NO_';

// 开关自带更新ADD_TIME,EDIT_TIME,DEL_TIME的操作 
Model.UPDATE_TIME = true;

// 开关自带更新ADD_IP,EDIT_IP,DEL_IP的操作 
Model.UPDATE_IP = true;

// 开关添加ID
Model.ADD_ID = true;

// 默认排序
Model.ORDER_BY = {
	_id: 'desc'
}

module.exports = Model;