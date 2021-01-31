/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */

const ApplicationConstants = require("../constants/ApplicationConstants");
const CommandConstant = require("../constants/CommandConstant");
const ApplicationUtil = require("../util/ApplicationUtil");
const axios = require("axios");
const Http = require("./HttpService");
/**
 * To load Active campaign list which has minimum contribute permission.
 */
export async function getActiveCampaignList() {
  let API_URL =
    Http.API_URL() +
    "/campaign.do?" +
    "userApiToken=" +
    ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_CAMPAIGN_LIST_ACTIVE_CONTRIBUTE);
  formData.append("page", 1);
  formData.append("start", 0);
  formData.append("limit", -1);

  return new Promise(function (resolve, reject) {
    axios
      .post(API_URL, formData)
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        } else {
          resolve(res);
        }
      })
      .catch((err) => {
        reject();
      });
  });
}
