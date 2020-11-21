 /**
 * Notes: 通用页面操作类库
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const helper = require('../helper/helper.js');

/**
 *  获取父页面
 * @param {*} deep  1=当前 2=父页 3=父父页
 */
function getPrevPage(deep = 2) {
	let pages = getCurrentPages();
	let prevPage = pages[pages.length - deep]; //上一个页面 
	return prevPage;
}

/**
 * 修改当前/父页面的某个列表节点
 * @param {*} id 主键
 * @param {*} valName 被修改的字段名
 * @param {*} val  被修改的值 
 * @param {*} list   数据集
 * @param {*} idName 主键名
 */
function modifyListNode(id, list, valName, val, idName = '_id') {

	if (!list || !Array.isArray(list)) return false;
	let pos = list.findIndex(item => item[idName] === id);
	if (pos > -1) {
		list[pos][valName] = val;
		return true;
	}
	return false;
}

/**
 * 修改当前/父页面的某个列表节点
 * @param {*} id 主键
 * @param {*} valName 被修改的字段名
 * @param {*} val  被修改的值
 * @param {*} deep  1=当前 2=父页 3=父父页
 * @param {*} listName   数据集名
 * @param {*} idName 主键名
 */
function modifyPrevPageListNode(id, valName, val, deep = 2, listName = 'dataList', idName = '_id') {
	let prevPage = getPrevPage(deep);
	if (!prevPage) return;

	let dataList = prevPage.data[listName];
	if (!dataList) return;

	let list = dataList['list'];
	if (modifyListNode(id, list, valName, val, idName)) {
		prevPage.setData({
			[listName + '.list']: list
		});
	}
}

/**
 * 从记录数组里删除某个节点
 * @param {*} id 
 * @param {*} list 
 * @param {*} idName 
 */
function delListNode(id, list, idName = '_id') {
	if (!list || !Array.isArray(list)) return false;
	let pos = list.findIndex(item => item[idName] === id);
	if (pos > -1) {
		list.splice(pos, 1);
		return true;
	}
	return false;
}


/**
 * 删除当前/父页面的某个列表节点
 * @param {*} id 主键
 * @param {*} deep 1=当前 2=父页 3=父父页
 * @param {*} listName  数据集名
 * @param {*} idName  主键名
 */
function delPrevPageListNode(id, deep = 2, listName = 'dataList', idName = '_id') {
	let prevPage = getPrevPage(deep);
	let dataList = prevPage.data[listName];
	if (!dataList) return;

	let list = dataList['list'];
	let total = dataList['total'] - 1;
	if (delListNode(id, list, idName)) {
		prevPage.setData({
			[listName + '.list']: list,
			[listName + '.total']: total
		});
	}

}

/**
 * 刷新当前/父页面的某个列表节点
 * @param {*} deep  1=当前 2=父页 3=父父页
 * @param {*} listName  数据集名
 * @param {*} listFunc  翻页函数名
 */
async function refreshPrevListNode(deep = 2, listName = 'dataList', listFunc = '_getList') {
	let prevPage = getPrevPage(deep);
	let dataList = prevPage.data[listName];
	if (!dataList) return;
	await prevPage[listFunc]();
}

/**
 * 回到顶部测算
 */
function scrollTop(e, that) {
	if (e.scrollTop > 100) {
		that.setData({
			topShow: true
		});
	} else {
		that.setData({
			topShow: false
		});
	}
}

/**
 * 选择图片
 * @param {*} that 
 * @param {*} max  最大上传上限
 * @param {*} imgListName  图片数组名
 */
function chooseImage(that, max = 4, imgListName = 'imgList') {
	wx.chooseImage({
		count: max, //默认9
		sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
		sourceType: ['album', 'camera'], //从相册选择
		success: async (res) => {
			that.setData({
				[imgListName]: that.data[imgListName].concat(res.tempFilePaths)
			});
		}
	});
}

/**
 * 删除图片
 * @param {*} that 
 * @param {*} idx  被删除图片索引
 * @param {*} imgListName  图片数组名
 */
function delImage(that, idx, imgListName = 'imgList') {
	let callback = function () {
		that.data[imgListName].splice(idx, 1);
		that.setData({
			[imgListName]: that.data[imgListName]
		})
	}
	showConfirm('确定要删除该图片吗？', callback);
}

/**
 * 图片预览
 * @param {*} that 
 * @param {*} url 
 * @param {*} imgListName  图片数组名
 */
function previewImage(that, url, imgListName = 'imgList') {
	// 图片预览
	wx.previewImage({
		urls: that.data[imgListName],
		current: url
	});
}


/**
 * 表单的双向数据绑定
 * @param {*} 页面 
 * @param {*} 事件 
 */
function model(that, e) {
	let item = e.currentTarget.dataset.item;
	that.setData({
		[item]: e.detail.value
	})
}

/**
 * 无提示成功，同时做后续处理
 */
function showNoneToast(title = '操作完成', duration = 1500, callback) {
	wx.showToast({
		title: title,
		icon: 'none',
		duration: duration,
		success: function () {
			callback && (setTimeout(() => {
				callback();
			}, duration));
		}
	});
}

/**
 * 加载中，同时做后续处理
 */
