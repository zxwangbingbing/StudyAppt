/**
 * Notes: 收藏实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-05-24 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class FavModel extends BaseProjectModel {

}

// 集合名
FavModel.CL = BaseProjectModel.C('fav');

FavModel.DB_STRUCTURE = {
	_pid: 'string|true',
	FAV_ID: 'string|true',

	FAV_USER_ID: 'string|true',

	FAV_TITLE: 'string|true|comment=标题',
	FAV_TYPE: 'string|true|comment=类型',
	FAV_OID: 'string|true|comment=相关表主键',
	FAV_PATH: 'string|true|comment=路径',

	FAV_ADD_TIME: 'int|true',
	FAV_EDIT_TIME: 'int|true',
	FAV_ADD_IP: 'string|false',
	FAV_EDIT_IP: 'string|false',
};

// 字段前缀
FavModel.FIELD_PREFIX = "FAV_";

module.exports = FavModel;