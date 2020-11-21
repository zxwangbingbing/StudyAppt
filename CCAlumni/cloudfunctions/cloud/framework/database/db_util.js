/**
 * Notes: 数据库基本操作
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const util = require('../utils/util.js');
const strUtil = require('../utils/str_util.js');

const cloudBase = require('../cloud/cloud_base.js');
const MAX_RECORD_SIZE = 100; //数据库每次可取最大记录数
const DEFAULT_RECORD_SIZE = 20; //默认显示记录数

// 云函数入口文件
const cloud = cloudBase.getCloud();
const db = cloud.database();
const dbCmd = db.command; // 命令
const dbAggr = dbCmd.aggregate; // 聚合

/**
 * 添加数据
 * @param {*} collectionName 
 * @param {*} data 
 * @returns 返回PK
 */
async function insert(collectionName, data) {
	let query = await db.collection(collectionName).add({
		data
	});
	return query._id;
}

/**
 * 更新数据
 * @param {*} collectionName 
 * @param {*} where 为非对象 则作为PK处理
 * @param {*} data 
 * @returns 影响行数
 */
async function edit(collectionName, where, data) {

	let query = await db.collection(collectionName);

	// 查询条件
	if (util.isDefined(where)) {
		if (typeof (where) == 'string' || typeof (where) == 'number')
			query = await query.doc(where);
		else
			query = await query.where(fmtWhere(where));
	}

	query = await query.update({
		data
	});

	return query.stats.updated;
}

/**
 * 字段自增
 * @param {*} collectionName 
 * @param {*} where 为非对象 则作为PK处理
 * @param {*} field 
 * @param {*} val 
 * @returns 影响行数
 */
async function inc(collectionName, where, field, val = 1) {
	let query = await db.collection(collectionName);

	// 查询条件
	if (util.isDefined(where)) {
		if (typeof (where) == 'string' || typeof (where) == 'number')
			query = await query.doc(where);
		else
			query = await query.where(fmtWhere(where));
	}

	query = await query.update({
		data: {
			[field]: dbCmd.inc(val)
		}
	});

	return query.stats.updated;
}

/**
 * 删除数据
 * @param {*} collectionName 
 * @param {*} where 
 * @returns 删除函数
 */
async function del(collectionName, where) {
	let query = await db.collection(collectionName);

	// 查询条件
	if (util.isDefined(where)) {
		if (typeof (where) == 'string' || typeof (where) == 'number')
			query = await query.doc(where);
		else
			query = await query.where(fmtWhere(where));
	}

	query = await query.remove();
	return query.stats.removed;
}

/**
 * 获取总数
 * @param {*} collectionName 
 * @param {*} where 
 */
async function count(collectionName, where) {
	let query = await db.collection(collectionName);

	// 查询条件
	if (typeof (where) == 'string' || typeof (where) == 'number')
		query = await query.doc(where);
	else
		query = await query.where(fmtWhere(where));

	query = await query.count();
	return query.total;
}

/**
 * 联表获取分页（2张表)
 * @param {*} collectionName 
 * @param {*} joinParams 被连接表 参数设置
 * joinParams = {
			from: 't_user',
			localField: '_openid',
			foreignField: '_openid',
			as: 'USER_DETAIL', 
		}
 * @param {*} where 
 * @param {*} fields 
 * @param {*} orderBy 
 * @param {*} page 
 * @param {*} size 
 * @param {*} isTotal  是否计算总数
 * @param {*} oldTotal  上次总数
 * @param {*} is2Many  1对1，还是1对多，默认1:1 false
 */
