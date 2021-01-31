/*
 * Flutter App Icon Generator
 * Currently basic UI has been integrated.
 * Will be fine tuning the UI in the later releases.
 *
 */

const application = require("application");
const fs = require("uxp").storage.localFileSystem;

const SELECTION_IMAGE_WIDTH = 100;
const SELECTION_IMAGE_HEIGHT = 100;

const IOS_APP_ICONS_PATH_ARR = "ios/Runner/Assets.xcassets/AppIcon.appiconset";
const iOS_RESOLUTION_MAP = {
    "Icon-App-1024x1024@1x.png": 1024.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-40x40@3x.png": 120.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-60x60@2x.png": 120.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-76x76@2x.png": 152.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-83.5x83.5@2x.png": 167.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-60x60@3x.png": 180.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-20x20@1x.png": 20.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-29x29@1x.png": 29.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-20x20@2x.png": 40.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-40x40@1x.png": 40.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-29x29@2x.png": 58.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-20x20@3x.png": 60.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-76x76@1x.png": 76.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-40x40@2x.png": 80.0 / SELECTION_IMAGE_WIDTH,
    "Icon-App-29x29@3x.png": 87.0 / SELECTION_IMAGE_WIDTH,
}


const ANDROID_RES_PATH_ARR = "android/app/src/main/res";
const ANDROID_BASE_UNIT = 48;
const ANDROID_RESOLUTION_MAP = {
    //48x48 is the base and 4 times = 192x192 is the scale
    // with 4x4 cell the editing should happen
    //TODO: this is removed as it is not supported by Flutter Project created in Android Studio
    // "mipmap-ldpi": (0.75 * ANDROID_BASE_UNIT) / SELECTION_IMAGE_WIDTH,
    "mipmap-mdpi": (1.0 * ANDROID_BASE_UNIT) / SELECTION_IMAGE_WIDTH,
    "mipmap-hdpi": (1.5 * ANDROID_BASE_UNIT) / SELECTION_IMAGE_WIDTH,
    "mipmap-xhdpi": (2.0 * ANDROID_BASE_UNIT) / SELECTION_IMAGE_WIDTH,
    "mipmap-xxhdpi": (3.0 * ANDROID_BASE_UNIT) / SELECTION_IMAGE_WIDTH,
    "mipmap-xxxhdpi": (4.0 * ANDROID_BASE_UNIT) / SELECTION_IMAGE_WIDTH,
}

let flutter_folder_path = null;
async function myPluginCommand(selection) {

    const folder = await fs.getFolder();
    flutter_folder_path = folder.nativePath;

    let androidResPath;
    let iOSAppIconPath;
    try {
        androidResPath = await folder.getEntry(ANDROID_RES_PATH_ARR);
        iOSAppIconPath = await folder.getEntry(IOS_APP_ICONS_PATH_ARR);
    } catch (error) {
        notAFlutterRoot.showModal();
        return;
    }

    const width = selection.items[0].width;
    const height = selection.items[0].height;

    if (width != SELECTION_IMAGE_WIDTH || height != SELECTION_IMAGE_HEIGHT) {
        errorDialog.showModal();
        return;
    }
    for (let resolution in ANDROID_RESOLUTION_MAP) {
        const mipmapFolder = await androidResPath.getEntry(resolution);
        const mipmapFile = await mipmapFolder.createFile("ic_launcher.png", { overwrite: true });

        let renditionSettings = [{
            node: selection.items[0],
            outputFile: mipmapFile,
            type: application.RenditionType.PNG,
            scale: ANDROID_RESOLUTION_MAP[resolution],
        }];
        await application.createRenditions(renditionSettings);
    }

    for (let resolution in iOS_RESOLUTION_MAP) {
        const appIconFileName = await iOSAppIconPath.createFile(resolution, { overwrite: true });
        let renditionSettings = [{
            node: selection.items[0],
            outputFile: appIconFileName,
            type: application.RenditionType.PNG,
            scale: iOS_RESOLUTION_MAP[resolution],
        }];
        await application.createRenditions(renditionSettings);
    }

    showSuccessMessage();
    //TODO: the whole method needs to be enclosed with try-catch, and proper error messaging needs to be
    // shown. Until, then the errors are left to Adobe XD plugin environment to be handled.
}


module.exports = {
    commands: {
        myPluginCommand: myPluginCommand,
    }
};


function h(tag, props, ...children) {
    let element = document.createElement(tag);
    if (props) {
        if (props.nodeType || typeof props !== "object") {
            children.unshift(props);
        }
        else {
            for (let name in props) {
                let value = props[name];
                if (name == "style") {
                    Object.assign(element.style, value);
                }
                else {
                    element.setAttribute(name, value);
                    element[name] = value;
                }
            }
        }
    }
    for (let child of children) {
        element.appendChild(typeof child === "object" ? child : document.createTextNode(child));
    }
    return element;
}
let dialog =
    h("dialog",
        h("form", { method: "dialog", style: { width: 400 } },
            h("h1", "Simple Form"),
            h("hr"),
            h("p", "This plugin will vectorize your entire project. Are you sure you'd like to continue?"),
            h("label",
                h("span", "Input Type Text"),
                h("input", { id: "folder_input_id" })
            ),
            h("label",
                h("span", "Text Area rows=6, Bug: Should be 6 rows high."),
                h("textarea", { style: { height: 100 } })
            ),
            h("label",
                h("span", "Select"),
                h("select",
                    ...["A", "B", "C", "D", "E", "F", "G"].map(name => h("option", `Option ${name}`))
                )
            ),
            h("label", { style: { flexDirection: "row", alignItems: "center" } },
                h("input", { type: "checkbox" }),
                h("span", "Input Type Checkbox?")
            ),
            h("label",
                h("span", "Input Type Range"),
                h("input", { type: "range" })
            ),
            h("footer",
                h("button", { uxpVariant: "primary", onclick(e) { dialog.close() } }, "Cancel"),
                h("button", {
                    uxpVariant: "cta", async onclick(e) {
                        const folder = await fs.getFolder();
                        document.getElementById("folder_input_id").value = folder.nativePath;
                    }
                }, "Submit")
            )
        )
    )
document.body.appendChild(dialog);

let errorDialog =
    h("dialog",
        h("form", { method: "dialog" },
            h("label",
                h("span", "Select 100x100 Sized Object"),
            ),

            h("footer",
                h("button", { uxpVariant: "primary", onclick(e) { errorDialog.close() } }, "OK"),
            ),
        )
    );
document.body.appendChild(errorDialog);

let notAFlutterRoot =
    h("dialog",
        h("form", { method: "dialog" },
            h("label",
                h("span", "Not a Flutter App Directory"),
            ),

            h("footer",
                h("button", { uxpVariant: "primary", onclick(e) { notAFlutterRoot.close() } }, "OK"),
            ),
        )
    );
document.body.appendChild(notAFlutterRoot);

function showSuccessMessage() {
    let successMessage =
        h("dialog",
            h("form", { method: "dialog", style: { width: 500 } },
                h("h4", { style: { padding: "8px" } }, "Generated Succesfully"),
                h("p", `iOS: ${flutter_folder_path}/${IOS_APP_ICONS_PATH_ARR}`),
                h("p", `Android: ${flutter_folder_path}/${ANDROID_RES_PATH_ARR}`),

                h("footer",
                    h("button", { uxpVariant: "primary", onclick(e) { successMessage.close() } }, "OK"),
                ),
            )
        );
    document.body.appendChild(successMessage);
    successMessage.showModal();
}


