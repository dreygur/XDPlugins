const { alert, error, prompt } = require("./lib/dialogs.js");

async function showAlert(Headline, Copy) {
    /* we'll display a dialog here */
    if (!Headline) {
        console.log('No heading found');
        Headline = 'Connect to the Internet';
    }
    if (!Copy) {
        console.log('No heading found');
        Copy = 'Connect to the Internet';
    }
    await alert(
        Headline, //[1]
        Copy
    ); //[2]
    
}
async function showError() {
    /* we'll display a dialog here */
    await error("Synchronization Failed", //[1]
"Failed to synchronize all your changes with our server. Some changes may have been lost.",
"Steps you can take:",
"* Save your document",
"* Check your network connection",
"* Try again in a few minutes"); //[2]
}




module.exports = {
    showAlert,
    showError
};
