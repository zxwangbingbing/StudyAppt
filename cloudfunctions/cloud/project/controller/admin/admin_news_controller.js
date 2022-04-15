/**
 * Notes: 资讯模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2021-07-11 10:20:00 
 */

const BaseAdminController = require('./base_admin_controller.js');

const AdminNewsService = require('../../service/admin/admin_news_service.js');

const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');
const LogModel = require('../../model/log_model.js');

class AdminNewsController extends BaseAdminController {

	/** 资讯排序 */
	async sortNews() { // 数据校验
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		await service.sortNews(input.id, input.sort);
	}

	/** 资讯状态修改 */
	async statusNews() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int|in:0,1,8',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		await service.statusNews(input.id, input.status);

	}

	/** 资讯列表 */
	async getNewsList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		let result = await service.getNewsList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D h:m');
			list[k].NEWS_EDIT_TIME = timeUtil.timestamp2Time(list[k].NEWS_EDIT_TIME, 'Y-M-D h:m');

		}
		result.list = list;

		return result;

	}

	/**
	 * 更新富文本信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsContent() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			newsId: 'must|id',
			content: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		return await service.updateNewsContent(input);
	}


	/** 发布资讯信息 */
	async insertNews() {
		await this.isAdmin();

		let rules = {};
		let type = this.getParameter('type');
		// 数据校验
		if (type == 0)
			rules = {
				title: 'must|string|min:4|max:50|name=标题',
				cateId: 'must|id|name=分类',
				cateName: 'must|string|name=分类',
				order: 'must|int|min:1|max:9999|name=排序号',
				desc: 'must|string|min:10|max:200|name=简介',
				type: 'must|int|in:0,1|name=是否外部文章'
			};
		else
			rules = {
				title: 'must|string|min:4|max:50|name=标题',
				cateId: 'must|id|name=分类',
				cateName: 'must|string|name=分类',
				order: 'must|int|min:1|max:9999|name=排序号',
				desc: 'must|string|min:10|max:200|name=简介',
				type: 'must|int|in:0,1|name=是否外部文章',
				url: 'must|string|min:10|max:300|name=外部链接地址',
			};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		let result = await service.insertNews(this._adminId, input);

		this.log('添加了文章《' + input.title + '》', LogModel.TYPE.NEWS);

		return result;

	}


	/** 获取资讯信息用于编辑修改 */
	async getNewsDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		return await service.getNewsDetail(input.id);

	}

	/** 编辑资讯 */
	async editNews() {
		await this.isAdmin();

		let rules = {};
		let type = this.getParameter('type');
		// 数据校验
		if (type == 0)
			rules = {
				id: 'must|id',
				title: 'must|string|min:4|max:50|name=标题',
				cateId: 'must|id|name=分类',
				cateName: 'must|string|name=分类',
				order: 'must|int|min:1|max:9999|name=排序号',
				desc: 'string|min:10|max:200|name=简介',
				type: 'must|int|in:0,1|name=是否外部文章'
			};
		else
			rules = {
				id: 'must|id',
				title: 'must|string|min:4|max:50|name=标题',
				cateId: 'must|id|name=分类',
				cateName: 'must|string|name=分类',
				order: 'must|int|min:1|max:9999|name=排序号',
				desc: 'string|min:10|max:200|name=简介',
				type: 'must|int|in:0,1|name=是否外部文章',
				url: 'must|string|min:10|max:300|name=外部链接地址',
			};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		let result = service.editNews(input);

		this.log('修改了文章《' + input.title + '》', LogModel.TYPE.NEWS);

		return result;
	}

	/** 删除资讯 */
	async delNews() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let name = await this.getNameBeforeLog('news', input.id);

		let service = new AdminNewsService();
		await service.delNews(input.id);

		this.log('删除了文章《' + name + '》', LogModel.TYPE.NEWS);

	}

	/**
	 * 更新图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsPic() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			newsId: 'must|id',
			imgList: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		return await service.updateNewsPic(input);
	}

}

module.exports = AdminNewsController;