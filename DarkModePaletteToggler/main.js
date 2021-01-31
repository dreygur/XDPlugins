// Import required modules
const scenegraph = require('scenegraph'),
      {LinearGradient, BooleanGroup, RepeatGrid} = scenegraph,
      assets = require('assets'),
      application = require('application')

// Set variables
let colorAssets = getUsefullColorAssets(),
    isInLightMode = autoselectMode(),
    panel,
    lightModeButton,
    darkModeButton,
    reloadColorsButton,
    generateAssetsButton,
    helpButton,
    colorsSection,
    style,
    editionHasBeenDone = false,
    helpDialog

/**
 * Variables Initializer
 */

// colorAssets initializer - Browse assets to get usefull ones
function getUsefullColorAssets() {
    // Reset colorAssets
    let usefullColorAssets = []
    const allColorAssets = assets.colors.get()
    allColorAssets.forEach(lightColor => {
        // Check first if the color is light and if a dark variant exists
        if ( lightColor.name && lightColor.name.includes('/Light') ) {
            let darkColor = aDarkVariantExistOf(lightColor.name, allColorAssets)
            if (darkColor !== false) {
                usefullColorAssets.push([lightColor,darkColor])
            }
        }
    })
    return usefullColorAssets
}
// isInLightMode initializer = Return the current mode by broswing all items (Light or Dark)
function autoselectMode() {
    let i = 0
    let darkColors = 0
    scenegraph.root.children.forEach(rootItem => {
        i++
        darkColors += searchDarkColors(rootItem,0)
    })
    return (i >= darkColors)
}

// Recursive function to count dark colors used in the file
function searchDarkColors(item, darkColorsCounter) {
    for (const colors of colorAssets) {
        if (colors[1].color) { // On fait le test uniquement si c'est une couleur simple
            if (item.fill != null && item.fill.value == colors[1].color.value) {
                darkColorsCounter++
            }
            if (item.stroke != null && item.stroke.value == colors[1].color.value) {
                darkColorsCounter++
            }
        }
    }
    if (item.children != null) {
        item.children.forEach(item => {
            darkColorsCounter = searchDarkColors(item,darkColorsCounter)
        })
    }
    return darkColorsCounter
}

/**
 * Helpers functions to check if a variant of the color exists
 */
function aDarkVariantExistOf(lightColorName, colors) {
    const darkVariantName = lightColorName.replace('/Light','/Dark')
    return colorExistInWithName(colors, darkVariantName)
}
function aLightVariantExistOf(darkColorName, colors) {
    const lightVariantName = darkColorName.replace('/Dark','/Light')
    return colorExistInWithName(colors, lightVariantName)
}
function colorExistInWithName(colors, colorName) {
    for (const color of colors) {
        if (color.name == colorName) {
            return color
        }
    }
    return false
}

/**
 * Helpers functions to generate dark variant of a light color
 */
function generateDarkVariantOf(lightColor) {
    const darkColor = lightColor
    if (darkColor.gradientType) {
        darkColor.colorStops.forEach(colorStop => {
            colorStop.color.r = decreaseColorValue(colorStop.color.r)
            colorStop.color.g = decreaseColorValue(colorStop.color.g)
            colorStop.color.b = decreaseColorValue(colorStop.color.b)
        })
    } else {
        darkColor.color.r = decreaseColorValue(darkColor.color.r)
        darkColor.color.g = decreaseColorValue(darkColor.color.g)
        darkColor.color.b = decreaseColorValue(darkColor.color.b)
    }
    darkColor.name = lightColor.name.replace('/Light','/Dark')
    assets.colors.add(darkColor)
}
function decreaseColorValue(colorVal) {
    colorVal -= 50
    if (colorVal > 205 || colorVal < 0) {
        colorVal = 0
    }
    return colorVal
}
/**
 * Helpers functions to generate light variant of a dark color
 */
function generateLightVariantOf(darkColor) {
    const lightColor = darkColor
    if (darkColor.gradientType) {
        lightColor.colorStops.forEach(colorStop => {
            colorStop.color.r = increaseColorValue(colorStop.color.r)
            colorStop.color.g = increaseColorValue(colorStop.color.g)
            colorStop.color.b = increaseColorValue(colorStop.color.b)
        })
    } else {
        lightColor.color.r = increaseColorValue(lightColor.color.r)
        lightColor.color.g = increaseColorValue(lightColor.color.g)
        lightColor.color.b = increaseColorValue(lightColor.color.b)
    }
    lightColor.name = darkColor.name.replace('/Dark','/Light')
    assets.colors.add(lightColor)
}
function increaseColorValue(colorVal) {
    colorVal += 50
    if (colorVal < 50 || colorVal > 255) {
        colorVal = 255
    }
    return colorVal
}

/**
 * Helper functions to add a suffix to a color name
 */
function renameColorWithSuffix(color,suffix) {
    let renamedColor = color
    renamedColor.name += suffix
    assets.colors.delete(color)
    assets.colors.add(renamedColor)
}

