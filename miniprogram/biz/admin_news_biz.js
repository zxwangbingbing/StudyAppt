/**
 * Notes: 资讯后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-11-14 07:48:00 
 */

const cloudHelper = require('../helper/cloud_helper.js');
const dataHelper = require('../helper/data_helper.js');
const pageHelper = require('../helper/page_helper.js');
const setting = require('../setting/setting.js');

class AdminNewsBiz {

	// 提取简介
	static getDesc(desc, content) {
		if (desc) return dataHelper.fmtText(desc, 100);
		if (!Array.isArray(content)) return desc;

		for (let k in content) {
			if (content[k].type == 'text') return dataHelper.fmtText(content[k].val, 100);
		}
		return desc;
	}

	/** 
	 * 图片上传
	 * @param {string} newsId 
	 * @param {Array} imgList  图片数组
	 */
	static async updateNewsPic(newsId, imgList) {

		// 图片上传到云空间
		imgList = await cloudHelper.transTempPics(imgList, setting.NEWS_PIC_PATH, newsId);

		// 更新本记录的图片信息
		let params = {
			newsId: newsId,
			imgList: imgList
		}

		try {
			// 更新数据 从promise 里直接同步返回
			let res = await cloudHelper.callCloudSumbit('admin/news_update_pic', params);
			return res.data.urls;
		} catch (err) {
			console.error(err);
		}
	}


	/** 
	 * 富文本中的图片上传
	 * @param {string} newsId 
	 * @param {Array} content  富文本数组
	 */
	static async updateNewsCotnentPic(newsId, content, that) {
		let imgList = [];
		for (let k in content) {
			if (content[k].type == 'img') {
				imgList.push(content[k].val);
			}
		}

		// 图片上传到云空间
		imgList = await cloudHelper.transTempPics(imgList, setting.NEWS_PIC_PATH, newsId);

		// 更新图片地址
		let imgIdx = 0;
		for (let k in content) {
			if (content[k].type == 'img') {
				content[k].val = imgList[imgIdx];
				imgIdx++;
			}
		}

		// 更新本记录的图片信息
		let params = {
			newsId,
			content
		}

		try {
			// 更新数据 从promise 里直接同步返回
			await cloudHelper.callCloudSumbit('admin/news_update_content', params);
			that.setData({
				formContent: content
			});
		} catch (e) {
			console.error(e);
			return false;
		}

		return true;
	}

	static getCateName(cateId) {
		let skin = pageHelper.getSkin();
		let cateList = dataHelper.getSelectOptions(skin.NEWS_CATE);

		for (let k in cateList) {
			if (cateList[k].val == cateId) return cateList[k].label;
		}
		return '';
	}


	/** 取得分类 */
	static async getCateList() {
		let skin = pageHelper.getSkin();

		let cateList = dataHelper.getSelectOptions(skin.NEWS_CATE);

		let arr = [];
		for (let k in cateList) {
			arr.push({
				label: cateList[k].label,
				type: 'cateId',
				val: cateList[k].val, //for options
				value: cateList[k].val, //for list
			})
		}
		return arr;
	}

	/** 表单初始化相关数据 */
	static async initFormData(id = '') {
		let cateIdOptions = await AdminNewsBiz.getCateList();

		return {
			id,

			contentDesc: '',

			// 分类
			cateIdOptions,

			// 图片数据 
			imgList: [],


			// 表单数据 
			formType: 0, //类型 
			formOrder: 9999,
			formTitle: '',
			formDesc: '',
			formUrl: '',
			formContent: [],
			formCateId: '',
		}

	}

}


/** 表单校验  本地 */
AdminNewsBiz.CHECK_FORM = {
	title: 'formTitle|must|string|min:4|max:50|name=标题',
	cateId: 'formCateId|must|id|name=分类',
	order: 'formOrder|must|int|min:1|max:9999|name=排序号',
	desc: 'formDesc|string|min:10|max:200|name=简介',
	type: 'formType|must|int|in:0,1|name=是否外部文章'
};

/** 表单校验  外部 */
AdminNewsBiz.CHECK_FORM_OUT = {
	title: 'formTitle|must|string|min:4|max:50|name=标题',
	cateId: 'formCateId|must|id|name=分类',
	order: 'formOrder|must|int|min:1|max:9999|name=排序号',
	desc: 'formDesc|string|min:10|max:200|name=简介',
	type: 'formType|must|int|in:0,1|name=是否外部文章',
	url: 'formUrl|must|string|min:10|max:300|name=外部链接地址',
};

module.exports = AdminNewsBiz;