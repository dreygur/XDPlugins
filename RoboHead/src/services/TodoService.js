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
 * API to delete todo
 */
export async function deleteTodo(requestParams) {
  let API_URL =
    Http.API_URL() + "/todo.do?" + "userApiToken=" + ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_TODO_DELETE);
  formData.append("todoIds", requestParams.ids);
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
 * API to update todo
 */
export async function updateTodo(requestParams) {
  let API_URL =
    Http.API_URL() + "/todo.do?" + "userApiToken=" + ApplicationUtil.userToken;
  let formData = new FormData();
  formData.append("cmd", CommandConstant.CMD_TODO_UPDATE);
  formData.append("title", requestParams.title);
  formData.append("description", requestParams.description);
  formData.append("dueDate", requestParams.dueDate);
  formData.append("markAsComplete", requestParams.markAsComplete);
  formData.append("todoId", requestParams.todoId);
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
