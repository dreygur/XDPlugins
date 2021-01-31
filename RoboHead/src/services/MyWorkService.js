/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 14-10-2020
 */
const CommandConstant = require("../constants/CommandConstant");
const ApplicationUtil = require("../util/ApplicationUtil");
const axios = require("axios");
const Http = require("./HttpService");
/**
 * API to get All open work list
 */
export async function getAllOpenWorkList(requestParams) {
  let API_URL =
    Http.API_URL() + "/task.do?" + "userApiToken=" + ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_LIST_ALL_OPEN_WORK);
  formData.append("page", 1);
  formData.append("start", 0);
  formData.append("limit", -1);
  formData.append(
    "outputColumns",
    requestParams.outputColumns + ",description"
  );
  if (requestParams.sortDirection)
    formData.append("sortDirection", requestParams.sortDirection);
  if (requestParams.sortColumn)
    formData.append("sortColumn", requestParams.sortColumn);
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

/**
 * API to mark todo complete
 */
export async function markTodoAsComplete(requestParams) {
  let API_URL =
    Http.API_URL() + "/todo.do?" + "userApiToken=" + ApplicationUtil.userToken;

  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_TODO_MARK_TODO_COMPLETE);
  formData.append("todoIds", requestParams.id);
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

/**
 * API to update task status.
 */
export async function updateTaskStatus(requestParams) {
  let API_URL =
    Http.API_URL() + "/task.do?" + "userApiToken=" + ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_TASK_UPDATE_STATUS);
  formData.append("taskIds", requestParams.taskIds);
  formData.append("taskStatus", requestParams.taskStatus);
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

/**
 * API to get task link
 */
export async function getTaskLink(id) {
  let API_URL =
    Http.API_URL() + "/task.do?" + "userApiToken=" + ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_GENERATE_OBJECT_LINK);
  formData.append("taskId", id);
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

/**
 * API to get review link
 */
export async function getReviewLink(id) {
  let API_URL =
    Http.API_URL() +
    "/review.do?" +
    "userApiToken=" +
    ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_GENERATE_OBJECT_LINK);
  formData.append("reviewId", id);
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

/**
 * API to get project link
 */
export async function getProjectLink(id) {
  let API_URL =
    Http.API_URL() +
    "/project.do?" +
    "userApiToken=" +
    ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_GENERATE_OBJECT_LINK);
  formData.append("projectId", id);
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

/**
 * API to Add as favorites
 */
export async function addToFavorites(requestParams) {
  let API_URL =
    Http.API_URL() +
    "/favorite.do?" +
    "userApiToken=" +
    ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_ADD_TO_FAVORITES);
  formData.append("objectIds", requestParams.objectId);
  formData.append("objectType", requestParams.objectType);
  formData.append("userId", requestParams.userId);
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
