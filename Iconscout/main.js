const Storage = require('./Storage.js')
const insertImage = require('./insertImage.js')
const replaceSelectionsWithImages = require('./replaceSelectionsWithImages.js')
const copySvgToClipboard = require('./copySvgToClipboard.js')
const canInsertInSelection = require('./canInsertInSelection.js')

global.settings = null
global.insertSVG = async (selection, file) => {
  await copySvgToClipboard(file)
}
global.insertRaster = async (selection, file) => {
  console.log('xd insertRaster', selection.items.length, file)
  if (canInsertInSelection(selection)) {
    await replaceSelectionsWithImages(selection, [file])
  } else {
    await insertImage(selection, file)
  }
}
global.insertSVGs = async (selection, files) => {
  await copySvgToClipboard(files[0])
}
global.insertRasters = async (selection, files) => {
  console.log('xd insertRasters', selection.items.length, files)
  // We can't fill if the Artboard is selected
  // Thus insertImage in case of Artboard is selected
  if (canInsertInSelection(selection)) {
    await replaceSelectionsWithImages(selection, files)
  } else {
    await insertImage(selection, files[0])
  }
}

global.log = (args) => {
  // const { method, data } = args
  console.log('log from xd web', args)

  // if (method === 'insertRaster') {
  //   console.log(data.url)
  //   const { editDocument } = require('application')

  //   editDocument({ editLabel: 'Increase rectangle size' }, function (selection) {
  //     global[method](selection, data)
  //   })
  // }
}

module.exports = {
  panels: {
    panelCommand: {
      async show (event) {
        // Load All Settings
        global.settings = await Storage.all()

        console.log('xd: settings loaded', global.settings)

        // Show Panel
        const getPanel = require('./main.common.js').getPanel
        event.node.appendChild(getPanel())
      },
      hide (event) {
        Storage.saveAll(global.settings).then(() => console.log('xd: storage saved.'))
        event.node.firstChild.remove()
      },
      update () {
        // console.log('update')
      }
    }
  },
  commands: {
    // menuCommand: async function (selection) {
    //   try {
    //     // Load All Settings
    //     global.settings = await Storage.all()
    //     console.log('xd: storage', global.settings)

    //     const getDialog = require('./main.common.js').getDialog
    //     const dialog = getDialog()
    //     dialog.addEventListener('close', () => {
    //       // dialog is closed at this point
    //       // Save Settings
    //       Storage.saveAll(global.settings).then(() => console.log('xd: storage saved.'))
    //     })

    //     const { method, data } = await dialog.showModal()

    //     // Do the activity in Artboard
    //     console.log('method', method)
    //     if (global[method]) {
    //       await global[method](selection, data)
    //     }
    //     // Else it'll just close the box
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    insertImage: async function (selection) {
      // Insert Image in the artboard
      // await insertImage(selection)

      // Fill Image to the Shape
      // await replaceSelectionsWithImages(selection)

      // Insert SVG
      console.log('selection is', selection.insertionParent, selection.items[0])
      await global.insertRasters(selection, [
        {
          format: 'png',
          url: 'https://cdn.iconscout.com/icon/premium/png-128-thumb/alert-20-106197.png',
          name: 'Tarun'
        }
      ])
    }
  }
}
