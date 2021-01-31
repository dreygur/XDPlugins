const state = require('../components/state');
const storageHelper = require('../lib/storage-helper');
const $ = require('../lib/jquery');

module.exports.clearAll = () => {
  state.data = [];
  storageHelper.delete('weee')
  $('.list').html(`<div class="task-list" style="color: #999;">Add your first task item</div>`)
}