let application = require("application");

function getUiLabel(appLang = 'en') {
	if ('en' === appLang) appLang = 'default';
	let langFilePath = './i18l/' + appLang + '.json';
	try {
		return require(langFilePath);
	}
	catch (e) {
		return require('./i18l/default.json');
	}
}
const uiLabel = getUiLabel(application.appLanguage);

module.exports = {
	uiLabel
}