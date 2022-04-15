/**
 * Notes: 数据持久化与操作模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-09-04 04:00:00 
 */

const dbUtil = require('./db_util.js');
const util = require('../utils/util.js');
const timeUtil = require('../utils/time_util.js');
const AppError = require('../core/app_error.js');
const cloudBase = require('../cloud/cloud_base.js');

class Model {

	/**
	 * 构造当前ID
	 */
	static makeID() {
		let id = timeUtil.time('YMDhms') + ''; //秒

		//毫秒3位
		let miss = timeUtil.time() % 1000 + '';
		if (miss.length == 0)
			miss = '000';
		else if (miss.length == 1)
			miss = '00' + miss;
		else if (miss.length == 2)
			miss = '0' + miss;

		return id + miss;
	}

	/**
	 * 获取单个object
	 * @param {*} where 
	 * @param {*} fields 
	 * @param {*} orderBy 
	 * @returns object or null
	 */
	static async getOne(where, fields = '*', orderBy = {}) {
		return await dbUtil.getOne(this.CL, where, fields, orderBy);
	}

	/**
	 * 修改
	 * @param {*} where 
	 * @param {*} data 
	 */
	static async edit(where, data) {

		// 更新时间
		if (this.UPDATE_TIME) {
			let editField = this.FIELD_PREFIX + 'EDIT_TIME';
			if (!util.isDefined(data[editField])) data[editField] = timeUtil.time();
		}

		// 更新IP
		if (this.UPDATE_IP) {
			let cloud = cloudBase.getCloud();
			let ip = cloud.getWXContext().CLIENTIP;


			let editField = this.FIELD_PREFIX + 'EDIT_IP';
			if (!util.isDefined(data[editField])) data[editField] = ip;
		}

		// 数据清洗
		data = this.clearEditData(data);

		return await dbUtil.edit(this.CL, where, data);
	}

	/**
	 * 计算总数
	 * @param {*} where 
	 */
	static async count(where) {
		return await dbUtil.count(this.CL, where);
	}

