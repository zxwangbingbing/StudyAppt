/**
 * Notes: 系统设置实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-05 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseModel = require('./base_model.js');

class SetupModel extends BaseModel {

}

// 集合名
SetupModel.CL = "t_setup";

SetupModel.DB_STRUCTURE = {
	SETUP_ID: 'string|true',
	
	SETUP_TITLE: 'string|false|comment=网站名称',
	SETUP_ABOUT: 'string|false|comment=关于我们',

	SETUP_LOGO: 'object|false|default={}|comment=网站底图 对象{cloudId,url}',

	SETUP_AD_PIC: 'array|false|default=[]|comment=海报底图 对象数组[{cloudId,url}]',

	SETUP_REG_CHECK : 'int|true|default=0|comment=注册是否审核 0/1',

	SETUP_ADD_TIME: 'int|true',
	SETUP_EDIT_TIME: 'int|true', 
	SETUP_ADD_IP: 'string|false',
	SETUP_EDIT_IP: 'string|false',
};

// 字段前缀
SetupModel.FIELD_PREFIX = "SETUP_";

 

 
 

module.exports = SetupModel;