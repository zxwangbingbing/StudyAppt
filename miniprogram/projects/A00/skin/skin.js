module.exports = {
	PID: 'A00', // 服务大厅

	NAV_COLOR: '#ffffff',
	NAV_BG: '#5D95FF',

	MEET_NAME: '预约',

	MENU_ITEM: ['首页', '预约日历', '我的'], // 第1,4,5菜单
 
	NEWS_CATE: '1=最新动态,2=政策法规',
	MEET_TYPE: '1=户籍办理,2=就业创业,3=社会保障,4=证件办理,5=出境入境,6=离职退休,7=行驶驾驶,8=婚姻登记,9=职业资格,10=行政缴费',

	DEFAULT_FORMS: [{
			type: 'line',
			title: '姓名',
			desc: '请填写您的姓名',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		},
		{
			type: 'line',
			title: '手机',
			desc: '请填写您的手机号码',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		}
	]
}