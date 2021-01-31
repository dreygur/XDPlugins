/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


let scenegraph = require("scenegraph");
const { Artboard, Rectangle, Ellipse, Text, Color, ImageFill, LinearGradientFill } = require("scenegraph");

const storage = require("uxp").storage;
const fs = require("uxp").storage.localFileSystem;
const application = require("application");
const JSZip = require("./jszip");

var xmlHeader ='<?xml version="1.0" encoding="UTF-8" ?>';

async function main(selection,documentRoot) {
  
   
  
  //copy base folder
  const pluginFolder = await fs.getPluginFolder();
   const baseFolder = await pluginFolder.getEntry("base");
   
   var targetFile = await fs.getFileForSaving("output.vp", {types:["vp"]});
   
  var temp = await fs.getTemporaryFolder();
  try{
  let targetFolder = await temp.getEntry("tmp");
  await deleteFolder(targetFolder);
    }catch(e){
    }
  
    var targetFolder = await temp.createFolder("tmp"); 
      var myZip = new JSZip();
      await zipFolder(baseFolder,myZip);
      
  
  var renditions = {};
  let counter = 1;
  var myArtboards = [];
documentRoot.children.forEach(node => {
	if (node instanceof Artboard) 
        myArtboards.push(node);
});
   
    
  for(var artboard of myArtboards)
	try{
	
     
            let screenId = createNewUUID();
	
            var myXml = [xmlHeader,"<screen>"];
            myXml.push('<parentCode />\n\
<folderPosition>0</folderPosition>\n\
<name>'+artboard.name.replace(/[^a-zA-Z0-9- ]/g,"_")+'</name>\n\
<code>'+screenId+'</code>\n\
<templateID>'+createNewUUID()+'</templateID>\n\
<date>'+currDate()+'</date>\n\
<note></note>\n\
<legend-item></legend-item>\n\
<pageAlignment>LEFT</pageAlignment>\n\
<device>web</device>\n\
<orientation>'+getOrientation(artboard.width,artboard.height)+'</orientation>\n\
<backgroundGrowth>BOTH</backgroundGrowth>');

            myXml.push('<width>'+Math.round(artboard.width)+'</width>');
            myXml.push('<height>'+Math.round(artboard.height)+'</height>');
            
            
            
            myXml.push('<item-group id="'+createNewUUID()+'" visible="true">');
       
                 
                artboard.children.forEach(function (childNode, i) {
                    
                      myXml.push(nodeToXml(childNode,renditions,artboard.globalBounds,0));
                 });
                 
     	
        
	
    myXml.push('<style name="LnFCanvas">\n\
<DimensionStyle widthType="px" heightType="px" width="'+Math.round(artboard.width)+'" height="'+Math.round(artboard.height)+'" widthPercentage="0.0" heightPercentage="0.0" />\n\
<PositioningStyle left="0" top="0" pinLeft="none" pinTop="none" />');
                 if (artboard.fill)
                     {
                         
                         if(artboard.fill.constructor.name=="ImageFill" || artboard.fill.constructor.name=="LinearGradientFill" || artboard.fill.constructor.name=="RadialGradientFill")
                         {
                             renditions[screenId] = artboard;
                 myXml.push('<BackgroundStyle type="transparent">\n\
<image original-name="Bottom Black Cover.png" bgImType="STRETCH" bgImHAlign="BEGINNING" bgImVAlign="BEGINNING">'+screenId+'.png</image>\n\
</BackgroundStyle>');
                         }
                             else
                        {
               myXml.push('<BackgroundStyle type="color" value="'+getColor(artboard.fill)+'">\n\
<image bgImType="REPEAT" bgImHAlign="BEGINNING" bgImVAlign="BEGINNING" />\n\
</BackgroundStyle>');     
                        }
                    }; 
                     

myXml.push('<TransparencyStyle value="0" />\n\
</style>');
            myXml.push('</item-group>');
            myXml.push("<Events />");
            myXml.push("</screen>");

           
//            await writeScreen(myXml,screenId,screensFolder); 
            await zipTextToFile(myXml.join("\r"),myZip,"screens/"+screenId+".xml"); 
            counter++;
            
		
	}catch(e){console.log(e)}
    
    try{
        var testProp = false;
        for(var prop in renditions)
        {
            testProp = true;
            break;
        }
    if(testProp)    
    await writeNodeRenditions(renditions,targetFolder);
    }catch(e){console.log(e)};

    await zipFolder(targetFolder,myZip,"images");
    
    await deleteFolder(targetFolder);    
    

    
    var myZipFile = targetFile;
    
    myZip.generateAsync({type:"uint8array"}).then(function (data) {
  
      
        myZipFile.write(data,{format: storage.formats.binary});
    
    });
   
    return true;
  
}


