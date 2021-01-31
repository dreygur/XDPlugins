const os=require("os"),Helpers=require("../util/helpers"),Usage=require("../service/UsageService"),ResizePanel=require("../partial/resize/controller");let UI,selectIndex,RGSelection,RGList,changeRG;function Resize(){}Resize.prototype.Show=async function(e){if(UI=new ResizePanel,selectIndex=0,!UI.Created){e.node.firstChild&&e.node.firstChild.remove(),e.node.appendChild(await UI.Create());let s=await Helpers.GetUser();Usage.PanelOpen(s,os.platform())}},Resize.prototype.Hide=function(e){e.node.firstChild&&e.node.firstChild.remove(),UI=void 0,selectIndex=void 0,Usage.PanelClose()},Resize.prototype.Update=function(e){let s,i=Helpers.GetRGs(e);setTimeout(()=>{i.length?(UI.Panel.className="show",UI.Warning.className="hide",RGSelection=$first("#RGSelection"),RGList=$first("#RGList"),1===i.length?RGSelection.style.display="none":RGSelection.style.display="block",changeRG=function(){selectIndex=this.value,s=i[selectIndex],UI.Columns.value=s.numColumns,UI.Rows.value=s.numRows,UI.ChangeRepeatGrid(s)},Helpers.MakeRGList(RGList,i,selectIndex,changeRG)):(UI.Panel.className="hide",UI.Warning.className="show")},200)},module.exports=new Resize;