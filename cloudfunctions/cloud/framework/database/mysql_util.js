/**
 * Notes: MYSQL数据库基本操作
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-01-22 04:00:00 
 */

const mysql = require('mysql');

const util = require('../utils/util.js'); 
const AppError = require('../core/app_error.js');
const appCode = require('../core/app_code.js');

const config = require('../../config/config.js');

const MAX_RECORD_SIZE = 100; //数据库每次可取最大记录数
const DEFAULT_RECORD_SIZE = 20; //默认显示记录数

/*
function openConn() {
	let connection = mysql.createConnection({
		host: "127.0.0.1",
		database: "test",
		user: "root",
		password: "root",
		port: '3306',
	});

	connection.connect();

	return connection;
}
*/

function initPool() {
	let pool = mysql.createPool({
		host: config.MYSQL_DB_HOST,
		database: config.MYSQL_DB_DATABSE,
		user: config.MYSQL_DB_USER,
		password: config.MYSQL_DB_PASSWORD,
		port: config.MYSQL_DB_PORT,
	});

	return pool;
}

function closeConn(connection) {
	if (connection) {
		console.log('Colse DB Connection');
		connection.end();
	}
}

/**
 * 排序格式化
 * @param {*} orderBy 
 */
function fmtOrderBy(orderBy) {
	if (typeof (orderBy) == 'string') {
		orderBy = orderBy.trim();
		if (orderBy.length == 0)
			return '';
		else
			return `ORDER BY ${orderBy}`;
	}

	let order = '';
	for (let key in orderBy) {
		order += ', ' + key + ' ' + orderBy[key];
	}
	if (order) {
		order = order.substr(1);
		order = `ORDER BY ${order}`;
	}
	return order;
}

/**
 * RowDataPacket格式化
 */
function fmtRowData(rowDataPacket) {
	let dataString = JSON.stringify(rowDataPacket);
	let data = JSON.parse(dataString);
	return data;
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

	or支持******************* //TODO
	分2组 where.and / where.or
	where.and 格式同以上where
	where.or 可以传{xxx:11,yy:22} -----与条件
	[{xxx:111},{yy:22}]  ------------ 或条件
 */
function fmtWhere(where) {
	if (typeof (where) == 'string') {
		where = where.trim();
		if (where.length == 0)
			return '';
		else
			return `WHERE ${where}`;
	}

	let w = '';
	for (let key in where) {
		if (Array.isArray(where[key])) {
			let op = where[key][0];
			if (!Array.isArray(op)) {
				// 一维数组 
				w += fmtWhereSimple(key, where[key]);

			} else {
				// 二维数组 
				for (let i = 0; i < where[key].length; i++) {
					w += fmtWhereSimple(key, where[key][i]);
				}
			}
		} else
			w += fmtWhereSimple(key, where[key]);

	}
	return `WHERE 1=1  ${w}`;
}


/**
 * 单个where处理
 * @param {*} arr 
 */
function fmtWhereSimple(key, arr) {
	// 直接赋值的非数组
	if (!Array.isArray(arr)) {
		if (arr)
			return ` AND ${key}='${arr}' `;
		else
			return '';
	}

	// 数组
	let op = arr[0].toLowerCase().trim();
	let val = arr[1];
	let where = '';
	switch (op) {
		case '=':
			where += ` AND ${key} = '${val}' `;
			break;
		case '!=':
		case '<>':
			where += ` AND ${key} != '${val}' `;
			break;
		case '<':
			where += ` AND ${key} < ${val} `;
			break;
		case '<=':
			where += ` AND ${key} <= ${val} `;
			break;
		case '>':
			where += ` AND ${key} > ${val} `;
			break;
		case '>=':
			where += ` AND ${key} >= ${val} `;
			break;
		case 'like':
			if (!util.isDefined(val) || !val) break; //无条件不搜索
			where += ` AND ${key} LIKE '%${val}%' `;
			break;
		case 'in':
			where += ` AND ${key} IN (${val}) `;
			break;
		case 'not in':
			where += ` AND ${key} NOT IN (${val}) `;
			break;
		default:
			throw new AppError(`DB where OP error=[${op}]`, appCode.SVR);
			break;
	}
	return where;
}

/**
 * 格式化插入数据
 * @param {*} data 
 */
function fmtInsertData(data) { 
	let name = '';
	let val = ''
	let params = [];
	for (let key in data) {
		name += ',' + key;
		val += ',?';
		params.push(data[key]);
	}
	name = name.substr(1);
	val = val.substr(1);
	let sqlMid = ` (${name}) VALUES (${val}) `;
	return {sqlMid, params};
}

/**
 * 格式化修改数据
 * @param {*} data 
 */
function fmtEditData(data) { 
	let sqlMid = ''; 
	let params = [];
	for (let key in data) {
		sqlMid += ',' + key + '=?'; 
		params.push(data[key]);
	} 
	sqlMid = sqlMid.substr(1); 
	return {sqlMid, params};
}

/**
 * 获取所有数据
 * @param {*} tableName 
 * @param {*} where 
 * @param {*} fields 
 * @param {*} orderBy 
 * @param {*} size 
 * @returns list
 */
async function getAll(tableName, where, fields = '*', orderBy, size = MAX_RECORD_SIZE) {
	size = Number(size);
	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;

	// 排序
	orderBy = fmtOrderBy(orderBy);

	// 条件
	where = fmtWhere(where);

	let sql = `SELECT ${fields} FROM ${tableName} ${where} ${orderBy} LIMIT ${size}`;  
	try {
		let list = await sqlExecute(sql); 
		list = fmtRowData(list);
		return list;
	} catch (err) {
		// throw new AppError('db error', appCode.SVR)
		return [];
	} 
}

/**
 * 获取单个数据
 * @param {*} tableName 
 * @param {*} where 
 * @param {*} fields 
 * @param {*} orderBy 
 * @returns null or object
 */
async function getOne(tableName, where, fields = '*', orderBy = {}) {
	// 排序
	orderBy = fmtOrderBy(orderBy);

	// 条件
	where = fmtWhere(where);
 
	let sql = `SELECT ${fields} FROM ${tableName} ${where} ${orderBy} LIMIT 1`;  
	try {
		let list = await sqlExecute(sql); 
		list = fmtRowData(list);
		if (list && list.length > 0)
			return list[0];
		else 
			return null;
	} catch (err) {
		// throw new AppError('db error', appCode.SVR)
		return null;
	}  
}

/**
 * 获取分页数据
 * @param {*} tableName 
 * @param {*} where 
 * @param {*} fields 
 * @param {*} orderBy 
 * @param {*} page 
 * @param {*} size 
 * @param {*} isTotal 
 * @returns {page, size, list, total, oldTotal}
 */
async function getList(tableName, where, fields = '*', orderBy = {}, page = 1, size = DEFAULT_RECORD_SIZE, isTotal = true, oldTotal = 0) {
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
		let total = await count(tableName, where);
		data.total = total;
		data.count = Math.ceil(total / size);

		if (page > 1 && oldTotal > 0) {
			offset = data.total - oldTotal
			if (offset < 0) offset = 0;

		}
	}

	// 分页 
	let start = (page - 1) * size + offset;

	// 排序
	orderBy = fmtOrderBy(orderBy);

	// 条件
	where = fmtWhere(where);
 
 
	let sql = `SELECT ${fields} FROM ${tableName} ${where} ${orderBy} LIMIT ${start}, ${size}`;  
	try {
		let list = await sqlExecute(sql); 
		list = fmtRowData(list);
		data.list = list;
		return data;
	} catch (err) {  
		data.list = [];
		return data;
	}  
}


