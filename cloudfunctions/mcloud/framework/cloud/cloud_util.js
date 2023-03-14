/**
 * Notes: 云基本操作模块
 * Ver : CCMiniCloud Framework 2.3.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-09-05 04:00:00 
 */
const cloudBase = require('./cloud_base.js');

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

async function handlerCloudFilesForForms(oldForms, newsForms) {
	let oldFiles = [];
	let newFiles = [];

	for (let k = 0; k < oldForms.length; k++) {
		if (oldForms[k].type == 'image')
			oldFiles = oldFiles.concat(oldForms[k].val);
		else if (oldForms[k].type == 'content') {
			let contentVal = oldForms[k].val;
			for (let n in contentVal) {
				if (contentVal[n].type == 'img')
					oldFiles.push(contentVal[n].val);
			}

		}
	}

	for (let j in newsForms) {
		if (newsForms[j].type == 'image')
			newFiles = newFiles.concat(newsForms[j].val);
		else if (newsForms[j].type == 'content') {
			let contentVal = newsForms[j].val;
			for (let m in contentVal) {
				if (contentVal[m].type == 'img')
					newFiles.push(contentVal[m].val);
			}

		}
	}

	await handlerCloudFiles(oldFiles, newFiles);
}

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
		}

	}

	return newFiles;
}

async function deleteFiles(list) {
	if (!list) return;
	if (!Array.isArray(list)) list = [list];
	if (list.length == 0) return;

	const cloud = cloudBase.getCloud();
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
	handlerCloudFilesByRichEditor,
	handlerCloudFilesForForms
}