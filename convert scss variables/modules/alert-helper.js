let app = require("application"); 
const dom = sel => document.querySelector(sel);

function openAlert(title, msg) {
	document.body.innerHTML = `
<style>
    alert {
        display: flex;
        flex-direction: row-reverse;
    }
    #title {
        padding-bottom: 7px;
        border-bottom: 1px solid #ccc;
        font-size: 14px;
    }
</style>
<dialog id="alert">
    <form id="form" method="alert">
    	<h1 id="title">${getMessage(title)}</h1>
		<p>${getMessage(msg)}</p>
		<footer>
			<button id="ok" type="submit" uxp-variant="cta">OK</button>
		</footer>
	</form>
</dialog>
`;
	const alert = dom('#alert');
	const ok = dom('#ok');
	const cancelAlert = () => alert.close();
	ok.addEventListener('click', cancelAlert);
	ok.addEventListener('keypress', cancelAlert);

	return alert;
}

function getMessage(key){
    let messages = require('./message/message.json');
    return messages[key];
}

module.exports = 
{
    openAlert
}