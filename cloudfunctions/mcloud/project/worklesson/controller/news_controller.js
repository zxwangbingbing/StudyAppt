/**
 * Notes: 资讯模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-09-29 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const NewsService = require('../service/news_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class NewsController extends BaseProjectController {

	// 把列表转换为显示模式
	transNewsList(list) {
		let ret = [];
		for (let k = 0; k < list.length; k++) {
			let node = {};
			node.type = 'news';
			node.id = list[k]._id;
			node.title = list[k].NEWS_TITLE;
			node.desc = list[k].NEWS_DESC;
			node.ext = list[k].NEWS_ADD_TIME;
			node.pic = list[k].NEWS_PIC[0];
			ret.push(node);
		}
		return ret;
	}

	/** 资讯列表 */
	async getNewsList() {

		// 数据校验
		let rules = {
			cateId: 'string',
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序', 
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new NewsService();
		let result = await service.getNewsList(input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D');

			if (list[k].NEWS_OBJ && list[k].NEWS_OBJ.desc)
				delete list[k].NEWS_OBJ.desc;
		}
		result.list = this.transNewsList(list);

		return result;

	}


	/** 浏览资讯信息 */
	async viewNews() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new NewsService();
		let news = await service.viewNews(input.id);

		if (news) {
			// 显示转换 
			news.NEWS_ADD_TIME = timeUtil.timestamp2Time(news.NEWS_ADD_TIME, 'Y-M-D');
		}

		return news;
	}



}

module.exports = NewsController;