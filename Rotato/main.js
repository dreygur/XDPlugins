/*
 * Send to Rotato for Adobe XD
 
There are two functions

sendToRotato:selection 
saves the file Artboard.png to the root of the plugin settings folder. 
That folder is monitored by Rotato, which will treat that file as a dragged in file
Rotato: windowController.canvasViewController.setScreenshotForFirstDevice(fromFilePath: file)

explodeInRotato:selection
1. Saves each root level layer of the active artboard in the /exploded folder 
2. TRIGGER: When all layers are saved, it saves a "exploded.txt" file in the root folder that tells Rotato to start importing
3. when the monitor in Rotato sees this, it triggers the exploded artboard functions in Rotato
Rotato: windowController.canvasViewController!.loadArtboard(fromFolder: ab)
that in turn triggers Device:load(artboardFromFolder folderUrl : URL, ontoPlaceholder placeholderNode : SCNNode)
which in turn triggers SketchArtboard:populateLayers(fromFolder folderUrl: URL)


Filename convention
    - one file should be called Artboard.png and contain the entire artboard ready for flattening
    - the filenames contain the bounds of each layer, separated by 🔠
        - 0: layer name
        - 1: x
        - 2: y
        - 3: not used?!
        - 4: not used
        - 5: artboard width
        - 6: artboard height
        - 7: index (this layer's position)
        - 8: hex of artboard's background color

    - populateLayers will traverse subfolders, but thank goodness that's not necessary in XD
    - Export scale must be 5

The monitor lives in AppDelegate with the other toplevel stuff

 */


 
// var {Rectangle, Color} = require("scenegraph");

const application = require("application");
const fs = require("uxp").storage.localFileSystem;

// -----------------------------------------------------------------
//                       Explode in rotato
// -----------------------------------------------------------------
async function explodeInRotato(selection){
    console.log("explodeInRotato");

     // /Users/mortenjust/Library/Application Support/Adobe/Adobe XD CC/plugin_settings/01dc1332/

        // clean up 
        await cleanUp()
        const dataFolder = await fs.getDataFolder()
        var folder = await dataFolder.createFolder("exploded")

        // abort if no selection
        if (!selection.focusedArtboard) {
            createDialog().showModal()
            return
        }

        // get ready
        var renditions = []
        var processedItems = 0 
        const artboard = selection.focusedArtboard
        const artboardFillHex = artboard.fill.toHex(true).replace("#", "")
        var topLayers = artboard.children
        var index = 0 

        // ------ loop through layers ----------

        console.log("Focused artboard: " + artboard)
        console.log("topLayers: " + topLayers)
        console.log("toplayers chiildren "+topLayers)        
        console.log("foreaching "+topLayers.length+" layers")

        await Promise.all(topLayers.map(async (layer) => {
            const bounds = layer.boundsInParent
            const fileName = layer.name.replace(/[^a-z0-9]/gi,'') + "🔠" + bounds.x + "🔠"  + bounds.y + "🔠"  + bounds.width + "🔠" + bounds.height + "🔠" 
                        + artboard.width
                        + "🔠" + artboard.height + "🔠" + index + "🔠" + artboardFillHex+ "🔠.png"
            index++
            const file = await folder.createFile(fileName)
            renditions.push({node: layer, outputFile: file, type: application.RenditionType.PNG, scale: 5})
        }))

        const artboardFile = await folder.createFile("Artboard.png")
        renditions.push({node : artboard, outputFile: artboardFile, type: application.RenditionType.PNG, scale: 5})        
        
        console.log("creating "+renditions.length+" renditions")
        
        application.createRenditions(renditions)
        .then(async results => {
            const signalFile = await dataFolder.createFile("explosionAvailable.rotatoSignal")                    
            await signalFile.write("Exploded");
            
        })
        .catch(error => {console.log(error)})



        // topLayers.forEach(async layer => {
        //     console.log("layer: " + layer.name)
        //     const bounds = layer.boundsInParent
        //     // Group 2🔠38🔠48🔠16🔠13🔠375🔠812🔠1🔠000000🔠.png
        //     console.log("creating filename")
            
        //     const fileName = layer.name + "🔠" + bounds.x + "🔠"  + bounds.y + "🔠"  + bounds.width + "🔠" + bounds.height + "🔠" 
        //         + artboard.width
        //         + "🔠" + artboard.height + "🔠" + index + "🔠" + artboardFillHex+ "🔠.png"

        //     index++
        //     console.log("added " + layer.name + "")

        //     const file = await folder.createFile(fileName)            
        //     renditions.push({node: layer, outputFile: file, type: application.RenditionType.PNG, scale: 5})        
        //     processedItems++

        //     if(processedItems == topLayers.length){
        //         const artboardFile = await folder.createFile("Artboard.png")
        //         renditions.push({node : artboard, outputFile: artboardFile, type: application.RenditionType.PNG, scale: 5})        
                
        //         console.log("creating "+renditions.length+" renditions")
        //         application.createRenditions(renditions)
        //         .then(async results => {
        //             const signalFile = await dataFolder.createFile("explosionAvailable.rotatoSignal")                    
        //             await signalFile.write("Exploded");
        //         })
        //         .catch(error => {console.log(error)})
        //     }
        // });
        
    
}

