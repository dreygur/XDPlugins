class SelectionUtils {

    updateSelection(selection, list, defaultLanguage) {
        this.defaultLanguage = defaultLanguage;
        let selectionChildCount = selection.options.length;
        if (selectionChildCount < list.length) this.listIsBigger(selection, selectionChildCount, list)
        else if (selectionChildCount > list.length) this.childCountIsBigger(selection, selectionChildCount, list)
        else this.listAndChildCountEqual(selection, list)
    }

    listIsBigger(selection, selectionSize, list) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (index < selectionSize) {
                const option =this.updateChild(selection.options[index], element, this.defaultLanguage, element);
                selection.appendChild(option);
            }
            else {
                const option = this.addChild(element, this.defaultLanguage, element);
                selection.appendChild(option);
            }
        }
    }

    childCountIsBigger(selection, selectionSize, list) {
        while(selection.options.length != list.length){
            const option = selection.options[0];
            option.remove();
        }
        this.listAndChildCountEqual(selection, list);
    }

    listAndChildCountEqual(selection, list) {
        for (let index = 0; index < list.length; index++) {
            const element = selection.options[index];
            if (index < list.length) {
                const option = this.updateChild(element, list[index], this.defaultLanguage, list[index]);
                selection.appendChild(option);
            }
        }
    }

    updateChild(option, lang, defautLang, text) {
        option.remove()
        return this.addChild(lang, defautLang, text)
    }

    addChild(lang, defautLang, text) {
        var option = document.createElement("OPTION");
        option.setAttribute("value", lang);

        if (lang === defautLang)
            option.setAttribute("selected");

        const optionText = document.createTextNode(text);
        option.appendChild(optionText);
        return option;
    }

    removeChild(element) {
        element.remove();
    }

}

module.exports = SelectionUtils;