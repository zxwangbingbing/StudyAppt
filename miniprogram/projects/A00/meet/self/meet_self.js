let behavior = require('../../../../behavior/meet_self_bh.js');
let PassortBiz = require('../../../../biz/passport_biz.js');
let skin = require('../../skin/skin.js');

Page({
	behaviors: [behavior], 

	onReady: function () { 
		PassortBiz.initPage({
			skin,
			that: this
		});
	},
})