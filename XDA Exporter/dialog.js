// ダイアログを生成する
const showDialogY = (text) => {
    // create the dialog
    let dialog = document.createElement("dialog");

    // main container
    let container = document.createElement("div");
    container.style.minWidth = 400;
    container.style.padding = 40;

    // add content
    let title = document.createElement("h3");
    title.style.padding = 20;
    title.textContent = text;
    container.appendChild(title);

    // close button
    let closeButton = document.createElement("button");
    closeButton.textContent = "Yes";
    container.appendChild(closeButton);
    closeButton.onclick = (e) => {
        dialog.close();
    }

    document.body.appendChild(dialog);
    dialog.appendChild(container);
    dialog.showModal()
}

module.exports = {
    showDialogY
}