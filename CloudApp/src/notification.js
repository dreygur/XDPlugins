const $ = require('../lib/jquery');
const h = require('./helpers').h;
const notificationStyle = require('./style').notificationStyle;

class Notification {
  constructor() {}

  static destroy() {
    $('dialog .notification').remove();
  }

  static error(body) {
    Notification.send('Opps! Something went wrong', body, 'error');
  }

  static send(title, body, kind = 'success') {
    const notification = h(
      'div',
      { class: `notification ${kind}` },
      h('style', notificationStyle),
      h('div', { class: 'title' }, h('p', title)),
      h('div', { class: 'body' }, h('div', body)),
      h(
        'div',
        { class: 'footer' },
        h(
          'button',
          { uxpVariant: 'primary', onclick: Notification.destroy },
          'Dismiss'
        )
      )
    );
    $('dialog').append(notification);
  }
}

module.exports = Notification;
