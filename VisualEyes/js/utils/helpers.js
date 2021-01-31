const fs = require("uxp").storage.localFileSystem;
const formats = require("uxp").storage.formats;
const shell = require("uxp").shell;

async function createToastMessage(message) {
  document.body.innerHTML = `
    <dialog id="dialog">
      <form>
        <p>${message}</p>
        <footer>
          <button id="button" type="submit" uxp-variant="primary">Close</button>
        </footer>
      </form>
    </dialog>
  `;
  const dialog = document.querySelector("#dialog");
  dialog.addEventListener("submit", () => {
    dialog.remove();
  });

  setTimeout(() => dialog.remove(), 6000);
  dialog.showModal();
}

function createToastMessageWithTitle(title, message) {
  document.body.innerHTML = `
    <dialog id="dialog">
      <form>
        <h1 style="text-align:center;">${title}</h1>
        <div style="display: flex; flexDirection: row; justifyContent: space-around; align-items:center; padding: 16px; background-color: white; borderRadius: 8px; border: solid 1px rgba(29, 15, 104,0.1); margin: 2rem 0 1rem 0;"><p>${message}</p></div>
        <footer>
          <button id="button" type="submit" uxp-variant="primary">Close</button>
        </footer>
      </form>
    </dialog>
  `;
  const dialog = document.querySelector("#dialog");
  dialog.addEventListener("submit", () => {
    dialog.remove();
  });

  setTimeout(() => dialog.remove(), 6000);
  dialog.showModal();
}

function createToastMessageWithCTA(title, message, ctaMessage, link) {
  document.body.innerHTML = `
    <dialog id="dialog">
      <form>
        <h1>${title}</h1>
        <p>${message}</p>
        <footer>
          <button id="close" type="close">Close</button>
          <button id="cta" type="submit" uxp-variant="cta">${ctaMessage}</button>
        </footer>
      </form>
    </dialog>
  `;

  const dialog = document.querySelector("#dialog");
  dialog.addEventListener("submit", () => {
    shell.openExternal(link);
  });

  const cancelButton = document.querySelector("#close");
  dialog.addEventListener("click", () => {
    dialog.remove();
  });

  const ctaButton = document.querySelector("#cta");
  ctaButton.addEventListener("click", () => {
    shell.openExternal(link);
  });

  // setTimeout(() => dialog.remove(), 6000);
  dialog.showModal();
}

function createFinishDialog(title, message, hint, ctaMessage, link) {
  document.body.innerHTML = `
    <dialog id="dialog">
      <form>
        <h1>${title}</h1>
        <p>${message}</p>
        <p><b>${hint}</b></p>
        <footer>
          <button id="close" type="close">Close</button>
          <button id="cta" type="submit" uxp-variant="cta">${ctaMessage}</button>
        </footer>
      </form>
    </dialog>
  `;

  const dialog = document.querySelector("#dialog");
  dialog.addEventListener("submit", () => {
    shell.openExternal(link);
  });
  const cancelButton = document.querySelector("#close");
  dialog.addEventListener("click", () => {
    dialog.remove();
  });

  const ctaButton = document.querySelector("#cta");
  ctaButton.addEventListener("click", () => {
    shell.openExternal(link);
  });

  // setTimeout(() => dialog.remove(), 6000);
  dialog.showModal();
}

async function getApiKey() {
  const folder = await fs.getDataFolder();
  const entries = await folder.getEntries();

  const settingsFile = entries.find((entry) => entry.name === "settings.txt");

  let apiKey = "";
  if (settingsFile) {
    apiKey = await settingsFile.read({ format: formats.utf8 });
    return apiKey;
  } else {
    try {
      createToastMessage(`🤔 Please, set your API key first!`);
      return null;
    } catch (e) {}
  }
}

module.exports = {
  getApiKey,
  createFinishDialog,
  createToastMessage,
  createToastMessageWithTitle,
  createToastMessageWithCTA,
};
