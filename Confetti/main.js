const { generateCanvasConfettiSVG } = require('./generateCanvasConfetti')
const { Color, Artboard, Blur, selection } = require('scenegraph')
const commands = require('commands')
const rightAspect = (width, height, factor) => (width / height) * factor

let panel;

function create() {
  const html = `
<style>
  * {
    margin: 0;
    padding: 0;
  }
  .break {
    flex-wrap: wrap;
  }
  p {
    font-size: 14px;
    line-height: 1.5;
    color: #505050;
    margin: 0;
  }
  .container {
    margin-top: 12px;
    width: 100%;
  }
  section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .flex {
    display: flex;
  }
  .wrap {
    flex-wrap: wrap;
  }
  .full {
    flex-basis: 100%;
    width: 100%;
  }
  .half {
    flex-basis: 48%;
    width: 48%;
  }
  footer {
    display: flex;
  }
  .full label,
  .half label {
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin: -6px;
  }
  .subtitle {
    width: 100%;
    color: #707070;
    margin-bottom: 4px;
  }
  input {
    margin-bottom: 0;
  }
  input[type=number],
  input[type=text],
  input[type=range] {
    box-sizing: border-box;
    width: 100%;
  }
  .divider {
    width: 100%;
    height: 1px;
    background-color: #E4E4E4;
    margin: 16px 0;
  }
  .range {
    width: 100%;
  }
  .content {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .right {
    margin-left: auto;
  }
  #warning {
    margin-top: 17px;
  }
  .text {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .text p {
    color: #707070;
    font-size: 12px;
    line-height: 14px;
  }
  .text .value {
    margin-right: 3px;
  }
</style>
<form method="dialog" id="main">
  <div class="row break" id="sidebar">
    <div class="container">
      <section>
        <div class="full">
          <p>Confetti is distributed in a grid. Setup your grid to get the results you’re looking for.</p>
        </div>
      </section>
      <section>
        <div class="half">
          <label>
            <span class="subtitle">Columns &#x2194;</span>
            <input type="number" id="columns" value="3">
          </label>
        </div>
        <div class="half">
          <label class="flex">
            <span class="subtitle">Rows &#x2195;</span>
            <input type="number" id="rows" value="3">
          </label>
        </div>
      </section>

      <div class="divider"></div>

      <section>
        <div class="full">
          <label class="range">
            <div class="content">
              <input type="checkbox" class="setting" id="opacitySetting" />
              <span>Randomize opacity</span>
              <div class="right light text">
                <p class="value" id="opValue">80</p>
                <p>to 100%</p>
              </div>
            </div>
            <input type="range" min="0" max="100" value="80" class="slider" id="opacity" disabled>
          </label>
        </div>
      </section>

      <section>
        <div class="full">
          <label class="range">
            <div class="content">
              <input type="checkbox" class="setting" id="rotateSetting" />
              <span class="text">Randomize rotation</span>
              <div class="right light text">
                <p class="value" id="rotateValue">90</p>
                <p>to 360°</p>
              </div>
            </div>
            <input type="range" min="0" max="360" value="90" class="slider" id="rotation" disabled>
          </label>
        </div>
      </section>

      <section>
        <div class="full">
          <label class="range scale">
            <div class="content">
              <input type="checkbox" class="setting" id="scaleSetting" value="scale" placeholder="Randomize scale"/>
              <span class="scale-label">Randomize scale</span>
            </div>
          </label>
        </div>
      </section>

      <section>
        <div class="half">
          <label>
            <span>Minimum %</span>
            <input type="number" id="minimum" value="50" disabled>
          </label>
        </div>
        <div class="half">
          <label class="flex">
            <span>Maximum %</span>
            <input type="number" id="maximum" value="100" disabled>
          </label>
        </div>
      </section>

      <section>
        <div class="full">
          <label>
            <div class="content">
              <input type="checkbox" class="disabled" id="blurSetting" value="blur" placeholder="Depth of field blur"/>
              <span class="blur-label">Enable depth of field blur</span>
            </div>
          </label>
        </div>
      </section>

      <div class="divider"></div>

      <section>
        <div class="full">
          <label class="random-colors">
            <div class="content">
              <input type="checkbox" id="randomizeColors" value="randomize" placeholder="Randomize colors with hex codes"/>
              <span>Randomize colors with hex codes</span>
            </div>
          </label>
        </div>
      </section>

      <section class="wrap">
        <div class="half">
          <label class="full">
            <span>Color 1</span>
            <input type="text" id="colorOne">
          </label>
        </div>
        <div class="half">
          <label class="full">
            <span>Color 2</span>
            <input type="text" id="colorTwo" value="#">
          </label>
        </div>
        <div class="half">
          <label class="full">
            <span>Color 3</span>
            <input type="text" id="colorThree" value="#">
          </label>
        </div>
        <div class="half">
          <label class="full">
            <span>Color 4</span>
            <input type="text" id="colorFour" value="#">
          </label>
        </div>
        <div class="half">
          <label class="full">
            <span>Color 5</span>
            <input type="text" id="colorFive" value="#">
          </label>
        </div>
        <div class="half">
          <label class="full">
            <span>Color 6</span>
            <input type="text" id="colorSix" value="#">
          </label>
        </div>
      </section>
    </div>
    <footer>
      <button id="ok" type="submit" uxp-variant="cta">Run 🎉</button>
    </footer>
  </div>
  <p id="warning">Confetti is generated with groups, symbols, shapes or bitmaps.\n\nTo continue, please select a valid object.</p>
</form>
`;

  function exec() {
    const { editDocument } = require("application")

    const {
      columns,
      rows,
      opacitySetting,
      opacity,
      rotation,
      rotateSetting,
      blurSetting,
      scaleSetting,
      minimum,
      maximum,
      colorOne,
      colorTwo,
      colorThree,
      colorFour,
      colorFive,
      colorSix
    } = defineElements()

    editDocument({ editLabel: "Run Confetti" }, function(selection) {
      const artboardWidth = selection.focusedArtboard.width
      const artboardHeight = selection.focusedArtboard.height

      let confettiOptions = {
  			selection,
  			columns: columns.value,
  			rows: rows.value
  		}

  		if (confettiOptions.columns !== undefined && confettiOptions.rows !== undefined) {
  			const { xandyValues } = generateCanvasConfettiSVG({
  				options: confettiOptions,
  				width: artboardWidth,
  				height: artboardHeight
        })

        const allValues = {
          selection,
          columns: columns.value,
          rows: rows.value,
          applyOpacity: opacitySetting.checked,
          opacity: opacity.value,
          applyRotation: rotateSetting.checked,
          rotate: rotation.value,
          applyBlur: blurSetting.checked,
          scale: scaleSetting.checked,
          minimum: minimum.value,
          maximum: maximum.value,
          colors: [colorOne.value, colorTwo.value, colorThree.value, colorFour.value, colorFive.value, colorSix.value],
          xandyValues: xandyValues
        }

        generateConfetti(allValues)
      }
    })
  }

  panel = document.createElement("div");
  panel.innerHTML = html;
  panel.querySelector("form").addEventListener("submit", exec)

  return panel;
}

