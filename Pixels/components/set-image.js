const commands = require('commands');
const { ImageFill, selection } = require("scenegraph");
const { noSelection, noConnection } = require('./error');
const { injectImage } = require('./inject-image');
const fetchBinary = require('./fetchBinary');

module.exports.setImage = async function(event) {
  let $t = event.currentTarget;
  let src = $t.getAttribute('data-src');
  let id = $t.getAttribute('data-id');

  const { editDocument } = require("application");
  editDocument( async (selection) => {
    let types = ["Rectangle", "Ellipse", "Polygon"];
    const storage = require('uxp').storage;
    const fs = storage.localFileSystem;
    const formats = storage.formats;

    const tmp = await fs.getTemporaryFolder();
  
    if(selection.items.length >= 1 && selection.items[0].constructor.name != "Artboard") { 

      for(let i = 0; i < selection.items.length; i++){
        let selected = selection.items[i];
        
        if(types.includes(selected.constructor.name)) {
          // let getData = await injectImage(src, id);
          // let fillImage = await new ImageFill(getData);
         try {
          const d = await fetchBinary(src);
          const file = await tmp.createEntry('name', { overwrite: true });
          await file.write(d, { format: formats.binary });
          const bitmap = new ImageFill(file);
          selected.fill = bitmap;
          let getData = await injectImage(id)
          console.log(getData);
         } catch(err) {
           noConnection();
         }
        }
      }
    } else {
      noSelection();
    }
  })
}