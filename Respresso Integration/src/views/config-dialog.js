const { configWindow } = require("../../ui/config-window.js");
const SelectionUtils = require('../utils/selection-utils');

const selectionUtils = new SelectionUtils();
class ConfigDialog {

    constructor() { }

    init(config) {
        const dialog = document.createElement("dialog")
        dialog.innerHTML = configWindow;
        document.body.appendChild(dialog)

        const team = document.getElementById("team");
        const project = document.getElementById("project");
        team.textContent = `${team.textContent}  ${config.teamTitle}`;
        project.textContent = `${project.textContent}  ${config.projectTitle}`;


        return dialog;
    }

    initSelectVisibility(select, isVisible){
        if (!isVisible) 
        select.parentElement.remove();
    }

    initSelect(config, initerestedResources) {
        const imageSelection = document.getElementById("images");
        const localizationSelection = document.getElementById("localizations");
        const colorSelection = document.getElementById("colors");
        const appiconSelection = document.getElementById("appicons");
        const langSelection = document.getElementById("lang");

        this.initSelectVisibility(imageSelection, initerestedResources.image);
        this.initSelectVisibility(localizationSelection, initerestedResources.localization);
        this.initSelectVisibility(langSelection, initerestedResources.localization);
        this.initSelectVisibility(colorSelection, initerestedResources.color);
        this.initSelectVisibility(appiconSelection, initerestedResources.appicon);

        config.categories.forEach(element => {
            if (element.categoryId === "localization") {
                this.addVersions(element.versions, localizationSelection)
            }
            else if (element.categoryId === "image") {
                this.addVersions(element.versions, imageSelection)
            } else if (element.categoryId === "color") {
                this.addVersions(element.versions, colorSelection)
            } else if (element.categoryId === "appIcon") {
                this.addVersions(element.versions, appiconSelection)
            }
        });
    }

    initListeners(dialog, loader, initerestedResources) {
        const form = dialog.querySelector("form")

        dialog.querySelector("button.cancel").addEventListener("click", () => {
            dialog.close();
        });

        const localizationSelection = document.getElementById("localizations");
        dialog.querySelector(".localizations").addEventListener("change", async () => {

            let version = localizationSelection.value;
            if (version === undefined) version = localizationSelection.tag;
            if (version === "none") return;
            loader.version.call(this, version);

        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const localization = dialog.querySelector(".localizations");
            const image = dialog.querySelector(".images");
            const color = dialog.querySelector(".colors");
            const appicon = dialog.querySelector(".appicons");
            const lang = dialog.querySelector(".lang");
            const result = {}

            if(initerestedResources.localization) result["localization"] = localization.value
            if(initerestedResources.localization) result["lang"] = lang.value
            if(initerestedResources.image) result["image"] = image.value
            if(initerestedResources.color) result["color"] = color.value
            if(initerestedResources.appicon) result["appicon"] = appicon.value

            dialog.close(result);
        });
    }

    addVersions(versions, selection) {
        versions.forEach(version => {
            if (version.editable) {
                var option = document.createElement("OPTION");
                option.setAttribute("value", version.version);
                if (selection.size === undefined) {
                    option.setAttribute("selected", "selected");
                    selection.value = version.version;
                    selection.tag = version.version;
                    selection.dispatchEvent(new Event('change'));
                }

                const text = document.createTextNode(version.version);
                option.appendChild(text);
                selection.appendChild(option);
                selection.size = 1
            }
        });
    }

    async show(config, loader, initerestedResources) {
        const dialog = this.init(config);
        this.initListeners(dialog, loader, initerestedResources);
        this.initSelect(config, initerestedResources);

        const res = await dialog.showModal();
        document.body.removeChild(dialog);
        if (res) return { localization: res.localization, image: res.image, color: res.color, lang: res.lang, appicon : res.appicon }
    }

    async updateLanguages(languages) {
        const langSelection = document.getElementById("lang");
        selectionUtils.updateSelection(langSelection, languages.config.languages, languages.config.defaultLanguage);
    }
}

module.exports = ConfigDialog;