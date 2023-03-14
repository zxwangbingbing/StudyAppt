const behavior = require('../../../../../comm/behavior/my_fav_bh.js');
const ProjectBiz = require('../../../biz/project_biz.js');

Page({

	behaviors: [behavior],

	onReady: function () { 
		ProjectBiz.initPage(this);
	},
})