/**
 * Notes: 数据库基本操作
 * Ver : CCMiniCloud Framework 2.9.1 ALL RIGHTS RESERVED BY CClinux0730 (wechat)
 * Date: 2020-09-05 04:00:00 
 */

const util = require('../utils/util.js');
const dataUtil = require('../utils/data_util.js');

const cloudBase = require('../cloud/cloud_base.js');
const MAX_RECORD_SIZE = 1000;
const DEFAULT_RECORD_SIZE = 20;

const cloud = cloudBase.getCloud();
const db = cloud.database();
const dbCmd = db.command;
const dbAggr = dbCmd.aggregate;


// 获得一个命令操作
function getCmd() {
	return dbCmd;
}


async function insertBatch(collectionName, data, size = 1000) {

	let dataArr = dataUtil.spArr(data, size);
	for (let k = 0; k < dataArr.length; k++) {
		await db.collection(collectionName).add({
			data: dataArr[k]
		});
	}

	//return query._id;
}

async function insert(collectionName, data) {

	let query = await db.collection(collectionName).add({
		data
	});
	return query._id;
}

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

async function mul(collectionName, where, field, val = 1) {
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
			[field]: dbCmd.mul(val)
		}
	});

	return query.stats.updated;
}

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

async function distinct(collectionName, where, field) {
	let query = await db.collection(collectionName);
	query = await query.aggregate();

	// 查询条件
	query = await query.match(fmtWhere(where));

	query = await query.group({
		_id: null,
		'uniqueValues': dbAggr.addToSet('$' + field)

	}).end();

	if (query && query.list && query.list[0] && query.list[0]['uniqueValues']) {
		return query.list[0]['uniqueValues'];
	} else
		return [];
}

async function distinctCnt(collectionName, where, field) {
	let data = await distinct(collectionName, where, field);
	return data.length;
}

async function groupSum(collectionName, where, groupField, fields) {

	let query = await db.collection(collectionName);
	query = await query.aggregate();

	// 查询条件
	query = await query.match(fmtWhere(where));

	if (!Array.isArray(fields)) {
		fields = [fields];
	}
	let node = {};
	for (let k = 0; k < fields.length; k++) {
		node[fields[k]] = dbAggr.sum('$' + fields[k]);
	}

	query = await query.group({
		_id: {
			[groupField]: '$' + groupField
		},
		...node

	}).end();

	if (query && query.list) {
		let list = query.list;
		for (let k = 0; k < list.length; k++) {
			list[k][groupField] = list[k]['_id'][groupField];
			delete list[k]['_id'];
		}
		return list;
	} else
		return [];
}

async function groupCount(collectionName, where, groupField) {

	let query = await db.collection(collectionName);
	query = await query.aggregate();

	// 查询条件
	query = await query.match(fmtWhere(where));

	query = await query.group({
		_id: '$' + groupField,
		total: dbAggr.sum(1)

	}).end();

	if (query && query.list) {
		let list = query.list;
		let ret = {};
		for (let k = 0; k < list.length; k++) {
			ret[groupField + '_' + list[k]['_id']] = list[k].total;
		}
		return ret;
	} else
		return null;
}

async function sum(collectionName, where, field) {
	// TODO 可扩展为支持多个字段同时统计
	let query = await db.collection(collectionName);
	query = await query.aggregate();

	// 查询条件
	query = await query.match(fmtWhere(where));

	query = await query.group({
		_id: null,
		'summ': dbAggr.sum('$' + field)

	}).end();

	if (query && query.list && query.list[0] && query.list[0]['summ']) {
		return query.list[0]['summ'];
	} else
		return 0;
}

async function max(collectionName, where, field) {
	let query = await db.collection(collectionName);
	query = await query.aggregate();

	// 查询条件
	query = await query.match(fmtWhere(where));

	query = await query.group({
		_id: null,
		'maxx': dbAggr.max('$' + field)

	}).end();

	if (query && query.list && query.list[0] && query.list[0]['maxx']) {
		return query.list[0]['maxx'];
	} else
		return 0;
}

async function min(collectionName, where, field) {
	let query = await db.collection(collectionName);
	query = await query.aggregate();

	// 查询条件
	query = await query.match(fmtWhere(where));

	query = await query.group({
		_id: null,
		'minx': dbAggr.min('$' + field)

	}).end();

	if (query && query.list && query.list[0] && query.list[0]['minx']) {
		return query.list[0]['minx'];
	} else
		return 0;
}

async function clear(collectionName) {
	await db.collection(collectionName).where({
		_id: dbCmd.neq(1)
	}).remove().then(res => {

	});
}

async function isExistCollection(collectionName) {
	try {
		await getOne(collectionName, {});
		return true;

	} catch (err) {
		return false;
	}
}

async function createCollection(collectionName) {
	try {
		await db.createCollection(collectionName);

		console.log('>> Create New Collection [' + collectionName + '] Succ, OVER.');
		return true;

	} catch (err) {
		console.error('>> Create New Collection [' + collectionName + '] Failed, Code=' + err.errCode + '|' + err.errMsg);
		return false;
	}

}

async function rand(collectionName, where = {}, fields = '*', size = 1) {

	size = Number(size);

	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;


	let query = await db.collection(collectionName)
		.aggregate();

	if (util.isDefined(where))
		query = await query.match(fmtWhere(where));

	if (util.isDefined(fields) && fields != '*')
		query = await query.project(fmtFields(fields));


	query = await query.sample({
		size
	});

	query = await query.end();

	if (size == 1) {
		if (query.list.length == 1)
			return query.list[0];
		else
			return null;
	} else
		return query.list;

}

