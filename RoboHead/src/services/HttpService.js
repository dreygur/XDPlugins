/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const axios = require("axios");
const ApplicationConstants = require("../constants/ApplicationConstants");
const CommandConstant = require("../constants/CommandConstant");
const ApplicationUtil = require("../util/ApplicationUtil");
/**
 * To add request headers in each request.
 */
axios.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/x-www-form-urlencoded";
  config.headers["user-agent"] = ApplicationConstants.USER_AGENT;
  return config;
});
/**
 * To get Account URL for each request
 */
function API_URL() {
  return "https://" + ApplicationUtil.applicationUrl;
}

module.exports = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  API_URL: API_URL,
};
