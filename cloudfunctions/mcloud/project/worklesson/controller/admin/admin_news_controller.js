/**
 * Notes: 资讯模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');

const AdminNewsService = require('../../service/admin/admin_news_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const contentCheck = require('../../../../framework/validate/content_check.js');
const NewsModel = require('../../model/news_model.js');

class AdminNewsController extends BaseProjectAdminController {

	/** 置顶与排序设定 */
	async sortNews() {
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

	/** 首页设定 */
	async vouchNews() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			vouch: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		await service.vouchNews(input.id, input.vouch);
	}

	/** 资讯状态修改 */
	async statusNews() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		await service.statusNews(input.id, input.status);

	}

	/** 资讯列表 */
	async getAdminNewsList() {
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
		let result = await service.getAdminNewsList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D h:m');
			list[k].NEWS_EDIT_TIME = timeUtil.timestamp2Time(list[k].NEWS_EDIT_TIME, 'Y-M-D h:m');

			if (list[k].NEWS_OBJ && list[k].NEWS_OBJ.desc)
				delete list[k].NEWS_OBJ.desc;
		}
		result.list = list;

		return result;

	}

	/**
	 * 更新富文本信息
	 */
	async updateNewsContent() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			content: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		return await service.updateNewsContent(input);
	}


	/** 发布资讯信息 */
	async insertNews() {
		await this.isAdmin();

		// 数据校验 
		let rules = {
			title: 'must|string|min:4|max:50|name=标题',
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名',
			order: 'must|int|min:0|max:9999|name=排序号',
			desc: 'must|string|min:10|max:200|name=简介',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		let result = await service.insertNews(input);

		this.logNews('添加了文章《' + input.title + '》');

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

		let rules = {
			id: 'must|id',
			title: 'must|string|min:4|max:50|name=标题',
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类',
			order: 'must|int|min:0|max:9999|name=排序号',
			desc: 'string|min:10|max:200|name=简介',
			forms: 'array|name=表单',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		let result = service.editNews(input);

		this.logNews('修改了文章《' + input.title + '》');

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

		let title = await NewsModel.getOneField(input.id, 'NEWS_TITLE');

		let service = new AdminNewsService();
		await service.delNews(input.id);

		if (title)
			this.logNews('删除了文章《' + title + '》');

	}

	/**
	 * 更新图片信息
	 * @returns 返回 urls数组 [url1, url2, url3, ...]
	 */
	async updateNewsPic() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			imgList: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		return await service.updateNewsPic(input);
	}

	/** 更新图片信息 */
	async updateNewsForms() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		return await service.updateNewsForms(input);
	}

}

module.exports = AdminNewsController;