function getColor(color)
{
    //255r255g255b0a
    var result = [color.r,"r",color.g,"g",color.b,"b",Math.round(((255-color.a)/255)*100),"a"].join("");
    return result;
}

function nodeToXml(node,renditions,parentBounds,rotation)
{
    var result = "";
    var nodeId = createNewUUID();
    var lockType = node.locked ? "none" : "none";
    var visible = node.visible;
    var hidden = !visible;
 
    let nodeX = Math.round(node.globalBounds.x-parentBounds.x);
    let nodeY = Math.round(node.globalBounds.y-parentBounds.y);
     
   
   
    var myOpacity = node.opacity;
    myOpacity = (100*(1-myOpacity)).toFixed(0);
    switch(node.constructor.name)
    {
            
    case "Rectangle":
        result = '<rectangle id="'+nodeId+'" auto-fit="false" hidden="'+hidden+'" lockType="'+lockType+'" onTop="false" visible="'+visible+'">\n\
<text></text>\n\
<style name="LnFRectangle">\n\
<DimensionStyle widthType="px" heightType="px" width="'+Math.round(node.localBounds.width)+'" height="'+Math.round(node.localBounds.height)+'" widthPercentage="0.0" heightPercentage="0.0" />\n\
        <PositioningStyle left="'+nodeX+'" top="'+nodeY+'" pinLeft="none" pinTop="none" />\n';
        if(node.fillEnabled && node.fill!=null)
         if (node.fill && (node.fill.constructor.name=="ImageFill" || node.fill.constructor.name=="LinearGradientFill" || node.fill.constructor.name=="RadialGradientFill"))
        {
            renditions[nodeId] = node;
result += '<BackgroundStyle type="transparent">\n\
<image original-name="Bottom Black Cover.png" bgImType="STRETCH" bgImHAlign="BEGINNING" bgImVAlign="BEGINNING">'+nodeId+'.png</image>\n\
            </BackgroundStyle>\n';
        }
        else if(node.fill!=null)
result += '<BackgroundStyle type="color" value="'+getColor(node.fill)+'">\n\
<image bgImType="REPEAT" bgImHAlign="BEGINNING" bgImVAlign="BEGINNING" />\n\
            </BackgroundStyle>\n';
            else
                result += '<BackgroundStyle type="color" value="0r0g0b0a">\n\
<image bgImType="REPEAT" bgImHAlign="BEGINNING" bgImVAlign="BEGINNING" />\n\
            </BackgroundStyle>\n';
        if(node.strokeEnabled && node.stroke!=null)
        result+='<BorderStyle radius="'+Math.round(Math.min(100,100*node.effectiveCornerRadii.topLeft*2/Math.min(node.localBounds.width,node.localBounds.height))).toString() +'" leftColor="'+getColor(node.stroke)+'" topColor="'+getColor(node.stroke)+'" rightColor="'+getColor(node.stroke)+'" bottomColor="'+getColor(node.stroke)+'" leftStyle="solid" topStyle="solid" rightStyle="solid" bottomStyle="solid" leftWidth="'+Math.round(node.strokeWidth)+'" topWidth="'+Math.round(node.strokeWidth)+'" rightWidth="'+Math.round(node.strokeWidth)+'" bottomWidth="'+Math.round(node.strokeWidth)+'" />\n';
        else if(node.effectiveCornerRadii.topLeft!=0) result+='<BorderStyle radius="'+Math.round(Math.min(100,100*node.effectiveCornerRadii.topLeft*2/Math.min(node.localBounds.width,node.localBounds.height))).toString() +'" leftColor="0r0g0b0a" topColor="0r0g0b0a" rightColor="0r0g0b0a" bottomColor="0r0g0b0a" leftStyle="solid" topStyle="solid" rightStyle="solid" bottomStyle="solid" leftWidth="0" topWidth="0" rightWidth="0" bottomWidth="0" />\n';
         
result+='<TransparencyStyle value="'+myOpacity+'" />\n\
<PaddingStyle top="0" left="0" bottom="0" right="0" />\n\
<FontStyle size="10.0" height="17">\n\
<family>Arial</family>\n\
<style name="Regular" weight="400" italic="normal" />\n\
</FontStyle>\n\
<RotationStyle angle="'+Math.round(node.rotation+rotation)+'" />';
        if(node.shadow){
        
        var dx = node.shadow.x;
        var dy = node.shadow.y;
        
        var angle = 90;
        if(dx!=0 && dy!=0){
            var pi = Math.PI;
          angle = Math.round((Math.atan(-dy/dx))*(180/pi));
          if(dx>=0)
            angle= angle+180;
          angle = parseInt(((angle % 360)+360)%360);
        }

            result+='\n<ShadowStyle>\n\
<Box enable="'+node.shadow.visible+'" global="false" blur="'+node.shadow.blur+'" distance="'+Math.round(Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2)))+'" angle="'+angle+'" color="'+getColor(node.shadow.color)+'" dist="0" />\n\
<Text enable="false" />\n\
</ShadowStyle>';
        }else
            result+='\n<ShadowStyle>\n\
<Box enable="false" />\n\
<Text enable="false" />\n\
</ShadowStyle>';
         result+='\n<MarginStyle top="0" left="0" bottom="0" right="0" />\n\
</style>\n\
<rich-text-range-list>\n\
<text-range text-range-start="0" text-range-end="0">\n\
<style name="LnFTextRange">\n\
<FontStyle size="10.0" height="17">\n\
<family>Arial</family>\n\
<style name="Regular" weight="400" italic="normal" />\n\
</FontStyle>\n\
<TextStyle color="51r51g51b0a" hAlign="center" vAlign="center" decoration="none" line-height="18" />\n\
</style>\n\
</text-range>\n\
</rich-text-range-list>\n\
<userID>'+removeInvalidCharacters(node.name)+'</userID>\n\
</rectangle>';
        break;
    case "Ellipse":
        result = '<ellipse id="'+nodeId+'" auto-fit="false" hidden="'+hidden+'" lockType="'+lockType+'" onTop="false" visible="'+visible+'">\n\
<text></text>\n\
<style name="LnFEllipse">\n\
<DimensionStyle widthType="px" heightType="px" width="'+Math.round(node.localBounds.width)+'" height="'+Math.round(node.localBounds.height)+'" widthPercentage="0.0" heightPercentage="0.0" />\n\
<PositioningStyle left="'+nodeX+'" top="'+nodeY+'" pinLeft="none" pinTop="none" />\n';

    if(node.fillEnabled && node.fill!=null)
         if (node.fill && (node.fill.constructor.name=="ImageFill" || node.fill.constructor.name=="LinearGradientFill" || node.fill.constructor.name=="RadialGradientFill"))
        {
            renditions[nodeId] = node;
result += '<BackgroundStyle type="transparent">\n\
<image original-name="Bottom Black Cover.png" bgImType="STRETCH" bgImHAlign="BEGINNING" bgImVAlign="BEGINNING">'+nodeId+'.png</image>\n\
            </BackgroundStyle>\n';
        }
        else if(node.fill!=null)
