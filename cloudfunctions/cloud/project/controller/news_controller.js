/**
 * Notes: 资讯模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-09-29 04:00:00 
 */

const BaseController = require('./base_controller.js');
const NewsService = require('../service/news_service.js');
const timeUtil = require('../../framework/utils/time_util.js');

class NewsController extends BaseController {

	// 把列表转换为显示模式
	transNewsList(list) {
		let ret = [];
		for (let k in list) {
			let node = {};
			node.type = 'news';
			node._id = list[k]._id;
			node.title = list[k].NEWS_TITLE;
			node.desc = list[k].NEWS_DESC;
			node.ext = list[k].NEWS_ADD_TIME;
			node.pic = list[k].NEWS_PIC[0];
			ret.push(node);
		}
		return ret;
	}

	/** 首页资讯列表 */
	async getHomeNewsList() {
		let rules = {};

		// 取得数据
		let input = this.validateData(rules);

		let service = new NewsService();
		let list = await service.getHomeNewsList(input);

		for (let k in list) {
			list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D');
		}

		return this.transNewsList(list);

	}


	/** 资讯列表 */
	async getNewsList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			cateId: 'string',
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

		for (let k in list) {
			list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D');
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