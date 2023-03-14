/**
 * Notes: 实体基类 
 * Date: 2021-03-15 19:20:00 
 * Ver : CCMiniCloud Framework 2.12.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */


const Model = require('./model.js');
const util = require('../utils/util.js');
const dataUtil = require('../utils/data_util.js');
const config = require('../../config/config.js');

class MultiModel extends Model {

	static C(cl) {
		return config.COLLECTION_PRFIX + cl;
	}

	static _getWhere(where, mustPID = true) {
		if (mustPID) {
			if (typeof (where) == 'string' || typeof (where) == 'number') {
				where = {
					_id: where,
					_pid: util.getProjectId()
				};
			} else
				where._pid = util.getProjectId();
		}
		return where;
	}

	static async getOneField(where, field, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		let one = await super.getOne(where, field);
		if (!one)
			return null;
		else {
			let ret = one[field];
			if (ret === undefined)
				return '';
			else
				return one[field];
		}
	}

	static async getOne(where, fields = '*', orderBy = {}, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.getOne(where, fields, orderBy);
	}

	static async edit(where, data, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.edit(where, data);
	}

	static async editForms(where, formName, objName, hasImageForms, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);

		let forms = await this.getOneField(where, formName, mustPID);
		if (!forms) return;


		// 赋值
		for (let k = 0; k < hasImageForms.length; k++) {
			for (let j in forms) {
				if ((forms[j].type == 'image' || forms[j].type == 'content')
					&& forms[j].mark == hasImageForms[k].mark
					&& forms[j].type == hasImageForms[k].type) {
					forms[j].val = hasImageForms[k].val;
					break;
				}
			}
		}

		let data = {
			[formName]: forms,
			[objName]: dataUtil.dbForms2Obj(forms)
		};

		return await super.edit(where, data);
	}

	static async count(where, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.count(where);
	}

	static async insert(data, mustPID = true) {
		if (mustPID) data._pid = util.getProjectId();
		return await super.insert(data);
	}

	static async insertBatch(data = [], size = 1000, mustPID = true) {
		if (mustPID) {
			for (let k = 0; k < data.length; k++) {
				data[k]._pid = util.getProjectId();
			}
		}

		return await super.insertBatch(data, size);
	}

	static async insertOrUpdate(where, data, mustPID = true) {
		if (mustPID) {
			where._pid = util.getProjectId();
		}
		return await super.insertOrUpdate(where, data);
	}

	static async del(where, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.del(where);
	}

	static async clear() {
		return await super.clear();
	}

	static async inc(where, field, val = 1, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.inc(where, field, val);
	}

	static async mul(where, field, val = 1, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.mul(where, field, val);
	}

	static async groupSum(where, groupField, field, mustPID = true) {
		if (mustPID) where._pid = util.getProjectId();
		return await super.groupSum(where, groupField, field);
	}

	static async groupCount(where, groupField, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.groupCount(where, groupField);
	}

	static async sum(where, field, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.sum(where, field);
	}

	static async distinct(where, field, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.distinct(where, field);
	}

	static async distinctCnt(where, field, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.distinctCnt(where, field);
	}

	static async max(where, field, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.max(where, field);
	}

	static async min(where, field, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.min(where, field);
	}

	static async rand(where, field, size = 1, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.rand(where, field, size);
	}

	static async getAll(where, fields, orderBy, size = 100, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.getAll(where, fields, orderBy, size);
	}

	static async getAllBig(where, fields, orderBy, size = 1000, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.getAllBig(where, fields, orderBy, size);
	}

	static async getAllByArray(arrField, where, fields, orderBy, size = 100, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.getAllByArray(arrField, where, fields, orderBy, size);
	}

	static async getList(where, fields, orderBy, page, size, isTotal, oldTotal, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	static async getListJoin(joinParams, where, fields, orderBy, page = 1, size, isTotal = true, oldTotal = 0, is2Many = false, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal, is2Many);
	}

	static async getListJoinCount(joinParams, where, mustPID = true) {
		where = MultiModel._getWhere(where, mustPID);
		return await super.getListJoinCount(joinParams, where);
	}

}

module.exports = MultiModel;