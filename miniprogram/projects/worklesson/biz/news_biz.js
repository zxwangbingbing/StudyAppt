/**
 * Notes: 资讯模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js');
const dataHelper = require('../../../helper/data_helper.js');
const projectSetting = require('../public/project_setting.js');

class NewsBiz extends BaseBiz {

	/** 取得分类 */
	static getCateList() {
		let cateList = projectSetting.NEWS_CATE;

		let arr = [];
		for (let k = 0; k < cateList.length; k++) {
			arr.push({
				label: cateList[k].title,
				type: 'cateId',

				id: cateList[k].id,
				title: cateList[k].title,
				style: cateList[k].style,

				val: cateList[k].id, //for options
				value: cateList[k].id, //for list
			})
		}
		return arr;
	}


	static setCateTitle(cateId = null, that) {

		// 获取当前小程序的页面栈
		let pages = getCurrentPages();
		// 数组中索引最大的页面--当前页面
		let currentPage = pages[pages.length - 1];
		// 附加参数 
		if (currentPage.options && currentPage.options.id) {
			cateId = currentPage.options.id;
		}
		let cateList = dataHelper.getSelectOptions(projectSetting.NEWS_CATE);
		for (let k = 0; k < cateList.length; k++) {
			if (cateList[k].val == cateId) {
				wx.setNavigationBarTitle({
					title: cateList[k].label
				});

				if (cateList[k].ext) { //样式
					that.setData({
						listMode: cateList[k].ext
					});
				} else {
					that.setData({
						listMode: 'leftbig'
					});
				}

			}
		}

	}

	/** 搜索菜单设置 */
	static async getSearchMenu() {
		let sortMenus = [{
			label: '全部',
			type: '',
			value: ''
		}];
		let sortMenusAfter = [{
			label: '最新',
			type: 'sort',
			value: 'new'
		},];
		let sortItems = [];

		sortMenus = sortMenus.concat(sortMenusAfter);

		return {
			sortItems,
			sortMenus
		}
	}
}

module.exports = NewsBiz;