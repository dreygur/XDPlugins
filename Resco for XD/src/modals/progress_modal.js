
function createProgressBar(iconsLength) {
    document.body.innerHTML = `
        <style>
            #dialog form {
                width: 360px;
                text-align: center;
            }
            #progressBar {
                margin-top: 15px;
            }
            #percentageValue {
                font-weight: bold;
            }
        </style>
        <dialog id="dialog">
            <form method="dialog">
                <span>Please wait, your icons are being rendered:&nbsp<span id="percentageValue"></span></span>
                <progress id="progressBar" max="${iconsLength}" value="0"></progress>
            </form>
        </dialog>
    `;
    const [dialog, form] = [
    `dialog`,
    `form`
    ].map(s => document.querySelector(s));
    
    return dialog;
}

module.exports = createProgressBar;