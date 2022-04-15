 /**
  * Notes: 表单通用类库
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux@qq.com
  * Date: 2021-02-28 07:48:00 
  */


 /**
  * model变表单
  * @param {*} model 
  */
 function model2Form(model) {
 	let newModel = {};
 	for (let k in model) {
 		let arr = k.split('_');
 		let result = '';
 		for (let i = 1; i < arr.length; i++) {
 			let name = arr[i].toLowerCase();
 			name = name.charAt(0).toUpperCase() + name.slice(1);
 			result = result + name;
 		}

 		newModel['form' + result] = model[k];
 	}
 	return newModel;
 }

 // picker表单赋值到页面data
 function setOptions(that, options, name, val) {
 	let idx = options.indexOf(val);
 	idx = (idx < 0) ? 0 : idx;
 	that.setData({
 		[name]: idx
 	})
 }

 module.exports = {
 	model2Form,
 	setOptions
 }