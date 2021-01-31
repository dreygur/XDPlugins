const h = require('./helpers.js').h;
const style = require('./style.js').loginStyle;
const OAuth = require('./oauth.js');

class OAuthDialog {
  constructor() {
    this.dialog = null;
  }

  loginClicked(e) {
    console.log("Login Clicked");
    let ls = document.getElementById('loading-screen');
    ls.style.display = 'flex';
    OAuth.intializeOauthFlow(this);
  }

  dismissModal() {
    console.log("Dismiss Dialog");
    this.dialog.close();
  }

  buildDialog() {
    this.dialog = h(
      'dialog',
      h('style', style),
      h(
        'div',
        { class: 'login-container' },
        h('img', { src: 'cloudapp-logo-large.png', class: 'large-logo' }),
        h('h1', { class: 'hero' }, 'CloudApp'),
        h(
          'div',
          { class: 'button-container' },
          h(
            'button',
            { uxpVariant: 'primary', onclick: () => this.dialog.close() },
            'Cancel'
          ),
          h(
            'button',
            {
              uxpVariant: 'cta',
              type: 'submit',
              onclick: e => {
                this.loginClicked();
              },
            },
            'Login'
          )
        ),
        h(
          'div',
          { class: 'loading-screen', id: 'loading-screen' },
          h('img', { src: 'spinner.gif' }),
          h('h1', 'Please Complete Login in the browser.')
        )
      )
    );
    console.log("Returning Dialog");
   return this.dialog
  }
}

module.exports = OAuthDialog;
