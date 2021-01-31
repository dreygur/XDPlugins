"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetName(str) {
    let a = str.replace(/\ /g, "_").replace(/\-/g, "_").toLowerCase();
    let ChosenName = "";
    let capslock = false;
    for (var i = 0; i < a.length; i++) {
        if (a[i] >= 'a' && a[i] <= 'z')
            ChosenName += capslock ? a[i].toString().toUpperCase() : a[i];
        if (a[i] >= '0' && a[i] <= '9')
            ChosenName += a[i];
        capslock = false;
        if (a[i] == '_') {
            ChosenName += a[i];
            capslock = true;
        }
    }
    while (a.indexOf("__") >= 0)
        a = a.replace("__", "_");
    return ChosenName;
}
exports.GetName = GetName;
function MessageBox(msg) {
    let dialog;
    dialog = document.createElement("dialog");
    let form = document.createElement("form");
    dialog.appendChild(form);
    form.style.width = "600";
    let hello = document.createElement("h1");
    hello.textContent = msg;
    form.appendChild(hello);
    let footer = document.createElement("footer");
    form.appendChild(footer);
    let closeButton = document.createElement("button");
    closeButton.uxpVariant = "cta";
    closeButton.textContent = "Close";
    closeButton.onclick = (e) => dialog.close();
    footer.appendChild(closeButton);
    document.body.appendChild(dialog).showModal();
}
exports.MessageBox = MessageBox;
