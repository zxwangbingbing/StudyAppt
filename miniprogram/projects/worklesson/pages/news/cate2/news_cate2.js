let behavior = require('../../../../../comm/behavior/news_index_bh.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const NewsBiz = require('../../../biz/news_biz.js');


Page({
	behaviors: [behavior],

	onLoad: function (options) {
		ProjectBiz.initPage(this);
		this._setCate(NewsBiz.getCateList(), options, 2);

	},
})