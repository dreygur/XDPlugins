const msg = {
  validate: {
    selType: "Please select an artboard.",
    selDim: "Please select a square artboard."
  },
  opInfo: {
    success: "Favicons saved.",
    clipboard: "HTML tags copied to clipboard.",
    error: "An error occurred. Please try again.",
    errorDirRead: "Unable to read folder. Please choose another folder.",
    errorDirCreate: "Unable to create destination folder. Please try again.",
    folderPickerCancel: "No destination folder selected."
  }
};

const styleClass = {
  success: "success",
  info: "info",
  warning: "warning",
  error: "error"
};

const resetMessage = () => {
  const element = document.querySelector("#message");
  if (element.dataset.timeout === true) return;

  element.textContent = "";
  element.className = "hide";
};

const showMessage = options => {
  const element = document.querySelector("#message");
  element.textContent = options.message;
  element.className = `show ${options.styleClass}`;

  if (options.withTimeout) {
    element.dataset.timeout = true;
    initTimeout(element);
  }
};

const initTimeout = element => {
  setTimeout(() => {
    element.dataset.timeout = false;
    resetMessage(element);
  }, 4000);
};

module.exports = {
  msg,
  styleClass,
  resetMessage,
  showMessage
};