function togglePalette(toLight) {
    editionHasBeenDone = false
    application.editDocument(selection => {
        scenegraph.root.children.forEach(artboard => {
            paintItem(artboard, toLight)
        })
    })
    isInLightMode = toLight
    alertUserIfNotAnyEditionHasBeenDone()
}
function alertUserIfNotAnyEditionHasBeenDone() {
    if (!editionHasBeenDone) {
        if (!helpDialog) {
            helpDialog = document.createElement('dialog');
            helpDialog.innerHTML = `
    <style>
        dialog form {
            width: 500px;
        }
        dialog form h2 {
            display: none;
        }
    </style>
    <form method="dialog">
        <h1 class="h1">
            <span>Dark Mode Palette Toggler Help</span>
        </h1>
        <hr />
        ${getHelpHtml()}
        <footer>
            <button type="submit" uxp-variant="cta">Ok</button>
        </footer>
    </form>
            `;
            panel.appendChild(helpDialog)
        }
        return helpDialog.showModal();
    }
}
function paintItem(item, toLight) {
    let oldColorIndex = toLight ? 1 : 0
    if (item.mask) { return }
    if (item instanceof BooleanGroup) { return }
    if (item instanceof RepeatGrid) { return }
    for (const colors of colorAssets) {
        if (colors[oldColorIndex].color) {
            // Normal color
            if (item.fill && item.fill.value == colors[oldColorIndex].color.value) {
                item.fill = colors[(oldColorIndex + 1) % 2].color
                editionHasBeenDone = true
            }
            if (item.stroke && item.stroke.value == colors[oldColorIndex].color.value) {
                item.stroke = colors[(oldColorIndex + 1) % 2].color
                editionHasBeenDone = true
            }
        } else if (colors[oldColorIndex].gradientType) {
            // Gradient
            if (item.fill && item.fill instanceof LinearGradient) {
                let gradient = item.fill.clone()
                gradient.colorStops = colors[(oldColorIndex + 1) % 2].colorStops
                item.fill = gradient
                editionHasBeenDone = true
            }
        }
    }
    if (item.children != null) {
        item.children.forEach(item => {
            paintItem(item, toLight)
        })
    }
}

/**
 * Generate assets
 */
function generateAssets() {
    application.editDocument(selection => {
        const allColorAssets = assets.colors.get()
        allColorAssets.forEach(color => {
            if (color.name) {
                if (color.name.includes('/Light')) {
                    if (aDarkVariantExistOf(color.name, allColorAssets) === false) {
                        generateDarkVariantOf(color)
                    }
                } else if (color.name.includes('/Dark')) {
                    if (aLightVariantExistOf(color.name, allColorAssets) === false) {
                        generateLightVariantOf(color)
                    }
                } else {
                    if (isInLightMode) {
                        renameColorWithSuffix(color,'/Light')
                        generateDarkVariantOf(color)
                    } else {
                        renameColorWithSuffix(color,'/Dark')
                        generateLightVariantOf(color)
                    }
                }
            }
        })
    })
    reloadColorsSection()
}

/**
 * Toggle dark palette
 */
function toggleDarkPalette(e) {
    if (!e.target.classList.contains('not-active')) {
        return
    }
    togglePalette(false)
    panel.querySelector('#light').classList.add('not-active')
    panel.querySelector('#dark').classList.remove('not-active')
}

/**
 * Toggle light palette
 */
function toggleLightPalette(e) {
    if (!e.target.classList.contains('not-active')) {
        return
    }
    togglePalette(true)
    panel.querySelector('#light').classList.remove('not-active')
    panel.querySelector('#dark').classList.add('not-active')
}

/**
 * Reload assets and actualize colors section
 */
function reloadColorsSection() {
    colorAssets = getUsefullColorAssets()
    style.innerHTML = getCSS()
    colorsSection.innerHTML = getColorLinesHtml()
}

/**
 * Generate CSS
 */

function getColorsCSS() {
    let css = ``
    colorAssets.forEach(colors => {
        colors.forEach(color => {
            if (color.gradientType) {
                if (color.gradientType == 'linear') {
                    css += `.color[data-name=${color.name.replace(/ /g, '')}] {
                        background: linear-gradient(to right`
                } else if (color.gradientType == 'radial') {
                    css += `.color[data-name=${color.name.replace(/ /g, '')}] {
                        background: radial-gradient(circle at center`
                }
                color.colorStops.forEach(colorStop => {
                    css += `, ${colorStop.color.toHex()} ${colorStop.stop * 100}%`
                })
                css += `);
                }`
            } else {
                css += `.color[data-name=${color.name.replace(/ /g, '')}] {
                    background: ${color.color.toHex()};
                }`
            }
        })
    })
    return css
}

