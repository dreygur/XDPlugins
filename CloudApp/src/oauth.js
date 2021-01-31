const HASH = require('../lib/sha256.min.js');
let HMAC = null;
const UXP = require('uxp');
const routes = require('./routes');
const FS = UXP.storage.localFileSystem;
const dismiss_oauth_event = new Event('CLOUDAPP_DISMISS_OAUTH');
const force_oauth_event = new Event('CLOUDAPP_FORCE_LOGIN');
const login_complete_event = new Event('CLOUDAPP_LOGIN_COMPLETE');
const Api = require('./api');

const fetchSecret = async () => {
  if (HMAC === null) {
    HMAC = await xhrRequest(routes.oauth.secret, 'GET').then(
      response => response.secret
    );
  }
  return HMAC;
};

const generateCodeFromURL = async url => {
  const secret = await fetchSecret();
  const stringToEncode = `${secret}${url}${secret}`;
  return HASH.sha256.hex(stringToEncode);
};

const generateUrlForTokenPolling = async sessionId => {
  const authTokenUrl = routes.oauth.authToken.replace(':session_id', sessionId);
  const code = await generateCodeFromURL(authTokenUrl);
  return `${authTokenUrl}?code=${code}`;
};

const genExtOauthUrl = async sessionId => {
  const codeUrl = routes.oauth.extOauth.replace(':session_id', sessionId);
  const code = await generateCodeFromURL(codeUrl);
  let redirect_uri = routes.oauth.redirect;
  return `${codeUrl}?code=${code}&redirect_uri=${redirect_uri}`;
};

const genTokenValidUrl = async token => {
  const codeUrl = routes.oauth.validToken.replace(':token', token);
  const code = await generateCodeFromURL(codeUrl);
  return `${codeUrl}?code=${code}`;
};

const genTokenRefreshURL = async (refresh, access) => {
  const codeUrl = routes.oauth.refreshToken
    .replace(':refresh_token', refresh)
    .replace(':access_token', access);
  const code = await generateCodeFromURL(codeUrl);
  return `${codeUrl}?code=${code}`;
};

const manipulateTokenExpiry = token => {
  token = JSON.parse(token);
  let now = new Date();
  const expiresAt = new Date(now.getTime() + (token['time_remaining'] * 1000));
  token['expires_at'] = expiresAt.toString();
  token = JSON.stringify(token);
  return token;
}

const writeTokenToFile = async token => {
  token = manipulateTokenExpiry(token);
  const pluginDataFolder = await FS.getDataFolder();
  const settings = await pluginDataFolder.createEntry('settings.json', {
    overwrite: true,
  });
  settings.write(token);
};

const writeUserToFile = async user => {
  const pluginDataFolder = await FS.getDataFolder();
  const localuser = await pluginDataFolder.createEntry('user.json', {
    overwrite: true,
  });
  localuser.write(user);
};

const xhrRequest = (url, method, body = '') => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.timeout = 3500;
    req.onload = () => {
      if (req.status === 200) {
        try {
          resolve(req.response);
        } catch (err) {
          reject(`Couldn't parse response. ${err.message}, ${req.response}`);
        }
      } else {
        reject(req);
      }
    };
    req.ontimeout = () => {
      console.log('polling..');
      resolve(xhrRequest(url, method));
    };
    req.onerror = err => {
      reject(err);
    };
    req.open(method, url, true);
    req.responseType = 'json';
    if (method === 'POST' && body !== '') {
      req.send(body);
    } else {
      req.send();
    }
  });
};

const pollForAccessToken = async (session_id, d) => {
  let url = await generateUrlForTokenPolling(session_id);
  xhrRequest(url, 'POST').then(async response => {
    await writeTokenToFile(JSON.stringify(response));
    d.dismissModal();
    document.dispatchEvent(login_complete_event);
  });
};

const intializeOauthFlow = async dialog => {
  // Fetch Session Identifier from engine
  let code = await generateCodeFromURL(routes.oauth.session);
  let url = `${routes.oauth.session}?code=${code}`;
  xhrRequest(url, 'GET').then(
    async response => {
      //if successful open the browser to start the oauth flow on engine.
      // and the start polling for the keys to the kingdom
      const session_id = response.identifier;
      const extUrl = await genExtOauthUrl(session_id);
      UXP.shell.openExternal(extUrl);
      pollForAccessToken(session_id, dialog);
      return true;
    },
    err => {
      document.dispatchEvent(dismiss_oauth_event);
      console.log('There was an error!');
      console.log(err);
      document.dispatchEvent(force_oauth_event);
    }
  );
};