function show(event) {
  if (!panel) event.node.appendChild(create())
}

function update() {
  const {
    sidebar,
    warning
  } = defineElements()

  if (selection.items.length > 0 && !(selection.items[0] instanceof Artboard)) {
    updateSidebar(selection)
  } else {
    sidebar.style.display = "none"
    warning.style.display = "block"
  }
}

function updateSidebar(selection) {
  const {
    columns,
    rows,
    opacitySetting,
    opacity,
    opValue,
    rotateSetting,
    rotation,
    rotateValue,
    scaleSetting,
    blurSetting,
    minimum,
    maximum,
    colorOne,
    colorTwo,
    colorThree,
    colorFour,
    colorFive,
    colorSix,
    warning,
    sidebar
  } = defineElements()

  sidebar.style.display = "block"
  warning.style.display = "none"

  const selectedItems = selection.items
  const element = selectedItems[0]

  let typeOfFill = ''

  if (element.fill) {
    typeOfFill = element.fill.constructor.name
  }

	const name = element.constructor.name
	let fillColor = null

	if (name === "SymbolInstance") {
		fillColor = "#"
    colorOne.disabled = true
		colorTwo.disabled = true
		colorThree.disabled = true
		colorFour.disabled = true
		colorFive.disabled = true
    colorSix.disabled = true
	} else if (typeOfFill === "ImageFill") {
		fillColor = "#"
	} else {
		fillColor = element.fill.toHex()
	}

  colorOne.value = fillColor

  columns.oninput = () => {
		if (columns.value > 99) {
			columns.value = 99
		}
	}

	rows.oninput = () => {
		if (rows.value > 99) {
			rows.value = 99
		}
	}

  opacitySetting.onchange = () => {
    if (opacitySetting.checked === true) {
      opacity.disabled = false
    } else {
      opacity.disabled = true
    }
  }

  opacity.onchange = () => {
    let op = Math.floor(opacity.value)
    let n = op.toString()
    opValue.innerHTML = n
	}

  rotateSetting.onchange = () => {
    if (rotateSetting.checked === true) {
      rotation.disabled = false
    } else {
      rotation.disabled = true
    }
  }

  rotation.onchange = () => {
    let rotate = Math.floor(rotation.value)
    let string = rotate.toString()
    rotateValue.innerHTML = string
  }

  scaleSetting.onchange = () => {
		if (scaleSetting.checked === true) {
      minimum.disabled = false
      maximum.disabled = false
      blurSetting.disabled = false
    } else {
			minimum.disabled = true
      maximum.disabled = true
      blurSetting.disabled = true
      blurSetting.checked = false
    }
	}
}

