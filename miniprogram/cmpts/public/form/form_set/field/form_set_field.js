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
		lenOptions: dataHelper.getSelectOptions('1=1个字以内,2=2个字以内,3=3个字以内,4=4个字以内,5=5个字以内,6=6个字以内,7=7个字以内,8=8个字以内,9=9个字以内,10=10个字以内,15=15个字以内,20=20个字以内,30=30个字以内,40=40个字以内,50=50个字以内,100=100个字以内,200=200个字以内,500=500个字以内'),

		checkBoxLimitOptions: dataHelper.getSelectOptions('0=0项,1=1项,2=2项,3=3项,4=4项,5=5项,6=6项,7=7项,8=8项,9=9项,10=10项,11=11项,12=12项,13=13项,14=14项,15=15项,16=16项,17=17项,18=18项,19=19项,20=20项'),

		onlySetDesc: '',

		// 基本属性
		formMark: '',
		formType: 'line',
		formTitle: '',
		formDesc: '',
		formMust: true,
		formLen: 50,
		formOnlySet: {
			mode: 'all',
			cnt: -1
		},

		// type=select
		formSelectOptions: ['', ''],

		// type=mobile
		formMobileTruth: true, //手机真实性

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
				formLen: node.len,
				formOnlySet: node.onlySet,
				formSelectOptions: node.selectOptions,
				formMobileTruth: node.mobileTruth,
				formCheckBoxLimit: node.checkBoxLimit,

				onlySetDesc: formSetHelper.getOnlySetDesc(node.onlySet)
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
			wx.navigateBack({
				delta: 0,
			});
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

			for (let k in formSelectOptions) {
				if (formSelectOptions[k].length < 1) {
					return pageHelper.showModal('选项' + (Number(k) + 1) + '还没填哦');
				}

				if (formSelectOptions[k].length > 30) {
					return pageHelper.showModal('选项' + (Number(k) + 1) + '不能超过30个字，精简一点!');
				}
			}

			this.data.formMobileTruth = true;
			this.data.formLen = 50;
			
			if (formType == 'select') this.data.formCheckBoxLimit = 2; 

		} else if (formType == 'mobile') {
			//非本类型的排除
			this.data.formSelectOptions = ['', ''];
			this.data.formCheckBoxLimit = 2;
			this.data.formLen = 50;
		} else {
			//非本类型的排除
			this.data.formSelectOptions = ['', ''];
			this.data.formMobileTruth = true;
			this.data.formCheckBoxLimit = 2;

			if (formType != 'line' && formType != 'multi' && formType != 'number' && formType != 'digit') {
				this.data.formLen = 50;
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
			len: Number(this.data.formLen),
			onlySet: this.data.formOnlySet,
			selectOptions: this.data.formSelectOptions,
			mobileTruth: this.data.formMobileTruth,
			checkBoxLimit: Number(this.data.formCheckBoxLimit),
		};


		if (this.data.index == -1) {
			fields.push(node); //新的
		} else {
			fields[this.data.index] = node;
		}

		_parentFormSet.set(fields);
		wx.navigateBack({
			delta: 0,
		});
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
		this.setData({
			formSelectOptions
		});
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