function getCSS() {
    return `${getColorsCSS()}
            .titles {
                display: flex;
                justify-content: space-around;
            }
            .color-line {
                display: flex;
                align-items: center;
                justify-content: space-around;
                margin-bottom: 20px;
            }
            .color {
                width: 30vw;
                height: 30vw;
                max-width: 100px;
                max-height: 100px;
                background: black;
                border-radius: 10px;
                border: 1px solid rgb(220,220,220);
            }
            h2,
            .secondary-actions,
            header.color-line {
                text-align: center;
                margin-bottom: 5px;
            }
            button.not-active {
                opacity: 0.3;
            }
            button.not-active:hover {
                opacity: 0.7;
            }
            .help-detail .user-guide,
            .help-detail .bug-alert,
            .help-detail .plugin-limits {
                display: none;
            }
            .help-detail.open .user-guide,
            .help-detail.open .bug-alert,
            .help-detail.open .plugin-limits {
                display: block;
            }
            .user-guide,
            .bug-alert,
            .plugin-limits {
                padding: 5px;
                margin-bottom: 5px;
            }
            .user-guide {
                background: rgba(0, 255, 0, 0.1);
            }
            .bug-alert {
                background: rgba(0, 0, 255, 0.1);
            }
            .plugin-limits {
                background: rgba(255, 255, 0, 0.2);
            }
            .help-detail p {
                text-align: left;
                line-height: 1.7;
                margin-bottom: 10px;
            }`
}

/**
 * Generate HTML
 */
function getColorLinesHtml() {
    let lines = ``
    colorAssets.forEach(colors => {
        lines += `
        <h2>${colors[0].name.replace('/Light','')}</h2>
        <div class="color-line">
            <div class="color" data-name="${colors[0].name.replace(/ /g, '')}"></div>
            <span><-></span>
            <div class="color" data-name="${colors[1].name.replace(/ /g, '')}"></div>
        </div>`
    })
    return lines
}
function getHeaderHtml() {
    return `<header class="color-line">
                <button id="light" type="submit" ${isInLightMode ? '' : 'class="not-active"'} uxp-variant="cta">Light</button>
                <button id="dark" type="submit" ${isInLightMode ? 'class="not-active"' : ''} uxp-variant="cta">Dark</button>
            </header>`
}
function getSecondaryActionsHtml() {
    return `<div class="secondary-actions">
                <button id="generateVariants" uxp-variant="primary">Generate assets variants</button>
            </div>
            <div class="secondary-actions">
                <button id="reloadColors" uxp-variant="primary">Reload Color assets</button>
            </div>`
}
function getHelpHtml() {
    return `
            <div class="user-guide">
                <h3>User guide</h3>
                <p>1. Use the "Generate assets variants" button to transform your named color assets in compatible ones <br/> OR <br/> For each color, create a name/Light and name/Dark asset and then use the "Reload colors" button</p>
                <p>2. Switch between light-mode and dark-mode via the DarkModeToggler</p>
                <p>3. Edit colors via the Adobe XD assets panel</p>
            </div>
            <div class="bug-alert" >
                <h3>If colors doesn't toggle well...</h3>
                <p>
                    If everything is well set up but the plugin doesn't toggle colors properly : Cut all your artboards in the same time and paste it again. Then, try again to switch between light and darkmode, the manipulation must  have fix the problem.
                </p>
            </div>
            <div class="plugin-limits">
                <p>
                    Because of software restrictions, this plugin is not able to edit : circular gradients, repeatGrids and objects into a shape mask. It can change in the futur if these restrictions are removed.
                </p>
            </div>
            <div class="titles">
                <button uxp-variant="action" id="help-action">Open In-App User Guide</button>
            </div>
        `
}

function initializePanel() {

    function getHtml() {
        return `
        <style>${getCSS()}</style>
        <form method="dialog" id="main">
            <div class="help-detail">
                ${getHelpHtml()}
            </div>
            ${getHeaderHtml()}
            <div id="colorsSection">
                ${getColorLinesHtml()}
            </div>
        </form>
        ${getSecondaryActionsHtml()}`
    }

    function setElementVariables() {
        colorsSection = panel.querySelector('#colorsSection')
        lightModeButton = panel.querySelector('#light')
        darkModeButton = panel.querySelector('#dark')
        reloadColorsButton = panel.querySelector('#reloadColors')
        generateAssetsButton = panel.querySelector('#generateVariants')
        helpButton = panel.querySelector('#help-action')
        style = panel.querySelector('style')
    }

    function setEventListeners() {
        lightModeButton.addEventListener('click', toggleLightPalette)
        darkModeButton.addEventListener('click', toggleDarkPalette)
        reloadColorsButton.addEventListener('click', reloadColorsSection)
        generateAssetsButton.addEventListener('click', generateAssets)
        helpButton.addEventListener('click',() => {
            const helpDetail = panel.querySelector('.help-detail')
            helpDetail.classList.toggle('open')
            if (helpDetail.classList.contains('open')) {
                helpButton.innerText = `Hide User Guide`
            } else {
                helpButton.innerText = `Open In-App User Guide`
            }
        })
    }

    panel = document.createElement("div")
    panel.innerHTML = getHtml()
    setElementVariables()
    setEventListeners()

    return panel
}

/**
 * Needed function to show left plugin panel
 */
function show(event) {
    if (!panel) event.node.appendChild(initializePanel());
}

module.exports = {
    panels: {
        darkModeToggler: { show }
    }
};