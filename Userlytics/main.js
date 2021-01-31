const $ = sel => document.querySelector(sel);
const env = 'prod';
const publicUrl = env === 'pre' ? 'https://dev.userlytics.com' : 'https://www.userlytics.com';
const apiUrl = env === 'pre' ? 'https://api-dev.userlytics.com' : 'https://api.userlytics.com';
const req = require("uxp");
const INFINITE_CREDITS = 999999;
var token = '';
var creditsPanel = 0;
var creditsClient = 0;
var studyHash = '';

function createDialog() {
    var id = "dialog"
    const sel = `#${id}`;
    let dialog = document.querySelector(sel);
    if (dialog) {
        console.log("Reusing old dialog");
        return dialog;
    }

    document.body.innerHTML = `
<style>
    h1, h2, h3, h4, p {
        width: 100%;
    }

    dialog {
        height: 520px;
    }

    ${sel} h1 {
        margin-bottom: 20px;
    }

    ${sel} > div, ${sel} form {
        width: 300px;
    }

    ${sel} form input {
        width: 80%;
    }

    .header {
    	margin: 0 auto 20px auto;
    }

    h3 {
    	margin-bottom: 10px;
    }

    #builder-1, #builder-2, #builder-3, #builder-4 {
        display: none;
    }

    .new-account span {
        color: blue;
        display: block;
        cursor: pointer;
    }

    #asset_type{
        display: none;  
    }

    .center {
        margin: 0 auto;
        text-align: center;
        padding:5px;
    }

    .hint {
        font-size: 10pt;
    }

    .hidden {
        display: none;
    }

    .error {
        color: #de3434;
    }
</style>
<dialog id="${id}">
	<img class="header" src="./images/logo_bubble.png" height="100" />
    <div id="login">
        <form method="dialog">
        	<p>Remember to copy your Prototype public link:</p>
            <p class="hint">You can find your prototype URl by clicking on the Share button (top right corner) and then on Publish Prototype.</p>
            <label>
                <span>Please enter your credentials</span>
                <input uxp-quiet="true" type="text" id="email" placeholder="Email"/>
            </label>
            <label>
                <input uxp-quiet="true" type="password" id="password" placeholder="Password"/>
            </label>
            <div class="new-account">
                <p>Don't have an account? <span id="new-client">Create your free account</span></p>
            </div>
            <p id="auth-error" class="error"></p>
            <footer>
                <button type="button" id="cancel">Cancel</button>
                <button type="submit" id="auth" uxp-variant="cta" data-working-text="Checking..." data-default-text="OK">OK</button>
            </footer>
        </form>
    </div>
    <div id="builder-1">
        <h3>Create study</h3>
        <form method="dialog">
            <label>
                <span>Test name</span>
                <input uxp-quiet="true" type="text" id="sty_name" name="sty_name" placeholder="Name"/>
            </label>
            <label>
                <span>Participants Access</span>
                <select id="sty_participants_access" name="sty_participants_access">
                    <option value="1" selected>Desktop</option>
                    <option value="2">Smartphone</option>
                    <option value="3">Tablet</option>
                </select>
            </label>
            <footer>
                <button type="button" class="cancel">Cancel</button>
                <button type="submit" id="continue-1" uxp-variant="cta">Continue</button>
            </footer>
        </form>
    </div>
    <div id="builder-2">
        <h3>Create study</h3>
        <form method="dialog">
            <label>
                <span>Source of Participants</span>
                <select id="sty_recruitment" name="sty_recruitment">
                    <option value="panel" selected>Userlytics Panel</option>
                    <option value="client">Client Supplies</option>
                </select>
            </label>
            <label>
                <span>Number of Participants <span id="participants-max"></span></span>
                <input type="number" id="sty_participants" name="sty_participants" />
            </label>
            <p id="participants-error" class="error"></p>
            <footer>
                <button type="button" class="back">Back</button>
                <button type="submit" id="continue-2" uxp-variant="cta">Continue</button>
            </footer>
        </form>
    </div>
    <div id="builder-3">
        <h3>Create study</h3>
        <form method="dialog">
            <input type="hidden" class="hidden" id="app_website" name="app_website" value="app" />
            <input type="hidden" class="hidden" id="asset_type" name="asset_type" value="prototype" />
            <input type="hidden" class="hidden" id="sty_prototype_platform" name="sty_prototype_platform" value="web-platforms" />
            <label id="mobile-field">
                <span>Mobile OS</span>
                <select id="mobile_os" name="mobile_os">
                    <option value="android" selected>Android</option>
                    <option value="ios">iOS</option>
                    <option value="both">Both</option>
                </select>
            </label>
            <label>
                <span>Prototype URL</span>
                <p class="hint">You can find your prototype URl by clicking on the Share button (top right corner) and then on Publish Prototype.</p>
                <input type="text" id="sty_prototype_platform_info" name="sty_prototype_platform_info" />
            </label>
            <p id="prototype-error" class="error"></p>
            <footer>
                <button type="button" class="back2">Back</button>
                <button type="submit" id="continue-3" uxp-variant="cta" data-working-text="Creating..." data-default-text="Create">Create</button>
            </footer>
        </form>
    </div>
    <div id="builder-4">
        <form method="dialog">
            <h3 class="center">Study Created!</h3>
            <p class="center">Your study has been created!</p>
            <p class="center">Now you can add tasks to your test script.</p>
            <footer>
                <button type="submit" id="edit-script" uxp-variant="cta">Go to Test Script</button>
                <button id="close">Close</button>
            </footer>
        </form>
    </div>
</dialog>
`;

    dialog = document.querySelector(sel);

    const [form, cancel, auth, name, continue1, continue2, continue3, close, newClient, cancel2, back, back2, editScript, passwordField, participantsField, recruitmentSelect] = [`${sel} form`, "#cancel", "#auth", "#name", "#continue-1", "#continue-2", "#continue-3", "#close", "#new-client", ".cancel", ".back", ".back2", "#edit-script", "#password", "#sty_participants", "#sty_recruitment"].map(s => $(s));


    newClient.addEventListener("click", () => {
        goToURL('client');
    });

    cancel.addEventListener("click", (e) => {
        e.preventDefault();
        dialog.close();
    });

    auth.addEventListener("click", e => {
        e.preventDefault();
        apiLogin(auth);
    });

    editScript.addEventListener("click", () => {
        goToURL('client/study/hash/' + studyHash)
    });

    cancel2.addEventListener("click", () => {
        dialog.close();
    });

    back.addEventListener("click", () => {
        gotoBack(2);
    });

    back2.addEventListener("click", () => {
        gotoBack(3);
    });

    participantsField.addEventListener("keydown", (e) => {
    	console.log('keydown');
		var theEvent = e || window.event;

		// Handle paste
		if (theEvent.type === 'paste') {
			key = event.clipboardData.getData('text/plain');
		} else {
			// Handle key press
			var key = theEvent.keyCode || theEvent.which;
			key = String.fromCharCode(key);
		}
		console.log(key);
		var regex = /[0-9]|\./;
		if( !regex.test(key) ) {
			console.log('Not valid');
			theEvent.returnValue = false;
			if (theEvent.preventDefault) {
				console.log('Prevent default');
				theEvent.preventDefault();
			}
		}
		console.log('End');
    });

    recruitmentSelect.addEventListener('change', (e) => {
    	console.log('Recruitment changed to ' + recruitmentSelect.value);
        var participantsMaxElement = document.getElementById('participants-max');
        participantsMaxElement.innerHTML = '(max: ' + participantsMaxElement.getAttribute('data-' + recruitmentSelect.value) + ')';
    });

    continue1.addEventListener("click", e => {
        e.preventDefault();
        if (validate('sty_name') && validateSelect('sty_participants_access')) {
            screenFlow(false, false, true, false, false)
        }
    });
    continue2.addEventListener("click", e => {
        e.preventDefault();
        document.getElementById('participants-error').innerHTML = '';
        if (validate('sty_participants') && validateSelect('sty_recruitment')) {
            if (validateParticipants()) {
                screenFlow(false, false, false, true, false);
            } else {
                document.getElementById('participants-error').innerHTML = 'We are sorry but you don\'t have enough credits to add this amount of participants. Please, contact us at info@userlytics.com if you want to purchase more credits.';
            }
        }
    });
    continue3.addEventListener("click", e => {
        e.preventDefault();
        document.getElementById('prototype-error').innerHTML = '';
        if (validate('asset_type') && validate('sty_prototype_platform_info')) {
        	if (isValidUrl(document.getElementById('sty_prototype_platform_info').value)) {
            	apiStudy(continue3);
	        } else {
	        	document.getElementById('prototype-error').innerHTML = 'The prototype URL is not a valid URL';
	        }
        }
    });

    close.addEventListener("click", () => {
        dialog.close();
        dialog.parentNode.removeChild(dialog);
    });

    fixSelectedOptions();

    return dialog;
}

