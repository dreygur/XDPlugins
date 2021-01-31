/*
  Add items to checklist 
  Updates lastInput = await storageHelper.get('weee')
*/
const $ = require('../lib/jquery');
const storageHelper = require('../lib/storage-helper');
const state = require('../components/state');
const { writeListItem } = require('../components/writeListItem');

module.exports.addCheckListItem = async function() {
  const $list = $('.list');
  let inputValue = document.getElementById("input-el").value
  if (inputValue < 1) return;
  $('.task-list').hide();

  let setData = {
    toDo: inputValue,
    done: false
  }

  state.data.push(setData)
  storageHelper.set('weee', state.data);

  $list.children().remove();
  $list.html(writeListItem(state.data))

  $('.to-do-item').each(function () {
    if ($(this).hasClass('is-checked')) {
      $(this).find('.checker').attr('checked', true)
    }
  })

  $("#input-el").val('');
  $("#input-el").focus();


  if(state.data.length <= 1) {
    $('.move-parent').hide();
  }
}