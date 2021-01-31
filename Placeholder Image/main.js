const commands = require('commands');
const axios = require('./lib/axios');
const { ImageFill, Color } = require("scenegraph");
const endPoint = "https://kennykrosky.com/image-data-uri?image=https://via.placeholder.com/";
const { alert, error } = require('./lib/dialogs.js');


const runImages = async (selection) => {
  let types = ["Rectangle", "Ellipse", "Polygon"];
  if(selection.items.length >= 1 && selection.items[0].constructor.name != "Artboard") {
    for(let i = 0; i < selection.items.length; i++){
      let selected = selection.items[i];
      let { localBounds } = selection.items[i];
      
      if(types.includes(selected.constructor.name)) {
        let height = Math.round(localBounds.height);
        let width = Math.round(localBounds.width);
        let getDate = await fetchImage(height, width);
        let fillImage = await new ImageFill(getDate);
        selected.fill = fillImage;
      }
  
    }
  } else {
    alertUserNoObj();
  }
}

const fetchImage = (height, width) => {
  return axios(`${endPoint}${width}x${height}.png/?text=${width}x${height}`)
  .then(response =>  {
    return response.data;
  })
  .catch((err) => {
    console.log(err);
    noConnection();
  })
}



const alertUserNoObj = async () => {
  await error(
    "Placeholder Image error",
    "Please select one or more of the following: ",
    "* Rectangle",
    "* Ellipse",
    "* Polygon"
  );
}

const noConnection = async () => {
  await error(
    "Placeholder Image error",
    "Please connect to the internet and try again ",
  );
}



module.exports = {
  commands: {
    doImage: runImages
  }
}