function defineElements() {
  const columns = document.querySelector("#columns")
  const rows = document.querySelector("#rows")

  const opacitySetting = document.querySelector("#opacitySetting")
  const opacity = document.querySelector("#opacity")
  const opValue = document.querySelector("#opValue")
  const rotateSetting = document.querySelector("#rotateSetting")
  const rotation = document.querySelector("#rotation")
  const rotateValue = document.querySelector("#rotateValue")

  const blurSetting = document.querySelector("#blurSetting")
  const scaleSetting = document.querySelector("#scaleSetting")

  const minimum = document.querySelector("#minimum")
  const maximum = document.querySelector("#maximum")

  const colorOne = document.querySelector("#colorOne")
  const colorTwo = document.querySelector("#colorTwo")
  const colorThree = document.querySelector("#colorThree")
  const colorFour = document.querySelector("#colorFour")
  const colorFive = document.querySelector("#colorFive")
  const colorSix = document.querySelector("#colorSix")

  const sidebar = document.querySelector('#sidebar')
  const warning = document.querySelector('#warning')

  return {
    columns,
    rows,
    opacitySetting,
    opacity,
    opValue,
    rotateSetting,
    rotation,
    rotateValue,
    blurSetting,
    scaleSetting,
    minimum,
    maximum,
    colorOne,
    colorTwo,
    colorThree,
    colorFour,
    colorFive,
    colorSix,
    sidebar,
    warning
  }
}

function generateConfetti(options) {
  const {
    selection,
    columns,
    rows,
    applyOpacity,
    opacity,
    applyRotation,
    rotate,
    scale,
    applyBlur,
    minimum,
    maximum,
    colors,
    xandyValues
  } = options

	// Get the selected item
  const selectedItems = selection.items
	const focusedArtboard = selection.focusedArtboard
  const availableColors = colors.filter(color => color !== "#")
  const original = selection.items

  let resizeFactor = 1
  let rotateFactor = 0

	// Check if something is selected
	if (selectedItems.length === 0) {
		return
  }

  // We will push all the duplicates to the array. This will be used to apply the blur to all elements.
  const updatedItems = []

  // Duplicate the stuff
	for (let h = 0; h < xandyValues.length; h++) {
		let row = xandyValues[h]

		for (let v = 0; v < row.length; v++) {
      const selectedRange = selectedItems.length
      const randomSelection = Math.floor(Math.random() * selectedRange)
      const element = selectedItems[randomSelection]
      const initRotateValue = Math.floor(Math.random() * (360 - rotate) + rotate)

      selection.items = element

      commands.duplicate()

      const duplicate = selection.items[0]
      let fillType = ''

      if (duplicate.fill) {
        fillType = duplicate.fill.constructor.name
      }

      const xVal = (xandyValues[h][v][0])
      const yVal = (xandyValues[h][v][1])

      if (applyRotation) {
        rotateFactor = initRotateValue
      }

      if (scale === true) {
        const minFactor = minimum / 100
        const maxFactor = maximum / 100
        resizeFactor = Math.random() * (maxFactor - minFactor) + minFactor
      }

      const rightOpacity = opacity / 100
      const opacityFactor = Math.random() * (1 - rightOpacity) + rightOpacity

			const resizeWidth = resizeFactor * duplicate.localBounds.width
			const resizeHeight = resizeFactor * duplicate.localBounds.height

      // The position we want the node to be at.
			const nodeTopLeft = {
				x: 0 + xVal,
				y: 0 + yVal
      }

      // This sets the x and y value for the item. Following the formule: second param - first param.
      duplicate.placeInParentCoordinates({x: 0, y: 0}, nodeTopLeft)

      if (applyRotation) {
				duplicate.rotateAround(rotateFactor, duplicate.localCenterPoint)
      }

			duplicate.resize(resizeWidth, resizeHeight)

      if (applyOpacity) {
        duplicate.opacity = opacityFactor
      }

			if (!(fillType === "ImageFill")) {
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)]
	      duplicate.fill = new Color(randomColor)
      }

      // We push this to the array so we can apply the blur after we have resized all elements.
      updatedItems.push(duplicate)
    }
  }

  function applyBlurToElements(array = []) {
    // Get the width of the smallest element in the array.
    const smallestWidth = array[array.length - 1].localBounds.width
    const appliedBlurWidth = smallestWidth + (smallestWidth / 2)

    // Apply the blur to each element in the array.
    array.forEach(element => {
      if (element.localBounds.width > appliedBlurWidth) {
        const elementNodeWidth = element.localBounds.width
        const restWidth = smallestWidth / 2
        const restNumb = elementNodeWidth - restWidth
        const restPercent = (restWidth / 100) * restNumb
        const blurValue = restPercent / 1.5

        element.blur = new Blur(blurValue , 0, 0, true, false)
      }
    });
  }

  if (applyBlur) {
    // We sort the the items on width so the biggest is the first item and the last is the smallest.
    const updatedSorted = updatedItems.sort((a, b) => b.localBounds.width - a.localBounds.width)
    applyBlurToElements(updatedSorted)
  }

	selection.items = original

  for (let i = 0; i < selection.items.length; i++) {
    selection.items[i].removeFromParent()
  }

}

module.exports = {
  panels: {
    createConfetti: {
      show,
      update
    }
  }
}
