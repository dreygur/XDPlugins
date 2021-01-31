/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const app = require('application');

class LanguageHelper {
    /**
     * @private
     * @type {{"error-selection-title": {default: string, de: string}, "error-selection-description": {default: string, de: string}, "modal-lorem-description": {default: string, de: string}, "modal-lorem-text-label": {default: string, de: string}, "modal-lorem-terminate-label": {default: string, de: string}, "modal-lorem-includeLineBreaks-label": {default: string, de: string}, "modal-lorem-trim-label": {default: string, de: string}, "modal-lorem-btn-ok": {default: string, de: string}, "modal-lorem-btn-cancel": {default: string, de: string}}}
     */
    static strings() {
        return {
            "exportText": {
                "default": "Export text",
                "de": "Text exportieren"
            },
            "capitalize": {
                "default": "Capitalize text",
                "de": "Großbuchstaben"
            },
            "replaceText": {
                "default": "Replace text…",
                "de": "Text Ersetzen…"
            },
            "replaceDescription": {
                "default": "Replace text in the currently selected text layers (Repeat Grids aren't supported, yet)",
                "de": "Text in ausgewählten Textebenen ersetzen (Wiederholungsraster werden noch nicht unterstützt)"
            },
            "replaceTextButton": {
                "default": "Replace text",
                "de": "Text Ersetzen"
            },
            "replaceUseRegex": {
                "default": "Use regular expressions (RegExp)",
                "de": "Reguläre Ausdrücke (RegExp) verwenden"
            },
            "replaceSearchLabel": {
                "default": "Search:",
                "de": "Suchbegriff:"
            },
            "replaceReplaceWithLabel": {
                "default": "Replace with:",
                "de": "Ersetzen durch:"
            },
            "replaceSelectionErrorTitle": {
                "default": "No text selected",
                "de": "Kein Text ausgewählt"
            },
            "replaceSelectionErrorText": {
                "default": "Please include at least one text layer in your selection and try again.",
                "de": "Bitte wählen Sie mind. einen Text aus und versuchen Sie es nochmal."
            },
            "trimSelectionErrorTitle": {
                "default": "No area text selected",
                "de": "Kein Flächentext ausgewählt"
            },
            "trimSelectionErrorText": {
                "default": "Please include at least one area text in your selection and try again.",
                "de": "Bitte wählen Sie mind. einen Flächentext aus und versuchen Sie es nochmal."
            },
            "loremSelectionErrorTitle": {
                "default": "No text selected",
                "de": "Kein Text ausgewählt"
            },
            "loremSelectionErrorText": {
                "default": "Please include at least one text layer in your selection and try again.",
                "de": "Bitte wählen Sie mind. einen Text aus und versuchen Sie es nochmal."
            },
            "copyHTMLSelectionErrorTitle": {
                "default": "Nothing selected",
                "de": "Nichts ausgewählt"
            },
            "copyHTMLSelectionErrorText": {
                "default": "Please include at least one layer in your selection and try again.",
                "de": "Bitte wählen Sie mind. ein Element aus und versuchen Sie es nochmal."
            },
            "modal-lorem-description": {
                "default": "Fills selected text element(s) with placeholder text.",
                "de": "Füllt das bzw. die ausgewählte(n) Textelement(e) mit Platzhaltertext."
            },
            "modal-lorem-text-label": {
                "default": "Placeholder text:",
                "de": "Platzhaltertext:"
            },
            "modal-lorem-terminate-label": {
                "default": "End with Period \".\"",
                "de": "Mit Satzzeichen \".\" abschließen"
            },
            "modal-lorem-includeLineBreaks-label": {
                "default": "Include line breaks",
                "de": "Zeilenumbrüche generieren"
            },
            "modal-lorem-trim-label": {
                "default": "Trim text area height to fit inserted text",
                "de": "Höhe dem eingefügten Text genau anpassen"
            },
            "modal-lorem-btn-ok": {
                "default": "Insert text",
                "de": "Text einfügen"
            },
            "insertText": {
                "default": "Insert text",
                "de": "Text einfügen"
            },
            "cancel": {
                "default": "Cancel",
                "de": "Abbrechen"
            },
            // Settings:
            "settingsTitle": {
                "default": "Text Toolbox Settings",
                "de": "Text Toolbox Einstellungen"
            },
            "settingsResetButtonText": {
                "default": "Reset plugin settings",
                "de": "Plugin-Einstellungen zurücksetzen"
            },
            "settingsResetText": {
                "default": "This resets all data saved by the plugin. That includes settings, defaults etc.",
                "de": "Dies setzt alle Daten des Plugins zurück. Das beinhaltet Einstellungen, Standardwerte etc."
            },
            "settingsResetHeading": {
                "default": "Reset Data",
                "de": "Daten löschen"
            },
            "saveSettings": {
                "default": "Save settings",
                "de": "Einstellungen speichern"
            },
            "experimental": {
                "default": "* This feature is currently in an experimental stage and some issues might occur.",
                "de": "* Die Funktion ist im Moment in einer experimentellen Phase und es könnte zu kleineren Fehlern kommen."
            },
            "trimHeight": {
                "default": "Adjust height",
                "de": "Höhe anpassen"
            },
            "lorem": {
                "default": "Lorem Ipsum…",
                "de": "Lorem Ipsum…"
            },
            "copyHTML": {
                "default": "Copy HTML*…",
                "de": "HTML kopieren*…"
            },
            "settings": {
                "default": "Settings…",
                "de": "Einstellungen…"
            },
            "help": {
                "default": "Help…",
                "de": "Hilfe…"
            },
            "copyHTMLTitle": {
                "default": "Copy HTML",
                "de": "HTML kopieren"
            },
            "copyHTMLText": {
                "default": "Copies markup for the selected nodes to clipboard as HTML.<br>This feature is currently in an experimental stage and some issues might occur.",
                "de": "Kopiert das HTML-Markup für die ausgewählten Elemente in die Zwischenablage.<br>Diese Funktion ist im Moment experimentell und es könnte zu kleineren Fehlern kommen."
            },
            "copyHTMLCTA": {
                "default": "Copy HTML to clipboard",
                "de": "HTML in Zwischenablage kopieren"
            },
            "copyHTMLIncludeComments": {
                "default": "Include layer name comments",
                "de": "Ebenennamen als Codekommentare generieren"
            },
            "copyHTMLUnderlineTag": {
                "default": "Underline-Tag",
                "de": "Tag für Unterstrichenes"
            },
        };
    }

    /**
     * The app language
     * @type {string}
     * @private
     */
    static lang() {
        return app.appLanguage
    };

    /**
     *
     * @param {string} key The key of the translated string
     * @return {*|string} The translated string or – if not available – the default value.
     * @throws {Error} if the `key` was not found
     */
    static getString(key) {
        if (Object.keys(LanguageHelper.strings()).includes(key)) {
            const translationObject = LanguageHelper.strings()[key];
            return translationObject[LanguageHelper.lang()] || translationObject.default;
        } else {
            throw new Error('Translation for "' + key + '" was not defined.')
        }
    }
}

module.exports = LanguageHelper;