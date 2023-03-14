
const app = getApp();
Component({
	/**
	 * 组件的一些选项
	 */
	options: {
		addGlobalClass: true,
		multipleSlots: true
	},
	/**
	 * 组件的对外属性
	 */
	properties: {
		textColor: {
			type: String,
			value: 'text-white'
		},
		url: {
			type: String,
			value: '/projects/home/index/home_index'
		}
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		method: 'back',
		statusBarHeight: app.globalData.statusBarHeight,
		customBarHeight: app.globalData.customBarHeight,
	},

	lifetimes: {
		attached() {
			let parentPages = getCurrentPages().length;
			if (parentPages == 1)
				this.setData({
					method: 'home'
				}); 
		}
	},


	/**
	 * 组件的方法列表
	 */
	methods: {
		bindTap() {
			if (this.data.method == 'back') {
				wx.navigateBack();
			} else
				wx.reLaunch({
					url: this.data.url,
				});
		}
	}
})