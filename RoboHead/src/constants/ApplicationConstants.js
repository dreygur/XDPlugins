/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 *
 * Application level constants will be here..
 *
 */
const ApplicationConstants = {
  ACCOUNT_URL: ".robohead.com", //Prod
  //ACCOUNT_URL: ".rh-2.net", //Stage
  USER_AGENT: "RH_XD_plugin",
  TRUE: 1,
  FALSE: 2,
  TRUE_STRING: "true",
  FALSE_STRING: "false",
  SORT_OBJECT: "SORT",
  SETTING_OBJECT: "SETTING",
  ASC: "ASC",
  DESC: "DESC",
  COPY_TO_RH_PANEL_ID: "CopyToRHPanel",
  ALL_OPEN_WORK_PANEL_ID: "AllOpenWorkPanel",
  MMDDYYYY_FORMAT: "MM/dd/yyyy",
  DDMMYYYY_FORMAT: "dd/MM/yyyy",
  OBJECT_TYPE_PROJECT: 3,
  OBJECT_TYPE_CAMPAIGN: 6,
  OBJECT_TYPE_LIBRARY: 16,
  OBJECT_TYPE_FOLDER: 4,
  OBJECT_TYPE_TASK: 9,
  OBJECT_TYPE_REVIEW: 10,
  OBJECT_TYPE_NOTE: 11,
  OBJECT_TYPE_FILE: 12,
  OBJECT_TYPE_TODO: 13,
  OBJECT_TYPE_ALL_OPEN_WORK: 68,
  EXPORT_TYPE_PNG: "png",
  EXPORT_TYPE_SVG: "svg",
  EXPORT_TYPE_JPG: "jpg",
  EXPORT_TYPE_PDF: "pdf",
  HELP_URL: "https://aquentcloud.helpdocsonline.com/plugins",
  FEEDBACK_URL:
    "https://docs.google.com/forms/d/e/1FAIpQLSdBLvMYhADAf4_96EzZUeN5ab7e8mIdIxobVpNVAcr6Rph3lw/viewform",
  BAD_CREDENTAILS_ERROR: "Bad credentials",
  TASK_OVERDUE: 1,
  TASK_ACTIVE: 2,
  TASK_UPCOMING: 3,
  TASK_OVERDUE_AND_BLOCKED: 4,
  TASK_BLOCKED: 5,
  TASK_COMPLETE: 6,
  TASK_NOT_READY: 7,
  TASK_ON_HOLD: 8,
  TASK_STATUS_NOT_STARTED: 156,
  TASK_STATUS_IN_PROGRESS: 157,
  TASK_STATUS_COMPLETE: 158,
  TASK_STATUS_ONHOLD: 155,
};

module.exports = ApplicationConstants;
