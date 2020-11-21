/**
 * Notes: 内容审核
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const AppError = require('../handler/app_error.js'); 
const cloudBase = require('../cloud/cloud_base.js');
const config = require('../../comm/config.js'); 

/**
 * 校验图片信息
 * @param {*} 图片流buffer 
 */
async function checkImg(imgData, mine) {
	if (!config.CHECK_CONTENT) return;

	let cloud = cloudBase.getCloud();
	try {
		const result = await cloud.openapi.security.imgSecCheck({
			media: { 
				contentType: 'image/' + mine,
				value: Buffer.from(imgData, 'base64') // 这里必须要将小程序端传过来的进行Buffer转化,否则就会报错,接口异常
			}

		})
		console.log('imgcheck', result);
		if (!result || result.errCode !== 0) {
			throw new AppError('图片内容不合适，请修改');
		}

	} catch (err) {
		console.log('imgcheck ex', err);
		throw new AppError('图片内容不合适，请修改');
	}

}

/**
 * 把输入数据里的文本数据提交内容审核
 * @param {*} input 
 */
async function checkTextMulti(input) {
	if (!config.CHECK_CONTENT) return;

	let txt = '';
	for (let k in input) {
		if (typeof (input[k]) === 'string')
			txt += input[k];
	} 
	await checkText(txt);
}

/**
 * 校验文字信息
 * @param {*}  
 */
async function checkText(txt) {
	if (!config.CHECK_CONTENT) return;
	
	if (!txt) return;

	let cloud = cloudBase.getCloud();
	try {
		const result = await cloud.openapi.security.msgSecCheck({
			content: txt

		})
		// console.log('checkText', result);
		if (!result || result.errCode !== 0) {
			throw new AppError('文字内容不合适，请修改');
		}

	} catch (err) {
		console.log('checkText ex', err);
		throw new AppError('文字内容不合适，请修改');
	}

}

module.exports = {
	checkImg,
	checkTextMulti,
	checkText
}