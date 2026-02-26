const pageHelper = require('../../../../../helper/page_helper.js');
const dataHelper = require('../../../../../helper/data_helper.js');
const helper = require('../../../../../helper/helper.js');
const formSetHelper = require('../../form_set_helper.js');

let _parentFormSet = null;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		index: -1, // 父页面索引 -1则为新加

		typeOptions: formSetHelper.getTypeOptions(),
		onlySetOptions: formSetHelper.getOnlySetOptions(),
		maxOptions: dataHelper.getSelectOptions('0=0个字,1=1个字,2=2个字,3=3个字,4=4个字,5=5个字,6=6个字,7=7个字,8=8个字,9=9个字,10=10个字,11=11个字,12=12个字,13=13个字,14=14个字,15=15个字,15=15个字,16=16个字,17=17个字,18=18个字,19=19个字,20=20个字,25=25个字,30=30个字,40=40个字,50=50个字,100=100个字,200=200个字,500=500个字,1000=1000个字,2000=2000个字'),
		minOptions: dataHelper.getSelectOptions('0=0个字,1=1个字,2=2个字,3=3个字,4=4个字,5=5个字,6=6个字,7=7个字,8=8个字,9=9个字,10=10个字,11=11个字,12=12个字,13=13个字,14=14个字,15=15个字,15=15个字,16=16个字,17=17个字,18=18个字,19=19个字,20=20个字,25=25个字,30=30个字,40=40个字,50=50个字,100=100个字,200=200个字,500=500个字'),

		checkBoxLimitOptions: dataHelper.getSelectOptions('0=0项,1=1项,2=2项,3=3项,4=4项,5=5项,6=6项,7=7项,8=8项,9=9项,10=10项,11=11项,12=12项,13=13项,14=14项,15=15项,16=16项,17=17项,18=18项,19=19项,20=20项'),

		onlySetDesc: '',

		// 基本属性
		formMark: '',
		formType: 'text',
		formTitle: '',
		formDesc: '',
		formMust: true,
		formMax: 50,
		formMin: 0,
		formOnlySet: {
			mode: 'all',
			cnt: -1
		},

		// type=select
		formSelectOptions: ['', ''],


		// type=checkbox
		formCheckBoxLimit: 2,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			formMark: formSetHelper.mark(),
			onlySetDesc: formSetHelper.getOnlySetDesc(this.data.formOnlySet)
		});

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;
		_parentFormSet = parent.selectComponent("#form-set");

		if (options && helper.isDefined(options.idx)) {
			let index = options.idx;

			let fields = _parentFormSet.get();
			let node = fields[index];

			if (!node.mark) node.mark = formSetHelper.mark();

			this.setData({
				index,
				formMark: node.mark,
				formType: node.type,
				formTitle: node.title,
				formDesc: node.desc,
				formMust: node.must,
				formMax: node.max,
				formMin: node.min,
				formOnlySet: node.onlySet,
				formSelectOptions: node.selectOptions,
				formCheckBoxLimit: node.checkBoxLimit,

				onlySetDesc: formSetHelper.getOnlySetDesc(node.onlySet)
			});

			wx.setNavigationBarTitle({
				title: '字段编辑',
			});

		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	// 重复次数
	bindOnlySetCmpt: function (e) {
		let formOnlySet = {};
		formOnlySet.mode = e.detail[0];
		formOnlySet.cnt = e.detail[1];
		this.setData({
			formOnlySet,
			onlySetDesc: formSetHelper.getOnlySetDesc(formOnlySet)
		});
	},

	bindDelTap: function (e) {
		if (this.data.index == -1) return;

		let callback = () => {
			let fields = _parentFormSet.get();
			fields.splice(this.data.index, 1);
			_parentFormSet.set(fields);
			wx.navigateBack();
		}

		pageHelper.showConfirm('确定要删除当前字段吗？', callback);
	},

	bindSubmitTap: function (e) {
		if (this.data.formTitle.length < 1) return pageHelper.showModal('字段名称必填哦');
		if (this.data.formTitle.length > 60) return pageHelper.showModal('字段名称必不能超过60个字');

		if (this.data.formDesc.length > 30) return pageHelper.showModal('填写说明不能超过30个字');

		if (this.data.formType.length < 1) return pageHelper.showModal('字段填写类型必须选择哦');
		let formType = this.data.formType;

		if (formType == 'select' || formType == 'checkbox') {
			// 下拉框
			let formSelectOptions = this.data.formSelectOptions;

			for (let k = 0; k < formSelectOptions.length; k++) {
				if (formSelectOptions[k].length < 1) {
					return pageHelper.showModal('选项' + (Number(k) + 1) + '还没填哦');
				}

				if (formSelectOptions[k].length > 30) {
					return pageHelper.showModal('选项' + (Number(k) + 1) + '不能超过30个字，精简一点!');
				}
			}

			this.data.formMax = 50;
			this.data.formMin = 0;

			if (formType == 'select') this.data.formCheckBoxLimit = 2;

		} else if (formType == 'mobile') {
			//非本类型的排除
			this.data.formSelectOptions = ['', ''];
			this.data.formCheckBoxLimit = 2;
			this.data.formMax = 11;
			this.data.formMin = 11;
		} else {
			//非本类型的排除
			this.data.formSelectOptions = ['', ''];
			this.data.formCheckBoxLimit = 2;

			if (formType != 'text' && formType != 'textarea' && formType != 'int' && formType != 'digit') {
				this.data.formMax = 50;
				this.data.formMin = 0;
			}
		}

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		let fields = _parentFormSet.get();


		let node = {
			mark: this.data.formMark,
			title: this.data.formTitle,
			desc: this.data.formDesc,
			type: this.data.formType,
			must: this.data.formMust,
			max: Number(this.data.formMax),
			min: Number(this.data.formMin),
			onlySet: this.data.formOnlySet,
			selectOptions: this.data.formSelectOptions,
			checkBoxLimit: Number(this.data.formCheckBoxLimit),
		};


		node = formSetHelper.initFieldOne(node);
		if (this.data.index == -1) {
			fields.push(node); //新的
		} else {
			fields[this.data.index] = node; //修改的
		}

		_parentFormSet.set(fields);
		wx.navigateBack();
	},

	switchModel: function (e) {
		pageHelper.switchModel(this, e, 'bool');
	},

	bindSelectOptionsBlur: function (e) {
		// 多选项目的输入
		let idx = pageHelper.dataset(e, 'idx');
		let val = e.detail.value.trim();
		let formSelectOptions = this.data.formSelectOptions;
		formSelectOptions[idx] = val;
		/*
		this.setData({
			formSelectOptions
		});*/
	},

	bindDelSelectOptionsTap: function (e) {
		let formSelectOptions = this.data.formSelectOptions;
		if (formSelectOptions.length <= 2) return pageHelper.showModal('至少2个选项');


		let callback = () => {
			let idx = pageHelper.dataset(e, 'idx');
			formSelectOptions.splice(idx, 1);
			this.setData({
				formSelectOptions
			});
		}

		pageHelper.showConfirm('确定删除该项吗？', callback);
	},

	bindAddSelectOptionsTap: function (e) {
		let formSelectOptions = this.data.formSelectOptions;
		if (formSelectOptions.length >= 20) return pageHelper.showModal('最多可以添加20个选项');

		formSelectOptions.push('');
		this.setData({
			formSelectOptions
		});
	}

})