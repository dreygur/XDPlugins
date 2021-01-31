/*
  Plugin Documentation
  https://adobexdplatform.com/plugin-docs/
  @Plugin: Notes
  @Author Kenny Krosky 
*/
const storageHelper = require('./lib/storage-helper');
const { addCheckListItem } = require('./components/addToNotes');
const { checkboxChecker } = require('./components/checkboxChecker')
const { deleteItem } = require('./components/removeItem');
const { clearAll } = require('./components/clearAll');
const { loadedTask } = require('./components/loadedTask');
const { arrange } = require('./components/arrange');
const $ = require('./lib/jquery');
const styles = require('./components/styles');
let panel;

const panelContainer = () => {
  let html = /* html */ `
  <style>
    ${styles}
  </style>
    <div class="outer-most">
      <div class="to-do-parent">
        <div class="to-do-parent__inner">
          <div class="list">
            <div class="task-list" style="color: #000;">Add your first task item</div>
          </div>
        </div>
      </div>
      <div class="action-group">
        <form class="form">
          <input uxp-quiet="true" name="el" id="input-el" placeholder="Add Item" autofocus>
          <div class="button-group">
            <button class="reset">Clear List</button> 
            <button uxp-variant="cta" id="addNote">Add</button>
          </div>
        </form>   
      </div>
    </div>
  `;
  panel = document.createElement("div");
  panel.innerHTML = html;
  return panel;
}


const show = async event => {
  
  if (!panel) {
    await event.node.appendChild(panelContainer());
    let initialState = await storageHelper.get('weee');
    loadedTask(initialState);

    if(initialState !== undefined) {
      if(initialState.length <= 1) {
        $('.move-parent').hide();
      }
    }
    
    $('.form').on('submit', addCheckListItem);
    $('#addNote').on('click', addCheckListItem);
    $('.reset').on('click', clearAll);
    $(document).on('click', '.delete', deleteItem);
    $(document).on('click', '.checklist-group', checkboxChecker)
    $(document).on('click', '.move', arrange);

  }

}

const hide = () => {
  console.log('hiding')
}

module.exports = {
  panels: {
    runPlugin: {
      show,
      hide
    }
  }
};
