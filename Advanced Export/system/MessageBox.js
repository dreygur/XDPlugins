"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageBox {
    content(message, title, cls) {
        return `
                <style>
                    form {
                        width: 360px;
                    }
                    .h1 {
                        align-items: center;
                        justify-content: space-between;
                        display: flex;
                        flex-direction: row;
                    }
                    .icon {
                        border-radius: 4px;
                        width: 24px;
                        height: 24px;
                        overflow: hidden;
                    }
                    p{

                        ${cls}
                    }
                </style>
                <form method="dialog">
                    <h1 class="h1">
                        <span>${title}</span>
                        <img class="icon" src="./assets/icon.png" />
                    </h1>
                    <hr />
                    <p>${message}</p>
                    <footer>
                        <button type="submit" uxp-variant="cta">ok</button>
                    </footer>
                </form>
        `;
    }
    ShowWarning(message) {
        let cls = "color:red";
        let ourDialog = document.createElement("dialog");
        ourDialog.innerHTML = this.content(message, "export problem", cls);
        document.body.appendChild(ourDialog).showModal();
    }
    ShowMessage(message) {
        let ourDialog = document.createElement("dialog");
        ourDialog.innerHTML = this.content(message, "export", "");
        document.body.appendChild(ourDialog).showModal();
    }
}
exports.MessageBox = MessageBox;
