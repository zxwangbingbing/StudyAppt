/**
 * Notes: 互助实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-14 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseModel = require('./base_model.js');

class InfoModel extends BaseModel {

}

// 集合名
InfoModel.CL = "t_info";

InfoModel.DB_STRUCTURE = {
	INFO_ID: 'string|true',
	INFO_USER_ID: 'string|true',

	INFO_TITLE: 'string|true|comment=标题',
	INFO_DESC: 'string|false|comment=描述',
	INFO_CONTENT: 'string|true|comment=内容',
	INFO_STATUS: 'int|true|default=1|comment=状态 0=待审核 1=正常 7=过期 8=停用 9=删除',
	INFO_TYPE: 'string|true|default=其他|comment=类型  资源合作,活动聚会,创业合作,招聘猎头,求职,企业推介,供应采购,商务合作,服务咨询,其他',
	INFO_ORDER: 'int|true|default=9999',

	INFO_VIEW_CNT: 'int|true|default=0|comment=访问次数',
	INFO_FAV_CNT: 'int|true|default=0|comment=收藏人数',
	INFO_COMMENT_CNT: 'int|true|default=0|comment=评论数',
	INFO_LIKE_CNT: 'int|true|default=0|comment=点赞数',

	INFO_EXPIRE_TIME: 'int|true|default=0|comment=过期时间 0=永不过期',

	INFO_REGION_PROVINCE: 'string|false|comment=区域(省)',
	INFO_REGION_CITY: 'string|false|comment=区域(市)',
	INFO_REGION_COUNTY: 'string|false|comment=区域(区)',

	INFO_PIC: 'array|false|default=[]|comment=附加图片 对象数组[{cloudId,url}]',

	INFO_ADD_TIME: 'int|true',
	INFO_EDIT_TIME: 'int|true', 
	INFO_ADD_IP: 'string|false',
	INFO_EDIT_IP: 'string|false',
};

// 字段前缀
InfoModel.FIELD_PREFIX = "INFO_";

InfoModel.STATUS = {
	//0=待审核 1=正常 8=停用 9=删除
	UNUSE: 0,
	COMM: 1,
	PEDDING: 8,
	DEL: 9
}; 

InfoModel.STATUS_DESC = {
	//0=待审核 1=正常 8=停用 9=删除
	UNUSE: '待审核',
	COMM: '正常',
	PEDDING: '停用',
	DEL: '删除'
}; 
 

module.exports = InfoModel;