/*
* uiLogos for Adobe XD by @realvjy
* Visit https://uilogos.co/xd-plugin
* Created date: Dec 2018
* Updated date: 12 Jan 2018
* Version 0.3.0
*/

const scenegraph = require("scenegraph");
const fs = require("uxp").storage.localFileSystem;
const { ImageFill } = require("scenegraph");
const diag = require('./dialog.js');

var selectedShapes = null;

// shuffle logos/images
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

async function generateLogos(type, color) {
  const pluginFolder = await fs.getPluginFolder();
  const pluginEntries = await pluginFolder.getEntries();
  const resourceFolder = await getFolderData(pluginEntries, 'resources');
  const logosFolder = await getFolderData(resourceFolder, 'logos');
  let logoTypeFolder;
  if (type == 'full-logo') {
    logoTypeFolder = await getFolderData(logosFolder, 'full-logo');
  }

  if (type == 'mark') {
    logoTypeFolder = await getFolderData(logosFolder, 'mark');
  }

  if (type == 'flags') {
    logoTypeFolder = await getFolderData(logosFolder, 'flags');
  }

  // Get logos array
  const allLogos = await getFolderData(logoTypeFolder, color);

  return allLogos;
}

// Get all logos
async function getLogos(selection, type, color) {
  if (selection.items.length > 0) {
    try {
      await generateLogos(type, color)
      .then(result => {
        if (result.length > 0) {
          return fillLogos(selection, result);
        }
      });
    } catch (e) {
      diag.showDialog('#alertDialog',e);
    }
  } else {
    diag.showDialog('#infoDialog', 'Please select rectangele shapes');
  }
}


// Get Rectangle and oval Shapes
async function fillLogos(selection, allLogos) {
  shuffle(allLogos);
  var imageCount = allLogos.length;
  if (imageCount != 0 && imageCount >= selection.items.length) {
    for (var i = 0; i < selection.items.length; i++) {
      if (selection.items[i] instanceof scenegraph.Rectangle) {
        try {
          var logoObj = await getLogo(allLogos[i]);
          fillSelectionWithLogo(selection.items[i], logoObj);
        } catch (e) {
          console.log(e);
        } finally {
          diag.showDialog('#alertDialog',selection.items.length+' shapes filled with logo or flag');
        }
      } else {
        diag.showDialog('#infoDialog', 'Please select shapes');
      }
    }
  } else {
    diag.showDialog('#alertDialog', selection.items.length+' shapes! Please select upto '+allLogos.length+' Shapes');
  }
}

// Fill selected shape with image/logo
function fillSelectionWithLogo(selectedPath, image) {
  const imageFill = new ImageFill(image);
  let newBounds = getFrameSize(selectedPath, imageFill);
  selectedPath.height = newBounds.height;
  selectedPath.width = newBounds.width;
  selectedPath.x = newBounds.x;
  selectedPath.y = newBounds.y;
  selectedPath.strokeEnabled = false;
  selectedPath.name = image.name.split('.').slice(0, -1).join('.');
  selectedPath.fill = imageFill;
}


// Get logo for selected shape
function getLogo(selectedLogo) {
  return new Promise((resolve, reject) => {
    if (selectedLogo) {
      try {
        const logo = selectedLogo;
        resolve(logo);
      } catch (e) {
        reject('could not load logo')
      }
    } else {
      reject('had an error')
    }
  });
}

// Return Folder and Files
async function getFolderData(entries, folderName) {
  var folder = entries.filter(entry => entry.isFolder && entry.name == folderName);
  if (folder.length == 0) {
    console.log('The folder ' + folderName + ' doesn\'t exist');
    return undefined;
  } else {
    var files = await folder[0].getEntries();
    return files;
  }
}


// Frame Size for image repace
function getFrameSize(selectedPath, image){

    // Default dimentions
    var newX = 0;
    var newY = 0;
    var newWidth = 100;
    var newHeight = 100;
    var coordiBounds = selectedPath.boundsInParent;
    // Decide the output frame dimension for reference
    if (selectedPath instanceof scenegraph.Rectangle) {
      newX = coordiBounds.x;
      newY = coordiBounds.y;
      newWidth = coordiBounds.width;
      newHeight = coordiBounds.height;
    }

    // Decide the height and width
    var ratio = image.naturalWidth/image.naturalHeight;

    var newHeight = newHeight;
    var newWidth = image.naturalWidth/ratio;

    // Check for Portrait Logo
    if(newWidth > coordiBounds.width) {
        newHeight = coordiBounds.height;
        newWidth = newHeight*ratio;
    }


    // Decide location center align with shape
    var newX = coordiBounds.x + (coordiBounds.width - newWidth)/2;
    var newY = coordiBounds.y + (coordiBounds.height - newHeight)/2;

    var newBounds = {x: newX, y: newY, height: newHeight, width: newWidth};

    return newBounds;
}
module.exports = {
  commands: {
    getColorLogotype: async function (selection) {
      try {
        await getLogos(selection, 'full-logo', 'color');
      } catch (error) {
        console.log(error)
      }
    },
    getBlackLogotype: async function (selection) {
      try {
        await getLogos(selection, 'full-logo', 'black');
      } catch (error) {
        console.log(error)
      }
    },
    getColorLogomark: async function (selection) {
      try {
        await getLogos(selection, 'mark', 'color');
      } catch (error) {
        console.log(error)
      }
    },
    getBlackLogomark: async function (selection) {
      try {
        await getLogos(selection, 'mark', 'black');
      } catch (error) {
        console.log(error)
      }
    },
    // Method for flag 12 Jan
    getCountryFlag: async function (selection) {
      try{
        await getLogos(selection, 'flags', 'color');
      } catch (error) {
        console.log(error)
      }
    }
  }
}
