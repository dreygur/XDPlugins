/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */

//To Validate entered email is correct or not.
export function validateEmail(email) {
  var customEmail = /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/;

  if (customEmail.test(email)) {
    return true;
  } else {
    return false;
  }
}

//To check passed value is empty or not.
export function isEmpty(value) {
  if (
    value !== undefined && value !== null && typeof value === "string"
      ? value.trim() !== ""
      : value !== ""
  ) {
    return false;
  }
  return true;
}
