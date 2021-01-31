const { progressWindow } = require("../../ui/progress-window.js");

class ProgressDialog {

    constructor() {
        this.dialog = null
    }

    init() {
        const dialog = document.createElement("dialog");
        dialog.innerHTML = progressWindow;
        document.body.appendChild(dialog)

        //console.log(typeof RadialProgress)
        //var bar = new RadialProgress(document.getElementById("bar"),{indeterminate:true,colorFg:"#FFFFFF",thick:2.5,fixedTextSize:0.3});
        //this.container = document.createElement("div");

        /*const localization = document.getElementById("localization");
        var content = this.fillTextView(state.localization)
        localization.textContent = `localization: ${content.substring(0, content.length - 1)}`*/

        return dialog;
    }

    async show() {

        this.dialog = this.init();
        /*dialog.querySelector("button.cancel").addEventListener("click", () => {
            dialog.close();
        });

        dialog.addEventListener("submit", (e) => {
            e.preventDefault();

            dialog.close({ result: OK });
        });*/

        await this.dialog.showModal();
        document.body.removeChild(this.dialog);
    }

    hide(){
        this.dialog.close();
    }
}

module.exports = ProgressDialog;