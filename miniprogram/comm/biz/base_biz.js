/**
 * Notes: 基础模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-11-14 07:48:00 
 */

const pageHelper = require('../../helper/page_helper.js');

class BaseBiz {

	static getCateName(cateId, cateList) {
		for (let k = 0; k < cateList.length; k++) {
			if (cateList[k].id == cateId) {
				return cateList[k].title;
			}
		}
		return '';
	}

	static getCateList(cateList) {

		let arr = [];
		for (let k = 0; k < cateList.length; k++) {
			arr.push({
				label: cateList[k].title,
				type: 'cateId',
				val: cateList[k].id, //for options form
				value: cateList[k].id, //for list menu
			})
		}

		return arr;
	}

	static setCateTitle(cateList, cateId = null) {

		let curPage = pageHelper.getPrevPage(1);
		if (!curPage) return;

		if (!cateId) {
		if (curPage.options && curPage.options.id) {
			cateId = curPage.options.id;
		}
		}

		for (let k = 0; k < cateList.length; k++) {
			if (cateList[k].id == cateId) {
				wx.setNavigationBarTitle({
					title: cateList[k].title
				});
				curPage.setData({
					listMode: cateList[k].style || ''
				})
				return;
			}
		}

	}
}

module.exports = BaseBiz;