/*validation functions*/

function validateParticipants() {
    var recruitment = document.getElementById('sty_recruitment').value;
    var participants = document.getElementById('sty_participants').value;
    var valid = false;
    if (recruitment === 'panel') {
        valid = creditsPanel == INFINITE_CREDITS || participants <= creditsPanel;
    } else if (recruitment === 'client') {
        valid = creditsClient == INFINITE_CREDITS || participants <= creditsClient;
    }
    return valid;
}

function validate(element) {
    let variable = document.getElementById(element);
    if (variable.value == "") {
        console.log('the field is empty');
        variable.focus();
        return false;
    }
    return true;
}

function validateSelect(element) {
    let variable = document.getElementById(element);
    if (variable._selectedOptions == null) {
        console.log('the selectbox is empty');
        return false;
    }
    return true;
}

function isValidUrl(url) {
    try {
        new URL(url);
        console.log('Valid URL');
        return true;
    } catch (_) {
        console.log('Invalid URL');
        return false;
    }
}

async function screenFlow(login, screen1, screen2, screen3, screen4) {
    console.log('Changing screen...');
    let loginDiv = document.getElementById('login');
    let builder1 = document.getElementById('builder-1');
    let builder2 = document.getElementById('builder-2');
    let builder3 = document.getElementById('builder-3');
    let builder4 = document.getElementById('builder-4');

    loginDiv.style.display = (!login) ? 'none' : 'block';
    builder1.style.display = (!screen1) ? 'none' : 'block';
    builder2.style.display = (!screen2) ? 'none' : 'block';
    builder3.style.display = (!screen3) ? 'none' : 'block';
    builder4.style.display = (!screen4) ? 'none' : 'block';

    if (screen3) {
        console.log('Checking mobile OS');
        checkIfMobileOSShouldBeShown();
    }
}

