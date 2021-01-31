const { warning } = require("./lib/dialogs.js");

const reportError = async (url) => {
  const res = await warning('Oops, Something went wrong!', `We're unable to insert this image. Share this Image url with us for debugging: ${url}`, ['Close', 'Report to Iconscout']);

  if (res.which === 1) {
    const reportUrl = `https://discuss.iconscout.com/new-topic?title=Unable%20to%20insert&body=Hi%20Team,%0AI%20am%20unable%20to%20download%20this%20image:%20${url}%0ACan%20you%20help%20me%20with%20it?.&category=Icondrop%20Plugin&tags=error`;
    require('uxp').shell.openExternal(reportUrl);
  }
}

module.exports = reportError;
