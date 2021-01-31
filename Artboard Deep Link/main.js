const clipboard = require("clipboard");
const cloud = require("cloud");
const {alert, error} = require("./lib/dialogs.js");
const interactions = require("interactions");


let artboardName; //name provided by xd or user
let artifactURL = ""; //xd root link
let finalURL; //link for browser
let sharedLink; //type of the link
let onHomeArtboardChain; //the link of interactions that starts from the home artboard and its respective branches

// Get prototypes/specs data
let sharedArtifacts = cloud.getSharedArtifacts();
let prototypes = sharedArtifacts.filter(artifact => (artifact.type === cloud.ArtifactType.PROTOTYPE));
let specs = sharedArtifacts.filter(artifact => (artifact.type === cloud.ArtifactType.SPECS));

function getURL(selection, sharedLink) {
    if (artifactURL == false) {
        error("No web link for " + sharedLink + "!", "First, share this project online in order to create the web link. Go to:\nShare -> Share for " + sharedLink + " -> Create Link");
        //Wheater of not to clear the clipboard if button (artifact) is not available (maybe as a checkbox):
        //clipboard.copyText(""); //currently it creates a text box that needs to be deleted form scene
        return;
    }

    //should work only for artboards:
    if (!selection.items[0] || selection.items[0].constructor.name != "Artboard") {
         //Wheater of not to clear the clipboard if button (artifact) is not available (maybe as a checkbox):
        //clipboard.copyText(""); //currently it creates a text box that needs to be deleted form scene
        alert("Select an artboard!", "This command works only if you have previously selected an artboard.\nThen you can just PASTE (CTRL/CMD + V) the link in your 🌐browser.");
        return;
    }

    onHomeArtboardChain = selection.items[0].incomingInteractions.some(item => {
        //if current selection has incoming interection which is on the same chain that reaches the home (first)
        //console.log("item is: " + item.triggerNode.guid + " and home is: " + interactions.homeArtboard.guid);
        return (item.triggerNode.guid === interactions.homeArtboard.guid) ? "true" : "false"
    })
    //console.log("is in chain link to home:", onHomeArtboardChain);
    //console.log("is home: " + selection.items[0].isHomeArtboard);
    //console.log(interactions.allInteractions.length + " " + onHomeArtboardChain + " " + !selection.items[0].isHomeArtboard + "\n");
    //console.log(interactions.allInteractions.length > 0 && onHomeArtboardChain == false && !selection.items[0].isHomeArtboard);

    //if there are no interactions made between any artboards, XD will map all the artboards to the links, so we can receive them safely via plugin:
    //else the selected artboard needs to be on the same chain with home artboard or else will not be visible online
    //if the selected artboard doesn't get (receive) any interaction will not be linked by XD in the browser: continue if selection.items[0].incomingInteractions == true
    //MOST IMPORTANTLY: if selected artboard is not directly chain-linked with the home artboard -> artboard doesn't render in browser by XD 
    if (interactions.allInteractions.length > 0 && !onHomeArtboardChain && !selection.items[0].isHomeArtboard) {
        error("This artboard got lost! ☹", "💥 WE GIVE YOU THE LINK, BUT YOU MIGHT NOT SEE WHAT YOU WANT IN THE BROWSER!\n\n🔥 Most likely you will see the Home Screen.\n\n🔑 SOLUTION: Attach this artboard to a chain of interactions that eventually gets connected to the root of the document:  🏠the Home Artboard.\n\n❗ Remember: In XD any artboard that is not connected to another artboard that eventually chains up to the root home artboard, will not appear in the 🌐browser.\n\n❔ PS: You may choose to have not a single interaction between the artboards and that could work too.");
    }

    //clean the title name of the selected artboard the way xd presents links in web browser:
    artboardName = selection.items[0].name
        .replace(/[^a-z0-9]+/gi, "-") // replace with "-' any character that is not a number or a letter
        .replace(/[-]+$/g, ""); //remove any "-" fron end of link
    finalURL = artifactURL + "screen/" + selection.items[0].guid + "/" + artboardName + "/";
    clipboard.copyText(finalURL); //copy URL to clipboard
    //finalURL = ""; //clear url
    //artifactURL = ""; //clearxd root link
    //console.log(finalURL); //for debug
}

function getPROTOTYPEurl(selection) {
    if (prototypes == false) {
        artifactURL == false;
    } else {
        prototypes.forEach(artifact => {
            artifactURL = artifact.url;
        });
    }
    sharedLink = "Review";
    getURL(selection, sharedLink);
}

function getSPECSurl(selection) {
    if (specs == false) {
        artifactURL == false;
    } else {
        specs.forEach(artifact => {
            artifactURL = artifact.url;
        });
    }
    sharedLink = "Development";
    getURL(selection, sharedLink);
}

module.exports = {
    commands: {
        getPROTOTYPEurl,
        getSPECSurl
    }
};
