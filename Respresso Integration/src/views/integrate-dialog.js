const { integrateWindow } = require("../../ui/integrate-window.js");
const settings = {
    serverAddress: "http://127.0.0.1:8080/api/weather", //"https://app.respresso.io",
    projectToken: null,
    export: "root",
    localization: true,
    color: true,
    image: true
}

class Dialog {

    constructor() { }

    async show() {
        const dialog = document.createElement("dialog")
        dialog.innerHTML = integrateWindow;
        document.body.appendChild(dialog)
        const form = dialog.querySelector("form")
        dialog.querySelector("button.cancel").addEventListener("click", () => {
            dialog.close();
            settings.serverAddress = undefined;
            settings.projectToken = undefined;
        });

        form.addEventListener("submit", (e) => {
            const serverAddress = form.querySelector(".input-server");
            const projectToken = form.querySelector(".input-token");
            const selection = form.querySelector(".selection-mode");
            const localization = form.querySelector(".checkbox-localization")
            const color = form.querySelector(".checkbox-color")
            const image = form.querySelector(".checkbox-image")
            const appicon = form.querySelector(".checkbox-appicon")

            e.preventDefault();

            if (!projectToken.value) document.getElementById("token").focus();
            else dialog.close({
                    server: serverAddress.value,
                    token: projectToken.value,
                    export: selection.value,
                    localization: localization.checked,
                    image: image.checked,
                    color: color.checked,
                    appicon: appicon.checked
                });
        });
        const res = await dialog.showModal();
        if (res) {
            settings.serverAddress = res.server;
            settings.projectToken = res.token;
            settings.export = res.export;
            settings.localization = res.localization;
            settings.color = res.color;
            settings.image = res.image;
            settings.appicon = res.appicon;
        }

        return settings;
    }
}

module.exports = Dialog;