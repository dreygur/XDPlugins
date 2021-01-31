
const { editDocument } = require("application");
const application = require("application");

let panel;
const defaultParms = {
  leftEdgeType: "none",
  rightEdgeType: "arrow1",
  lineWidth: 1,
  edgeScale: 100,
  color: "#666666"
}
const labels = {
  default:{
    menu:{
      straight: "Straight",
      curve: "Curve",
      snake: "Snake"
    },
    edit:{
      title: "Edit",
      lineWidth: "Line Width",
      edgeScale: "Edge Scale",
      leftEdge: "Left",
      rightEdge: "Right",
      color: "Color",
      default: "Reset to default",
      edgeType:{
        none: "none",
        arrow1: "arrow1",
        arrow2: "arrow2",
        arrow3: "arrow3",
        circle1: "circle1",
        circle2: "circle2",
        square1: "square1",
        square2: "square2",
        bar: "bar"
      }
    }
  },
  ja:{
    menu:{
      straight: "直線",
      curve: "折れ線",
      snake: "カギ線"
    },
    edit:{
      title: "編集",
      lineWidth: "先の太さ",
      edgeScale: "ポイントの大きさ",
      leftEdge: "左端",
      rightEdge: "右端",
      color: "着色",
      default: "初期値に戻す",
      edgeType:{
        none: "無し",
        arrow1: "矢印１",
        arrow2: "矢印２",
        arrow3: "矢印３",
        circle1: "円形１",
        circle2: "円形２",
        square1: "四角１",
        square2: "四角２",
        bar: "縦線"
      }
    }
  }
}

function create(onActionButton, onChangeProperty) {

  let _labels;
  if(application.appLanguage == 'ja'){
    _labels = labels.ja;
  }else{
    _labels = labels.default;
  }

  const html = `
<style>
 .actionButton {
   width: 100%;
   background: #fff;
   padding: 10px;
   border-radius: 4px;
   display: block;
   border: 1px solid #fff;
   margin-bottom: 4px;
 }
 .actionButton:hover{
   border: 1px solid #999;
 }
 .actionButton span{
   font-size: 108%;
   line-height: 24px;
   display: inline-block;
   color: #333;
   text-decoration: none;
 }
 .actionButton img{
   width: 24px; height: 24px;
   margin-right: 16px;
 }
 .hide {
   display: none;
 }
 .show{
   display: block;
 }
 .row {
   align-items: center;
  }
 .spread {
       justify-content: space-between;
       width: 100%;
 }
 .edge{
   display: inlineBlock;
   width: 50%;

 }
 input[type="range"]{
   width: 100%;
 }
 label{
   margin: 0.2em 0;
   width: 100%;
 }
 .propertyBox{
   background: rgba(0,0,0,0.025);
   padding: 4px;
 }
 h2{
   font-size: 140%;
   margin: 12px 0;
   padding: 0 4px;
 }
 .footer{
   text-align:right;
   margin: 4px 0;
 }

</style>
<div id="toolPanel" class="show">
 <a href="#" data-action="straight" class="actionButton">
   <img src="assets/icon_straight.png" />
   <span>${_labels.menu.straight}</span>
 </a>
 <a href="#" data-action="curve" class="actionButton">
   <img src="assets/icon_curve.png" />
   <span>${_labels.menu.curve}</span>
 </a>
 <a href="#" data-action="snake" class="actionButton">
   <img src="assets/icon_snake.png" />
   <span>${_labels.menu.snake}</span>
 </a>
</div>
<div id="propertyPanel" class="hide">
 <h2>${_labels.edit.title}</h2>
 <div class="propertyBox">
   <div><label>
     <div class="row spread">
         <span>${_labels.edit.lineWidth}</span>
         <span class="lineWidthValue">1</span>
     </div>
     <input type="range" id="lineWidth" min=0.5 max=5 value=1 step=0.5 />
   </label></div>
   <div><label>
     <div class="row spread">
         <span>${_labels.edit.edgeScale}</span>
         <span class="edgeScaleValue">100%<span>
     </div>
     <input type="range" id="edgeScale" min=0 max=200 value=100 step=25 />
   </label></div>
   <div>
     <label class="edge">
       <span>${_labels.edit.leftEdge}</span>
       <select id="leftEdge">
            <option value="none" selected>${_labels.edit.edgeType.none}</option>
            <option value="arrow1">${_labels.edit.edgeType.arrow1}</option>
            <option value="arrow2">${_labels.edit.edgeType.arrow2}</option>
            <option value="arrow3">${_labels.edit.edgeType.arrow3}</option>
            <option value="circle1">${_labels.edit.edgeType.circle1}</option>
            <option value="circle2">${_labels.edit.edgeType.circle2}</option>
            <option value="square1">${_labels.edit.edgeType.square1}</option>
            <option value="square2">${_labels.edit.edgeType.square2}</option>
            <option value="bar">${_labels.edit.edgeType.bar}</option>
       </select>
     </label>
     <label class="edge">
       <span>${_labels.edit.rightEdge}</span>
       <select id="rightEdge">
            <option value="none">${_labels.edit.edgeType.none}</option>
            <option value="arrow1" selected>${_labels.edit.edgeType.arrow1}</option>
            <option value="arrow2">${_labels.edit.edgeType.arrow2}</option>
            <option value="arrow3">${_labels.edit.edgeType.arrow3}</option>
            <option value="circle1">${_labels.edit.edgeType.circle1}</option>
            <option value="circle2">${_labels.edit.edgeType.circle2}</option>
            <option value="square1">${_labels.edit.edgeType.square1}</option>
            <option value="square2">${_labels.edit.edgeType.square2}</option>
            <option value="bar">${_labels.edit.edgeType.bar}</option>
       </select>
     </label>
   </div>
   <label>
    <span>${_labels.edit.color}</span>
    <input type="text" id="color" value="#666666" />
   </label>
   <input type="hidden" id="lineType" value="straight" style="display:none" />
 </div>
 <div class="footer">
  <button id="defaultButton">${_labels.edit.default}</button>
 </div>
</div>
 `;
  panel = document.createElement("div");
  panel.innerHTML = html;
  const buttons = panel.querySelectorAll(".actionButton");
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener("click", _onActionButton);
  }
  const inputs = panel.querySelectorAll("#propertyPanel input, #propertyPanel select");
  for(let i = 0; i < inputs.length; i++){
    inputs[i].addEventListener("change", _onChangeProperty);
  }
  const sliders = panel.querySelectorAll("#edgeScale, #lineWidth");
  for(let i = 0; i < sliders.length; i++){
    sliders[i].addEventListener("input", _onInputSlider);
  }
  const defaultButton = panel.querySelector("#defaultButton");
  defaultButton.addEventListener("click", _onDefaultButton);

  function _onChangeProperty(e=null){
    onChangeProperty(getParms());
  }
  function _onActionButton(e){
    const actionName = e.currentTarget.getAttribute('data-action');
    onActionButton(actionName);
  }
  function _onInputSlider(e){
    const input = e.currentTarget;
    let label;
    if(input.id == "lineWidth"){
      label = input.parentNode.querySelector(".lineWidthValue");
      label.innerHTML = input.value + "";
    }else if(input.id == "edgeScale"){
      label = input.parentNode.querySelector(".edgeScaleValue");
      label.innerHTML = input.value + "%";
    }
  }
  function _onDefaultButton(e){
    updateToolPanel(defaultParms);
    _onChangeProperty();
  }
  return panel;
}


