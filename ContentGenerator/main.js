/**
 * CONTENT GENERATOR PLUGIN
 */

const textG = require("./text.js"),
      imageG = require("./images.js");
const scenegraph = require("scenegraph");

var body, select, dialog;

const content = {images: [{label: 'Profile Images', buttons: [['Both', 'Female', 'Male']]},
                          {label: 'Sample Images', buttons: [['Unsplash']]}],
                 text: [{label: 'Names', buttons: [['Both', 'Female', 'Male']]},
                        {label: 'Dates', buttons: [['MM/DD', 'MM/DD/YY', 'MMM DD'], ['DD/MM', 'DD/MM/YY', 'DD MMM']]},
                        {label: 'Other text', buttons: [['City', 'Country', 'Email'], ['Currency $', 'Currency €', 'Currency £'], ['Paragraph', 'Percentage', 'Phone'], ['Number', 'Title']]}]
                }
const imageMapMethods = new Map([['Female', imageG.femaleImages], ['Male', imageG.maleImages],
                                ['Both', imageG.mixedImages], ['Unsplash', imageG.unsplash]]);
const textMapMethods = new Map([['Female', textG.femaleNames], ['Male', textG.maleNames],
                                ['Both', textG.mixedNames], ['MM/DD', textG.MM_DD_Date],
                                ['DD/MM', textG.DD_MM_Date], ['MM/DD/YY', textG.MM_DD_YY_Date],
                                ['DD/MM/YY', textG.DD_MM_YY_Date], ['MMM DD', textG.MMM_DD_Date],
                                ['DD MMM', textG.DD_MMM_Date], ['Email', textG.email],
                                ['Country', textG.country], ['City', textG.city],
                                ['Currency $', textG.price_dollar], ['Currency €', textG.price_euro],
                                ['Currency £', textG.price_lira], ['Phone', textG.phoneNumber],
                                ['Percentage', textG.percentage], ['Number', textG.simpleNumber],
                                ['Unsplash', imageG.unsplash], ['Title', textG.title],
                                ['Paragraph', textG.paragraph]]);

function createFooter() {
    const footer = document.createElement("footer");
    Object.assign(footer.style, {width: 353, display: "flex", flexDirection: "row", marginTop: 35});
    const closeButton = document.createElement("button");
    Object.assign(closeButton.style, {marginRight: -6});
    closeButton.textContent = "Cancel";
    closeButton.setAttribute("uxp-variant", 'primary');
    closeButton.addEventListener("click", () => {
        dialog.close();
        dialog.remove();
    });
    footer.appendChild(closeButton);
    return footer;
}

function createWindowArea(textLabel, buttonsArray, selection) {
    const area = document.createElement("div");
    Object.assign(area.style, {display: "flex", flexDirection: "column", marginTop: 10});
    const label = document.createElement("span");
    Object.assign(label.style, {marginLeft: 6, marginTop: 15, fontSize: 11});
    label.textContent = textLabel;
    area.appendChild(label);
    buttonsArray.forEach(function (buttons) {
        const buttonsArea = document.createElement("div");
        Object.assign(buttonsArea.style, {width: 421, display: "flex", flexDirection: "row", marginBottom: -17});
        buttons.forEach(function(button) {
            const actionButton = document.createElement("button");
            Object.assign(actionButton.style, {width: 110, height: 32, marginLeft: 6, marginRight: 6});
            actionButton.textContent = button;
            actionButton.setAttribute("uxp-variant", "action");
            actionButton.addEventListener("click", () => {
                if (selection.items.length != 0)
                    dialog.close(button);
            });
            buttonsArea.appendChild(actionButton);
        });
        area.appendChild(buttonsArea);
    });
    return area;
}

