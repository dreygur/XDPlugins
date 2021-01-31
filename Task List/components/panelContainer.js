const styles = require('./styles');
let panel;

module.exports.panelContainer = () => {
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
          <input uxp-quiet="true" name="el" id="input-el" placeholder="Add item" autofocus>
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
};