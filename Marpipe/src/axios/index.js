const axios = require('axios');
const API_URL = process.env.VUE_APP_API_URL;
const storageHelper = require('xd-storage-helper');
import store from '../store/index.js';
import router from '../router.js';

const securedAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

securedAxiosInstance.interceptors.request.use(config => {
  async function getCSRF () {
    const method = config.method.toUpperCase();
    if (method !== "OPTIONS" && method !== "GET") {
      config.headers = {
        ...config.headers,
        "X-CSRF-TOKEN": await storageHelper.get('csrf', '')
      };
    }
    return config;
  }

  return getCSRF()
});

securedAxiosInstance.interceptors.response.use(null, error => {
  async function csrf() {
    return await storageHelper.get('csrf', '')
  }

  if (
    error.response &&
    error.response.config &&
    error.response.status === 401
  ) {
    return csrf()
      .then(token => {
        return plainAxiosInstance
          .post(
            "/v1/refresh",
            {},
            { headers: { "X-CSRF-TOKEN": token } }
          )
          .then(response => {
            storageHelper.set('csrf', response.data.csrf)
            store.commit("USER_SIGN_IN");
            // After another successfull refresh - repeat original request
            let retryConfig = error.response.config;
            retryConfig.headers["X-CSRF-TOKEN"] = token;
            return plainAxiosInstance.request(retryConfig);
          })
          .catch(error => {
            storageHelper.set('csrf', '')
            store.commit("USER_SIGN_OUT");
            // redirect to signin if refresh fails
            if (router.history.current.name !== "Signin" && router.history.current.name !== "Signup") {
              router.replace("/signin");
            }
            return Promise.reject(error);
          });
      })
    // If 401 by expired access cookie, we do a refresh request
    
  } else {
    return Promise.reject(error);
  }
});

export { securedAxiosInstance, plainAxiosInstance };
