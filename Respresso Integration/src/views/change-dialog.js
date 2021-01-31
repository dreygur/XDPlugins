const { changeWindow } = require("../../ui/change-window.js");

class ChangeDialog {

    constructor() {

    }

    fillTextView(state, interested) {
        
        if (!interested) return "none ";
        else if (!state) return "not changed ";
        var content = "";

        if (state.create) content += ` create ${state.create} element(s),`;
        if (state.update) content += ` update ${state.update} element(s),`;
        if (state.delete) content += ` delete ${state.delete} element(s),`;
        if (state.none) content   += `unmodified ${state.none} element(s) `;

        return content;
    }

    init(state, interestedResources) {
        const dialog = document.createElement("dialog")
        dialog.innerHTML = changeWindow;
        document.body.appendChild(dialog)

        
        const localization = document.getElementById("localization");
        var content = this.fillTextView(state.localization, interestedResources.localization)
        localization.textContent = `localization: ${content.substring(0, content.length - 1)}`

        const image = document.getElementById("image")
        content = this.fillTextView(state.image, interestedResources.image)
        image.textContent = `image: ${content.substring(0, content.length - 1)}`

        const color = document.getElementById("color")
        content = this.fillTextView(state.color, interestedResources.color)
        color.textContent = `color: ${content.substring(0, content.length - 1)}`

        const appicon = document.getElementById("appicon")
        content = this.fillTextView(state.appIcon, interestedResources.appicon)
        appicon.textContent = `appIcon: ${content.substring(0, content.length - 1)}`

        return dialog;
    }

    async show(states, interestedResources) {

        const dialog = this.init(states, interestedResources);
        const form = dialog.querySelector("form")

        dialog.querySelector("button.cancel").addEventListener("click", () => {
            dialog.close();
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            dialog.close({ result: "OK" });
        });

        const res = await dialog.showModal();
        document.body.removeChild(dialog);
        return res.result;
    }
}

module.exports = ChangeDialog;