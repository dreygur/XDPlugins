const application = require("application");
const fs = require("uxp").storage.localFileSystem;

async function uwpIconsExport(selection) {
    // Exit if there's no selection
    // For production plugins, providing feedback to the user is expected
    if (selection.items.length === 0)
        return console.log("No selection. Guide the user on what to do.");

    // Get a folder by showing the user the system folder picker
    const folder = await fs.getFolder();
    // Exit if user doesn't select a folder
    if (!folder) return console.log("User canceled folder picker.");

    let times = 0;
    while (times < selection.items.length) {
        await exportImage(selection.items[times], folder);
        times = times + 1;
    }
    const dialog = createDialog(times);
    return dialog.showModal();
}

async function exportImage(image, folder) {

    // Create a file that will store the rendition
    const name = image.name;
    const scale100 = await folder.createFile(name + ".png", { overwrite: true });
    const scale125 = await folder.createFile(name + ".scale125.png", { overwrite: true });
    const scale150 = await folder.createFile(name + ".scale150.png", { overwrite: true });
    const scale200 = await folder.createFile(name + ".scale200.png", { overwrite: true });
    const scale400 = await folder.createFile(name + ".scale400.png", { overwrite: true });

    console.log(name);

    // Create options for rendering a PNG.
    // Other file formats have different required options.
    // See `application#createRenditions` docs for details.

    const renditionOptions = [

        {
            node: image,
            outputFile: scale100,
            type: application.RenditionType.PNG,
            scale: 1
        },
        {
            node: image,
            outputFile: scale125,
            type: application.RenditionType.PNG,
            scale: 1.25
        },
        {
            node: image,
            outputFile: scale150,
            type: application.RenditionType.PNG,
            scale: 1.5
        },
        {
            node: image,
            outputFile: scale200,
            type: application.RenditionType.PNG,
            scale: 2
        },
        {
            node: image,
            outputFile: scale400,
            type: application.RenditionType.PNG,
            scale: 4
        }
    ];

    try {
        // Create the rendition(s)
        const results = await application.createRenditions(renditionOptions);

        // Create and show a modal dialog displaying info about the results
        //const dialog = createDialog(results[0].outputFile.nativePath);
        //return dialog.showModal();
    } catch (err) {
        // Exit if there's an error rendering.
        return console.log("Something went wrong. Let the user know.");
    }
}

function createDialog(times) {
    // Add your HTML to the DOM
    document.body.innerHTML = `
    <style>
    form {
        width: 400px;
    }
    </style>
    <dialog id="dialog">
        <form method="dialog">
            <h1>UWP icons saved in selected folder</h1>
             <p>Selected assets: ${times}</p>
             <p>UWP Formats: 100, 125, 150, 200, and 400.</p>
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

module.exports = {
    commands: {
        uwpIconsExport
    }
};