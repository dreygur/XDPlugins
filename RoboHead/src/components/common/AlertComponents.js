/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const { alert, error } = require("../common/dialog/dialogs.js");
const Properties = require("../../properties/Properties");
export async function showInternetErrorAlert() {
  showAlert(
    Properties.Connect_to_internet_label,
    Properties.Internet_connection_error_message
  );
}
export async function showAlert(labelFirst, labelSecond) {
  await alert(labelFirst, labelSecond);
}
