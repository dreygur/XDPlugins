//  temporary shim until setTimeout is added to XD
global.setTimeout = fn => {
  fn();
};
global.clearTimeout = fn => {};

const formats = require('uxp').storage.formats;
const encode = require('./lib/base64-arraybuffer').encode;
const exportSelection = require('./src/export_selection').exportSelection;
const CloudappDialog = require('./src/cloudapp_dialog');
const OAuthDialog = require('./src/oauth_dialog');
const OAuth = require('./src/oauth.js');
const Api = require('./src/api');
let ArtBoardSelection = null;
let oauthdialog = null;
const fs = require('uxp').storage.localFileSystem;
let dialogRef = null;

let AirbrakeClient = require('./lib/airbrakeJs');
let airbrake = new AirbrakeClient({
  projectId: 196301,
  projectKey: '73de6b158914cf876a5d5837904e91a0'
});

document.addEventListener('CLOUDAPP_DISMISS_OAUTH', () => {
  console.log("CLOUDAPP_DISMISS_OAUTH");
  closeOauthDialog();
});
document.addEventListener('CLOUDAPP_FORCE_LOGIN', () => {
  console.log("CLOUDAPP_FORCE_LOGIN");
  //Killing this for the moment it breaks the promise chain...
  // await startLogin();
});
document.addEventListener('CLOUDAPP_LOGIN_COMPLETE', async () => {
  console.log("CLOUDAPP_LOGIN_COMPLETE");
  const token = await OAuth.accessToken();
  await showDialog();
});
document.addEventListener('CLOUDAPP_ERROR', () => {
  console.log("CLOUDAPP_ERROR");
  closeCloudappDialogAndShowError(document.errorObject);
  document.errorObject = null;
})

const showDialog = async function() {
  let platform = 'mac';
  if (await isWindows() === true){
    platform = 'windows';
  }
  try {
    let cloudappDialog = new CloudappDialog(platform);
    if (ArtBoardSelection.items.length > 0) {
      const file = await exportSelection(ArtBoardSelection);
      const fileData = await file.read({ format: formats.binary });
      const image = encode(fileData);
      cloudappDialog.setBase64Image(image);
      console.log("Build Dialog");
      cloudappDialog.buildDialog();
      console.log("Append Dialog");
      document.body.appendChild(cloudappDialog.dialog);
      console.log("Show Dialog");
      dialogRef = cloudappDialog;
      await cloudappDialog.dialog.showModal().finally(() => cloudappDialog.dialog.remove());
      console.log("Finished Show Dialog");
      cloudappDialog = null;
    } else {
      const errorDialog = cloudappDialog.errorDialog('No artboard selected');
      document.body.appendChild(errorDialog);
      await errorDialog.showModal().finally(() => errorDialog.remove());
    }
  } catch (e) {
    console.log(e);
    airbrake.notify(e);
  }
};

const closeOauthDialog = () => {
  console.log("Closing Oauth");
  if (oauthdialog !== null) {
    oauthdialog.dismissModal();
  }
};

const closeCloudappDialogAndShowError = (error) => {
  dialogRef.dialog.remove();
  console.log(error);
  airbrake.notify(error);
  const cloudappDialog = new CloudappDialog();
  const errorMessage = `Awe Snap!
  There was an unrecoverable error, please try again later.
  If this error persists please contact CloudApp Support.


  Error:  ${error.message}`;

  const errorDialog = cloudappDialog.errorDialog(errorMessage);
  document.body.appendChild(errorDialog);
  errorDialog.showModal();
}

const startLogin = async function() {
  console.log("Start login called");
  oauthdialog = new OAuthDialog();
  console.log("Build Oauth Dialog");
  oauthdialog.buildDialog();
  console.log("Append Oauth Dialog");
  document.body.appendChild(oauthdialog.dialog);
  console.log("Show Oauth Modal");
  await oauthdialog.dialog.showModal().finally(() => oauthdialog.dialog.remove());
  console.log("Done Show Oauth Modal");
  oauthdialog= null;
};

const isWindows = async () => {
  const settingsFolder = await fs.getDataFolder();
  const path = settingsFolder.nativePath;
  if (path.startsWith('/')){
    return false
  }
  return true
}

const intializePlugin = async selection => {
  ArtBoardSelection = selection;

  const loggedIn = await OAuth.credentialsAvaliable();
  if (loggedIn === true) {
    const token = await OAuth.accessToken();
    console.log("StartDialog");
    await showDialog();
    console.log("FinishDialog");
  } else {
    console.log("StartLogin");
    await startLogin();
    console.log("FinishLogin")
  }
};

module.exports = {
  commands: {
    intializePlugin
  },
};
