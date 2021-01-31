
import { securedAxiosInstance, plainAxiosInstance } from "@/axios/index.js";
const storageHelper = require('xd-storage-helper');
const apiVersion = "v1";
import router from "../../router";

const state = {
  user: {
    signed_in: false,
    accounts: []
  },
  error: '',
  currentAccount: {},
  connected: false,
};

const getters = {
  USER: state => state.user,
  USER_ERROR: state => state.error,
  CURRENT_ACCOUNT: state => state.currentAccount,
  ACCOUNTS: state => state.user.accounts,
  CONNECTED: state => state.connected,
}

const actions = {
  updateUser: (context, user) => {
    context.commit('SET_USER', user);
  },
  signUp: (context, user) => {
    const { email, password, password_confirmation } = user
    return plainAxiosInstance
      .post("/v1/signup", {
        email,
        password,
        password_confirmation,
      })
      .then(response => {
        if (!response.data.csrf) {
          context.commit('SET_ERROR', response)
        } else (
          storageHelper.set('csrf', response.data.csrf),
          context.commit('SET_USER', response.data.user),
          router.push('/')
        )
      })
      .catch(error => {
        context.commit('SET_ERROR', error)
        console.error(error);
      });
  },
  signIn: (context, user) => {
    return plainAxiosInstance
      .post(`${apiVersion}/signin`, { email: user.email, password: user.password })
      .then(response => {
        if (!response.data.csrf) {
          context.commit('SET_ERROR', response)
        } else (
          storageHelper.set('csrf', response.data.csrf),
          context.commit('SET_USER', response.data.user),
          router.push('/')
        )
      })
      .catch(error => {
        console.error(error);
        context.commit('SET_ERROR', error)
      });
  },
  getUser: context => {
    return securedAxiosInstance
      .get(`${apiVersion}/me`)
      .then(response => {
        response.data.signed_in = true;
        response.data.has_active_subscription = !!(
          response.data.current_period_end &&
          response.data.current_period_end >
          parseInt((new Date().getTime() / 1000).toFixed(0))
        );
        context.commit("SET_USER", response.data);

        if (!context.getters.CURRENT_ACCOUNT.id) {
          if (response.data.last_account_id) {
            securedAxiosInstance
              .get(`${apiVersion}/accounts/${response.data.last_account_id}`, {
                params: {
                  select: true
                }
              })
              .then(response => {
                context.commit("CURRENT_ACCOUNT", response.data);
              })
              .catch(error => console.log(error));
          } else {
            securedAxiosInstance
              .get(`${apiVersion}/accounts/${context.getters.USER.accounts[0].id}`, {
                params: {
                  select: true
                }
              })
              .then(response => {
                context.commit("CURRENT_ACCOUNT", response.data);
              })
              .catch(error => console.log(error));
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  },
  signOut: context => {
    return securedAxiosInstance
      .delete(`${apiVersion}/signin`)
      .then(response => {
        storageHelper.set('csrf', '')
        context.commit("USER_SIGN_OUT")
        router.replace('/signin')
      })
      .catch(error => {
        console.error(error);
      });
  },
  updateConnection: (context) => {
    context.commit("SET_CONNECTION", navigator.onLine)
  }
}

const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
  },
  SET_ERROR: (state, error) => {
    state.error = (error.response && error.response.data && error.response.data.error) || "Unknown error - please try again"
  },
  USER_SIGN_IN: state => {
    state.user.signed_in = true
  },
  USER_SIGN_OUT: state => {
    state.user = {
      signed_in: false,
      accounts: []
    };
  },
  CURRENT_ACCOUNT: (state, currentAccount) => {
    if (currentAccount.id !== state.currentAccount.id) {
      return securedAxiosInstance
        .get(`/v1/accounts/${currentAccount.id}`, {
          params: {
            select: true
          }
        })
        .then(response => {
          state.currentAccount = response.data;
        })
    }
  },
  SET_CONNECTION: (state, boolean) => {
    state.connected = boolean
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}