result += '<BackgroundStyle type="color" value="'+getColor(node.fill)+'">\n\
<image bgImType="REPEAT" bgImHAlign="BEGINNING" bgImVAlign="BEGINNING" />\n\
            </BackgroundStyle>\n';
        else
            result += '<BackgroundStyle type="color" value="0r0g0b0a">\n\
<image bgImType="REPEAT" bgImHAlign="BEGINNING" bgImVAlign="BEGINNING" />\n\
            </BackgroundStyle>\n';
        if(node.strokeEnabled && node.stroke!=null){
            result+='<BorderStyle color="'+getColor(node.stroke)+'" style="solid" width="'+Math.round(node.strokeWidth)+'" />\n';
        }else{
            result+='<BorderStyle color="0r0g0b0a" style="none" width="1" />\n';
        }
result+='<TransparencyStyle value="'+myOpacity+'" />\n\
<PaddingStyle top="0" left="0" bottom="0" right="0" />\n\
<FontStyle size="10.0" height="17">\n\
<family>Arial</family>\n\
<style name="Regular" weight="400" italic="normal" />\n\
</FontStyle>\n\
<RotationStyle angle="'+Math.round(node.rotation+rotation)+'" />';
        if(node.shadow)
            result+='\n<ShadowStyle>\n\
<Box enable="'+node.shadow.visible+'" global="false" blur="'+node.shadow.blur+'" distance="'+Math.round(Math.sqrt(node.shadow.y*node.shadow.y+node.shadow.x*node.shadow.x))+'" angle="'+Math.round(Math.atan2(node.shadow.y,node.shadow.x))+'" color="'+getColor(node.shadow.color)+'" dist="0" />\n\
<Text enable="false" />\n\
</ShadowStyle>';
        else
            result+='\n<ShadowStyle>\n\
<Box enable="false" />\n\
<Text enable="false" />\n\
</ShadowStyle>';
        
         result+='\n<MarginStyle top="0" left="0" bottom="0" right="0" />\n\
</style>\n\
<rich-text-range-list>\n\
<text-range text-range-start="0" text-range-end="0">\n\
<style name="LnFTextRange">\n\
<FontStyle size="10.0" height="17">\n\
<family>Arial</family>\n\
<style name="Regular" weight="400" italic="normal" />\n\
</FontStyle>\n\
<TextStyle color="51r51g51b0a" hAlign="center" vAlign="center" decoration="none" line-height="18" />\n\
</style>\n\
</text-range>\n\
</rich-text-range-list>\n\
<userID>'+removeInvalidCharacters(node.name)+'</userID>\n\
</ellipse>';
        break;
    case "Line":
    case "Path":
     case "BooleanGroup":   
    case "LinkedGraphic":
       renditions[nodeId] = node;

       
        result = '<image id="'+nodeId+'" hidden="'+hidden+'" lockType="'+lockType+'" onTop="false" visible="'+visible+'">\n\
<image-name type="svg" preserveRatio="false">'+nodeId+'.png</image-name>\n\
<original-name>tmpSVG.png</original-name>\n\
<style name="LnFImage">\n\
<DimensionStyle widthType="px" heightType="px" width="'+Math.round(node.globalDrawBounds.width)+'" height="'+Math.round(node.globalDrawBounds.height)+'" widthPercentage="0.0" heightPercentage="0.0" />\n\
<PositioningStyle left="'+nodeX+'" top="'+nodeY+'" pinLeft="none" pinTop="none" />\n\
<BorderStyle radius="0" leftColor="0r0g0b0a" topColor="0r0g0b0a" rightColor="0r0g0b0a" bottomColor="0r0g0b0a" leftStyle="none" topStyle="none" rightStyle="none" bottomStyle="none" leftWidth="1" topWidth="1" rightWidth="1" bottomWidth="1" />\n\
<TransparencyStyle value="'+myOpacity+'" />\n\
<RotationStyle angle="'+Math.round(node.rotation+rotation)+'" />';

            result+='\n<ShadowStyle>\n\
<Box enable="false" />\n\
</ShadowStyle>';
        
         result+='<SVGBackgroundStyle isSVG="true" bgColor="0r0g0b0a" hasColor="false" />\n\
<MarginStyle top="0" left="0" bottom="0" right="0" />\n\
</style>\n\
<userID>'+removeInvalidCharacters(node.name)+'</userID>\n\
</image>';
        
        break;
    
    
    case "Text":
            var color = "0r0g0b0a";
       if(node.fill!=null)
           color =getColor(node.fill);
        result = '<rich-text id="'+nodeId+'" hidden="'+hidden+'" lockType="'+lockType+'" onTop="false" visible="'+visible+'">\n\
<text>'+node.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')+'</text>\n\
<style name="LnFRichText">\n\
<DimensionStyle widthType="px" heightType="px" width="'+Math.round(node.localBounds.width)+'" height="'+Math.round(node.localBounds.height)+'" widthPercentage="0.0" heightPercentage="0.0" />\n\
<PositioningStyle left="'+nodeX+'" top="'+nodeY+'" pinLeft="none" pinTop="none" />\n\
<BackgroundStyle type="transparent" />\n\
<BorderStyle radius="0" leftColor="0r0g0b0a" topColor="0r0g0b0a" rightColor="0r0g0b0a" bottomColor="0r0g0b0a" leftStyle="none" topStyle="none" rightStyle="none" bottomStyle="none" leftWidth="1" topWidth="1" rightWidth="1" bottomWidth="1" />\n\
<TextStyle color="'+color+'" hAlign="'+node.textAlign+'" vAlign="left" decoration="none" line-height="'+Math.min(node.localBounds.height,node.lineSpacing).toFixed(0)+'" />\n\
<FontStyle size="'+(node.fontSize*72/96).toFixed(0)+'" height="0">\n\
<family>'+node.fontFamily+'</family>\n\
<style name="'+node.fontStyle+'" weight="400" italic="normal" />\n\
</FontStyle>\n\
<TransparencyStyle value="'+myOpacity+'" />\n\
<PaddingStyle top="0" left="0" bottom="0" right="0" />\n\
<RotationStyle angle="'+Math.round(node.rotation+rotation)+'" />';
        if(node.shadow)
            result+='\n<ShadowStyle>\n\
<Box enable="false" />\n\
<Text enable="false" />\n\
</ShadowStyle>';
        
         result+='\n<MarginStyle top="0" left="0" bottom="0" right="0" />\n\
</style>\n\
<rich-text-range-list>';
      var start = 0;
      var end = 0;
      for(var r=0;r<node.styleRanges.length;r++)
      try{
          var currRange = node.styleRanges[r];
          end+=currRange.length;
          if(r==node.styleRanges.length-1)
              end = node.text.length;
          result+='\n<text-range text-range-start="'+start+'" text-range-end="'+end+'">\n\
<style name="LnFTextRange">\n\
<FontStyle size="'+(currRange.fontSize*72/96).toFixed(0)+'" height="'+(currRange.fontSize*72/96).toFixed(0)+'">\n\
<family>'+currRange.fontFamily+'</family>\n\
<style name="'+currRange.fontStyle+'" weight="400" italic="normal" />\n\
</FontStyle>\n\
<TextStyle color="'+getColor(currRange.fill)+'" hAlign="'+node.textAlign+'" vAlign="center" decoration="none" line-height="'+Math.min(node.localBounds.height,node.lineSpacing).toFixed(0)+'" />\n\
</style>\n\
</text-range>';
        start = end;
      }catch(e){console.log(e)}

      
      result+='\n</rich-text-range-list>\n\
<userID>'+removeInvalidCharacters(node.name)+'</userID>\n\
</rich-text>';
        
        break;
    case "Group":
    case "RepeatGrid":
    case "SymbolInstance":
    if(node.rotation!=0 || node.mask){
    renditions[nodeId] = node;

       
        result = '<image id="'+nodeId+'" hidden="'+hidden+'" lockType="'+lockType+'" onTop="false" visible="'+visible+'">\n\
<image-name type="svg" preserveRatio="false">'+nodeId+'.png</image-name>\n\
<original-name>tmpSVG.png</original-name>\n\
<style name="LnFImage">\n\
<DimensionStyle widthType="px" heightType="px" width="'+Math.round(node.globalDrawBounds.width)+'" height="'+Math.round(node.globalDrawBounds.height)+'" widthPercentage="0.0" heightPercentage="0.0" />\n\
<PositioningStyle left="'+nodeX+'" top="'+nodeY+'" pinLeft="none" pinTop="none" />\n\
<BorderStyle radius="0" leftColor="0r0g0b0a" topColor="0r0g0b0a" rightColor="0r0g0b0a" bottomColor="0r0g0b0a" leftStyle="none" topStyle="none" rightStyle="none" bottomStyle="none" leftWidth="1" topWidth="1" rightWidth="1" bottomWidth="1" />\n\
<TransparencyStyle value="'+myOpacity+'" />\n\
<RotationStyle angle="'+Math.round(node.rotation+rotation)+'" />';

            result+='\n<ShadowStyle>\n\
<Box enable="false" />\n\
</ShadowStyle>';
        
         result+='<SVGBackgroundStyle isSVG="true" bgColor="0r0g0b0a" hasColor="false" />\n\
<MarginStyle top="0" left="0" bottom="0" right="0" />\n\
</style>\n\
<userID>'+removeInvalidCharacters(node.name)+'</userID>\n\
</image>';
    }else{
    result = '<group-container id="'+nodeId+'" auto-fit="false" hidden="'+hidden+'" lockType="'+lockType+'" onTop="false" visible="'+visible+'">\n\
<text></text>\n\
<style name="LnFGroup">\n\
<DimensionStyle widthType="px" heightType="px" width="'+Math.round(node.localBounds.width)+'" height="'+Math.round(node.localBounds.height)+'" widthPercentage="0.0" heightPercentage="0.0" />\n\
<PositioningStyle left="'+nodeX+'" top="'+nodeY+'" pinLeft="none" pinTop="none" />\n\
<TransparencyStyle value="'+myOpacity+'" />\n\
<PaddingStyle top="0" left="0" bottom="0" right="0" />\n\
<RotationStyle angle="0" />';
         result+='\n<MarginStyle top="0" left="0" bottom="0" right="0" />';
    result+='\n</style>';
          
		let elements = node.children;
        var currChildren = [];

        node.children.forEach(function (childNode, i) {
         
            currChildren.push(nodeToXml(childNode,renditions,node.globalBounds,Math.round(node.rotation)));
        });
		
        
        result+="\n"+currChildren.join("\n");
        
     result+='\n<userID>'+removeInvalidCharacters(node.name)+'</userID>\n\
    </group-container>';
    }
    
        
        break;

    
   
        
    }
    
    return result;
    
}

