const pageHelper = require('../../../helper/page_helper');
const posterCmptHelper = require('../../public/poster/poster_cmpt_helper.js');
const FavBiz = require('../../../comm/biz/fav_biz.js');
const FootBiz = require('../../../comm/biz/foot_biz.js');

Component({
	options: {
		addGlobalClass: true
	},

	/**
	 * 组件的属性列表
	 */
	properties: {
		mode: {
			type: String,
			value: 'mode1'
		},
		oid: {
			type: String,
			value: ''
		},
		cate: {
			type: String,
			value: ''
		},
		title: {
			type: String,
			value: ''
		},
		cover: {
			type: String,
			value: ''
		},
		desc: {
			type: String,
			value: '查看详情'
		},
		qr: {
			type: String,
			value: ''
		},
		bg: {
			type: String,
			value: ''
		},
		color: {
			type: String,
			value: ''
		},
		tag: {
			type: String, //小角标
			value: ''
		},
		doFav: {
			type: Boolean,
			value: true
		},
		doFoot: {
			type: Boolean,
			value: true
		},
		doShare: {
			type: Boolean,
			value: true
		},
		doHome: {
			type: Boolean,
			value: true
		},
		homeUrl: {
			type: String,
			value: ''
		},
		doPoster: {
			type: Boolean,
			value: true
		},
		doFoot: {
			type: Boolean,
			value: true
		},
		doTop: {
			type: Boolean,
			value: true
		},
		doSlot: {
			type: Boolean,
			value: false
		},
		topBtnBottom: {
			type: Number,
			value: 190
		},
		topBtnShow: {
			type: Boolean,
			value: false
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		isFav: -1,
		showPoster: false,
		posterConfig: null,
	},

	lifetimes: {
		created: function () {

		},
		attached: function () {

		},
		ready: async function () {
			if (!this.data.oid || !this.data.title) return;

			if (this.data.doFav) {
				FavBiz.isFav(this, this.data.oid);
			}

			if (this.data.doFoot) {
				FootBiz.addFoot(this.data.cate, this.data.title);
			}

			if (this.data.doShare) {

				let posterConfig = await posterCmptHelper.config1({
					cover: this.data.cover,
					title: this.data.title,
					desc: this.data.desc,
					qr: this.data.qr,
					bg: this.data.bg
				})
				this.setData({
					posterConfig
				});

			}
		},
		move: function () {

		},
		detached: function () {

		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		bindShareTap: function () {
			this.setData({
				showPoster: true
			});
		},
		bindFavTap: async function () {
			if (this.data.isFav == -1) return;
			
			await FavBiz.updateFav(this, this.data.oid, this.data.isFav, this.data.cate, this.data.title);
		},
		url: function (e) {
			pageHelper.url(e, this);
		},
		bindHomeTap: function (e) {
			let url = this.data.homeUrl;
			if (!url)
				url = pageHelper.fmtURLByPID('/pages/default/index/default_index');

			wx.reLaunch({ url });
		}, 
		top: function (e) {
			// 回页首事件
			pageHelper.top();
		} 
	}
})