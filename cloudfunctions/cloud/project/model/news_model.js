/**
 * Notes: 资讯实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-10-28 19:20:00 
 */


const BaseModel = require('./base_model.js');

class NewsModel extends BaseModel {

}

// 集合名
NewsModel.CL = "ax_news";

NewsModel.DB_STRUCTURE = {
	_pid: 'string|true',
	NEWS_ID: 'string|true',
	NEWS_ADMIN_ID: 'string|true',

	NEWS_TYPE: 'int|true|default=0|comment=类型 0=本地文章，1=外部链接',
	NEWS_TITLE: 'string|false|comment=标题',
	NEWS_DESC: 'string|false|comment=描述',
	NEWS_URL: 'string|false|comment=外部链接URL',
	NEWS_STATUS: 'int|true|default=1|comment=状态 0/1',

	NEWS_CATE_ID: 'string|true|comment=分类编号',
	NEWS_CATE_NAME: 'string|true|comment=分类冗余',

	NEWS_ORDER: 'int|true|default=9999',

	NEWS_HOME: 'int|true|default=9999|comment=推荐到首页',

	NEWS_CONTENT: 'array|true|default=[]|comment=内容',

	NEWS_VIEW_CNT: 'int|true|default=0|comment=访问次数',
	NEWS_FAV_CNT: 'int|true|default=0|comment=收藏人数',
	NEWS_COMMENT_CNT: 'int|true|default=0|comment=评论数',
	NEWS_LIKE_CNT: 'int|true|default=0|comment=点赞数',


	NEWS_PIC: 'array|false|default=[]|comment=附加图片  [cloudId1,cloudId2,cloudId3...]',

	NEWS_ADD_TIME: 'int|true',
	NEWS_EDIT_TIME: 'int|true',
	NEWS_ADD_IP: 'string|false',
	NEWS_EDIT_IP: 'string|false',
};

// 字段前缀
NewsModel.FIELD_PREFIX = "NEWS_";


module.exports = NewsModel;