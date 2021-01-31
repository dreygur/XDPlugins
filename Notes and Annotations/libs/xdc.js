module.exports=function(t){var e={};function r(o){if(e[o])return e[o].exports;var s=e[o]={i:o,l:!1,exports:{}};return t[o].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=t,r.c=e,r.d=function(t,e,o){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(o,s,function(e){return t[e]}.bind(null,s));return o},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=3)}([function(t,e){t.exports=require("scenegraph")},function(t,e){t.exports=require("uxp")},function(t,e){t.exports=require("application")},function(t,e,r){t.exports=r(9)},function(t,e){t.exports=require("commands")},function(t,e){t.exports=require("viewport")},function(t,e){t.exports=require("assets")},function(t,e,r){(function(e){t.exports={install:function(t,r,o){o.add("get",function(r,o,s){try{t.color;var n=t.quoted,a=t.functions.functionRegistry.get("color");t.functions.functionRegistry.get("escape");let l=new RegExp("\\[CONTROLLER:(.*)\\]","g").exec(r.value);if(l){let t=e.globalRoot,r=l[1];for(let e=0,l=t.children.length;e<l;e++){let l=t.children.at(e);if(l.name==`[CONTROLLER:${r}]`)for(let t=0,e=l.children.length;t<e;t++){let e=l.children.at(t);if(-1!=e.name.indexOf(o.value))switch(console.log("node",e.name),s.value){case"fill":return a(n('"',e.fill.toHex()));case"stroke-width":return console.log("node.strokeWidth",e.strokeWidth),e.strokeWidth;case"stroke-color":return a(n('"',e.stroke.toHex()));case"corner-radius":return e.cornerRadii.topLeft;case"font-family":return e.fontFamily}}}}}catch(t){console.log("ERROR IN CUSTOM FUNC: ",t)}})}}}).call(this,r(8))},function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){"use strict";r.r(e);const o=r(0),{selection:s,root:n}=r(0),a=r(4),l=r(2),i=r(1).storage,c=r(5),p=r(1).storage.localFileSystem;const h=r(6),d=r(7);class u{constructor(t,e){this.entry=t,this.type=t.type,this.node=t.node,this.expressions=t.expressions,this.classes=t.classes||[],this.index=e,this.id,this.tag,this.xdid=t.node.guid,this.closingTag,this.inner="",this.styles={},this.attributes={},this.children=[],this.renditions,this.process(t)}process(t){let e=/#([a-zA-Z]?[a-zA-Z0-9-_]*)/.exec(this.node.name);this.id=e?e[1]:"e"+this.index;const r=[f,g,y,m,b,x,w,k];for(var o=0;o<r.length;o++){let t=r[o];if(t.check(this,this.node)){t.apply(this,this.node);break}}}}class f{static check(t,e){return"Artboard"==t.type}static apply(t,e){t.tag="div",t.classes.push("artboard"),t.tagOpen=`<div ${E.getDefaultAttributes(t)}>`,t.tagClose="</div>",t.styles.position="relative",E.applySize(t,e),t.styles["background-color"]=E.getFill(e).value}}class g{static check(t,e){return"Group"==t.type&&e.mask}static apply(t,e){b.apply(t,e),t.styles.width=`${e.boundsInParent.width}px`,t.styles.height=`${e.boundsInParent.height}px`}}class y{static check(t,e){return"Group"==t.type}static apply(t,e){t.tag="div",t.tagOpen=`<div ${E.getDefaultAttributes(t)}>`,t.tagClose="</div>",E.applyTransformation(t,e),E.applyOpacity(t,e)}}class m{static check(t,e){return"Text"==t.type}static apply(t,e){{let r="";e.text.split(/\n/g).forEach((t,o)=>{let s=e.lineSpacing?e.lineSpacing:1.2*e.fontSize;r+=`<tspan x="0" dy="${o?s:0}px">${t}</tspan>`}),t.tag="svg",t.tagOpen=`<svg ${E.getDefaultAttributes(t)} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`,t.tagClose="</svg>",t.inner=`<text x="0" y="0" style="font-family: ${e.fontFamily}; font-size: ${e.fontSize}px; fill: ${E.getFill(e).value}">\n      ${r}</text>`,t.styles.overflow="visible",E.applyTransformation(t,e),E.applyOpacity(t,e)}}}class b{static check(t,e){const r=E.getFill(e);if(r&&-1!=["ImageFill"].indexOf(r.type))return!0}static apply(t,e){t.tag="img",t.tagOpen=`<img ${E.getDefaultAttributes(t)} src="${t.id}.png">`,t.tagClose="",t.renditions=[],t.renditions.push({id:t.id,element:t,node:e}),t.attributes.src=`${t.id}.png`,E.applySize(t,e),E.applyTransformation(t,e),E.applyOpacity(t,e)}}class x{static check(t,e){if(-1==["Rectangle"].indexOf(t.type))return!1;const r=E.getFill(e).type;return-1!=[void 0,"Color","LinearGradientFill","RadialGradientFill"].indexOf(r)}static apply(t,e){t.tag="div",t.tagOpen=`<div ${E.getDefaultAttributes(t)}>`,t.tagClose="</div>",E.applySize(t,e),E.applyTransformation(t,e),E.applyOpacity(t,e),"Color"==E.getFill(e).type&&(t.styles["background-color"]=E.getFill(e).value),t.styles.border=`${e.strokeWidth}px solid ${E.getStroke(e).value}`,e.hasRoundedCorners&&(t.styles["border-radius"]=`${e.cornerRadii.topLeft}px ${e.cornerRadii.topRight}px ${e.cornerRadii.bottomRight}px ${e.cornerRadii.bottomLeft}px`)}}class w{static check(t,e){return-1!=["Ellipse"].indexOf(t.type)}static apply(t,e){t.tag="svg",t.tagOpen=`<svg ${E.getDefaultAttributes(t)} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${e.localBounds.width}" height="${e.localBounds.height}">`,t.tagClose="</svg>";let r=e.fillEnabled?`fill="${E.getFill(e).value}"`:'fill="none"',o=e.strokeEnabled?`stroke="${E.getStroke(e).value}"`:"";t.inner=`<ellipse id="${t.id}-ellipse"\n                              cx="${e.radiusX}" cy="${e.radiusY}" rx="${e.radiusX}" ry="${e.radiusY}"\n                              ${r}\n                              ${o}\n                              stroke-width="${e.strokeWidth}"\n                              />`,t.styles.overflow="visible",E.applyTransformation(t,e),E.applyOpacity(t,e)}}class k{static check(t,e){return-1!=["Path"].indexOf(t.type)}static apply(t,e){t.tag="svg",t.tagOpen=`<svg ${E.getDefaultAttributes(t)} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`,t.tagClose="</svg>";let r=e.fillEnabled&&E.getFill(e).value?`fill="${E.getFill(e).value}"`:'fill="transparent"',o=e.strokeEnabled?`stroke="${E.getStroke(e).value}"`:"";t.inner=`<path id="${t.id}-path" d="${e.pathData}"\n                           ${r}\n                           ${o}\n                           stroke-width="${e.strokeWidth}"\n                            />`,t.styles.overflow="visible",E.applyTransformation(t,e),E.applyOpacity(t,e)}}class E{static num(t,e=2){const r=Math.pow(10,e);return Math.round(t*r)/r}static getDefaultAttributes(t){let e=t.classes?`class="${t.classes.map(t=>t.replace(".","")).join(" ")}"`:"";return`id="${t.id}" ${e} xd-type="${t.type}"`}static applySize(t,e){e.width&&(t.styles.width=E.num(e.width)+"px"),e.height&&(t.styles.height=E.num(e.height)+"px")}static applyTransformation(t,e){if(0==e.rotation)t.styles.top=E.num(e.translation.y)+"px",t.styles.left=E.num(e.translation.x)+"px";else{const r=e.transform;t.styles["transform-origin"]="0 0",t.styles.transform=`matrix(${r.a}, ${r.b}, ${r.c}, ${r.d}, ${r.e}, ${r.f})`}}static getFill(t){if(!t.fillEnabled||!t.fill)return!1;let e,r=t.fill.constructor.name;return"Color"==r&&(e=t.fill.a<255?`rgba(${t.fill.r}, ${t.fill.g}, ${t.fill.b}, ${Math.round(t.fill.a/255*100)/100})`:t.fill.toHex()),{type:r,value:e}}static getStroke(t){if(!t.strokeEnabled||!t.stroke)return!1;return{type:t.stroke.constructor.name,value:t.stroke.a<255?`rgba(${t.stroke.r}, ${t.stroke.g}, ${t.stroke.b}, ${Math.round(t.stroke.a/255*100)/100})`:t.stroke.toHex()}}static applyOpacity(t,e){e.opacity<1&&(t.styles.opacity=e.opacity)}}const v=r(2),R=r(1).storage.localFileSystem;var $={WebGraphCreator:class{constructor(){this.nodes=[],this.elementIndex=1}add(t){this.nodes.push(t)}async create(){try{let t={children:[]};for(let e=0;e<this.nodes.length;e++){let r=this.nodes[e];const o=await XDC.abstractScenegraph.get(r);this._generateEntry(o.root,t)}return t}catch(t){console.log("[ WebExport:WebGraphCreator ]",t)}}_generateEntry(t,e){let r=new u(t,this.elementIndex++);e.children.push(r),t.isMask||t.children.forEach(t=>{this._generateEntry(t,r)})}},WebRenderer:class{constructor(){}async render(t){try{let e={html:"",css:""};return t.children.forEach(t=>{this._process(t,e)}),e}catch(t){console.log("[ WebExport:WebRenderer ]",t)}}_process(t,e){e.html+=`\n${t.tagOpen}`,e.html+=t.inner,e.css+=`#${t.id} {\n`;for(let r in t.styles)t.styles.hasOwnProperty(r)&&(e.css+=`  ${r}: ${t.styles[r]};\n`);e.css+="}\n",t.children.forEach(t=>{this._process(t,e)}),e.html+=`\n${t.tagClose}`}},RenditionExporter:class{constructor(){this.renditionList=[]}async export(t){try{for(var e=0;e<t.children.length;e++){let r=t.children[e];await this._process(r)}this.renditionList.length&&(await this.tweak(),await v.createRenditions(this.renditionList),await this.untweak())}catch(t){console.log("[ RenditionExporter ]",t)}}async _process(t,e){try{if(t.renditions)for(var r=0;r<t.renditions.length;r++){let e=t.renditions[r],o=await this._createRenditionDefinition(e);this.renditionList.push(o)}for(let r=0;r<t.children.length;r++){let o=t.children[r];await this._process(o,e)}}catch(t){console.log("[ RenditionExporter ]",t)}}async _createRenditionDefinition(t){try{const e=await R.getDataFolder(),r=await e.createFile(t.id+".png",{overwrite:!0});return{node:t.node,outputFile:r,type:v.RenditionType.PNG,minify:!0,embedImages:!0,scale:2,quality:70}}catch(t){console.log("[ RenditionExporter ]",t)}}async tweak(){try{this.renditionList.forEach(async t=>{let e=0,r=function(t){e+=t.rotation,t.parent&&"RootNode"!=t.parent.constructor.name&&r(t.parent)};r(t.node),t.__finalRotation=e,t.node.rotation&&t.node.rotateAround(-e,t.node.localCenterPoint)})}catch(t){console.log("[ RenditionExporter ]",t)}}async untweak(){try{this.renditionList.forEach(async t=>{if(null!=t.__finalRotation&&0!=t.__finalRotation)try{t.node.rotateAround(t.__finalRotation,t.node.localCenterPoint)}catch(t){console.log("[ RenditionExporter ]",t)}})}catch(t){console.log("[ RenditionExporter ]",t)}}}};r(0);const{selection:C,root:S}=r(0);class A{constructor(){this.expressions=[]}add(t){this.expressions.push(t)}get(t){return t?this.expressions.filter(e=>e.command==t)[0]:this.expressions}}class O{constructor(){this.arguments=[]}get(t){for(let e=0,r=this.arguments.length;e<r;e++){let r=this.arguments[e];if(r.key==t)return r.value}}}const P="[ AbstractScenegraph ]";class _{static async processNode(t,e){try{e.type=t.constructor.name,e.name=t.name,e.node=t,e.expressions=XDC.expressions.getExpressionsByNode(t),e.classes=_.getClasses(t.name);for(let r=0;r<t.children.length;r++){const o=t.children.at(r),s=new D;s.isMask=!!o.mask,e.children.push(s),await this.processNode(o,s)}}catch(t){console.log(P,t)}}static getClasses(t){return t.match(/(^|\W)\.[\w-]+/g)}}class D{constructor(){this.node,this.expressions,this.isMask=!1,this.children=[]}}const L=r(0);e.default={scenegraph:L,root:L.root,selection:L.selection,XdTpl:class{constructor(){this.version="1.6"}place(t,e){return new Promise((r,o)=>{try{p.getPluginFolder().then(o=>{o.getEntry(t).then(t=>{t.read().then(t=>{e.offsetX=e.offsetX?e.offsetX:0,e.offsetY=e.offsetY?e.offsetY:0;const o=JSON.parse(t);let l,i=s.editContext;l=i==n?XDC.core.getBounds():XDC.core.getBounds([s.items[0]]);const p=this.import(i,o)[0];if(p.name=e.rename?e.rename:p.name,e.position){let t;switch(e.position){case"aboveleft":t={x:l.left,y:l.top-p.localBounds.height-e.offsetY};break;case"lefttop":t={x:l.left-p.localBounds.width-e.offsetX,y:l.top};break;case"relative":t={x:l.left-e.offsetX,y:l.top-e.offsetY}}p.placeInParentCoordinates({x:p.localBounds.x,y:p.localBounds.y},t)}!0===e.ungroup?a.ungroup():s.items=p,c.scrollIntoView(s.items[0]),r({node:p})})})})}catch(t){console.log("Error during XDTPL place()",t)}})}async export(t){const e={type:"XDTPL",version:this.version,sets:[]};for(let r=0;r<t.length;r++){let o=t[r];const s={name:`set_${r}`,type:"Set",children:[]};s.children.push(await this._exportNode(o)),e.sets.push(s)}return JSON.stringify(e,null,0)}async _exportNode(t){const e={type:t.constructor.name};if([{property:"name"},{property:"width"},{property:"height"},{property:"text"},{property:"areaBox"},{property:"textAlign"},{property:"lineSpacing"},{property:"radiusX"},{property:"radiusY"},{property:"translation"}].forEach(r=>{null!=t[r.property]&&(e[r.property]=t[r.property])}),t.topLeftInParent&&(e.x=t.topLeftInParent.x-t.localBounds.x),t.topLeftInParent&&(e.y=t.topLeftInParent.y-t.localBounds.y),t.styleRanges&&t.styleRanges.length&&(e.styleRanges=[],t.styleRanges.forEach(t=>{e.styleRanges.push({length:t.length,fontFamily:t.fontFamily,fontStyle:t.fontStyle,fontSize:t.fontSize,fill:t.fill.toHex()})})),t.cornerRadii&&(e.cornerRadii={topLeft:t.cornerRadii.topLeft,topRight:t.cornerRadii.topRight,bottomRight:t.cornerRadii.bottomRight,bottomLeft:t.cornerRadii.bottomLeft}),0!=t.rotation&&(e.rotation=t.rotation,e.rotationPoint=t.localCenterPoint),t.opacity<1&&(e.opacity=t.opacity),t.mask&&(e.mask=!0),t.fillEnabled&&(e.fillEnabled=t.fillEnabled,t.fill))switch(e.fill={type:t.fill.constructor.name},t.fill.constructor.name){case"Color":e.fill.hex=t.fill.toHex(),e.fill.alpha=Math.round(t.fill.a/255*100)/100;break;case"LinearGradientFill":e.fill.startX=t.fill.startX,e.fill.startY=t.fill.startY,e.fill.endX=t.fill.endX,e.fill.endY=t.fill.endY,e.fill.colorStops=[],t.fill.colorStops.forEach(t=>{e.fill.colorStops.push({color:t.color.toHex(),alpha:t.color.a/255,stop:t.stop})});break;case"ImageFill":try{let r=t.fill.naturalWidth/t.width;r=r>6?6:r;const o=await p.getTemporaryFolder(),s=await o.createEntry("xdtpl_export_image.tmp",{overwrite:!0});await new Promise((o,n)=>{let a=[{node:t,outputFile:s,type:"image/jpeg"==t.fill.mimeType?l.RenditionType.JPG:l.RenditionType.PNG,scale:r,quality:70}];l.createRenditions(a).then(async t=>{const r=await s.read({format:i.formats.binary});e.fill.base64=XDC.misc.arrayBufferToBase64(r),o()}).catch(t=>{console.log("[ XDTPL Error ] Error during creation of temp image to extract base64",t),n()})})}catch(t){console.log("[ XDTPL ] Error in _exportNode(): ",t)}}if(t.strokeEnabled&&(e.strokeEnabled=t.strokeEnabled,t.stroke&&(e.stroke=t.stroke.toHex(),e.strokeWidth=t.strokeWidth,e.strokePosition=t.strokePosition,e.strokeEndCaps=t.strokeEndCaps,e.strokeJoins=t.strokeJoins,e.strokeMiterLimit=t.strokeMiterLimit,e.strokeDashOffset=t.strokeDashOffset,t.strokeDashArray.length&&(e.strokeDashArray=[],t.strokeDashArray.forEach(t=>e.strokeDashArray.push(t))))),t.blur&&(e.blur={blurAmount:t.blur.blurAmount,brightnessAmount:t.blur.brightnessAmount,fillOpacity:t.blur.fillOpacity,isBackgroundEffect:t.blur.isBackgroundEffect,visible:t.blur.visible}),t.shadow){let r={hex:t.shadow.color.toHex(),alpha:Math.round(t.shadow.color.a/255*100)/100};e.shadow={x:t.shadow.x,y:t.shadow.y,blur:t.shadow.blur,color:r,visible:t.shadow.visible}}if("Line"==t.constructor.name&&(e.startX=t.start.x,e.startY=t.start.y,e.endX=t.end.x,e.endY=t.end.y),"Path"==t.constructor.name&&(e.pathData=t.pathData),t.children&&t.children.length){e.children=[];for(var r=0;r<t.children.length;r++){const o=t.children.at(r);e.children.push(await this._exportNode(o))}}return e}import(t,e){try{const r=[];return e.sets.forEach((e,o)=>{e.children.forEach((e,o)=>{r.push(this._createNode(e,t,[]))})}),r}catch(t){console.log("XdTpl import Error:",t)}}_createNode(t,e,r){try{let n;if(["Group","SymbolInstance","BooleanGroup","RepeatGrid"].indexOf(t.type)>=0&&(r=[]),"Group"!=t.type&&"RepeatGrid"!=t.type&&"SymbolInstance"!=t.type&&"BooleanGroup"!=t.type&&((n=new o[t.type]).name=t.name,this._addTypeSpecificProperties(n,t),n.placeInParentCoordinates({x:0,y:0},{x:t.x,y:t.y}),"Artboard"==t.type?(XDC.core.addArtboard(n),e=n):e.addChild(n),n&&r.push(n)),t.children&&t.children.length&&t.children.forEach(t=>{let o=this._createNode(t,e,r);o&&["Group","SymbolInstance","BooleanGroup","RepeatGrid"].indexOf(o.constructor.name)>=0&&r.push(o)}),["Group","SymbolInstance","BooleanGroup","RepeatGrid"].indexOf(t.type)>=0&&r.length){s.items=r,t.mask,a[t.mask?"createMaskGroup":"group"]();let e=s.items[0];e.name=t.name,e.placeInParentCoordinates({x:0,y:0},{x:t.x,y:t.y}),t.opacity&&(e.opacity=parseFloat(t.opacity)),t.rotation&&(e.rotateAround(t.rotation,t.rotationPoint),e.placeInParentCoordinates({x:0,y:0},{x:t.translation.x,y:t.translation.y})),n=e}return n}catch(t){console.error("Error in XDTPL._createNode():",t.message)}}_addTypeSpecificProperties(t,e){switch(e.type){case"Artboard":case"Rectangle":t.width=e.width,t.height=e.height}switch(e.rotation&&t.rotateAround(e.rotation,t.localCenterPoint),e.type){case"Artboard":this._addFillAndStroke(t,e);break;case"Line":case"Rectangle":case"Ellipse":case"Path":t.opacity=e.opacity||1,this._addFillAndStroke(t,e)}switch(this._addBlur(t,e),this._addShadow(t,e),e.type){case"Line":t.setStartEnd(e.startX,e.startY,e.endX,e.endY);break;case"Rectangle":e.cornerRadii&&(t.cornerRadii=e.cornerRadii);break;case"Ellipse":t.radiusX=e.radiusX,t.radiusY=e.radiusY;break;case"Path":t.pathData=e.pathData;break;case"Text":t.text=e.text,t.areaBox=e.areaBox;let r=JSON.parse(JSON.stringify(e.styleRanges));r.forEach(t=>{t.fill=new o.Color(t.fill)}),t.styleRanges=r,t.textAlign=e.textAlign,t.lineSpacing=e.lineSpacing}}_addFillAndStroke(t,e){switch("Artboard"!=e.type&&"Line"!=e.type&&(t.fillEnabled=e.fillEnabled||!1),e.fill?e.fill.type:null){case"Color":t.fill=new o.Color(e.fill.hex,e.fill.alpha);break;case"LinearGradientFill":const r=new o.LinearGradient;r.setEndPoints(e.fill.startX,e.fill.startY,e.fill.endX,e.fill.endY);const s=[];e.fill.colorStops.forEach(t=>{s.push({color:new o.Color(t.color,t.color.alpha),stop:t.stop})}),r.colorStops=s,t.fill=r;break;case"ImageFill":const n=new o.ImageFill(`data:image/jpeg;base64,${e.fill.base64}`);t.fill=n}"Artboard"!=e.type&&(t.strokeEnabled=e.strokeEnabled||!1),e.strokeEnabled&&(t.stroke=new o.Color(e.stroke),t.strokeWidth=e.strokeWidth,t.strokePosition=e.strokePosition,e.strokeEndCaps&&(t.strokeEndCaps=e.strokeEndCaps),e.strokeJoins&&(t.strokeJoins=e.strokeJoins),e.strokeMiterLimit&&(t.strokeMiterLimit=e.strokeMiterLimit),e.strokeDashOffset&&(t.strokeDashOffset=e.strokeDashOffset),e.strokeDashArray&&(t.strokeDashArray=e.strokeDashArray))}_addBlur(t,e){e.blur&&(t.blur=new o.Blur(e.blur.blurAmount,e.blur.brightnessAmount,e.blur.fillOpacity,e.blur.visible,e.blur.backgroundEffect))}_addShadow(t,e){if(!e.shadow)return;let r=new o.Color(e.shadow.color.hex,e.shadow.color.alpha);t.shadow=new o.Shadow(e.shadow.x,e.shadow.y,e.shadow.blur,r,e.shadow.visible)}},XdCss:class{constructor(t){this.debug=!1,this.styleGraph,this.classGraph,this.affectedElements}async parse(t){return new Promise((e,r)=>{let o={};h.colors.get().forEach(t=>{o[t.name]=t.color.toHex()}),less.render(t,{plugins:[d],globalVars:o}).then(t=>{let o=t.css.replace(/\/\*([\s\S]*?)\*\//g,"");try{let t=[];o.split("}").forEach(e=>{let r=e.split("{");if(0===r[0].trim().length||0===r[1].trim().length)return;let o={selectors:[],properties:{}};t.push(o);let s=r[0].split(",");for(var n=0;n<s.length;n++){let t=[];s[n].trim().split(" ").forEach(e=>{let r=e.split(".").map(t=>t="."+t);r.shift(),t.push(r)}),o.selectors.push(t)}let a=r[1].split(";");for(n=0;n<a.length-1;n++){let t=a[n].split(":"),e=t[0].replace(/\n/g,"").trim();o.properties[e]=t[1].replace(/\n/g,"").trim()}}),e(t),this.styleGraph=t}catch(t){console.log("Error while parsing CSS",t),r(t)}},function(t){console.log("Error while parsing CSS",t),r(t)})})}generateClassGraph(t){try{function e(t){return t.name.match(/(\.[a-zA-Z0-9-_]+)/g)}let r=function(t,o,s){let n=e(t);if(n){s.push(n);let e=[];s.forEach(t=>e.push(t)),e.pop();let r={type:t.constructor.name,classes:n,path:e,node:t};o.children=o.children?o.children:[],o.children.push(r),o=r}return t.children&&t.children.length&&t.children.forEach(t=>{-1==["SymbolInstance","RepeatGrid","BooleanGroup"].indexOf(t.constructor.name)&&r(t,o,s)}),n&&s.pop(),o},o=[];return t.parent&&function t(r){let s=e(r.parent);s&&o.unshift(s),r.parent&&"RootNode"!=r.parent.constructor.name&&t(r.parent)}(t),this.classGraph=r(t,{children:[]},o),this.classGraph}catch(t){console.log("Error in XdCss.queryNodesWithClasses():",t)}}logClassGraphOutline(t){!function t(e,r){e.children.forEach(e=>{let o="";for(var s=0;s<r;s++)o+="   ";console.log(o,e.node.name,`(${e.type})`,e.path),e.children&&(t(e,++r),r--)})}(this.generateClassGraph(t),0)}async render(t,e){const r=(new Date).getTime();let o=await this.parse(e);console.log("parse:             ",(new Date).getTime()-r,"ms");const s=(new Date).getTime();let n=this.generateClassGraph(t);console.log("classGraph:        ",(new Date).getTime()-s,"ms");let a=0,l=(t,e)=>{t.children.forEach(t=>{let r="";for(var s=0;s<e;s++)r+="   ";this.debug&&console.log(r,t.node.name,`(${t.type})`,t.classes,"path:",t.path),a++,this._renderClassGraphNode(t,o),t.children&&(l(t,++e),e--)})};l(n,0),this.affectedElements=a}_renderClassGraphNode(t,e){const r="                                 ";if(e.forEach(e=>{for(let n=0,a=e.selectors.length;n<a;n++){let a=e.selectors[n];this.debug&&console.log("                              (?) selector:",a);let l=this;function o(t,e){let o=t[t.length-1],s=!0,n=!1;for(let t=0,r=o.length;t<r;t++){let r=o[t];if(-1==e.classes.indexOf(r))return s=!1,!1}if(l.debug&&console.log(r,"classMatches:",s),s){if(0===e.path.length&&t.length>1)return!1;if(0===e.path.length&&1===t.length)return!0;if(1===t.length)return!0}let a=Array.from(e.path),i=(e,o)=>{let s=t[e];l.debug&&console.log(r,"next test: currentSelectorSegment:",s);let c=a.findIndex(t=>{l.debug&&console.log(r," *?# SEARCH:",s,"  IN ",t);for(let e=0,r=s.length;e<r;e++)if(-1===t.indexOf(s[e]))return!1;return!0});l.debug&&console.log(r," + pathIndex",c),l.debug&&console.log(r," + lastPathIndex",o);const p=a.splice(0,c+1).length;c<o||-1!=c&&(++e<t.length-1?i(e,c-p):n=!0)};return i(0,-999),l.debug&&console.log(r,"check: pathMatches:",n),s&&n}let i=o(a,t);if(this.debug&&console.log(r,i?"✅ ":"✖",e.selectors),i)for(var s in t.cache=t.cache?t.cache:{},e.properties)t.cache[s]=e.properties[s]}}),t.cache)for(var o in t.cache){const e=t.node,r=t.cache[o];switch(o){case"background-color":case"fill":const t=h.colors.get().filter(t=>t.name==r);t&&t.length>0&&t[0].color?e.fill=t[0].color:e.fill=new XDC.scenegraph.Color(r);break;case"stroke-color":e.stroke=new XDC.scenegraph.Color(r),e.strokeEnabled=!0;break;case"stroke-width":e.strokeWidth=Number(r),e.strokeEnabled=!0;break;case"corner-radius":-1!=["Rectangle"].indexOf(e.constructor.name)&&e.setAllCornerRadii(Number(r));break;case"font-family":-1!=["Text"].indexOf(e.constructor.name)&&(e.fontFamily=r)}}}},webExport:$,core:class{static getAllArtboards(){return S.children.filter(t=>"Artboard"==t.constructor.name)}static getLastArtboard(){return this.getAllArtboards().pop()}static addArtboard(t){S.addChildAfter(t,this.getLastArtboard())}static getBounds(t,e){t=t||S.children,e="global"!=e&&"local"!=e?"parent":e;let r={left:null,top:null,right:null,bottom:null,width:null,height:null};return t.forEach(t=>{const o="global"==e?t.globalBounds:"parent"==e?t.boundsInParent:t.localBounds;(null==r.left||o.x<r.left)&&(r.left=o.x),(null==r.top||o.y<r.top)&&(r.top=o.y),(null==r.right||o.x+o.width>r.right)&&(r.right=o.x+o.width),(null==r.bottom||o.y+o.height>r.bottom)&&(r.bottom=o.y+o.height)}),r.width=r.right-r.left,r.height=r.bottom-r.top,r}},query:class{static exec(){console.log("query::exec")}static query(t,e){const r=[];let o=(t,e)=>{let s={};for(const r in e){let o;switch(r){case"type":e[r]instanceof Array?e[r].forEach(e=>{o||(o=t.constructor.name==e)}):o=t.constructor.name==e[r];break;case"fill":t.fill&&"Color"==t.fill.constructor.name&&(o=e[r].exec(t.fill.toHex()));break;default:o=e[r].exec(t[r])}s[r]=o}if(Object.getOwnPropertyNames(s)){let e=!0;for(let t in s)s[t]||(e=!1);e&&r.push({node:t,results:s})}t.children.forEach(t=>{o(t,e)})};return"Array"==t.constructor.name||"SceneNodeList"==t.constructor.name?t.forEach(t=>{o(t,e)}):o(t,e),r}},expressions:class{static getExpressionsByNode(t){return class{static parseNodeName(t){let e=new A,r=t.name.match(/@[a-zA-Z]{1}[a-zA-Z\.]*({.*?})?/g);return r&&r.forEach(t=>{let r=new O,[o,s,n]=/@([a-zA-Z]{1}[a-zA-Z\.]*)({.*?})?/.exec(t);if(r.command=s,n){let t=(n=n.trim().replace("{","").replace("}","")).split(",");for(let e=0,o=t.length;e<o;e++){let o=t[e].split(":"),s={key:o[0]?o[0].trim():void 0,value:o[1]?o[1].trim():void 0};r.arguments.push(s)}}e.add(r)}),e}}.parseNodeName(t)}static execute(){}},abstractScenegraph:class{static async get(t){return new Promise(async(e,r)=>{try{console.log("\n\n"),console.log(P);const r={type:"ASC",version:"1.0.0",root:new D};await _.processNode(t,r.root),e(r)}catch(t){console.log(P,t)}})}},misc:class{static arrayBufferToBase64(t){for(var e,r="",o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=new Uint8Array(t),n=s.byteLength,a=n%3,l=n-a,i=0;i<l;i+=3)r+=o[(16515072&(e=s[i]<<16|s[i+1]<<8|s[i+2]))>>18]+o[(258048&e)>>12]+o[(4032&e)>>6]+o[63&e];return 1==a?r+=o[(252&(e=s[l]))>>2]+o[(3&e)<<4]+"==":2==a&&(r+=o[(64512&(e=s[l]<<8|s[l+1]))>>10]+o[(1008&e)>>4]+o[(15&e)<<2]+"="),r}}}}]).default;