function show(event, onActionButton, onChangeProperty) {
  if (!panel) event.node.appendChild(create(onActionButton, onChangeProperty));
}

function showPropertyPanel(parms){
  updateToolPanel(parms);
  panel.querySelector("#toolPanel").className = "hide";
  panel.querySelector("#propertyPanel").className = "show";
}
function hidePropertyPanel(){
  panel.querySelector("#toolPanel").className = "show";
  panel.querySelector("#propertyPanel").className = "hide";
}

function updateToolPanel(parms){
  panel.querySelector("#propertyPanel #lineWidth").value = parms.lineWidth;
  panel.querySelector("#propertyPanel #leftEdge").value = parms.leftEdgeType;
  panel.querySelector("#propertyPanel #rightEdge").value = parms.rightEdgeType;
  if(parms.lineType) panel.querySelector("#propertyPanel #lineType").value = parms.lineType;
  panel.querySelector("#propertyPanel #color").value = parms.color;
  panel.querySelector("#propertyPanel #edgeScale").value = parms.edgeScale;
  panel.querySelector("#propertyPanel .lineWidthValue").innerHTML = parms.lineWidth + "";
  panel.querySelector("#propertyPanel .edgeScaleValue").innerHTML = parms.edgeScale + "%";

}
function getParms(){
  return {
    lineWidth: document.querySelector("#lineWidth").value - 0,
    leftEdgeType: document.querySelector("#leftEdge").value,
    rightEdgeType: document.querySelector("#rightEdge").value,
    edgeScale: document.querySelector("#edgeScale").value - 0,
    lineType: document.querySelector("#lineType").value,
    color: document.querySelector("#color").value
  };
}


module.exports.getParms = getParms;
module.exports.show = show;
module.exports.showPropertyPanel = showPropertyPanel;
module.exports.hidePropertyPanel = hidePropertyPanel;