function gotoBack(step) {
    if (step == 2) {
        screenFlow(false, true, false, false, false)
    } else if (step == 3) {
        screenFlow(false, false, true, false, false)
    }
    return false;
}

function goToURL(url) {
    req.shell.openExternal(publicUrl + "/" + url);
}

function fixSelectedOptions() {
    var selects = document.getElementsByTagName('select');
    for (var i = 0, max = selects.length; i < max; i++) {
        var select = selects[i];
        var selectedOption = select.querySelector('option[selected]');
        if (selectedOption !== undefined) {
            select.value = selectedOption.value;
        }

    }
}

function checkIfMobileOSShouldBeShown() {
    var participantsAccess = document.getElementById('sty_participants_access').value;
    var mobileOsField = document.getElementById('mobile-field');
    console.log('Participants access: ' + participantsAccess);
    if (parseInt(participantsAccess) === 1) {
        console.log('Hidding mobile OS');
        mobileOsField.style.display = 'none';
    } else {
        console.log('Showing mobile OS');
        mobileOsField.style.display = 'block';
    }
}

function apiLogin(authButton) {
    if (authButton.getAttribute('working')) {
        return;
    }
    var errorParagraph = document.getElementById('auth-error');
    if (validate('email') && validate('password')) {
        errorParagraph.innerHTML = '';
        var body = {
            'email': document.getElementById('email').value,
            'password': document.getElementById('password').value,
            'type': 'client'
        };
        var success = function(json) {
            token = json.token;
            // TODO: Save token on disk
            apiClientCredits(authButton, errorParagraph);
        };
        var failure = function(json) {
            authButton.innerHTML = authButton.getAttribute('data-default-text');
            authButton.removeAttribute('working');
            if (json instanceof Object) {
                errorParagraph.innerHTML = 'Invalid credentials';
            } else {
                errorParagraph.innerHTML = json;
            }
        };
        authButton.innerHTML = authButton.getAttribute('data-working-text');
        authButton.setAttribute('working', 'true');
        api('POST', apiUrl + '/v1/auth/login', token, body, success, failure);
    } else {
        errorParagraph.innerHTML = 'Please fill your email and/or password';
    }
}

