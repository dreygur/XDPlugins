const fs = require('uxp').storage.localFileSystem;
var clipboard = require('clipboard');
const $ = require('../lib/jquery');
const h = require('./helpers').h;
const dialogStyle = require('./style').dialog;
const errorDialogStyle = require('./style').errorDialog;
const Api = require('./api');
const Notification = require('./notification');
const force_oauth_event = new Event('CLOUDAPP_FORCE_LOGIN');

class CloudappDialog {
  constructor(platform) {
    this.dropName = null;
    this.settings = { share: null, expiration: null };
    this.image = null;
    this.dialog = null;
    this.loading = false;
    this.dropSaved = false;
    this.dropLinkInput = null;
    this.api = Api.getInstance();
    this.user = this.api.user;
    this.platform = platform;
  }

  defaultDropName() {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    return `Image-${dd}-${mm}-${yyyy}`;
  }

  close() {
    this.api.user = null;
    this.dialog.close();
  }

  async logOut() {
    try {
      const settingsFolder = await fs.getDataFolder();
      const settings = await settingsFolder.getEntry('settings.json');
      const user = await settingsFolder.getEntry('user.json');
      await user.delete();
      await settings.delete();
      this.dialog.close();
      document.dispatchEvent(force_oauth_event);
    } catch (e) {
      console.log(e);
      airbrake.notify(e);
    }
  }

  notifyCompletion() {
    const notificationBody = h(
      'p',
      'Your link has been copied to the clipboard.'
    );
    Notification.send('Upload complete!', notificationBody);
  }

  async onsubmit(e) {
    // prevent users rage clicking turning into multiple dup items
    if (this.dropSaved) {
      this.dialog.close();
      return;
    }
    if (!this.loading) {
      this.loading = true;
      $('#save').text('Creating Drop...');
      $('#save').prop('disabled', true);

      const params = {
        name: this.dropName.value,
        strategy: 'response',
        settings: {
          share: this.settings.share.value,
          expiration: this.settings.expiration.value,
        },
      };
      const drop = await this.api.createDrop(params);
      const dropWithLinks = await this.api.uploadFile(drop, this.image);
      console.log('Drop upload complete continue with UI');
      const expireParams = this.expireParams();
      if (expireParams) {
        await this.api.setExpiration(drop.slug, expireParams);
      }

      const shareValue = this.settings.share.value;
      if (shareValue && shareValue === 'unrestricted_team') {
        await this.api.restrict(drop.slug, { option: shareValue });
      }
      this.loading = false;
      this.dropSaved = true;
      clipboard.copyText(dropWithLinks.share_url);
      this.notifyCompletion();
      $('#save').text('Done');
      $('#save').prop('disabled', false);
    }
  }

  expireParams() {
    const expirationValue = this.settings.expiration.value;
    if (expirationValue === 'never' || !expirationValue) {
      return undefined;
    }
    let [name, value] = expirationValue.split('|');
    const params = {};
    if (name === 'expires_at') {
      let date = new Date();
      const times = {
        hour: 1,
        day: 24,
        week: 24 * 7,
      };
      date.setHours(date.getHours() + times[value]);
      value = date.toJSON();
    } else {
      value = parseInt(value);
    }
    params[name] = value;
    return params;
  }

  setBase64Image(imageUrl) {
    this.image = imageUrl;
  }

  showDropdown() {
    $('.user--dropdown, .arrow').toggleClass('active');
  }

  errorDialog(error) {
    this.dialog = h(
      'dialog',
      h('style', errorDialogStyle),
      h('p', error),
      h(
        'div',
        { class: 'button-container' },
        h(
          'button',
          { uxpVariant: 'primary', onclick: () => this.dialog.close() },
          'Close'
        )
      )
    );
    return this.dialog;
  }

  buildDialog() {
    const shareHidden = this.user.team ? '' : 'hidden';
    const expirationHidden = this.user.subscribed ? '' : 'hidden';
    this.dialog = h(
      'dialog',
      h('style', dialogStyle),
      h(
        'form',
        { method: 'dialog' },
        h(
          'header',
          h(
            'div',
            { class: 'header' },
            h(
              'div',
              { class: 'header--item' },
              h('img', { src: '../images/cloudapp-logo.png', class: 'logo' }),
              h('span', 'Create a Drop')
            ),
            h(
              'div',
              { class: 'header--item user', onclick: this.showDropdown },
              h(
                'div',
                { class: 'avatar', style: 'border-radius: 10px;' },
                h('img', {
                  src: `https://www.gravatar.com/avatar/${
                    this.user.gravatar_hash
                  }`,
                  class: 'avatar--img',
                })
              ),
              h('span', { class: 'header--item_user-name' }, this.user.email),
              h('div', { class: 'arrow' }),
              h(
                'div',
                { class: 'user--dropdown' },
                h('ul', h('li', { onclick: () => this.logOut() }, 'logout'))
              )
            )
          )
        ),
        h(
          'div',
          { class: 'row columns' },
          h(
            'div',
            { class: 'column form-group' },
            h(
              'div',
              { class: 'input-group' },
              h('label', 'Name'),
              (this.dropName = h('input', {
                uxpQuiet: true,
                value: this.defaultDropName(),
              }))
            ),
            h(
              'div',
              h(
                'div',
                { class: `input-group ${shareHidden}` },
                h('label', 'Share Settings'),
                (this.settings.share = h(
                  'select',
                  {
                    uxpQuiet: true,
                    name: 'share',
                    id: `share-${this.platform}`,
                  },
                  h(
                    'option',
                    { value: 'unrestricted', selected: true },
                    'Anyone with the link'
                  ),
                  h(
                    'option',
                    { value: 'unrestricted_team' },
                    'Anyone in my team who has the link'
                  )
                ))
              ),
              h(
                'div',
                { class: `input-group ${expirationHidden}` },
                h('label', 'Expiration Date'),
                (this.settings.expiration = h(
                  'select',
                  {
                    uxpQuiet: true,
                    name: 'expires',
                    id: `expires-${this.platform}`,
                  },
                  h('option', { value: 'never', selected: true }, 'Never'),
                  h('option', { value: 'expires_at|hour' }, 'in 1 hour'),
                  h('option', { value: 'expires_at|day' }, 'in 1 day'),
                  h('option', { value: 'expires_at|week' }, 'in 1 week'),
                  h(
                    'option',
                    { value: 'expires_after_views|1' },
                    'after 1 view'
                  ),
                  h(
                    'option',
                    { value: 'expires_after_views|10' },
                    'after 10 views'
                  )
                ))
              )
            )
          ),
          h(
            'div',
            { class: 'column' },
            h(
              'div',
              { class: 'card' },
              h('p', this.imagePath),
              h('img', {
                class: 'artboard',
                src: `data:image/png;base64,${this.image}`,
              })
            ),
            h(
              'div',
              { class: 'button-container' },
              h(
                'button',
                {
                  uxpVariant: 'primary',
                  onclick: () => {
                    this.close();
                  },
                },
                'Cancel'
              ),
              h(
                'button',
                {
                  uxpVariant: 'cta',
                  id: 'save',
                  type: 'button',
                  onclick: () => {
                    this.onsubmit();
                  },
                },
                'Create Link'
              )
            )
          )
        )
      )
    );
    this.settings.share.value = 'unrestricted';
    this.settings.expiration.value = 'never';
    return this.dialog;
  }
}

module.exports = CloudappDialog;
