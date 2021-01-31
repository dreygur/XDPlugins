/*
 *
 */

const viewport = require("viewport");
const {error, prompt} = require("./lib/dialogs");

 

async function mainFunction(selection, root) { 
  
    const feedback = await prompt("Find Artboard from Link", "Copy the link from the browser and paste it here to find the related artboard in your file.\n\nExample: https://xd.adobe.com/view/824esdsf2-fes3-4561-8139-v9c3c26fd912-d71d/", "Paste the link from browser...", ["Dismiss", "Apply"]);
    const pastedLink = feedback.value;
    //console.log(feedback.value);

    function findArtboard() {
        if (pastedLink.search(/\b^https:\/\/xd\.adobe\.com/) != 0) {
            error("Link is not valid!", "Check to see the correct link displayed in a browser.");
            return;
        }
 
        //check for a home artboard in this document:
        let artboard = root.children.filter(rootItem => rootItem.isHomeArtboard)[0];
        let guid;

        //if no home artboard => cannot find out which is the first artboard displayed in browser (might be the one with lowest x and y) !!! TODO
        if(!artboard) {
            error("No Home Artboard!", "First specify where this document should start from.\nGo to: Prototype -> 🏠 House symbol (on top left of an artboard).\n❗ Update your document (Share -> Share for ...)")
            // return;
        }
      
        const linkSplit = pastedLink.split("/");
   
        //get the artboard guid from pasted web link:
        //for links that are not the home artboard: 
        if(linkSplit.length > 6 ) {
            guid = linkSplit[6];
            artboard = root.children.filter(rootItem => rootItem.guid == guid)[0];
        }
        if ( !artboard ) { 
            error("Artboard not found", "The artboard you are looking for seems to not be in this document. Did you remove it? Then do an update (Share->Share for...)\nTry again with another link or look into another document.\nBe sure to paste a link EXACTLY how it appears in the browser!"); 
            return;
        }
        //console.log(artboard[0].globalBounds);
        //viewport.scrollToCenter(artboard.globalBounds.x, artboard.globalBounds.y);
        //viewport.scrollIntoView(artboard.globalBounds.x, artboard.globalBounds.y, artboard.localBounds.width, artboard.localBounds.height);
        viewport.zoomToRect(artboard);
        //viewport.scrollIntoView(artboard);
        selection.items=[artboard]
    }

    switch (feedback.which) {
        case 0:
            /* User canceled */
            break;
        case 1:
            /* User clicked Enable */
            findArtboard();
            break;
    }
    return;
    // debug(selection);
    //console.log("zoom factor: ", viewport.zoomFactor); 
    //console.log("viewport bounds: ", viewport.bounds);

    //jump to artboard
    //viewport.zoomToRect(selection.items[0]);

    //smooth scrolling to a particular location x, y:
    //viewport.scrollToCenter(100,100);
}

module.exports = {
    commands: {
        mainCommand: mainFunction
    }
};



