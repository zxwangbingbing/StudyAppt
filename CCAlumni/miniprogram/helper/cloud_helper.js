 /**
 * Notes: 云操作类库
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

 const helper = require('./helper.js');
 const cacheHelper = require('./cache_helper.js');
 const comm = require('../helper/comm.js');
 const setting = require('../helper/setting.js');

 const CODE = {
 	SUCC: 200,
 	SVR: 500, //服务器错误  
 	LOGIC: 1600, //逻辑错误 
 	DATA: 1301, // 数据校验错误 
 	HEADER: 1302, // header 校验错误  
 	NOT_USER: 1303, // 用户不存在 
 	USER_EXCEPTION: 1304, // 用户异常 
 	MUST_LOGIN: 1305, //需要登录 
 	USER_CHECK: 1306, //用户审核中

 	ADMIN_ERROR: 2001 //管理员错误
 };

 // 云函数提交请求(直接异步，无提示)
 function callCloudSumbitAsync(router, params = {}, options) {
 	if (!helper.isDefined(options)) options = {
 		hint: false
 	}
 	if (!helper.isDefined(options.hint)) options.hint = false;
 	return callCloud(router, params, options)
 }

 // 云函数提交请求(异步)
 async function callCloudSumbit(router, params = {}, options) {
 	if (!helper.isDefined(options)) options = {
 		title: '提交中..'
 	}
 	if (!helper.isDefined(options.title)) options.title = '提交中..';
 	return await callCloud(router, params, options);
 }

 // 云函数获取数据请求(异步)
 async function callCloudData(router, params = {}, options) {
 	if (!helper.isDefined(options)) options = {
 		title: '加载中..'
 	}

 	if (!helper.isDefined(options.title)) options.title = '加载中..';
 	let result = await callCloud(router, params, options).catch(err => {
 		return null; // 异常情况下返回空数据
 	});

 	// 直接提取数据 返回值有[], {} 两种形式，如果为空{} ,返回 null
 	if (result && helper.isDefined(result.data)) {
 		result = result.data;
 		if (Array.isArray(result)) {
 			// 数组处理
 		} else if (Object.keys(result).length == 0) {
 			result = null; //对象处理
 		}

 	}
 	return result;
 }

 // 云函数请求(异步)
 function callCloud(router, params = {}, options) {

 	let title = '加载中';
 	let hint = true; //数据请求时是否mask提示 

 	// 标题
 	if (helper.isDefined(options) && helper.isDefined(options.title))
 		title = options.title;

 	// 是否给提示
 	if (helper.isDefined(options) && helper.isDefined(options.hint))
 		hint = options.hint;

 	// 是否输出错误并处理
 	if (helper.isDefined(options) && helper.isDefined(options.doFail))
 		doFail = options.doFail;

 	if (hint) {
 		if (title == 'bar')
 			wx.showNavigationBarLoading();
 		else
 			wx.showLoading({
 				title: title,
 				mask: true
 			})
 	}



 	let token = '';
 	// 管理员token
 	if (router.indexOf('admin/') > -1) {
 		let admin = cacheHelper.get(comm.CACHE_ADMIN);
 		if (admin && admin.token) token = admin.token;
 	} else {
 		//正常用户
 		let user = cacheHelper.get(comm.CACHE_TOKEN);
 		if (user && user.id) token = user.id;
 	}

 	return new Promise(function (resolve, reject) {
 		wx.cloud.callFunction({
 			name: 'cloud',
 			data: {
 				router,
 				token,
 				params
 			},
 			success: function (res) {
 				if (res.result.code == CODE.LOGIC || res.result.code == CODE.DATA) {
 					// 逻辑错误&数据校验错误 
 					wx.showModal({
 						title: '温馨提示',
 						content: res.result.msg,
 						showCancel: false
 					});

 					reject(res.result);
 					return;
 				} else if (res.result.code == CODE.USER_EXCEPTION || res.result.code == CODE.USER_CHECK) {
 					// 用户状态异常 或者待审核
 					reject(res.result);
 					return;
 				} else if (res.result.code == CODE.ADMIN_ERROR) {
 					// 后台登录错误
 					wx.redirectTo({
 						url: '/pages/admin/index/admin_login',
 					});
 					//reject(res.result);
 					return;
 				} else if (res.result.code != CODE.SUCC) {
 					if (hint) {
 						wx.showModal({
 							title: '温馨提示',
 							content: '系统开小差了，请稍后重试',
 							showCancel: false
 						});
 					}
 					reject(res.result);
 					return;
 				}

 				resolve(res.result);
 			},
 			fail: function (res) {
 				if (hint) {
 					wx.showModal({
 						title: '',
 						content: '网络故障，请稍后重试',
 						showCancel: false
 					});
 				}
 				reject(res.result);
 				return;
 			},
 			complete: function (res) {
 				if (hint) {
 					if (title == 'bar')
 						wx.hideNavigationBarLoading();
 					else
 						wx.hideLoading();
 				}
 				// complete
 			}
 		});
 	});
 }

 /**
  * 数据列表请求
  * @param {*} that 
  * @param {*} listName 
  * @param {*} router 
  * @param {*} params 
  * @param {*} options 
  * @param {*} isReverse  是否倒序
  */
 async function dataList(that, listName, router, params, options, isReverse = false) {

 	console.log('dataList begin');

 	if (!helper.isDefined(that.data[listName]) || !that.data[listName]) {
 		let data = {};
 		data[listName] = {
 			page: 1,
 			size: 20,
 			list: [],
 			count: 0,
 			total: 0,
 			oldTotal: 0
 		};
 		that.setData(data);
 	}

 	//改为后台默认控制
 	//if (!helper.isDefined(params.size))
 	//	params.size = 20;

 	if (!helper.isDefined(params.isTotal))
 		params.isTotal = true;

 	let page = params.page;
 	let count = that.data[listName].count;
 	if (page > 1 && page > count) {
 		wx.showToast({
 			icon: 'none',
 			title: '没有更多数据了',
 		});
 		return;
 	}

 	// 删除未赋值的属性
 	for (let k in params) {
 		if (!helper.isDefined(params[k]))
 			delete params[k];
 	}

 	// 记录当前老的总数
 	let oldTotal = 0;
 	if (that.data[listName] && that.data[listName].total)
 		oldTotal = that.data[listName].total;
 	params.oldTotal = oldTotal;

 	// 云函数调用 
 	await callCloud(router, params, options).then(function (res) {
 		console.log('cloud begin');

 		// 数据合并
 		let dataList = res.data;
 		let tList = that.data[listName].list;

 		if (dataList.page == 1) {
 			tList = res.data.list;
 		} else if (dataList.page > that.data[listName].page) { //大于当前页才能更新
 			if (isReverse)
 				tList = res.data.list.concat(tList);
 			else
 				tList = tList.concat(res.data.list);
 		} else
 			return;

 		dataList.list = tList;
 		let listData = {};
 		listData[listName] = dataList;

 		that.setData(listData);

 		console.log('cloud END');
 	}).catch(err => {
 		console.log(err)
 	});

 	console.log('dataList END');

 }

 /**
  * 历史图片上传到云空间
  * @param {*} imgList 
  * @param {*} dir 
  * @param {*} id 
  */
 async function transTempPics(imgList, dir, id) {

 	for (let i = 0; i < imgList.length; i++) {

 		let filePath = imgList[i];
 		let ext = filePath.match(/\.[^.]+?$/)[0];

 		// 是否为临时文件
 		if (filePath.includes('tmp')) {
 			let rd = helper.genRandomNum(100000, 999999);
 			await wx.cloud.uploadFile({
 				cloudPath: dir + id + '_' + rd + ext,
 				filePath: filePath, // 文件路径
 			}).then(res => {
 				imgList[i] = res.fileID;
 			}).catch(error => {
 				// handle error TODO:剔除图片
 			})
 		}
 	}

 	return imgList;
 }

 function initCloud() {
 	if (!wx.cloud) {
 		console.error('请使用 2.2.3 或以上的基础库以使用云能力');
 		return false;
 	} else {
 		wx.cloud.init({
 			// env 参数说明：
 			//   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
 			//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
 			//   如不填则使用默认环境（第一个创建的环境）
 			env: setting.CLOUD_ID,
 			traceUser: false,
 		});
 		return true;
 	}
 	return false;
 }

 module.exports = {
 	CODE,
 	dataList,
 	callCloud,
 	callCloudSumbit,
 	callCloudData,
 	callCloudSumbitAsync,
 	initCloud,
 	transTempPics
 }