function showLoadingToast(title = '加载中', duration = 1500, callback) {
	wx.showToast({
		title: title,
		icon: 'loading',
		duration: duration,
		success: function () {
			callback && (setTimeout(() => {
				callback();
			}, duration));
		}
	});
}

/**
 * 提示成功，同时做后续处理
 */
function showSuccToast(title = '操作成功', duration = 1500, callback) {
	wx.showToast({
		title: title,
		icon: 'success',
		duration: duration,
		success: function () {
			callback && (setTimeout(() => {
				callback();
			}, duration));
		}
	});
}

/**
 * 二次确认操作
 */
function showConfirm(title = '确定要删除吗？', callback) {
	wx.showModal({
		title: '',
		content: title,
		cancelText: '取消',
		confirmText: '确定',
		success: res => {
			if (res.confirm) {
				callback && callback();
			}
		}
	})
}

function showModal(content, title = '温馨提示', callback) {
	wx.showModal({
		title: '温馨提示',
		content: content,
		showCancel: false,
		success(res) {
			callback && callback();
		}
	});
}

/**
 * 页面赋值
 * @param {*} that 
 * @param {*} data 
 */
function setPageData(that, data) {
	// 删除页面保留数据
	if (helper.isDefined(data['__webviewId__']))
		delete data['__webviewId__'];

	that.setData(data);
}
/**
 * 配合搜索列表响应监听
 * @param {*} that 
 */
function commListListener(that, e) {
	if (helper.isDefined(e.detail.search))
		that.setData({
			search: '',
			sortType: '',
		});
	else {
		that.setData({
			dataList: e.detail.dataList, 
		});
		if (e.detail.sortType)
			that.setData({ 
				sortType: e.detail.sortType,
			});
	}
		
}

function bindShowModalTap(e) {
	this.setData({
		modalName: e.currentTarget.dataset.modal
	})
}

function bindHideModalTap(e) {
	this.setData({
		modalName: null
	})
}

function setSkin(that) {
	wx.setNavigationBarColor({
		frontColor: '#ffffff',
		backgroundColor: '#0E9489'
	});
	that.setData({
		skin: 'skin2'
	});
}

/**
 * 控制回页首按钮
 * @param {*} e 
 */
function showTopBtn(e, that) {
	if (e.scrollTop > 100) {
		that.setData({
			topBtnShow: true
		});
	} else {
		that.setData({
			topBtnShow: false
		});
	}
}

/**
 * 回到顶部
 */
function top() {
	wx.pageScrollTo({
		scrollTop: 0
	})
}

// 跳到锚点
function anchor(id, that) {  
	let query = wx.createSelectorQuery().in(that);
	query.selectViewport().scrollOffset()
	//#comm 跳转到指定id位置
	query.select('#' + id).boundingClientRect();
	query.exec(function (res) {
		var miss = res[0].scrollTop + res[1].top - 10;
		wx.pageScrollTo({
			scrollTop: miss,
			duration: 300
		});
	});
}

/**
 * 页面跳转/图片预览
 */
function url(e, that) {
	let url = e.currentTarget.dataset.url;
	let type = e.currentTarget.dataset.type;

	if (type && type == 'redirect')
		wx.redirectTo({
			url
		});
	else if (type && type == 'switch')
		wx.switchTab({
			url
		});
	else if (type && type == 'back')
		wx.navigateBack({
			delta: 0,
		});
	else if (helper.isDefined(e.currentTarget.dataset.phone))
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.phone
		});
	else if (type && type == 'anchor') {
		//锚点
		anchor(url, that);
	}
	else if (type && type == 'img' || type && type == 'image') {
		if (url.indexOf('qlogo') > -1) { //微信大图
			url = url.replace('/132', '/0');
		}
		let urls = [url];

		if (helper.isDefined(e.currentTarget.dataset.imgs))
			urls = e.currentTarget.dataset.imgs;
			
		wx.previewImage({
			current: url, // 当前显示图片的http链接
			urls
		})
	} else
		wx.navigateTo({
			url
		})
}

function getId(that, options, idName = 'id') {
	let id = options[idName];
	if (!id) return false;

	that.setData({
		[idName]: id
	});
	return true;

}

// 页面提示
function hint(msg, type='redirect') {
	if (type == 'reLaunch')
		wx.reLaunch({
			url: '/pages/about/hint?msg=' + encodeURIComponent(msg),
		});
	else 
		wx.redirectTo({
			url: '/pages/about/hint?msg=' + encodeURIComponent(msg),
		});
}

//  重新加载
function reload(){
	wx.redirectTo({
		url: '/pages/my/reload/my_reload',
	  });
}

module.exports = {
	getPrevPage,
	modifyListNode,
	modifyPrevPageListNode,
	delListNode,
	delPrevPageListNode,
	refreshPrevListNode,

	scrollTop,

	chooseImage,
	previewImage,
	delImage,

	showSuccToast,
	showNoneToast,
	showLoadingToast,
	showConfirm,
	showModal,
	setPageData,
	
	hint,
	reload,
	
	commListListener,

	bindShowModalTap,
	bindHideModalTap,
	showTopBtn,

	getId, //获取id参数

	model, // 双向数据绑定
	top, // 回顶部
	url, // 跳转 
	anchor, //锚点跳转

	setSkin
}