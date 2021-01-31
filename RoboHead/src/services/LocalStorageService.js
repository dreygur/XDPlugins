/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
import Properties from "../properties/Properties.js";
import ApplicationUtil from "../util/ApplicationUtil.js";
const fs = require("uxp").storage.localFileSystem;
const base64 = require("base-64");
const utf8 = require("utf8");
/**
 * To get local stored user preferences
 */
export async function getLocalPreferenceData() {
  const settingsFolder = await fs.getDataFolder();
  let data = {};
  try {
    const settingsFile = await settingsFolder.getEntry("settings.json");

    const prefs = JSON.parse(await settingsFile.read());

    if (prefs.accountUrl) {
      let accountBytes = base64.decode(prefs.accountUrl);
      let accountURL = utf8.decode(accountBytes);
      data.accountUrl = accountURL;
    }

    if (prefs.userName) {
      let userNameBytes = base64.decode(prefs.userName);
      let userName = utf8.decode(userNameBytes);
      data.userName = userName;
    }

    if (prefs.password) {
      let passwordbytes = base64.decode(prefs.password);
      let password = utf8.decode(passwordbytes);
      data.password = password;
    }

    if (prefs.apiKey) {
      let apiKeyBytes = base64.decode(prefs.apiKey);
      let apiKey = utf8.decode(apiKeyBytes);
      data.apiKey = apiKey;
    }

    if (prefs.projectCheckboxValue) {
      let projectCheckboxVlue = base64.decode(prefs.projectCheckboxValue);
      let checkValue = utf8.decode(projectCheckboxVlue);
      data.projectAddVersionSelected = checkValue;
    }

    if (prefs.campaignCheckboxValue) {
      let campaignCheckboxVlue = base64.decode(prefs.campaignCheckboxValue);
      let checkValue = utf8.decode(campaignCheckboxVlue);
      data.campaignAddVersionSelected = checkValue;
    }
    return data;
  } catch (err) {
    /* handle errors; can also occur if settings haven't been saved yet */
  }
}

/**
 * To store user preferences at locally.
 * @param {*} data
 */
export async function setLocalPreferenceData(data) {
  var prefs = {};
  if (data.accountUrl) {
    var accountBytes = utf8.encode(data.accountUrl);
    var accountURL = base64.encode(accountBytes);
    prefs.accountUrl = accountURL;
  }
  if (data.email) {
    var userNameBytes = utf8.encode(data.email);
    var userName = base64.encode(userNameBytes);
    prefs.userName = userName;
  }
  if (data.password) {
    var passwordbytes = utf8.encode(data.password);
    var password = base64.encode(passwordbytes);
    prefs.password = password;
  }
  if (data.userApiToken) {
    var apiKeyBytes = utf8.encode(data.userApiToken);
    var apiKey = base64.encode(apiKeyBytes);
    prefs.apiKey = apiKey;
  }

  if (data.isProjectView) {
    var value = utf8.encode(
      data.projectCheckBoxValue == "true" ? "true" : "false"
    );
    var checkboxValue = base64.encode(value);
    prefs.projectCheckboxValue = checkboxValue;
  }

  if (data.isCampaignView) {
    var value = utf8.encode(
      data.campaignCheckBoxValue == "true" ? "true" : "false"
    );
    var checkboxValue = base64.encode(value);
    prefs.campaignCheckboxValue = checkboxValue;
  }

  const settingsFolder = await fs.getDataFolder();
  try {
    const settingsFile = await settingsFolder.createFile("settings.json", {
      overwrite: true,
    });
    await settingsFile.write(JSON.stringify(prefs));
  } catch (err) {
    /* handle errors */
  }
}

/**
 * To get pluggin setting temp location to store files
 */
export async function getTempLocation() {
  const folder = await fs.getDataFolder();
  let folderObject = {};
  let data = {};
  // Exit if user doesn't select a folder
  if (!folder) {
    data.errorMessage = "User canceled folder picker.";
  } else {
    data.folder = folder;
    folderObject.folder = folder;
  }

  return data;
}
/**
 * To delete preferences on user logout.
 */
export async function deletePrefences() {
  const settingsFolder = await fs.getDataFolder();

  try {
    const settingsFile = await settingsFolder.getEntry("settings.json");
    const prefs = await settingsFile.delete();
    const homeBean = await settingsFolder.getEntry("Preferences.json");
    const prefs1 = await homeBean.delete();

    return prefs;
  } catch (err) {
    /* handle errors; can also occur if settings haven't been saved yet */
  }
}

/**
 * To store  user view preferences
 * @param {*} data
 */
export async function setLocalUserViewPreferenceData(data) {
  const settingsFolder = await fs.getDataFolder();
  try {
    const settingsFile = await settingsFolder.createFile("Preferences.json", {
      overwrite: true,
    });
    await settingsFile.write(JSON.stringify(data));
  } catch (err) {
    /* handle errors */
  }
}

/**
 * To get local stored user list view preferences data
 */
export async function getLocalUserPreferenceData() {
  const settingsFolder = await fs.getDataFolder();
  try {
    const settingsFile = await settingsFolder.getEntry("Preferences.json");
    const prefs = JSON.parse(await settingsFile.read());
    return prefs;
  } catch (err) {
    /* handle errors; can also occur if settings haven't been saved yet */
  }
}

/**
 * To store  All Open work view preferences
 * @param {*} data
 */
export async function setLocalAllOpenPreferenceData(data, userId) {
  const settingsFolder = await fs.getDataFolder();
  try {
    let fileName = userId + "AllOpenWork" + ".json";
    const openWorkFile = await settingsFolder.createFile(fileName, {
      overwrite: true,
    });
    await openWorkFile.write(JSON.stringify(data));
  } catch (err) {
    /* handle errors */
  }
}

/**
 * To get local stored All open work view preferences data
 */
export async function getLocalAllOpenPreferenceData(userId) {
  const settingsFolder = await fs.getDataFolder();
  try {
    const openWorkFile = await settingsFolder.getEntry(
      userId + "AllOpenWork" + ".json"
    );
    const prefs = JSON.parse(await openWorkFile.read());
    return prefs;
  } catch (err) {
    /* handle errors; can also occur if settings haven't been saved yet */
  }
}
