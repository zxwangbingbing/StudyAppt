/**
 * Notes: 小程序封装类库
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
 * Date: 2020-09-06 14:00:00 
 */
const cloudBase = require('../cloud/cloud_base.js');
const cloudUtil = require('../cloud/cloud_util.js');
const config = require('../../config/config');
 

// 消息长度截取
function fmtThing(str) { //20个以内字符,可汉字、数字、字母或符号组合
	return str.substr(0, 20);
}

function fmtCharacterString(str) { //32位以内数字、字母或符号
	return str.substr(0, 32);
}

function fmtPhrase(str) { //5个以内汉字
	return str.substr(0, 5);
}

 

/**
 * 发送一次性消息
 * @param {*} body 
 * @param {*} key 
 */
async function sendMiniOnceTempMsg(body, key = '') {
//	console.log('##sendOnceTempMsg[' + key + ']', body);
	let cloud = cloudBase.getCloud();
	try {
		// 默认参数
		body.lang = 'zh_CN';
		body.miniprogramState = 'formal';

		await cloud.openapi.subscribeMessage.send(body);
	} catch (err) {
		cloudUtil.log('##sendOnceTempMsg[' + key + ']', err);
	}
}
module.exports = {
	sendMiniOnceTempMsg, 

	fmtThing,
	fmtCharacterString,
	fmtPhrase
}