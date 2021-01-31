const { ImageFill } = require('scenegraph')

async function getImageToFill(selection, image) {
  return fillImage(selection, image)
}

async function getRandomInspirations(selection) {
  const url = `https://designhunt.us/api/feed/getImagesForPlugin?count=25&source=Adobe%20XD`
  const imageUrl = await fetch(url)
  const json = await imageUrl.json()
  return appendImageToPanel(json, selection)
}

async function appendImageToPanel(jsonResponse, selection) {
  function exec(photoUrl) {
    // [2]
    const { editDocument } = require('application') // [3]
    // [6]
    editDocument(async function(selection) {
      await getImageToFill(selection, photoUrl)
    })
  }

  let imagePlaceholder = document.querySelector('#addMe')

  jsonResponse.forEach(item => {
    const photoUrl = item

    let html =
      '<img src="' +
      photoUrl +
      '" data-message="' +
      photoUrl +
      '" value="" width="100%"/>'
    var z = document.createElement('div') // is a node
    z.innerHTML = html
    z.addEventListener('click', () => exec(photoUrl))
    z.selectionParam = selection
    imagePlaceholder.appendChild(z)
  })
}

async function fillImage(selection, imageUrl) {
  var selected
  for (selected in selection.items) {
    try {
      const photoObj = await xhrBinary(imageUrl)
      const photoObjBase64 = await base64ArrayBuffer(photoObj)
      applyImagefill(selection.items[selected], photoObjBase64)
    } catch (err) {
      console.log('error')
      console.log(err.message)
    }
  }
}

async function downloadImage(selection, jsonResponse) {
  var selected
  for (selected in selection.items) {
    try {
      const photoUrl = jsonResponse[selected]

      let imagePlaceholder = document.querySelector('#addMe')
      console.log(imagePlaceholder)
      let html = '<img src="' + photoUrl + '"/>'
      console.log(html)
      var z = document.createElement('div') // is a node
      z.innerHTML = html
      imagePlaceholder.appendChild(z)

      const photoObj = await xhrBinary(photoUrl)
      const photoObjBase64 = await base64ArrayBuffer(photoObj)
      applyImagefill(selection.items[selected], photoObjBase64)
    } catch (err) {
      console.log('error')
      console.log(err.message)
    }
  }
}

function xhrBinary(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.onload = () => {
      if (req.status === 200) {
        try {
          const arr = new Uint8Array(req.response)
          resolve(arr)
        } catch (err) {
          reject('Couldnt parse response. ${err.message}, ${req.response}')
        }
      } else {
        reject('Request had an error: ${req.status}')
      }
    }
    req.onerror = reject
    req.onabort = reject
    req.open('GET', url, true)
    req.responseType = 'arraybuffer'
    req.send()
  })
}

function applyImagefill(selection, base64) {
  const imageFill = new ImageFill(`data:image/jpeg;base64,${base64}`)
  selection.fill = imageFill
}

function base64ArrayBuffer(arrayBuffer) {
  let base64 = ''
  const encodings =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  const bytes = new Uint8Array(arrayBuffer)
  const byteLength = bytes.byteLength
  const byteRemainder = byteLength % 3
  const mainLength = byteLength - byteRemainder

  let a
  let b
  let c
  let d
  let chunk

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i += 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63 // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4 // 3   = 2^2 - 1

    base64 += `${encodings[a]}${encodings[b]}==`
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2 // 15    = 2^4 - 1

    base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`
  }

  return base64
}

function create() {
  // [1]
  const html = `
<style>
p {
  font-size: 14px;
}
    .break {
        flex-wrap: wrap;
    }
    img {
      text-align: center;
    }
    #addMe {
      width: 100%;
      padding: 0;
    }
    .loadArea {
      width: 100%;
      text-align: center;
    }

</style>
<div id="addMe">
</div>
<div class="loadArea">
<button uxp-variant="primary" class="featuredButton" id="loadMore">
Load More
</button>
</div>
<p id="warning">Browse inspirations after making a shape selection on your Artboard.</p>
`

  let rootNode = document.createElement('panel') // [9]
  rootNode.innerHTML = html // [10]

  return rootNode // [12]
}

function show(event) {
  const { selection } = require('scenegraph') // [2]
  event.node.appendChild(create()) // [3]
  let buttonInspiration = document.querySelector('#loadMore')
  buttonInspiration.addEventListener('click', e =>
    getRandomInspirations(selection)
  )

  getRandomInspirations(selection)
  // update(selection) // [4]
}

function hide(event) {
  event.node.firstChild.remove() // [2]
}

// This is optional
function update(selection) {
  const { Rectangle, Artboard, Text, Group } = require('scenegraph') // [2]
  let form = document.querySelector('#addMe') // [3]
  let warning = document.querySelector('#warning') // [4]
  let rootNode = document.createElement('panel')
  let loadButton = document.querySelector('.loadArea')
  let hasTextLayers = false

  if (selection.items.length > 0) {
    for (var item in selection.items) {
      if (selection.items[item] instanceof Text) {
        hasTextLayers = true
        warning.innerHTML = `<p>Text objects are not supported by this plugin. Select a shape instead.</p>`
        form.style.display = 'none'
        loadButton.style.display = 'none'
        warning.style.display = 'inline'
      } else if (selection.items[item] instanceof Artboard) {
        warning.innerHTML = `<p>Artboards are not supported by this plugin. Select a shape instead.</p>`
        form.style.display = 'none'
        loadButton.style.display = 'none'
        warning.style.display = 'inline'
      } else if (selection.items[item] instanceof Group) {
        console.log(selection.items[item].children.at(0))
        console.log("It's a group.")
        warning.innerHTML = `<p>Groups are not supported by this plugin. Select a shape instead.</p>`
        form.style.display = 'none'
        loadButton.style.display = 'none'
        warning.style.display = 'inline'
      } else {
        warning.style.display = 'none'
        loadButton.style.display = 'block'
        form.style.display = 'block'
      }
    }
  } else {
    warning.style.display = 'inline'
    form.style.display = 'none'
    loadButton.style.display = 'none'
    warning.innerHTML = `<p>Make a shape selection in order to see the latest featured inspirations.<br/><br/><a href="https://www.designhunt.us/" style="padding-top: 20px;">Learn more about Design Hunt</a></p>`
  }

  // if (
  //   selection.hasArtboards == true ||
  //   selection.items.length == 0 ||
  //   hasTextLayers == true
  // ) {
  //   // [5]
  //   form.style.display = 'none'
  //   warning.style.display = 'inline'
  // } else {
  //   warning.style.display = 'none'
  //   form.style.display = 'block'
  // }
}

module.exports = {
  panels: {
    findInspiration: {
      show,
      hide,
      update
    }
  }
}