function apiClientCredits(authButton = undefined, errorParagraph = undefined) {
    var success = function(json) {
        // TODO: Save credits locally
        creditsPanel = json.cli_credits_panel;
        creditsClient = json.cli_credits_client;
        if (authButton) {
            authButton.innerHTML = authButton.getAttribute('data-default-text');
            authButton.removeAttribute('working');
        }
        var participantsMaxElement = document.getElementById('participants-max');
        participantsMaxElement.setAttribute('data-panel', creditsPanel < INFINITE_CREDITS ? creditsPanel : 'Infinite');
        participantsMaxElement.setAttribute('data-client', creditsClient < INFINITE_CREDITS ? creditsClient : 'Infinite');
        participantsMaxElement.innerHTML = '(max: ' + creditsPanel + ')';
        screenFlow(false, true, false, false, false);
    };
    var failure = function(json) {
        if (authButton) {
            authButton.innerHTML = authButton.getAttribute('data-default-text');
            authButton.removeAttribute('working');
        }
        if (errorParagraph) {
            errorParagraph.innerHTML = 'Unknown error';
        }
    };
    api('GET', apiUrl + '/v1/client/credits', token, {}, success, failure);
}

function apiStudy(createButton) {
    if (createButton.getAttribute('working')) {
        return;
    }
    var success = function(json) {
        createButton.innerHTML = createButton.getAttribute('data-default-text');
        createButton.removeAttribute('working');
        studyHash = json.sty_hash;
        screenFlow(false, false, false, false, true);
    };
    var failure = function(json) {
        createButton.innerHTML = createButton.getAttribute('data-default-text');
        createButton.removeAttribute('working');
        // Show error message
        var messages = [];
        if (json instanceof Object) {
            var messages = [];
            Object.keys(json.data).forEach(function(key, index) {
            	messages.push(json.data[key].join('<br />'));
            });
            messages = messages.join('<br />');
        } else {
            messages = json;
        }
        document.getElementById('prototype-error').innerHTML = messages;
    };
    var body = {
        sty_name: document.getElementById('sty_name').value,
        sty_participants_access: document.getElementById('sty_participants_access').value,
        sty_recruitment: document.getElementById('sty_recruitment').value,
        sty_participants: document.getElementById('sty_participants').value,
        asset_type: document.getElementById('asset_type').value,
        mobile_os: document.getElementById('mobile_os').value,
        app_website: document.getElementById('app_website').value,
        sty_prototype_platform: document.getElementById('sty_prototype_platform').value,
        sty_prototype_platform_info: document.getElementById('sty_prototype_platform_info').value
    };
    createButton.innerHTML = createButton.getAttribute('data-working-text');
    createButton.setAttribute('working', 'true');
    document.getElementById('prototype-error').innerHTML = '';
    api('POST', apiUrl + '/v1/study/create', token, body, success, failure)
}

function api(method, url, token = '', bodyObject = {}, successCallback = null, failureCallback = null) {
    console.log(method + ': ' + url);

    fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Token': token
        },
        body: serialize(bodyObject)
    })
    .then(function(response) {
        console.log('Response: ' + response.status);
        if (!response.ok) { 
            throw response;
        }
        return response.json();
    })
    .then(function(json) {
        if (successCallback) {
            successCallback(json);
        }
    })
    .catch(function(error) {
        console.log(error);
        if (failureCallback) {
            if (error instanceof TypeError) {
                failureCallback('Network Error');
            } else {
                error.json().then(json => {
                    failureCallback(json);
                });
            }
        }
    });
}

function serialize(obj, prefix) {
    var str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
            v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

async function MainFunction(selection) {
    // TODO: check token so if exists, trigger clientCredits api call and jump to test builder
    const dialog = createDialog();

    try {
        const r = await dialog.showModal();
        if (r) {
            console.log(`Your name is ${r}`);
        }
    } catch (err) {
        console.log("ESC dismissed dialog");
    }

}

module.exports = {
    commands: {
        MainFunction
    }
};
