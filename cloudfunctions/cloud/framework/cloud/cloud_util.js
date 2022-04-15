/**
 * Notes: 云基本操作模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-09-05 04:00:00 
 */
const cloudBase = require('./cloud_base.js');

/**
 * 高级日志记录错误
 * @param {*} method 
 * @param {*} err 
 */
function log(method, err, level = 'error') {
	const cloud = cloudBase.getCloud();
	const log = cloud.logger();
	log.error({
		method: method,
		errCode: err.code,
		errMsg: err.message,
		errStack: err.stack
	});
}
/**
 * 根据临时文件地址取得网络地址  
 * @param {*} fileID  
 * @returns {String}  
 */
async function getTempFileURLOne(fileID) {
	if (!fileID) return '';

	const cloud = cloudBase.getCloud();
	let result = await cloud.getTempFileURL({
		fileList: [fileID],
	})
	if (result && result.fileList && result.fileList[0] && result.fileList[0].tempFileURL)
		return result.fileList[0].tempFileURL;
	return '';
}

/**
 * 根据临时文件地址取得网络地址 
 * 用云文件 ID 换取真实链接，公有读的文件获取的链接不会过期，私有的文件获取的链接十分钟有效期。一次最多取 50 
 * @param {*} fileList 
 * @param {*} isValid 是否只取本次获取的合法的 
 * @returns {Array} 对象数组 [{cloudId:, url:}]
 */
async function getTempFileURL(tempFileList, isValid = false) {
	if (!tempFileList || tempFileList.length == 0) return [];

	const cloud = cloudBase.getCloud();
	let result = await cloud.getTempFileURL({
		fileList: tempFileList,
	})
	console.log(result);

	let list = result.fileList;
	let outList = [];
	for (let i = 0; i < list.length; i++) {
		let pic = {};
		if (list[i].status == 0) {
			//获取到地址的
			pic.url = list[i].tempFileURL;
			pic.cloudId = list[i].fileID;
			outList.push(pic)
		} else {
			//未获取到地址的（已经转换过的)
			if (!isValid) {
				pic.url = list[i].fileID; // fileID为URL, tempFileURL为空
				pic.cloudId = list[i].fileID;
				outList.push(pic)
			}
		}
	}
	return outList;
}

/**
 * 用后面的文件数组替换前面的，并删除已经不存在的FileID
 * @param {*} oldFiles  
 * @param {*} newFiles 
 * @returns [] 图片文件数组 [cloudId1,cloudId2,cloudId3...]
 */
async function handlerCloudFiles(oldFiles, newFiles) {
	//if (oldFiles.length == 0 && newFiles.length == 0) return [];

	const cloud = cloudBase.getCloud();
	for (let i = 0; i < oldFiles.length; i++) {
		let isDel = true;
		for (let j = 0; j < newFiles.length; j++) {
			if (oldFiles[i] == newFiles[j]) {
				// 从旧文件数组里 找到 新组 还存在的文件 ，则不删除
				isDel = false;
				break;
			}
		}
		// 新组里不存在，直接删除
		if (isDel && oldFiles[i]) { 
			let result = await cloud.deleteFile({
				fileList: [oldFiles[i]],
			});
			console.log(result);
		}

	}

	return newFiles;
}


/**
 * [富文本编辑器]用后面的文件数组替换前面的，并删除已经不存在的FileID
 * @param {*} oldFiles 
 * 格式 下同
	* [{
		cloudId: xxxxx
		url: yyyyyy
	* },....]
 * @param {*} newFiles 
 * @returns {Array} 对象数组 [{cloudId:, url:}]
 */
async function handlerCloudFilesByRichEditor(oldFiles, newFiles) {
	const cloud = cloudBase.getCloud();
	for (let i = 0; i < oldFiles.length; i++) {
		let isDel = true;
		for (let j = 0; j < newFiles.length; j++) {
			if (oldFiles[i].type == 'img' && newFiles[j].type == 'img' && oldFiles[i].val == newFiles[j].val) {
				// 从旧文件数组里 找到 新组 还存在的图片文件, 保存cloudID
				//newFiles[j].cloudId = oldFiles[i].cloudId;
				isDel = false;
				break;
			}
		}
		// 新组里不存在，直接删除
		if (isDel && oldFiles[i].type == 'img' && oldFiles[i].val) {

			let result = await cloud.deleteFile({
				fileList: [oldFiles[i].val],
			});
			console.log(result);
		}

	}

	return newFiles;
}

/**
 * 删除文件
 * @param {*} list 文件数组cloudid
 */
async function deleteFiles(list = []) {
	const cloud = cloudBase.getCloud();
	if (!Array.isArray(list) || list.length == 0) return;
	await cloud.deleteFile({
		fileList: list,
	});
}

module.exports = {
	log,
	getTempFileURL,
	getTempFileURLOne,
	deleteFiles,
	handlerCloudFiles,
	handlerCloudFilesByRichEditor
}