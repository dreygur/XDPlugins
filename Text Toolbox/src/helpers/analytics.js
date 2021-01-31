/*
 * Copyright (c) 2019. by Pablo Klaschka
 */

const storage = require('./storage');
let analyticsModal = null;


class analyticsHelper {
    static async send(feature, options) {
        let req = new XMLHttpRequest();
        req.open('POST', 'https://xdplugins.pabloklaschka.de/_api/submit');
        req.send(JSON.stringify({
            plugin_name: 'Text Toolbox',
            feature: feature,
            options: options
        }));
    }

    /**
     * Verifies that the user has accepted the privacy policy.
     * @param passedOptions
     * @param {string} passedOptions.pluginName
     * @param {string} passedOptions.privacyPolicyLink
     * @param {string} passedOptions.color
     * @return {Promise<boolean>}
     */
    static async verifyAcceptance(passedOptions) {
        if (await storage.get('analytics-accepted', false)) {
            return true;
        } else {
            let options = {
                pluginName: 'My plugin',
                privacyPolicyLink: 'https://www.mysite.com/privacy',
                color: '#2D4E64',
            };
            Object.assign(options, passedOptions);

            if (await this.dialog(options)) {
                await storage.set('analytics-accepted', true);
                return true;
            } else {
                throw new Error('Privacy policy wasn\'t accepted');
            }
        }
    }


    /**
     * @private
     * @param {object} options
     * @param {string} options.pluginName
     * @param {string} options.privacyPolicyLink
     * @param {string} options.color
     * @return {Promise<boolean>}
     */
    static async dialog(options) {

        if (!analyticsModal) {
            analyticsModal = document.createElement("dialog");
            analyticsModal.innerHTML = `
<style>
    header {
        background: ${options.color};
        height: 16px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
    }
    
    main {
        overflow-y: auto;
    }

    form {
        width: 640px;
        overflow-y: auto;
    }
    h1 {
        align-items: center;
        justify-content: space-between;
        display: flex;
        flex-direction: row;
    }
    
    input {
    width: 18px;
    }
    
    input[type="checkbox"] {
    width: 18px;
    }
</style>
<form method="dialog">
    <header></header>
    <main>
    <h1>
        <span>Analytics</span>
    </h1>
    <hr />
    <p>To enhance your experience when using the plugin, completely anonymous data regarding your usage will get submitted to (secure) servers in Germany. The submitted data doesn't include any user id or similar means of identifying specific users. Since data gets submitted to our servers in the form of HTTP requests, you'll have to accept the privacy policy <a href="${options.privacyPolicyLink}">${options.privacyPolicyLink}</a>to use the plugin.
</p>
<h2>Data that gets submitted:</h2>
<p>Data that's technically required to perform an HTTP request, a timestamp (current date and time), the plugin that gets used (i.e. ${options.pluginName}), the feature that gets used (e.g., which menu item selected) and the options that get used (e.g., categorical settings you set in dialogs).
</p>
<h2>Data that explicitly won't get submitted:</h2>
<p>Any data identifying you (e.g., user ids or similar), any data regarding your document, files on your computer or similar, any data that I didn't list above in "Data that gets submitted"
</p>
    <label style="flex-direction: row; align-items: center;">
        <input type="checkbox" /><span>I have read and accepted the privacy policy (${options.privacyPolicyLink})</span>
    </label>
    </main>
    <footer>
        <button id="cancel" uxp-variant="primary">Cancel</button>
        <button id="ok" type="submit" uxp-variant="cta">Accept</button>
    </footer>
</form>
        `;
        }

        document.querySelector('body').appendChild(analyticsModal);

        let form = document.querySelector('form');

        function onsubmit() {
            analyticsModal.close("ok");
        }

        form.onsubmit = onsubmit;

        const cancelButton = document.querySelector("#cancel");
        cancelButton.addEventListener("click", () => analyticsModal.close("reasonCanceled"));

        const okButton = document.querySelector("#ok");
        okButton.disabled = true;
        okButton.addEventListener("click", e => {
            onsubmit();
            e.preventDefault();
        });

        const checkbox = document.querySelector('input');
        checkbox.checked = false;
        checkbox.addEventListener('change', e => {
            console.log('checkbox: ', e.target.checked);
            okButton.disabled = !e.target.checked;
        });


        Object.assign(document.querySelector('label').style, {flexDirection: "row", alignItems: "center"});

        const pseudo = document.createElement('div');
        pseudo.appendChild(checkBox('Test', false));

        console.log(pseudo.innerHTML);

        return (await analyticsModal.showModal()) === 'ok';
    }
}


function checkBox(label, defaultChecked) {
    const lblCheck = document.createElement("label");
    Object.assign(lblCheck.style, {flexDirection: "row", alignItems: "center"});
    // lblCheck.class = 'row';
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = label;
    checkBox.placeholder = label;
    if (defaultChecked) {
        checkBox.checked = true;
    }
    lblCheck.appendChild(checkBox);
    const spanLblCheck = document.createElement('span');
    spanLblCheck.innerHTML = label;
    lblCheck.appendChild(spanLblCheck);

    return lblCheck;
}


module.exports = analyticsHelper;