const { appLanguage } = require("application");
const Strings = require('../Dictionaries/'+appLanguage+'.json');
export const HOOK_LIST = [{ name: "Default Translator", id: "adb" }, { name: "Google Translate", id: "goo" }, { name: "Microsoft Translate", id: "micro" }];
export const MODE_LIST = [{ name: "Highlight the longest translation", id: "draw" }, { name: "Preview Translated Artboard", id: "replace" }, { name: "Clear translations", id: "remove" }];
export const REQUEST_STRING_LIMIT = 20;
export const LOCALE_MAPPING = {
    "English": "en",
    "French": "fr",
    "German": "de",
    "Japanese": "ja",
    "Dutch": "nl",
    "Italian": "it",
    "Spanish": "es",
    "Brazilian Portuguese": "pt",
    "Swedish": "sv",
    "Danish": "da",
    "Finnish": "fi",
    "Norwegian": "nb",
    "Chinese Simplified": "zh-Hans",
    "Chinese Traditional": "zh-Hant",
    "Korean": "ko",
    "Czech": "cs",
    "Polish": "pl",
    "Russian": "ru",
    "Turkish": "tr",
    "Ukrainian": "uk"
};

export const LOCALE_MAP_REVERSE = {
    "(Select source language)": "(Select source language)",
    "en_US": "English",
    "fr_FR": "French",
    "de_DE": "German",
    "ja_JP": "Japanese",
    "nl_NL": "Dutch",
    "it_IT": "Italian",
    "es_ES": "Spanish",
    "pt_BR": "Brazilian Portuguese",
    "sv_SE": "Swedish",
    "da_DK": "Finnish",
    "zh_CN": "Chinese Simplified",
    "ko_KR": "Korean",
    "ru_RU": "Russian",
    "tr_TR": "Turkish",
    "uk_UA": "Ukrainian"
};
export const LOCALE_MAPPING_ADOBE_IO = {
    "English": "en_US",
    "French": "fr_FR",
    "German": "de_DE",
    "Japanese": "ja_JP",
    "Dutch": "nl_NL",
    "Italian": "it_IT",
    "Spanish": "es_ES",
    "Brazilian Portuguese": "pt_BR",
    "Swedish": "sv_SE",
    "Danish": "da_DK",
    "Finnish": "fi_FI",
    "Norwegian": "no_NO",
    "Chinese Simplified": "zh_CN",
    "Chinese Traditional": "zh_TW",
    "Korean": "ko_KR",
    "Czech": "cs_CZ",
    "Polish": "pl_PL",
    "Russian": "ru_RU",
    "Turkish": "tr_TR",
    "Ukrainian": "uk_UA"
};
export const allLangList = ['(Select source language)', 'German', 'French', 'Japanese', 'Spanish', 'Italian', 'Chinese Simplified', 'Korean', 'Russian', 'Turkish', 'Ukrainian', 'Finnish', 'Brazilian Portuguese', 'Dutch', 'Swedish', 'English'];

export const LANG_MAP = {'(Select source language)':Strings.SOURCE_LANGUAGE_LABEL,'German': 'German (Deutsch)', 'French': 'French (Français)', 'Japanese': 'Japanese (日本語)', 'Spanish': 'Spanish (Español)', 'Italian': 'Italian (Italiano)', 'Chinese Simplified':'Chinese Simplified (简体中文)', 'Korean':'Korean (한국어)', 'Russian':'Russian (Pусский)', 'Turkish':'Turkish (Türkçe)', 'Ukrainian':'Ukrainian (Українська)', 'Finnish':'Finnish (Suomi)', 'Brazilian Portuguese':'Brazilian Portuguese (Português do Brasil)', 'Dutch':'Dutch (Nederlands)', 'Swedish':'Swedish (Svenska)', 'English':'English'};
export const LANG_MAP_REVERSE = {'(Select source language)':'(Select source language)', 'German (Deutsch)':'German',  'French (Français)':'French',  'Japanese (日本語)':'Japanese',  'Spanish (Español)':'Spanish',  'Italian (Italiano)':'Italian', 'Chinese Simplified (简体中文)':'Chinese Simplified', 'Korean (한국어)':'Korean', 'Russian (Pусский)':'Russian', 'Turkish (Türkçe)':'Turkish', 'Ukrainian (Українська)':'Ukrainian', 'Finnish (Suomi)':'Finnish', 'Brazilian Portuguese (Português do Brasil)':'Brazilian Portuguese', 'Dutch (Nederlands)':'Dutch', 'Swedish (Svenska)':'Swedish', 'English':'English'};
LANG_MAP_REVERSE[Strings.SOURCE_LANGUAGE_LABEL] = '(Select source language)';