const sleep = m => new Promise(r => setTimeout(r, m))

async function cleanUp(){
    const df = await fs.getDataFolder()
    const ef = await df.getEntry("exploded").catch(error => {})
    await deleteContensOfFolder(ef).catch(error => {})
    await deleteContensOfFolder(df) 

    return true 
}


async function deleteContensOfFolder(folder){
    console.log("deleteContensOfFolder:" + folder)
    
    let entries = await folder.getEntries()
    console.log("dcof: got entries: "+entries)
    var stopAt = entries.length

    if(entries.length == 0){
        console.log("No files")
    }
    
    console.log("dcof: We have " + stopAt + "items here")

    await asyncForEach(entries, async entry => {
        await entry.delete()
    })

    // var i = 0 
    // await entries.forEach(async entry => {        
    //     console.log("dcof: ---> DELETING "+entry)
    //     await entry.delete()
    //     console.log("dcof: ---> DELETED "+entry)
    //     if (i++ == entries.length) {
    //         console.log("Done deleting, returning")
    //         return
    //     } 
    // })
}

const asyncForEach = async (array, callback) => {    
    console.log("async array has " + array.length + " and the first is " + array[0])
    for (let index = 0; index < array.length; index++) {
        console.log("async array retiurning index " + index + "  which is object " + array[index])
        await callback(array[index], index, array)
    }
  }
  

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


// -----------------------------------------------------------------
//                      Send to Rotato
// -----------------------------------------------------------------
async function sendToRotato(selection) {
    console.log("explodeInRotato");

    // /Users/mortenjust/Library/Application Support/Adobe/Adobe XD CC/plugin_settings/01dc1332/

       // clean up 
       await cleanUp()
       const dataFolder = await fs.getDataFolder()
       

       // abort if no selection
       if (!selection.focusedArtboard) {
           createDialog().showModal()
           return
       }

       // get ready
       var renditions = []
       const artboard = selection.focusedArtboard
       
       // save artboard
       const artboardFile = await dataFolder.createFile("Artboard.png")
       renditions.push({node : artboard, outputFile: artboardFile, type: application.RenditionType.PNG, scale: 3})        
       
       // render, then create signal file when done. Signal file triggers code in AppDelegate in Rotato
       await application.createRenditions(renditions)
       .then(async results => {
           const signalFile = await dataFolder.createFile("artboardAvailable.rotatoSignal")                    
           await signalFile.write("Single artboard");           
       })
}


// -----------------------------------------------------------------
//                      Copy rendered
// -----------------------------------------------------------------
async function copyRendered(selection) {
    console.log("explodeInRotato");

    // /Users/mortenjust/Library/Application Support/Adobe/Adobe XD CC/plugin_settings/01dc1332/

       // clean up 
       await cleanUp()
       const dataFolder = await fs.getDataFolder()
       

       // abort if no selection
       if (!selection.focusedArtboard) {
           createDialog().showModal()
           return
       }

       // get ready
       var renditions = []
       const artboard = selection.focusedArtboard
       
       // save artboard
       const artboardFile = await dataFolder.createFile("Artboard.png")
       renditions.push({node : artboard, outputFile: artboardFile, type: application.RenditionType.PNG, scale: 3})        
       
       // render, then create signal file when done. Signal file triggers code in AppDelegate in Rotato
       await application.createRenditions(renditions)
       .then(async results => {
           const signalFile = await dataFolder.createFile("artboardForPastebuffer.rotatoSignal")                    
           await signalFile.write("Single artboard for pasting");
           
       })
}

function createDialog() {
    // Add your HTML to the DOM
    document.body.innerHTML = `
      <style>
      form {
          width: 400px;
      }
      </style>
      <dialog id="dialog">
          <form method="dialog">
              <h1>Send to Rotato</h1>
              <p>Select an artboard or any element inside it first.</p>
              <footer>
              <button type="submit" uxp-variant="cta" id="ok-button">Got it</button>
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
        sendToRotato: sendToRotato, 
        explodeInRotato: explodeInRotato,
        copyRendered : copyRendered
    }
};
