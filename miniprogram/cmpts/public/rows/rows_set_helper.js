
const helper = require('../../../helper/helper.js');
const BASE_ROW = { title: '', val: '', pic: '', detail: [] };

function fmtRows(rows) {
	for (let k = 0; k < rows.length; k++) {
		let node = rows[k];
		if (!helper.isDefined(node['title'])) node['title'] = '';
		if (!helper.isDefined(node['val'])) node['val'] = '';
		if (!helper.isDefined(node['pic'])) node['pic'] = '';

		if (!helper.isDefined(node['detail'])) node['detail'] = [];
		if (!Array.isArray(node['detail'])) node['detail'] = [];
	}
 
	return rows;
}

module.exports = {
	BASE_ROW,
	fmtRows,
}