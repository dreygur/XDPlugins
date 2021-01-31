const { resultWindow } = require("../../ui/result-window.js");

class ResultDialog {

    constructor() { }

    async show(result, detail) {
        const dialog = document.createElement("dialog")
        dialog.innerHTML = resultWindow;
        document.body.appendChild(dialog)

        const resultTitle = document.getElementById("result")
        const details = document.getElementById("details")

        if (result === "OK")
            resultTitle.textContent = "Integration successful";
        else {
            resultTitle.textContent = "Integration had an error";
            details.textContent = detail;
        }

        dialog.querySelector("button.cancel").addEventListener("click", () => {
            dialog.close();
        });

        await dialog.showModal();
        document.body.removeChild(dialog);
    }
}

module.exports = ResultDialog;