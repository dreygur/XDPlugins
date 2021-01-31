/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */

const Http = require("./HttpService");
const ApplicationConstants = require("../constants/ApplicationConstants");
const CommandConstant = require("../constants/CommandConstant");
const ApplicationUtil = require("../util/ApplicationUtil");
const axios = require("axios");
var qs = require("qs");
const fs = require("uxp").storage.localFileSystem;
const application = require("application");
var Blob = require("blob");
const uxp = require("uxp");
const scenegraph = require("scenegraph");
/**
 * To create renditions of selected file format.
 * @param {*} requestParams
 */
export async function importFile(requestParams) {
  const file = await requestParams.folder.createFile(
    requestParams.name + "." + requestParams.mode,
    {
      overwrite: true,
    }
  );

  let optionParams = getSaveOptions(requestParams, file);
  try {
    const results = await application.createRenditions(
      optionParams.renditionOptions
    );
    return results;
  } catch (err) {
    // Exit if there's an error rendering.
    return err;
  }
}
/**
 * It returns rendition options
 * @param {*} requestParams
 * @param {*} file
 */
function getSaveOptions(requestParams, file) {
  let optionParams = {};
  switch (requestParams.mode) {
    case ApplicationConstants.EXPORT_TYPE_PNG:
      optionParams.renditionOptions = [
        {
          node:
            requestParams.selection.items.length > 1 ||
            requestParams.selection.items.length == 0
              ? scenegraph.root
              : requestParams.selection.items[0],
          outputFile: file,
          type: application.RenditionType.PNG,
          scale: 1,
        },
      ];
      break;
    case ApplicationConstants.EXPORT_TYPE_SVG:
      optionParams.renditionOptions = [
        {
          node:
            requestParams.selection.items.length > 1 ||
            requestParams.selection.items.length == 0
              ? scenegraph.root
              : requestParams.selection.items[0],
          outputFile: file,
          type: application.RenditionType.SVG,
          minify: true,
          embedImages: true,
        },
      ];
      break;
    case ApplicationConstants.EXPORT_TYPE_JPG:
      optionParams.typeString = application.RenditionType.JPG;
      optionParams.renditionOptions = [
        {
          node:
            requestParams.selection.items.length > 1 ||
            requestParams.selection.items.length == 0
              ? scenegraph.root
              : requestParams.selection.items[0],
          outputFile: file,
          type: application.RenditionType.JPG,
          scale: 1,
          quality: 1,
        },
      ];
      break;
    default:
      optionParams.renditionOptions = [
        {
          node:
            requestParams.selection.items.length > 1 ||
            requestParams.selection.items.length == 0
              ? scenegraph.root
              : requestParams.selection.items[0],
          outputFile: file,
          type: application.RenditionType.PDF,
        },
      ];
      break;
  }
  return optionParams;
}
/**
 * API to add files to given object type
 * @param {*} config
 * @param {*} requestParams
 */
export function addFiles(config = {}, requestParams) {
  const API_URL_FILE =
    Http.API_URL() + "/file.do?userApiToken=" + ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("content", requestParams.result[0].outputFile);
  formData.append("cmd", CommandConstant.CMD_ADD_FILE);
  formData.append("objectId", requestParams.id);
  formData.append("objectType", requestParams.objectType);
  formData.append("documentType", requestParams.objectType);
  formData.append("uploadFileTempId", 6);
  formData.append("parentFileId", null);
  formData.append("addVersionByFileName", requestParams.addVersionByFileName);
  formData.append("userApiToken", ApplicationUtil.userToken);
  return new Promise(function (resolve, reject) {
    axios
      .post(API_URL_FILE, formData, config)
      .then((res) => {
        if (res.data.success) {
          resolve(res.data.customParams);
        } else {
          reject(res);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
/**
 * API to fetch list of file of given objectType
 * @param {*} requestParams
 */
export async function listFiles(requestParams = {}) {
  let API_URL_FILE =
    Http.API_URL() + "/file.do?userApiToken=" + ApplicationUtil.userToken;
  requestParams.cmd = CommandConstant.CMD_LIST_FILES;
  requestParams.start = 0;
  requestParams.page = 1;
  requestParams.limit = -1;
  requestParams.userApiToken = ApplicationUtil.userToken;
  return await new Promise(function (resolve, reject) {
    axios
      .post(API_URL_FILE, qs.stringify(requestParams))
      .then((res) => {
        if (res.data) {
          resolve(res.data.List);
        } else {
          reject(res);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
/**
 * API to download file
 * @param {*} requestParams
 * @param {*} reference
 */
export async function downloadFile(requestParams, reference) {
  const formData =
    Http.API_URL() +
    "/file.do?userApiToken=" +
    ApplicationUtil.userToken +
    "&fileId=" +
    requestParams.id +
    "&cmd=" +
    CommandConstant.CMD_FILE_DOWNLOAD +
    "&documentType=" +
    requestParams.documentType;

  const photoUrl = formData;
  const photoObj = await xhrBinary(photoUrl, reference);
  const tempFolder = await fs.getDataFolder();
  const tempFile = await tempFolder.createFile(requestParams.file.title, {
    overwrite: true,
  });
  await tempFile.write(photoObj, { format: uxp.storage.formats.binary });
  reference.showDownloadMessage();
}
/**
 * API to upload file to given objectType
 * @param {*} requestParams
 * @param {*} scope
 */
export async function uploadFile(requestParams, scope) {
  importFile(requestParams, this).then((result) => {
    if (result) {
      scope.showprogress();
      let me = this;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "user-agent": ApplicationConstants.USER_AGENT,
        },
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (percentCompleted >= 95) {
            percentCompleted = 95;
          }
          scope.setState({
            percentCompleted: percentCompleted,
          });
        },
      };
      requestParams.result = result;
      addFiles(config, requestParams)
        .then((res) => {
          scope.setState({
            percentCompleted: 100,
            showUploadProgress: false,
            showMessage: true,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
/**
 * This function fetch ArrayBuffer response from RH API
 * @param {*} url
 * @param {*} reference
 */
function xhrBinary(url, reference) {
  reference.showSpinnerWheel();
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.onload = () => {
      if (req.status === 200) {
        try {
          reference.hideSpinnerWheel();
          const arr = new Uint8Array(req.response);
          resolve(arr);
        } catch (err) {
          reject("Couldnt parse response. ${err.message}, ${req.response}");
        }
      } else {
        reject("Request had an error: ${req.status}");
      }
    };
    req.onerror = reject;
    req.onabort = reject;
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.send();
  });
}
