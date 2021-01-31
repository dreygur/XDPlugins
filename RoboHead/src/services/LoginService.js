/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const ApplicationConstants = require("../constants/ApplicationConstants");
const axios = require("axios");
const CommandConstant = require("../constants/CommandConstant");
const Http = require("./HttpService");
/**
 * API to get login form after accounte url enter
 * @param {} accountUrl
 */
export async function getLoginForm(accountUrl) {
  let API_URL =
    "https://" + accountUrl + ApplicationConstants.ACCOUNT_URL + "/login.do?";
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_GET_LOGIN_FORM);
  formData.append("user-agent", ApplicationConstants.USER_AGENT);
  return new Promise(function (resolve, reject) {
    axios
      .post(API_URL, formData)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        } else if (!res.success && res.returnCode === 5) {
          resolve(res);
        }
      })
      .catch((err) => {
        reject();
      });
  });
}

/**
 * API to validate user credentails
 * @param {*} requestParams
 */
export async function validateUser(requestParams) {
  var formData =
    Http.API_URL() +
    "/login?" +
    "username=" +
    requestParams.emailId +
    "&password=" +
    requestParams.password;

  return new Promise(function (resolve, reject) {
    axios
      .get(formData)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        } else if (!res.success && res.returnCode === 5) {
          resolve(res);
        }
      })
      .catch((err) => {
        reject();
      });
  });
}
/**
 * API to load homebean data
 * @param {*} key
 */
export async function getHomeBean(key) {
  const API_URL_HOMEBEAN =
    Http.API_URL() +
    "/home.do?" +
    "userApiToken=" +
    key +
    "&cmd=" +
    CommandConstant.CMD_GET_HOME_BEAN_DATA +
    "&user-agent=" +
    ApplicationConstants.USER_AGENT +
    "&appType=mobile"; //Added to validate user API token on homebean data
  return new Promise(function (resolve, reject) {
    axios
      .post(API_URL_HOMEBEAN)
      .then((res) => {
        if (res.data && (res.data.loginUserId || res.data.success)) {
          resolve(res.data);
        } else {
          reject(res);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