/**
 * 获取所有数据
 * @param {*} tableName 
 * @param {*} where 
 * @param {*} fields 
 * @param {*} orderBy 
 * @param {*} size 
 * @returns 返回影响值
 */
async function del(tableName, where) {  
	// 条件
	where = fmtWhere(where);

	let sql = `DELETE FROM ${tableName} ${where} `; 
	try {
		let res = await sqlExecute(sql);
		return res.affectedRows;
	} catch (err) {
		// throw new AppError('db error', appCode.SVR)
		return 0;
	} 
}


/**
 * 添加数据
 * @param {*} tableName 
 * @param {*} data 
 * @returns 返回PK
 */
async function insert(tableName, data) {

	let {sqlMid, params} = fmtInsertData(data);

	let sql = `INSERT INTO ${tableName} ${sqlMid} `; 
	try {
		let res = await sqlExecute(sql, params);
		return res.insertId;
	} catch (err) {
		throw new AppError('db error', appCode.SVR) 
	}  
}


/**
 * 更新数据
 * @param {*} tableName 
 * @param {*} where 为非对象 则作为PK处理
 * @param {*} data 
 * @returns 影响行数
 */
async function edit(tableName, where, data) {
  
	let {sqlMid, params} = fmtEditData(data);

	// 条件
	where = fmtWhere(where);

	let sql = `UPDATE ${tableName} SET ${sqlMid}  ${where} `; 
	try {
		let res = await sqlExecute(sql, params);
		return res.affectedRows;
	} catch (err) {
		throw new AppError('db error', appCode.SVR) 
	}  
}




/**
 * 获取总数
 * @param {*} tableName 
 * @param {*} where 
 */
async function count(tableName, where) {
	where = fmtWhere(where);

	let sql = `SELECT COUNT(1) AS TOTAL FROM ${tableName}  ${where} `; 

	try {
		let res = await sqlExecute(sql);
		
		res = fmtRowData(res);
		if (res && res[0] && res[0].TOTAL)
			return res[0].TOTAL;
		else 
			return 0; 
	} catch (err) {
		return 0;
	}  
}

/**
 * 字段自增
 * @param {*} tableName 
 * @param {*} where 为非对象 则作为PK处理
 * @param {*} field 
 * @param {*} val 
 * @returns 影响行数
 */
async function inc(tableName, where, field, val = 1) {
	where = fmtWhere(where);

	let sql = '';
	if (val > 0)
		sql = `UPDATE ${tableName} SET ${field}=${field}+${val}  ${where} `; 
	else 
		sql = `UPDATE ${tableName} SET ${field}=${field}-${-val}  ${where} `; 

	try {
		let res = await sqlExecute(sql);
		return res.affectedRows;
	} catch (err) {
		return 0;
	}  
}

/**
 * 执行
 * @param {*} sql 
 * @param {*} params 数据参数
 */
function sqlExecute(sql, params = []) {
	if (config.DB_DEBUG) console.error('[SQL] ' + sql);
	if (config.DB_DEBUG && params.length > 0) console.error('[SQL PARAMS] ');
	if (config.DB_DEBUG && params.length > 0) console.error(params);

	let pool = initPool();
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				console.error('[DB ERROR] - ', err.message);
				reject(err);
			} else {
				connection.query(sql, params, (err, effect) => {
					if (err) {
						console.error('[DB SELECT ERROR] - ', err.message);
						reject(err);
					} else { 
						resolve(effect);
					}
					connection.release();
				});

			}
		});
	});
}

module.exports = {
	getAll,
	getList,
	del,
	insert,
	edit,
	count,
	inc,
	getOne
}