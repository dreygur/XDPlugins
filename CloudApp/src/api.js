require('../lib/formdata');
const routes = require('./routes');
const Notification = require('./notification');
const atob = require('../lib/atob').atob;
const api_error = new Event('CLOUDAPP_ERROR');

const fetchWithCheck = async (url, options) => {
  try {
    const response = await fetch(encodeURI(url), options);
    if (!response.ok) {
      Notification.error(`${response.status}: ${response.statusText}`);
    }
    return response;
  } catch (e) {
    console.log(`Request to ${encodeURI(url)} failed with error ${e}`);
    document.errorObject = e;
    document.dispatchEvent(api_error);
  }
};

class Api {
  static setToken(token) {
    Api.getInstance().token = token;
  }

  static getInstance() {
    return Api._instance || new Api();
  }

  constructor() {
    if (Api._instance) {
      return Api._instance;
    }
    Api._instance = this;
  }

  urlWithToken(route) {
    return `${route}?access_token=${this.token}`;
  }

  async createDrop(params) {
    try {
      const url = this.urlWithToken(routes.createDrop);
      const response = await fetchWithCheck(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      return response.json();
    } catch (e) {
      console.log(e);
      document.errorObject = e;
      document.dispatchEvent(api_error);
    }
  }

  async uploadFile(drop, file) {
    const { url, callback_url, bucket, name } = drop;
    const { AWSAccessKeyId, signature, key, policy, acl } = drop.s3;

    try {
      const formData = new FormData();
      const newKey = key.replace('${filename}', `${name}.png`);
      formData.append('AWSAccessKeyId', AWSAccessKeyId);
      formData.append('key', newKey);
      formData.append('acl', acl);
      formData.append('success_action_status', '201');
      formData.append('signature', signature);
      formData.append('policy', policy);
      formData.append('file', atob(file));
      const data = await formData.toString();
      // Uploading to s3
      console.log('Uloading to s3');
      const s3Response = await fetchWithCheck(url, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData.boundary}`,
        },
        body: data,
      });

      // Prepare params for v3 items API for calling back
      // Callback to v3 items API with needed params
      // Potentially move this to a mutation in apollo
      // Need to handle a refresh query via subs
      console.log('Running callback');
      const params = `key=${newKey}&bucket=${bucket}&access_token=${
        this.token
      }`;
      const response = await fetchWithCheck(`${callback_url}?${params}`, {
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Drop upload completed');
      return response.json();
    } catch (e) {
      console.log(e);
      airbrake.notify(e);
      document.errorObject = e;
      document.dispatchEvent(api_error);
    }
  }

  async setExpiration(slug, params) {
    try {
      console.log('Setting drop expiration');
      const url = this.urlWithToken(routes.expiration).replace(':id', slug);
      const response = await fetchWithCheck(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
    } catch (e) {
      console.log(e);
      airbrake.notify(e);      
      document.errorObject = e;
      document.dispatchEvent(api_error);
    }
  }

  async restrict(slug, params) {
    try {
      console.log('Restricting drop access');
      const url = this.urlWithToken(routes.security).replace(':slug', slug);
      const response = await fetchWithCheck(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
    } catch (e) {
      console.log(e);
      airbrake.notify(e);      
      document.errorObject = e;
      document.dispatchEvent(api_error);
    }
  }

  async getUserAccount() {
    try {
      const url = this.urlWithToken(routes.user);
      const response = await fetchWithCheck(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.json();
    } catch (e) {
      console.log(e);
      airbrake.notify(e);      
    }
  }
}

module.exports = Api;
