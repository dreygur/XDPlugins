const ENV = 'production';

const settings = {
  development: {
    baseUrl: 'https://engine-dev.ngrok.io',
    baseUrlCode: 'https://my.cl.test',
  },
  staging: {
    baseUrl: 'https://my.vapor.ly',
    baseUrlCode: 'https://my.vapor.ly',
  },
  production: {
    baseUrl: 'https://my.cl.ly',
    baseUrlCode: 'https://my.cl.ly',
  },
};

const host = settings[ENV];

let routes = {
  createDrop: '/v3/items',
  expiration: '/v3/items/:id/expiration',
  security: '/v2/items/:slug/security',
  user: '/v4/user_account',
  oauth: {
    secret: '/v4/adobe_xd/oauth/session/hmac_secret',
    session: '/v4/adobe_xd/oauth/session_id',
    extOauth: '/v4/adobe_xd/oauth/begin_flow/:session_id',
    redirect: '/v4/adobe_xd/oauth/finalize',
    authToken: '/v4/adobe_xd/oauth/token/:session_id',
    validToken: '/v4/adobe_xd/oauth/token/:token/check_validity',
    refreshToken: '/v4/adobe_xd/oauth/refresh/:refresh_token/:access_token',
  },
};

function routesWithHost(routes) {
  for (const route in routes) {
    if (typeof routes[route] === 'object') {
      routes[route] = routesWithHost(routes[route]);
    } else {
      routes[route] = host.baseUrl + routes[route];
    }
  }
  return routes;
}

module.exports = routesWithHost(routes);