const credentialsAvaliable = async () => {
  try {
    const pluginDataFolder = await FS.getDataFolder();
    const settings = await pluginDataFolder.getEntry('settings.json');
    return settings.isFile;
  } catch (e) {
    return false;
  }
};

const userInfoAvaliable = async () => {
  try {
    const pluginDataFolder = await FS.getDataFolder();
    const user = await pluginDataFolder.getEntry('user.json');
    return user.isFile;
  } catch (e) {
    return false;
  }
};

//This function checks the validity based only on
// token expiration

const tokenValid = token => {
  const now = new Date();
  const expiry = new Date(token.expires_at)
  return (expiry - now) > 1000
};

const readTokenFromFile = async () => {
  const pluginDataFolder = await FS.getDataFolder();
  const entries = await pluginDataFolder.getEntries();
  const localSettings = entries.filter(entry => entry.name === 'settings.json');
  return await localSettings[0].read();
};

const readUserFromFile = async () => {
  const pluginDataFolder = await FS.getDataFolder();
  const entries = await pluginDataFolder.getEntries();
  const localUser = entries.filter(entry => entry.name === 'user.json');
  return await localUser[0].read();
};

const attemptTokenRefresh = async (refresh, access) => {
  let url = await genTokenRefreshURL(refresh, access);
  await xhrRequest(url, 'PUT').then(
    async response => {
      if (
        typeof resposne !== 'undefined' &&
        response.access_token !== '' &&
        typeof response.access_token !== 'undefined' &&
        response.refresh_token !== '' &&
        typeof response.token_token !== 'undefined'
      ) {
        await writeTokenToFile(JSON.stringify(response));
      } else {
        //if refresh fails, delete token to force re auth
        const pluginDataFolder = await FS.getDataFolder();
        const entries = await pluginDataFolder.getEntries();
        const localSettings = entries.filter(
          entry => entry.name === 'settings.json'
        );
        const user = entries.filter(
          entry => entry.name === 'user.json'
        );
        await localSettings[0].delete();
        await user[0].delete();
        return false;
      }
      return false;
    },
    err => {
      document.dispatchEvent(dismiss_oauth_event);
      console.log('There was an error!');
      console.log(err);
      document.dispatchEvent(force_oauth_event);
    }
  );
  return false;
};

const fetchUserInfo = async () => {
  if(await userInfoAvaliable()){
    return JSON.parse(await readUserFromFile());
  }
  try {
    const user = await Api.getInstance().getUserAccount();
    await writeUserToFile(JSON.stringify(user));
    return user;
  } catch (e) {
    console.log(e);
    airbrake.notify(e);
  }
};

// This fucton will return an access token if there is one stored locally.
// prior to returning the access token it will confirm the token's validity
// if the token has expired, and a refresh token is avalible, the function will attempt to
// refresh the token., otherwise the fnuction will return false.
// if false is returned the your should be forced to login again.
const accessToken = async () => {
  //if the file doesn't exist return false
  if (!(await credentialsAvaliable())) {
    return false;
  }
  //read the file
  const data = JSON.parse(await readTokenFromFile());
  const token = data.access_token;
  const refresh_token = data.refresh_token;
  if (token !== '' && typeof token !== 'undefined') {
    //if the token passes validity testing, return the token.
    if (tokenValid(data)) {
      Api.setToken(token);
      if (!Api.getInstance().user) {
        Api.getInstance().user = await fetchUserInfo();
      }
      return token;
    } else {
      //otherwise attemp to refresh the token.
      await attemptTokenRefresh(refresh_token, token);
      //if the file doesn't exist return false
      // the file would exist here, becasue if the refresh fails
      // the file is deleted from disk.
      if (!(await credentialsAvaliable())) {
        return false;
      }
      //return the new token
      const data = await readTokenFromFile();
      return data.access_token;
    }
  }
  return false;
};

module.exports = { intializeOauthFlow, credentialsAvaliable, accessToken };
