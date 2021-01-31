const application = require("application")
const fs = require("uxp").storage.localFileSystem

const removeTheNotApproved = (unsanitized) => {
  return unsanitized.replace(/[\\:*?"<>|#]/g, '')
}

const dashesForSlashes = (unsanitized) => {
  return unsanitized.replace(/\//g, '-')
}

/**
 * Removes characters which are not allowed in file names and inserts dashes (-) for slashes.
 *
 * Removed: \:*?"<>|#
 * Dashed: /
 */
const sanitizeName = (unsanitized) => {
  return removeTheNotApproved(dashesForSlashes(unsanitized))
}

async function exportAt(selection, scale) {
  const renditionSettings = []
  const folder = await fs.getFolder()

  await Promise.all(selection.items.map(async (item) => {
    try {
      const file = await folder.createFile(`${sanitizeName(item.name)}.png`, {overwrite: true})
      renditionSettings.push({
        node: item,
        outputFile: file,
        type: application.RenditionType.PNG,
        scale: scale,
      })
    } catch (e) {
      console.log(e)
    }
  }))

  application.createRenditions(renditionSettings)
    // .then((results) => {})
    .catch((error) => {
      console.log(error)
    })
}

function exportDialog() {
  /**
   * Height and width need to be set up front. Can't them change later
   *
   * On Windows the size of dialog is constrained by the size of the window
   */
  const dialog = document.createElement("dialog")

  dialog.innerHTML = `
    <form method="dialog">
      <div>Which scale do you want to export at?</div>
      <footer>
        <button
          id="cancel"
          type="reset"
          uxp-variant="secondary"
          uxp-quiet="true"
        >Cancel</button>

        <button
          id="1x"
          type="button"
          uxp-variant="primary"
        >1x</button>

        <button
          id="2x"
          type="button"
          uxp-variant="primary"
        >2x</button>

        <button
          id="3x"
          type="button"
          uxp-variant="primary"
          autofocus="autofocus"
        >3x</button>
      </footer>
    </form>
  `

  let responseValue
  const closeOptions = {
    '#cancel': 'reasonCanceled',
    '#1x': 1,
    '#2x': 2,
    '#3x': 3,
  }

  // Listening to the 'close' event is the only way I can set the dialog
  // response when ENTER is pressed (otherwise it's just an empty string)
  dialog.addEventListener('close', (evt) => {
    dialog.close(responseValue)
  })

  Object.keys(closeOptions).forEach((key) => {
    // Clicking on a button will prepare the correct response value and then
    // directly close the dialog
    dialog.querySelector(key).addEventListener('click', () => {
      responseValue = closeOptions[key]
      dialog.close()
    })

    // Focusing on a button (like when TABbing through the buttons) will prepare
    // the correct response value when closing the dialog
    dialog.querySelector(key).addEventListener('focus', (evt) => {
      responseValue = closeOptions[key]
    })
  })

  // The only downside to the current approach is that the ESC key doesn't work
  // as expected. This event listener fixes that.
  dialog.addEventListener('keydown', (evt) => {
    // capture if ESC key is pressed and set the appropriate response value
    if (evt.keyCode === 27) {
      responseValue = 'reasonCanceled'
    }
  })

  document.appendChild(dialog)

  return dialog
}

function noSelectionDialog () {
  const dialog = document.createElement("dialog")

  dialog.innerHTML = `
    <form method="dialog">
      <h2>⚠️ Not so fast</h2>
      <p>Don't forget to select something to export :)</p>

      <footer>
        <button
          id="ok"
          type="submit"
          uxp-variant="cta"
        >OK, I will select something</button>
      </footer>
    </form>
  `
  document.appendChild(dialog)

  return dialog
}

async function showDialog(selection) {
  if (!selection.items.length) {
    const dialog = noSelectionDialog()
    await dialog.showModal()
    dialog.remove()
    return
  }

  const dialog = exportDialog()

  // `showModal` returns a Promise, that's why we await. If you're waiting for
  // dialog responses you need to make an async function so XD knows not to
  // close the document.
  const response = await dialog.showModal()

  if (response !== 'reasonCanceled' && typeof response === 'number') {
    exportAt(selection, response)
  }

  // If the dialog is not explicitly removed it will stay in RAM but won't be
  // visible to the user.
  dialog.remove()
}

module.exports = {
  commands: {
    "exportAtX": showDialog,
  },
}
