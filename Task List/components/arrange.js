const $ = require('../lib/jquery');
const storageHelper = require('../lib/storage-helper');
const state = require('../components/state');
const { writeListItem } = require('../components/writeListItem');


module.exports.arrange = (event) => {
  const $list = $('.list');
  let $this = $(event.currentTarget);
  let index = $this.parents('.to-do-item').index();
  let data = state.data;
  let currentStatus = data[index]
  

  if($this.hasClass('up')) {
    data[index] = data[index - 1];
    data[index - 1] = currentStatus
  } else {
    data[index] = data[index + 1];
    data[index + 1 ] = currentStatus
  }


  state.data = data;
  storageHelper.set('weee', state.data);

  $list.children().remove();
  $list.html(writeListItem(state.data))

  $('.to-do-item').each(function () {
    if ($(this).hasClass('is-checked')) {
      $(this).find('.checker').attr('checked', true)
    }
  })

}