	/**
	 * 插入数据
	 * @param {*} data 
	 */
	static async insert(data) {
		// 自动ID
		if (this.ADD_ID) {
			let idField = this.FIELD_PREFIX + 'ID';
			if (!util.isDefined(data[idField])) data[idField] = Model.makeID();
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

	/**
	 * 插入或者更新数据
	 * @param {*} data 
	 */
	static async insertOrUpdate(where, data) {
		let model = await dbUtil.getOne(this.CL, where, '_id');
		if (model) {
			await this.edit(model._id, data);
			return model._id;
		} else {
			return await this.insert(Object.assign(data, where));
		}
	}

	/**
	 * 批量插入数据
	 * @param {*} data 
	 */
	static async insertBatch(data = [], size = 1000) {
		// 自动ID
		if (this.ADD_ID) {
			let idField = this.FIELD_PREFIX + 'ID';
			for (let k in data)
				if (!util.isDefined(data[k][idField])) data[k][idField] = Model.makeID();
		}

		// 更新时间
		if (this.UPDATE_TIME) {
			let timestamp = timeUtil.time();
			let addField = this.FIELD_PREFIX + 'ADD_TIME';
			let editField = this.FIELD_PREFIX + 'EDIT_TIME';

			for (let k in data) {
				if (!util.isDefined(data[k][addField])) data[k][addField] = timestamp;
				if (!util.isDefined(data[k][editField])) data[k][editField] = timestamp;
			}

		}

		// 更新IP
		if (this.UPDATE_IP) {
			let cloud = cloudBase.getCloud();
			let ip = cloud.getWXContext().CLIENTIP;

			let addField = this.FIELD_PREFIX + 'ADD_IP';
			let editField = this.FIELD_PREFIX + 'EDIT_IP';

			for (let k in data) {
				if (!util.isDefined(data[k][addField])) data[k][addField] = ip;
				if (!util.isDefined(data[k][editField])) data[k][editField] = ip;
			}

		}
 
		// 数据清洗
		for (let k in data)
			data[k] = this.clearCreateData(data[k]);

		return await dbUtil.insertBatch(this.CL, data, size);
	}

	/**
	 * 删除记录
	 * @param {*} where 
	 */
	static async del(where) {
		return await dbUtil.del(this.CL, where);
	}

	/**
	 * 自增处理
	 * @param {*} where 
	 * @param {*} field 
	 * @param {*} val 
	 */
	static async inc(where, field, val = 1) {
		return await dbUtil.inc(this.CL, where, field, val);
	}

	/**
	 * 自乘处理
	 * @param {*} where 
	 * @param {*} field 
	 * @param {*} val 
	 */
	static async mul(where, field, val = 1) {
		return await dbUtil.mul(this.CL, where, field, val);
	}

	/**
	 * 分组求和
	 * @param {*} where 
	 * @param {*} groupField 
	 * @param {*} field 
	 * @param {*} val 
	 */
	static async groupSum(where, groupField, field) {
		return await dbUtil.groupSum(this.CL, where, groupField, field);
	}

	/**
	 * 分组求COUNT
	 * @param {*} where 
	 * @param {*} groupField  
	 * @param {*} val 
	 */
	static async groupCount(where, groupField) {
		return await dbUtil.groupCount(this.CL, where, groupField);
	}

	/**
	 * 求和
	 * @param {*} where 
	 * @param {*} field 
	 * @param {*} val 
	 */
	static async sum(where, field) {
		return await dbUtil.sum(this.CL, where, field);
	}

	/**
	 * 求不重复
	 * @param {*} where 
	 * @param {*} field 
	 * @param {*} val 
	 */
	static async distinct(where, field) {
		return await dbUtil.distinct(this.CL, where, field);
	}

	/**
	 * 求不重复
	 * @param {*} where 
	 * @param {*} field 
	 * @param {*} val 
	 */
	static async distinctCnt(where, field) {
		return await dbUtil.distinctCnt(this.CL, where, field);
	}

	/**
	 * 最大
	 * @param {*} where 
	 * @param {*} field 
	 * @param {*} val 
	 */
	static async max(where, field) {
		return await dbUtil.max(this.CL, where, field);
	}

	/**
	 * 最小
	 * @param {*} where 
	 * @param {*} field 
	 * @param {*} val 
	 */
	static async min(where, field) {
		return await dbUtil.min(this.CL, where, field);
	}

	/**
	 * 清空数据
	 */
	static async clear() {
		return await dbUtil.clear(this.CL);
	}
	
	/**
	 * 随机数据
	 * @param {*} where 
	 * @param {*} fields 
	 * @param {*} size 
	 */
	static async rand(where = {}, fields = '*', size = 1) {
		return await dbUtil.rand(this.CL, where, fields, size);
	}

	/**
	 * 所有记录
	 * @param {*} where 
	 * @param {*} fields 
	 * @param {*} orderBy 
	 * @param {*} size  
	 */
	static async getAll(where, fields, orderBy, size = 100) {
		return await dbUtil.getAll(this.CL, where, fields, orderBy, size);
	}


	/**
	 * 大数据情况下取得所有记录
	 * @param {*} where 
	 * @param {*} fields 
	 * @param {*} orderBy 
	 * @param {*} size  
	 */
	static async getAllBig(where, fields, orderBy, size = 1000) {
		return await dbUtil.getAllBig(this.CL, where, fields, orderBy, size);
	}

	/**
	 * 所有记录 数组字段拆分查询
	 * @param {*} where 
	 * @param {*} fields 
	 * @param {*} orderBy 
	 * @param {*} size  
	 */
	static async getAllByArray(arrField, where, fields, orderBy, size = 100) {
		return await dbUtil.getAllByArray(this.CL, arrField, where, fields, orderBy, size);
	}

	/**
	 * 分页记录
	 * @param {*} where 
	 * @param {*} fields 
	 * @param {*} orderBy 
	 * @param {*} page 
	 * @param {*} size 
	 * @param {*} isTotal 
	 * @param {*} oldTotal  // 上次分页的记录总数 
	 */
	static async getList(where, fields, orderBy, page, size, isTotal, oldTotal) {
		return await dbUtil.getList(this.CL, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	// 联表获取分页（2张表)
	static async getListJoin(joinParams, where, fields, orderBy, page = 1, size, isTotal = true, oldTotal = 0, is2Many = false) {
		return await dbUtil.getListJoin(this.CL, joinParams, where, fields, orderBy, page, size, isTotal, oldTotal, is2Many);
	}

	// 数组字段拆分查询
	static async getListByArray(arrField, where, fields, orderBy, page = 1, size, isTotal = true, oldTotal = 0) {
		return await dbUtil.getListByArray(this.CL, arrField, where, fields, orderBy, page, size, isTotal, oldTotal);
	}


	/**
	 * 数据库结构定义转换 支持float,int,string,array
	 * @param {*} stru 
	 */
	static converDBStructure(stru) {
		let newStru = {};
		for (let k in stru) {
			newStru[k] = {};

			let arr = stru[k].split('|');
			for (let key in arr) {

				// 类型
				let val = arr[key].toLowerCase().trim();
				let orginal = arr[key];

				let type = 'string';
				if (val === 'float' || val === 'int' || val === 'string' || val === 'array' || val === 'object' || val === 'bool') {
					type = val;
					newStru[k]['type'] = type;
					continue;
				}

				// 是否必填
				if (val === 'true' || val === 'false') {
					let required = (val === 'true') ? true : false;
					newStru[k]['required'] = required;
					continue;
				}

				// 默认值
				if (val.startsWith('default=') && util.isDefined(newStru[k]['type'])) {
					let defVal = orginal.replace('default=', '');
					switch (newStru[k]['type']) {
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
								for (let m in arr) {
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
					newStru[k]['defVal'] = defVal;
					continue;
				}

				// 注释
				if (val.startsWith('comment=')) {
					let comment = orginal.replace('comment=', '');
					newStru[k]['comment'] = comment;
					continue;
				}

				// 长度
				if (val.startsWith('length=')) {
					let length = orginal.replace('length=', '');
					length = Number(length);
					newStru[k]['length'] = length;
					continue;
				}

			}

			// 如果非必填字段没有默认值，则主动赋予一个
			if (!newStru[k]['required'] && !util.isDefined(newStru[k]['defVal'])) {
				let defVal = '';
				switch (newStru[k]['type']) {
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
				newStru[k]['defVal'] = defVal;
			}

			// 如果没有长度
			if (!util.isDefined(newStru[k]['length'])) {
				let length = 20;
				switch (newStru[k]['type']) {
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
				newStru[k]['length'] = length;
			}
		}
		return newStru;
	}

	/**
	 * 去掉脏数据:判断是否有未在数据库定义的字段, 复合型字段不校验(包含.点号)
	 * @param {*} data 
	 */
	static clearDirtyData(data) {
		for (let k in data) {
			if (!this.DB_STRUCTURE.hasOwnProperty(k) && !k.includes('.')) {
				console.error('脏数据:' + k);
				throw new AppError('脏数据');
			}
		}
	}

	/**
	 * 数据类型校正
	 * @param {*} data 
	 * @param {*} dbStructure 
	 */
	static converDataType(data, dbStructure) {
		for (let k in data) {
			if (dbStructure.hasOwnProperty(k)) {
				let type = dbStructure[k].type.toLowerCase();
				// 字段类型转换
				switch (type) {
					case 'string':
						data[k] = String(data[k]);
						break;
					case 'bool':
						//data[k] = data[k];
						break;
					case 'float':
					case 'int':
						data[k] = Number(data[k]);
						break;
					case 'array':
						if (data[k].constructor != Array)
							data[k] = [];
						break;
					case 'object':
						if (data[k].constructor != Object)
							data[k] = {};
						break;
					default:
						console.error('字段类型错误：' + k + dbStructure[k].type);
						throw new AppError("字段类型错误");
				}
			}
		}

		return data;
	}

	/**
	 * 数据创建清洗
	 * @param {*} data 
	 */
	static clearCreateData(data) {

		let dbStructure = Model.converDBStructure(this.DB_STRUCTURE);

		// 一维数组检查必填项，填写默认值
		for (let k in dbStructure) {

			// 数据类型
			if (!util.isDefined(dbStructure[k].type)) {
				console.log('[数据填写错误1]字段类型未定义：' + k);
				throw new AppError('数据填写错误1');
			}

			// 是否定义必填 
			if (!util.isDefined(dbStructure[k].required)) {
				console.log('[数据填写错误2]required未定义：' + k);
				throw new AppError('数据填写错误2');
			}

			//  键值未赋值情况
			if (!data.hasOwnProperty(k)) {
				// 必填
				if (dbStructure[k].required) {
					if (util.isDefined(dbStructure[k].defVal))
						// 必填且有缺省值
						data[k] = dbStructure[k].defVal;
					else {
						// 必填且无缺省值 
						console.log('[数据填写错误3]字段未填写：' + k);
						throw new AppError('数据填写错误3 ' + k);
					}
				} else {
					// 非必填字段必须有缺省值
					if (!util.isDefined(dbStructure[k].defVal)) {
						console.log('[数据填写错误4]非必填字段必须有缺省值：' + k);
						throw new AppError('数据填写错误4');
					}
					data[k] = dbStructure[k].defVal;
				}
			}
		}

		// 去掉脏数据
		this.clearDirtyData(data, dbStructure);

		// 数据类型校正
		data = this.converDataType(data, dbStructure);

		return data;
	}

	/**
	 * 数据编辑清洗
	 * @param {*} data 
	 */
	static clearEditData(data) {
		let dbStructure = Model.converDBStructure(this.DB_STRUCTURE);

		// 去掉脏数据
		this.clearDirtyData(data, dbStructure);

		// 数据类型校正
		data = this.converDataType(data, dbStructure);

		return data;
	}

	/**
	 * 获取枚举字段的描述
	 * @param {*} enumName 
	 * @param {*} val 
	 */
	static getDesc(enumName, val) {
		let baseEnum = this[enumName];
		let descEnum = this[enumName + '_DESC']
		let enumKey = '';

		// 先找出KEY
		for (let k in baseEnum) {
			if (baseEnum[k] === val) {
				enumKey = k;
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