function getOrientation(width,height)
{
    var result = "PORTRAIT";
    if(width>height) result = "LANDSCAPE";
    return result;
}



async function writeNodeRenditions(info,folder) {

    let renditionOptions = [];
    
    for(var nodeId in info)
    {
        let node = info[nodeId];

     var pngFile = await folder.createFile(nodeId+".png", { overwrite: true });
     var svgFile = await folder.createFile(nodeId+".svg", { overwrite: true });
     
     renditionOptions.push(
       {
         node: node,
         outputFile: pngFile,
         type: application.RenditionType.PNG,
         scale: 1
       });
       renditionOptions.push({
         node: node,
         outputFile: svgFile,
         type: application.RenditionType.SVG,
           embedImages:true,
           minify:false
       });
    
     }
     
    await application.createRenditions(renditionOptions);
     
}

function filterName(name) {
  return name.replace(/[\W]+/g, '-')
}

async function zipTextToFile(text, zip, path) {
        zip.file(path, text);
}

async function zipFile(entry, zip, path) {

        if(entry.name.indexOf(".")==0) return;
        const data = await entry.read({format: storage.formats.binary});
        if(path)
       zip.file(path+"/"+entry.name, data, {binary:true});
            else
      zip.file(entry.name, data, {binary:true});
  
}

