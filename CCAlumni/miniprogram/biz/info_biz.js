/**
 * Notes: 资讯模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('./base_biz.js');
const cloudHelper = require('../helper/cloud_helper.js');
const helper = require('../helper/helper.js');
const setting = require('../helper/setting.js');

class InfoBiz extends BaseBiz {


	/**
	 * 表单初始化相关数据
	 */
	static initFormData(id = '') {

		return {
			id,

			// 分类
			typeOptions: InfoBiz.TYPE_OPTIONS,

			// 有效期 
			expireStart: helper.time('Y-M-D'),
			expireEnd: helper.time('Y-M-D', setting.INFO_MAX_EXPIRE),

			// 图片数据
			imgMax: setting.INFO_MAX_PIC,
			imgList: [],


			// 表单数据 
			formTypeIndex: 0,
			formTitle: '',
			formContent: '',
			formExpireTime: helper.time('Y-M-D'),
			formRegion: setting.INFO_DEFAULT_REGION
		}

	}

	/** 
	 * 图片上传
	 * @param {string} infoId 
	 * @param {Array} imgList  图片数组
	 */
	static async updateInfoPic(infoId, imgList) {

		// 图片上传到云空间
		imgList = await cloudHelper.transTempPics(imgList, setting.INFO_PIC_DIR, infoId);

		// 更新本记录的图片信息
		let params = {
			infoId: infoId,
			imgList: imgList
		}

		try {
			// 更新数据 从promise 里直接同步返回
			let res = await cloudHelper.callCloudSumbit('info/update_pic', params);
			return res.data.urls;
		} catch (e) {}
	}

	/**
	 * 搜索菜单设置
	 */
	static getSearchMenu() {

		let sortItem1 = [{
			label: '综合排序',
			type: '',
			value: 0
		}];

		// 分类
		let sortItem2 = [{
			label: '所有分类',
			type: '',
			value: 0
		}];
		for (let k in InfoBiz.TYPE_OPTIONS){
			sortItem2.push(
				{
					label: InfoBiz.TYPE_OPTIONS[k],
					type: 'type',
					value: InfoBiz.TYPE_OPTIONS[k],
				}
			)
		}   

		let sortItems = [sortItem2];
		let sortMenus = [{
				label: '最新',
				type: 'sort',
				value: 'new'
			},
			{
				label: '最热',
				type: 'sort',
				value: 'view'
			}, 
			{
				label: '全部',
				type: '',
				value: ''
			}
		]

		return {
			sortItems,
			sortMenus
		}

	}
}
/**
 * 分类
 */
InfoBiz.TYPE_OPTIONS = "资源合作,活动聚会,创业合作,招聘猎头,求职,企业推介,供应采购,商务合作,服务咨询,其他".split(',');

//表单校验
InfoBiz.CHECK_FORM = {
	title: 'formTitle|required|string|min:5|max:50|name=互助标题',
	type: 'formType|required|string|min:2|max:10|name=互助分类',
	expireTime: 'formExpireTime|required|date|name=有效期',
	region: 'formRegion|required|array|len:3|name=有效区域',
	content: 'formContent|required|string|min:10|max:50000|name=详细描述'
};

module.exports = InfoBiz;