
function create(filepath) {
    // Add your HTML to the DOM
    document.body.innerHTML = `
      <style>
      form {
          width: 400px;
      }
      </style>
      <dialog id="dialog">
          <form method="dialog">
              <h1>PPT saved</h1>
              <p>Your ppt file was saved at:</p>
              <input type="text" uxp-quiet="true" value="${filepath}" readonly />
              <footer>
              <button type="submit" uxp-variant="cta" id="ok-button">OK</button>
              </footer>
          </form>
      </dialog>
    `;
  
    // Remove the dialog from the DOM every time it closes.
    // Note that this isn't your only option for DOM cleanup.
    // You can also leave the dialog in the DOM and reuse it.
    // See the `ui-html` sample for an example.
    const dialog = document.querySelector("#dialog");
    dialog.addEventListener("close", e => dialog.remove());
  
    return dialog;
  }

  exports.create = create;