async function zipFolder(folder, zip, path) {
    
    if(folder.name.indexOf(".")==0) return;
    let entries = await folder.getEntries();
    
  for (var entry of entries) {
 
    if (entry.isFile) {
      await  zipFile(entry, zip, path);
    } else {
        let localPath=path;
        if(!path)
            localPath = "";
        
        localPath+="/"+entry.name;
      await zipFolder(entry, zip, localPath);
    }
  }  
}

async function copyFolder(folder, dist) {
  let entries = await folder.getEntries()
  for (const entry of entries) {
    if (entry.isFile) {
      await entry.copyTo(dist, { overwride: true }).catch(err => console.warn('[warn]', err, entry))
    } else {
      let d = await dist.createFolder(entry.name)
      await copyFolder(/** @type {Folder} */ (entry), d)
    }
  }
}


async function deleteFolder(folder) {
  let entries = await folder.getEntries()
  for (const entry of entries) {
    if (entry.isFile) {
      await entry.delete()
    } else {
      await deleteFolder(/** @type {Folder} */(entry))
    }
  }
  await folder.delete()
}

async function writeScreen(info,id,folder) {
     const xmlFile = await folder.createFile(id+".xml", { overwrite: true });
     await xmlFile.write(info.join("\n"));
     
     return true;
}

function createNewUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function calculateValidName(originalName){
  var name = originalName.replace(/ /g,"_");
  name = name.replace(/([^a-zA-Z0-9_-])/g,"");
  name = name.replace(/(^[^a-zA-Z]*)/,"");
  if (name === "") 
  	name="Layer";
  return getValidUniqueName(name);
}

function getValidUniqueName(originalName,calculatedName,calculatedIndex){
  if(!calculatedName){
    calculatedName = originalName;
  }

  if(mapID[calculatedName]){
    if(calculatedIndex){
      calculatedIndex++;
    }else{
      calculatedIndex = 1;
    }
    return getValidUniqueName(originalName,originalName+"_"+calculatedIndex,calculatedIndex);
  }
  mapID[calculatedName] = originalName;
  return calculatedName;
}

function removeInvalidCharacters(string)
{
/*
    // remove everything forbidden by XML 1.0 specifications, plus the unicode replacement character U+FFFD
    var regex = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
    string = string.replace(regex, "_");
 	// remove everything not suggested by XML 1.0 specifications
    regex = new RegExp(
            "([\\x7F-\\x84]|[\\x86-\\x9F]|[\\uFDD0-\\uFDEF]|(?:\\uD83F[\\uDFFE\\uDFFF])|(?:\\uD87F[\\uDF"+
            "FE\\uDFFF])|(?:\\uD8BF[\\uDFFE\\uDFFF])|(?:\\uD8FF[\\uDFFE\\uDFFF])|(?:\\uD93F[\\uDFFE\\uD"+
            "FFF])|(?:\\uD97F[\\uDFFE\\uDFFF])|(?:\\uD9BF[\\uDFFE\\uDFFF])|(?:\\uD9FF[\\uDFFE\\uDFFF])"+
            "|(?:\\uDA3F[\\uDFFE\\uDFFF])|(?:\\uDA7F[\\uDFFE\\uDFFF])|(?:\\uDABF[\\uDFFE\\uDFFF])|(?:\\"+
            "uDAFF[\\uDFFE\\uDFFF])|(?:\\uDB3F[\\uDFFE\\uDFFF])|(?:\\uDB7F[\\uDFFE\\uDFFF])|(?:\\uDBBF"+
            "[\\uDFFE\\uDFFF])|(?:\\uDBFF[\\uDFFE\\uDFFF])(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\"+
            "uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|"+
            "(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))", "g");
        string = string.replace(regex, "_");
        */ 
    return string.replace(/&/g, '_').replace(/</g, '_').replace(/>/g, '_').replace(/"/g, '_').replace(/'/g, '_').replace(/:/g, '_').replace(/ /g, '_').replace(/\n/g, '_').replace(/,/g, '_').replace(/\./g, '_').replace(/;/g, '_');

}


function currDate()
{
var today = new Date();
return today.toLocaleString();
}

module.exports = {
  commands: {
    exportJIM: main
  }
};
