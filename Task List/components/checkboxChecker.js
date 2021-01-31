const state = require('../components/state');
const $ = require('../lib/jquery');
const storageHelper = require('../lib/storage-helper');

module.exports.checkboxChecker = async (event) => {
  let cleanItem = state.data;
  let $this = $(event.currentTarget);
  let checked = $this.parents('.to-do-item').hasClass('is-checked')

  if (checked) {
    $this.find('.checker').attr('checked', false)
    $this.parents('.to-do-item').removeClass('is-checked')
  } else {
    $this.find('.checker').attr('checked', true)
    $this.parents('.to-do-item').addClass('is-checked')
  }

  if (cleanItem[$this.parents('.to-do-item').index()].done) {
    cleanItem[$this.parents('.to-do-item').index()].done = false
  } else {
    cleanItem[$this.parents('.to-do-item').index()].done = true
  }
  storageHelper.set('weee', cleanItem);
}