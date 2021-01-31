/*
 * This Person Does Not Exist plugin for Adobe XD by @mightyalex
 */
 

var selectedShapes = null;

/* Core functions */

async function generateFaces(selection){
	
	selectedShapes = selection;
	
	if (selectedShapes.items.length > 0) {
		try {
			
			var summaryMessages = "";
			var failedDownloads = 0;
			var failedShapeTypes = 0;
			
			for (var i = 0; i < selectedShapes.items.length; i++) {
			    if(selectedShapes.items[i].constructor.name == "Rectangle" || selectedShapes.items[i].constructor.name == "Ellipse" || selectedShapes.items[i].constructor.name == "Path"){
			        
			        var shape_width = (selectedShapes.items[i].localBounds.width) * 2; // double the width for retina
			        var random_string = Math.random().toString(36).substring(7);
			        var photo_url = 'https://images.weserv.nl/?url=thispersondoesnotexist.com/image&w='+shape_width+'&' + random_string;
			        
			        var photo_obj = await fetchBinary(photo_url).catch(err => {summaryMessages += "\n❗ Error while downloading image. \n"; failedDownloads++});
			        
			        if(photo_obj){
			            var photo_obj_base64 = await base64ArrayBuffer(photo_obj);
			            const ImageFill = require("scenegraph").ImageFill;
			            var fill = new ImageFill('data:image/jpeg;base64,' + photo_obj_base64);
			            selectedShapes.items[i].fillEnabled = true;
						selectedShapes.items[i].fill = fill;
			        }
					sleepFor(1000); //pause in order to avoid duplicates
			    }else{
			        summaryMessages += "\n⚠️ "+selectedShapes.items[i].constructor.name+" is not supported and was skipped.\n";
			        failedShapeTypes++;
			    }
		    }
		    
		    summaryMessages += "\n✅ " + (selectedShapes.items.length - failedDownloads - failedShapeTypes) + " of " + selectedShapes.items.length + " selected objects were filled with avatars.";
		    showDialog("#alertDialog", summaryMessages);
			  
	    }catch(err) {
	    	showDialog("#alertDialog", err);
	    }
    }else {
    	showDialog("#onboardingDialog", "Please select one or more shapes that you want to be filled with avatars and run the plugin again.\n\nSupported shapes are Rectangle, Ellipse and Path.\n\nBest results are when shapes have equal width and height.");
    }	

}

/* Helper functions */

function showDialog(dialogId, messageText) {
    return new Promise((resolve, reject) => {
	    let dialog = document.querySelector(dialogId);
	    let message = document.querySelector(dialogId + " #message");
	    let closeButton = document.querySelector(dialogId + " #closeButton");
	    dialog.showModal();
	    message.textContent = messageText;
        closeButton.onclick = () => {
            dialog.close();
            resolve();
        }
    })
}

function fetchBinary(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.onload = () => {
            if (req.status === 200) {
                try {
                    var arr = new Uint8Array(req.response);
                    resolve(arr);
                } catch (err) {
                    reject(`Couldnt parse response. ${err.message}, ${req.response}`);
                }
            }else {
                reject(`Request had an error: ${req.status}`);
            }
        }
        req.onerror = reject;
        req.onabort = reject;
        req.open('GET', url, true);
        req.responseType = "arraybuffer";
        req.send();
    });
}

function base64ArrayBuffer(arrayBuffer) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}

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

function sleepFor( sleepDuration ){
	var now = new Date().getTime();
	while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

/* Dialog markup */

let alertDialog =
		    h("dialog", {id: "alertDialog"},
		   		h("div", { style: { borderBottom: "1px solid #eaeaea", width: "100%", paddingBottom: "20px", display: "flex", flexDirection: "row", alignItems: "center",}},		                
	                h("h1", {style: { fontSize: "24px" }}, "Summary"),
	            ),
		        h("form", { method:"dialog", style: { width: 400 } },
		            
		             h("div", {id: "message", marginTop: 10, maxHeight: 500, overflowY: "scroll"}, "Dialog message is not specified."),
		            
		            h("footer",
		                h("button", {id: "closeButton", uxpVariant: "cta"}, "OK"),
		            )
		        )
		    );
document.body.appendChild(alertDialog);

let onboardingDialog =
		    h("dialog", {id: "onboardingDialog"},
		    	h("div", { style: { borderBottom: "1px solid #eaeaea", width: "100%", paddingBottom: "20px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }},		                
	                h("div",		                
		                h("h1", {style: { fontSize: "24px" }}, "This Person Does Not Exist"),
		                h("h2", {style: { fontSize: "14px", fontWeight: "normal", color: "#555", marginBottom: "10px" }}, "Photos of fictional people"),
		                h("span", {style: { fontSize: "10px", color: "#555"}}, "Image source: "),
		                h("a", {style: {fontSize: "10px", color: "#116cd6", marginBottom: "10px", display: "inline"}, href: "https://thispersondoesnotexist.com" }, "thispersondoesnotexist.com"),
		                 h("span", {style: { fontSize: "10px", color: "#555"}}, "Image resize and proxy: "),
		                h("a", {style: {fontSize: "10px", color: "#116cd6", marginBottom: "10px", display: "inline"}, href: "https://images.weserv.nl" }, "images.weserv.nl"),
		                h("span", {style: { fontSize: "10px", color: "#555"}}, "Plugin by: "),
		                h("a", {style: {fontSize: "10px", color: "#116cd6", display: "inline"}, href: "https://twitter.com/mightyalex" }, "mightyalex")
					)
	            ),
		        h("form", { method:"dialog", style: { width: 400, textAlign: "left", display: "flex", paddingTop: "20px" } },
		            
		            h("p", {id: "message", style: {margin: "0"}}, "Dialog message is not specified."),
		            
		            h("footer",
		                h("button", {id: "closeButton", uxpVariant: "cta"}, "OK"),
		            )
		        )
		    );
document.body.appendChild(onboardingDialog);

/* Menu commands */

module.exports = {
    commands: {
        generateFaces
    }
}