async function getListByArray(collectionName, arrField, where, fields, orderBy, page = 1, size = DEFAULT_RECORD_SIZE, isTotal = true, oldTotal = 0) {

	if (typeof (where) == 'string' || typeof (where) == 'number') {
		where = {
			_id: where,
		};
	}

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
			.aggregate();

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

	// 拆分查询
	let query = await db.collection(collectionName)
		.aggregate()
		.unwind('$' + arrField);

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

	return data;
}

async function getListJoin(collectionName, joinParams, where, fields, orderBy, page = 1, size = DEFAULT_RECORD_SIZE, isTotal = true, oldTotal = 0, is2Many = false) {

	if (typeof (where) == 'string' || typeof (where) == 'number') {
		where = {
			_id: where,
		};
	}

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

	if (!is2Many) {
		for (let k = 0; k < data.list.length; k++) {
			if (util.isDefined(data.list[k][joinParams.as])) {
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

async function getListJoinCount(collectionName, joinParams, where) {

	if (typeof (where) == 'string' || typeof (where) == 'number') {
		where = {
			_id: where,
		};
	}

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

	return total;

}

async function getList(collectionName, where, fields = '*', orderBy = {}, page = 1, size = DEFAULT_RECORD_SIZE, isTotal = true, oldTotal = 0) {
	page = Number(page);
	size = Number(size);

	if (size > MAX_RECORD_SIZE || size == 0) size = MAX_RECORD_SIZE;

	let data = {
		page: page,
		size: size
	}

	let offset = 0;
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

async function getAllBig(collectionName, where, fields = '*', orderBy, size = MAX_RECORD_SIZE) {
	size = Number(size);
	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;

	// 计算总数
	let total = await await count(collectionName, where);

	// 页数
	let page = Math.ceil(total / size);

	let list = [];
	for (let i = 1; i <= page; i++) {
		let data = await getList(collectionName, where, fields, orderBy, i, size, false);

		if (data && data.list)
			list = list.concat(data.list);
	}

	return list;
}


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

async function getAllByArray(collectionName, arrField, where, fields = '*', orderBy, size = MAX_RECORD_SIZE) {
	size = Number(size);
	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;

	// 拆分
	let query = await db.collection(collectionName).aggregate()
		.unwind('$' + arrField);

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

	// 取数据
	query = await query.limit(size).end();
	return query.list;
}

async function getOne(collectionName, where, fields = '*', orderBy = {}) {
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

async function fmtOrderBy(query, orderBy) {
	for (let key in orderBy) {
		query = await query.orderBy(key, orderBy[key].toLowerCase())
	}
	return query;
}

function fmtJoinSort(sort) {
	for (let key in sort) {
		let v = sort[key];
		if (typeof (v) == 'string') {
			v = v.toLowerCase();
			if (v === 'asc')
				v = 1;
			else
				v = -1;
		}
		sort[key] = v;
	}
	return sort;
}


function fmtFields(fields) {
	if (typeof (fields) == 'string') {
		let obj = {};
		fields = fields.replace(/，/g, ",");
		let arr = fields.split(',');
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].trim().length > 0)
				obj[arr[i].trim()] = true;
		}
		return obj;
	}

	return fields;
}


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

	if (Array.isArray(where)) {
		for (let i = 0; i < where.length; i++)
			where[i] = fmtWhere(where[i]);
	}

	for (let key in where) {
		/* 判断是否有条件数组  
			INFO_EXPIRE_TIME: [
				['>=', 3], 
				['<=', 8],
				['<>', 5],
				['in', '6,7']
				],
		*/
		if (Array.isArray(where[key])) {
			let w = null;
			if (!Array.isArray(where[key][0]) && where[key][0].toLowerCase().trim() == 'between') {
				// 条件查询特殊处理
				where[key] = [
					['>=', where[key][1]],
					['<=', where[key][2]]
				];
			}

			if (!Array.isArray(where[key][0])) {
				// 一维数组 
				w = fmtWhereSimple(where[key]);
			} else {
				// 二维数组 
				for (let i = 0; i < where[key].length; i++) {
					let wTemp = fmtWhereSimple(where[key][i]);
					w = (w) ? w.and(wTemp) : wTemp;
				}
			}

			where[key] = w;

		}
	}
	return where;
}

function fmtWhereSimple(arr) {
	let sql = '';

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
			val = dataUtil.str2Arr(val);
			where = dbCmd.in(val);
			break;
		case 'not in':
			val = dataUtil.str2Arr(val);
			where = dbCmd.nin(val);
			break;
		default:
			console.error('error where oprt=' + op);
			break;
	}
	return where;
}

module.exports = {
	getCmd,

	insert,
	insertBatch,
	edit,
	del,

	count,
	inc,
	sum,
	groupCount,
	groupSum,
	distinct,
	distinctCnt,
	max,
	min,
	mul,

	isExistCollection,
	createCollection,
	clear,
	rand,
	getOne,
	getAll,
	getAllBig,

	getAllByArray,
	getList,
	getListJoin,
	getListJoinCount,
	getListByArray,
	MAX_RECORD_SIZE,
	DEFAULT_RECORD_SIZE
}