// Requiring API's
const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const ImageFill = require("scenegraph").ImageFill;
const command = require("commands");
const { error } = require("./lib/dialogs.js");

// Helper function for dialog modal
/**
* Shorthand for creating Elements.
* @param {*} tag The tag name of the element.
* @param {*} [props] Optional props.
* @param {*} children Child elements or strings
*/
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

// Iterating two times for making rendered image into selection.
for(let i=0;i<2;i++)
{
    // Main Handler Function
    async function mainFunction(selection) 
    {   
        // Getting temporary folder 
        const tempFolder = await fs.getTemporaryFolder();

        // Creating temporary file into temporary folder
        const file = await tempFolder.createFile('rendition.jpg', { overwrite: true });
            
        // Creating renditions
        const renditions = [{
            node: selection.items[0],
            outputFile: file,
            // Can change the image file type
            type: "jpg",
            scale: 1.0,
            // Can change the quality of image file
            quality:60
        }];
        
        // User should select atleast one node.
    
        if (selection.items.length > 0) 
        {
            
            // Creating rendition
            await application.createRenditions(renditions)
                .then(results => {
                    console.log("Image Created");
                })
                .catch(error => {
                    console.log("File creation error");
                })
                // Image filling to the selection try
                try{
                    if(file.name === "rendition.jpg")
                    {
                    let fill = new ImageFill(file);
                    
                    selection.items[0].fill = fill;
                    console.log("Image Filled");
                    
                    }
                    else{
                        showError();
                    }

                }
                catch(Error)
                {
                    console.log("Image not compressed and filled")
                    showError();
                }    

                // Try block for checking if there image entry
                // If exists deletes the temp image entry
                try
                {
                    const imageentry = await tempFolder.getEntry("rendition.jpg");
                    if(imageentry.name == "rendition.jpg")
                    {
                        try{
                            await imageentry.delete();
                            console.log("Deleted temporary storage!");
                            showdialog();
                        }
                        catch(Error)
                        {
                            showError();
                        }
                    }
                    else
                    {
                        showError();
                    }
                }
                catch(Error)
                {
                    showError();
                }
        }
        else
        {
            showError();
        }        
}
    

    // Function for showing dialog message
    function showdialog()
    {
        let dialog;
        dialog = h("dialog",
                    h("form", { method: "dialog", style: { width: 'auto', height: 'auto'} },
                        h("header",
                        h("img", { src: "images/sucess.png", width: 24 , height: 24 } ),
                        h("h1","Optimized")),
                        // h("footer",
                            h("button", { uxpVariant: "cta", onclick(e) { dialog.close() } },"OK")
                        )
                    )
                // )
        document.body.appendChild(dialog);
        dialog.showModal();
    }
    // Asynchronous Function to show error
    async function showError()
    {
        await error("Select Image",
                    "Please select an image file to perform compression");
    }

    // Exporting modules via JSON.
    module.exports = {
        commands: {
            myPluginCommand: mainFunction
            
        }
    };
}