async function getListJoin(collectionName, joinParams, where, fields, orderBy, page = 1, size = DEFAULT_RECORD_SIZE, isTotal = true, oldTotal = 0, is2Many = false) {
	page = Number(page);
	size = Number(size);

	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;

	data = {
		page: page,
		size: size
	}

	let offset = 0; //记录偏移量 防止新增数据列表重复 

	// 计算总页数
	if (isTotal) {
		// 联表
		let queryCnt = await db.collection(collectionName)
			.aggregate()
			.lookup(joinParams);

		// 查询条件
		if (util.isDefined(where))
			queryCnt = await queryCnt.match(fmtWhere(where));

		let total = await queryCnt.count('total').end();
		if (!total.list.length)
			total = 0;
		else
			total = total.list[0].total;

		data.total = total;
		data.count = Math.ceil(total / size);

		if (page > 1 && oldTotal > 0) {
			offset = data.total - oldTotal
			if (offset < 0) offset = 0;
		}
	}

	// 联表
	let query = await db.collection(collectionName)
		.aggregate()
		.lookup(joinParams);

	/*
	query = await query.replaceRoot({
	newRoot: $.mergeObjects([ $.arrayElemAt(['$USER_DETAIL', 0]), '$$ROOT' ])
	})*/

	// 查询条件
	if (util.isDefined(where))
		query = await query.match(fmtWhere(where));

	// 取出特定字段
	if (util.isDefined(fields) && fields != '*')
		query = await query.project(fmtFields(fields));

	// 排序   
	if (util.isDefined(orderBy)) {
		query = await query.sort(fmtJoinSort(orderBy));
	}

	// 分页
	query = await query.skip((page - 1) * size + offset).limit(size);


	// 取数据
	query = await query.end();
	data.list = query.list;

	// 1：N 数据处理为1:1
	if (!is2Many) {
		for (let k in data.list) {
			if (util.isDefined(data.list[k][joinParams.as])) {
				// 是否为数组,是数组转为一维
				if (Array.isArray(data.list[k][joinParams.as]) &&
					data.list[k][joinParams.as].length > 0)
					data.list[k][joinParams.as] = data.list[k][joinParams.as][0];
				else {
					data.list[k][joinParams.as] = {};
				}
			}
		}
	}

	return data;
}

/**
 * 获取分页数据
 * @param {*} collectionName 
 * @param {*} where 
 * @param {*} fields 
 * @param {*} orderBy 
 * @param {*} page 
 * @param {*} size 
 * @param {*} isTotal 
 * @returns {page, size, list, total, oldTotal}
 */
async function getList(collectionName, where, fields = '*', orderBy = {}, page = 1, size = DEFAULT_RECORD_SIZE, isTotal = true, oldTotal = 0) {
	page = Number(page);
	size = Number(size);
	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;

	let data = {
		page: page,
		size: size
	}

	let offset = 0; //记录偏移量 防止新增数据列表重复 
	// 计算总页数
	if (isTotal) {
		let total = await count(collectionName, where);
		data.total = total;
		data.count = Math.ceil(total / size);

		if (page > 1 && oldTotal > 0) {
			offset = data.total - oldTotal
			if (offset < 0) offset = 0;

		}
	}

	// 分页 
	let query = await db.collection(collectionName)
		.skip((page - 1) * size + offset)
		.limit(size);

	// 查询条件  
	if (util.isDefined(where) && where)
		query = await query.where(fmtWhere(where));

	// 取出特定字段
	if (util.isDefined(fields) && fields != '*')
		query = await query.field(fmtFields(fields));

	// 排序  
	if (util.isDefined(orderBy)) {
		query = await fmtOrderBy(query, orderBy);
	}

	// 取数据
	query = await query.get();

	data.list = query.data;

	return data;
}

/**
 * 获取所有数据
 * @param {*} collectionName 
 * @param {*} where 
 * @param {*} fields 
 * @param {*} orderBy 
 * @param {*} size 
 * @returns list
 */
async function getAll(collectionName, where, fields = '*', orderBy, size = MAX_RECORD_SIZE) {
	size = Number(size);
	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;

	let query = await db.collection(collectionName).limit(size);

	// 查询条件
	if (where)
		query = await query.where(fmtWhere(where));

	// 取出特定字段
	if (fields && fields != '*')
		query = await query.field(fmtFields(fields));

	// 排序 
	if (orderBy) {
		query = await fmtOrderBy(query, orderBy);
	}

	// 取数据
	query = await query.get(); 
	return query.data;
}

/**
 * 获取单个数据
 * @param {*} collectionName 
 * @param {*} where 
 * @param {*} fields 
 * @param {*} orderBy 
 * @returns null or object
 */
async function getOne(collectionName, where, fields = '*', orderBy = {}) {
	// 根据ID查询还是根据条件查询
	if (typeof (where) == 'string' || typeof (where) == 'number') {
		where = {
			_id: where
		};
	}

	// 查询条件 
	let query = await db.collection(collectionName)
		.where(fmtWhere(where))
		.limit(1);

	// 取出特定字段 
	if (fields != '*')
		query = await query.field(fmtFields(fields));

	// 排序
	if (orderBy)
		query = await fmtOrderBy(query, orderBy);

	// 取数据
	query = await query.get();

	if (query && query.data.length > 0) {
		return query.data[0];
	} else
		return null;
}

/**
 * OrderBy处理 （单表)
 * @param {*} query 数据库句柄
 * @param {*} orderBy 排序
 *  {  
		INFO_ADD_TIME: 'desc',
      	INFO_VIEW_CNT:	'asc'
  }
 */
async function fmtOrderBy(query, orderBy) {
	for (let k in orderBy) {
		query = await query.orderBy(k, orderBy[k].toLowerCase())
	}
	return query;
}

