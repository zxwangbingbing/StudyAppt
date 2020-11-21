/**
 * Notes: 相册实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-24 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseModel = require('./base_model.js');

class AlbumModel extends BaseModel {

}

// 集合名
AlbumModel.CL = "t_album";

AlbumModel.DB_STRUCTURE = {
	ALBUM_ID: 'string|true',
	ALBUM_USER_ID: 'string|true',

	ALBUM_TITLE: 'string|true|comment=标题',
	ALBUM_CONTENT: 'string|true|comment=内容',
	ALBUM_DESC: 'string|false|comment=描述',
	ALBUM_STATUS: 'int|true|default=1|comment=状态 0=待审核 1=正常 7=结束 8=停用 9=删除',
	ALBUM_TYPE: 'string|true|default=其他|comment=类型  同学时光,校园追忆,校友今夕,活动聚会,个人风采,其他',
	ALBUM_ORDER: 'int|true|default=9999',

	ALBUM_VIEW_CNT: 'int|true|default=0|comment=访问次数',
	ALBUM_FAV_CNT: 'int|true|default=0|comment=收藏人数',
	ALBUM_COMMENT_CNT: 'int|true|default=0|comment=评论数',
	ALBUM_LIKE_CNT: 'int|true|default=0|comment=点赞数',


	ALBUM_PIC: 'array|false|default=[]|comment=附加图片 对象数组[{cloudId,url}]',

	ALBUM_ADD_TIME: 'int|true',
	ALBUM_EDIT_TIME: 'int|true',
	ALBUM_ADD_IP: 'string|false',
	ALBUM_EDIT_IP: 'string|false',
};

// 字段前缀
AlbumModel.FIELD_PREFIX = "ALBUM_";

AlbumModel.STATUS = {
	//0=待审核 1=正常 7=结束 8=停用 9=删除
	UNUSE: 0,
	COMM: 1,
	OVER: 7,
	PEDDING: 8,
	DEL: 9
};

AlbumModel.STATUS_DESC = {
	//0=待审核 1=正常 7=结束 8=停用 9=删除
	UNUSE: '待审核',
	COMM: '正常',
	OVER: '结束',
	PEDDING: '停用',
	DEL: '删除'
};


module.exports = AlbumModel;