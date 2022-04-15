/**
 * Notes: 资讯后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-07-11 07:48:00 
 */

const BaseAdminService = require('./base_admin_service.js');

const dataUtil = require('../../../framework/utils/data_util.js');
const util = require('../../../framework/utils/util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');

const NewsModel = require('../../model/news_model.js');

class AdminNewsService extends BaseAdminService {

	/**添加资讯 */
	async insertNews(adminId, {
		title,
		cateId, //分类
		cateName,
		order,
		type = 0, //类型 
		desc = '',
		url = '', //外部链接

	}) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**删除资讯数据 */
	async delNews(id) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**获取资讯信息 */
	async getNewsDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let news = await NewsModel.getOne(where, fields);
		if (!news) return null;

		return news;
	}

	/**
	 * 更新富文本详细的内容及图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsContent({
		newsId,
		content // 富文本数组
	}) {

		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/**
	 * 更新资讯图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsPic({
		newsId,
		imgList // 图片数组
	}) {

		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	/**更新资讯数据 */
	async editNews({
		id,
		title,
		cateId, //分类
		cateName,
		order,
		type = 0, //类型 
		desc = '',
		url = '', //外部链接
	}) {

		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**取得资讯分页列表 */
	async getNewsList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'NEWS_ORDER': 'asc',
			'NEWS_ADD_TIME': 'desc'
		};
		let fields = 'NEWS_TYPE,NEWS_URL,NEWS_TITLE,NEWS_DESC,NEWS_CATE_ID,NEWS_EDIT_TIME,NEWS_ADD_TIME,NEWS_ORDER,NEWS_STATUS,NEWS_CATE_NAME,NEWS_HOME';

		let where = {};

		if (util.isDefined(search) && search) {
			where.or = [{
				NEWS_TITLE: ['like', search]
			}, ];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId':
					// 按类型
					where.NEWS_CATE_ID = sortVal;
					break;
				case 'status':
					// 按类型
					where.NEWS_STATUS = Number(sortVal);
					break;
				case 'home':
					// 按类型
					where.NEWS_HOME = Number(sortVal);
					break;
				case 'sort':
					// 排序
					if (sortVal == 'view') {
						orderBy = {
							'NEWS_VIEW_CNT': 'desc',
							'NEWS_ADD_TIME': 'desc'
						};
					}
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

	/**修改资讯状态 */
	async statusNews(id, status) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**资讯置顶排序设定 */
	async sortNews(id, sort) {
		this.AppError('此功能暂不开放，如有需要请加作者微信：cclinux0730');
	}
}

module.exports = AdminNewsService;