function dropdown(selectedDrop, selection) {
    const area = document.createElement("div");
    Object.assign(area.style, {display: "flex", flexDirection: "column", marginTop: 25});
    const label = document.createElement("span");
    Object.assign(label.style, {marginLeft: 6, fontSize: 11});
    label.textContent = 'Content Type';
    area.appendChild(label);
    select = document.createElement("select");
    Object.assign(select.style, {marginLeft: 10, width: 102, height: 20, marginBottom: -8});
    select.setAttribute("uxp-quiet", true);
    const options = ["Text Sample", "Image"];
    options.forEach(function(option) {
        const op = document.createElement("option");
        op.value = option;
        op.textContent = option;
        select.appendChild(op);
    });
    select.value = selectedDrop;
    select.addEventListener("change", () => {
        var newBody = select.value == 'Image' ? createBody(content.images, selection, "Please select a shape layer first.") : 
                                                createBody(content.text, selection, "Please select a text layer first.");
        body.parentNode.replaceChild(newBody, body);
        body = newBody;
    });
    area.appendChild(select);
    return area;
}

function createBody(bodyContent, selection, worningLabel) {
    const body = document.createElement("div");
    Object.assign(body.style, {width: 353, height: 305});
    bodyContent.forEach(function(areaContent) {
        const area = createWindowArea(areaContent.label, areaContent.buttons, selection);
        body.appendChild(area);
    });
    if (selection.items.length == 0) {
        const worningArea = document.createElement("div");
        Object.assign(worningArea.style, {display: "flex", flexDirection: "row", marginTop: 15});
        const image = document.createElement("img");
        Object.assign(image.style, {
            marginLeft: 10,
            marginTop: 8,
            height: 15
        });
        image.setAttribute("src", require.resolve("./warning.png"));
        worningArea.appendChild(image);
        const worningMessage = document.createElement("span");
        Object.assign(worningMessage.style, {marginLeft: 6, marginBottom: -5, marginTop: 8, fontSize: 12});
        worningMessage.textContent = worningLabel;
        worningArea.appendChild(worningMessage);
        body.appendChild(worningArea);
    }
    return body;
}

function isShape(node) {
    return (node instanceof scenegraph.Rectangle || node instanceof scenegraph.Ellipse || node instanceof scenegraph.Path);
}

function isText(node) {
    return (node instanceof scenegraph.Text);
}

function predominantSelection(selection) {
    const shapes = selection.items.filter(node => isShape(node)).length,
          textBoxes = selection.items.filter(node => isText(node)).length;
    if (shapes > textBoxes)
        return {cont: content.images, sel: "Image", worning: "Please select a shape layer first."};
    return {cont: content.text, sel: "Text Sample", worning: "Please select a text layer first."};
}

function createDialog(selection) {
    dialog = document.createElement("dialog");
    Object.assign(dialog.style, {width: 433, height: 550, marginLeft: 40, marginRight: 40, marginTop: 40, marginBottom: 40, backgroundColor: 0xffffff});
    const form = document.createElement("form");
    form.setAttribute("method", "dialog");
    dialog.appendChild(form);
    const header = document.createElement("h1");
    header.textContent = "Content Generator";
    form.appendChild(header);
    body = createBody(predominantSelection(selection).cont, selection, predominantSelection(selection).worning);
    const dropdownArea = dropdown(predominantSelection(selection).sel, selection);
    form.appendChild(dropdownArea);
    form.appendChild(body);
    const footer = createFooter();
    form.appendChild(footer);
    return dialog;
}

async function getResult(button, selection) {
    if(select.value == 'Image')
        await imageMapMethods.get(button)(selection);
    else
        await textMapMethods.get(button)(selection);
}

async function contentGenerator(selection) {
    const dialog = createDialog(selection);
    document.appendChild(dialog);
    try {
        const option = await dialog.showModal();
        await getResult(option, selection);
    } catch (err) {
        // cancelled with ESC
    } finally {
        dialog.remove();
    }
}

module.exports = {
    commands: {
        contentGenerator
    }
};
