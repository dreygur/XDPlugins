'use strict';
const execa = require('execa');

module.exports = async script => {
	if (process.platform !== 'darwin') {
		throw new Error('macOS only');
	}

	const {stdout} = await execa('osascript', ['-e', script]);
	return stdout;
};

module.exports.sync = script => {
	if (process.platform !== 'darwin') {
		throw new Error('macOS only');
	}

	const {stdout} = execa.sync('osascript', ['-e', script]);
	return stdout;
};
