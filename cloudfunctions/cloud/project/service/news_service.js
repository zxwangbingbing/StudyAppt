/**
 * Notes: 资讯模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-10-29 07:48:00 
 */

const BaseService = require('./base_service.js');
const util = require('../../framework/utils/util.js');
const NewsModel = require('../model/news_model.js');

class NewsService extends BaseService {

	/** 浏览资讯信息 */
	async viewNews(id) {

		let fields = '*';

		let where = {
			_id: id,
			NEWS_STATUS: 1
		}
		let news = await NewsModel.getOne(where, fields);
		if (!news) return null;



		return news;
	}


	/** 取得分页列表 */
	async getNewsList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		cateId, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'NEWS_ORDER': 'asc',
			'NEWS_ADD_TIME': 'desc'
		};
		let fields = 'NEWS_PIC,NEWS_VIEW_CNT,NEWS_TITLE,NEWS_DESC,NEWS_CATE_ID,NEWS_ADD_TIME,NEWS_ORDER,NEWS_STATUS,NEWS_CATE_NAME';

		let where = {};
		where.NEWS_STATUS = 1; // 状态 

		if (cateId && cateId !== '0') where.NEWS_CATE_ID = cateId;

		if (util.isDefined(search) && search) {
			where.NEWS_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'sort':
					// 排序 
					if (sortVal == 'new') {
						orderBy = {
							'NEWS_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		return await NewsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}


	/** 取得首页列表 */
	async getHomeNewsList() {
		let orderBy = {
			'NEWS_HOME': 'asc',
			'NEWS_ORDER': 'asc',
			'NEWS_ADD_TIME': 'desc'
		};
		let fields = 'NEWS_PIC,NEWS_TITLE,NEWS_DESC,NEWS_ADD_TIME';

		let where = {};
		where.NEWS_STATUS = 1; // 状态    

		return await NewsModel.getAll(where, fields, orderBy, 10);
	}


}

module.exports = NewsService;