/**
 * sort 处理（连接表) 
 * @param {*} sort   排序
 *  { 
      	INFO_ADD_TIME: -1,// 1=升序 -1=降序 只能1个？
	  	INFO_VIEW_CNT:	1,
		INFO_ADD_TIME: 'desc',
      	INFO_VIEW_CNT:	'asc'
  }
 */
function fmtJoinSort(sort) {
	for (let k in sort) {
		let v = sort[k];
		if (typeof (v) == 'string') {
			v = v.toLowerCase();
			if (v === 'asc')
				v = 1;
			else
				v = -1;
		}
		sort[k] = v;
	}
	return sort;
}

/**
 * fields处理 
 * @param {*} fields 需要取得的字段 两种形式
 * INFO_TITLE,INFO_ID,INFO_NAME 
 * 或者
 * {
 * 		INFO_TITLE:true,
 * 		INFO_NAME:true
 * }
 * 
 */
function fmtFields(fields) {
	if (typeof (fields) == 'string') {
		let obj = {};
		fields = fields.replace(/，/g, ",");
		let arr = fields.split(',');
		for (let i = 0; i < arr.length; i++) {
			obj[arr[i].trim()] = true;
		}
		return obj;
	}

	return fields;
}

/**
 * where处理 单表
 * @param {*} where ，支持:  in, like, not in, >=, >, <=, <, !=, <>
 * { 		 
		INFO_EXPIRE_TIME: [ //多条件
			['>=', 3], 
			['<=', 8],
			['<>', 5],
			['in', '6,7']
		], 
		INFO_ORDER: ['<=', 9999],
		INFO_TITLE: ['like', '1']
	}

	or支持*******************
	分2组 where.and / where.or
	where.and 格式同以上where
	where.or 可以传{xxx:11,yy:22} -----与条件
	[{xxx:111},{yy:22}]  ------------ 或条件
 */
function fmtWhere(where) {
	if (util.isDefined(where.and) || util.isDefined(where.or)) {
		let whereEx = null;
		if (util.isDefined(where.and))
			whereEx = dbCmd.and(fmtWhere(where.and));

		if (util.isDefined(where.or)) {
			if (whereEx)
				whereEx = whereEx.and(dbCmd.or(fmtWhere(where.or)));
			else
				whereEx = dbCmd.or(fmtWhere(where.or));
		}
		//console.log(whereEx);
		return whereEx;
	}
	// 如果是数组 一般是用在or的或条件
	if (Array.isArray(where)) {
		for (let i = 0; i < where.length; i++)
			where[i] = fmtWhere(where[i]);
	}

	for (let k in where) {
		/* 判断是否有条件数组  
			INFO_EXPIRE_TIME: [
				['>=', 3], 
				['<=', 8],
				['<>', 5],
				['in', '6,7']
				],
		*/
		if (Array.isArray(where[k])) {
			let op = where[k][0];
			let w = null;

			if (!Array.isArray(op)) {
				// 一维数组 
				w = fmtWhereSimple(where[k]);
			} else {
				// 二维数组 
				for (let i = 0; i < where[k].length; i++) {
					let wTemp = fmtWhereSimple(where[k][i]);
					w = (w) ? w.and(wTemp) : wTemp;
				}
			}

			where[k] = w;

		}
	}
	//console.log(where);
	return where;
}

/**
 * 单个where处理
 * @param {*} arr 
 */
function fmtWhereSimple(arr) {
	let op = arr[0].toLowerCase().trim();
	let val = arr[1];
	let where = {};
	switch (op) {
		case '=':
			where = dbCmd.eq(val);
			break;
		case '!=':
		case '<>':
			where = dbCmd.neq(val);
			break;
		case '<':
			where = dbCmd.lt(val);
			break;
		case '<=':
			where = dbCmd.lte(val);
			break;
		case '>':
			where = dbCmd.gt(val);
			break;
		case '>=':
			where = dbCmd.gte(val);
			break;
		case 'like':
			if (!util.isDefined(val) || !val) break; //无条件不搜索
			where = {
				$regex: val,
				$options: 'i'
			}
			break;
		case 'in':
			val = strUtil.str2Arr(val);
			where = dbCmd.in(val);
			break;
		case 'not in':
			val = strUtil.str2Arr(val);
			where = dbCmd.nin(val);
			break;
		default:
			break;
	}
	return where;
}

module.exports = {
	insert,
	edit,
	del,
	count,
	inc,
	getOne,
	getAll,
	getList,
	getListJoin,
	MAX_RECORD_SIZE,
	DEFAULT_RECORD_SIZE
}