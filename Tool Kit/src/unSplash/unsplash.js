/* @flow */
//const fetch from "./fetch";
const fetch = require('./fetch.js').default;
console.log(fetch);


const { API_URL, API_VERSION } = require("./constants");
const { buildFetchOptions } = require("./utils");

const auth = require("./methods/auth");
const currentUser =require("./methods/currentUser");
const users = require("./methods/users");
const photos = require("./methods/photos");
const categories = require("./methods/categories");
const collections = require("./methods/collections");
const search = require("./methods/search");
const stats = require("./methods/stats");

export const Unsplash = {
  _apiUrl: string;
  _apiVersion: string;
  _applicationId: string;
  _secret: string;
  _callbackUrl: ?string;
  _bearerToken: ?string;
  _headers: ?Object;

  auth: Object;
  currentUser: Object;
  users: Object;
  photos: Object;
  categories: Object;
  collections: Object;
  search: Object;
  stats: Object;
  toJson: Function;

  constructor(
    options: {
      apiUrl: string,
      apiVersion: string,
      applicationId: string,
      secret: string,
      callbackUrl?: string,
      bearerToken?: string,
      headers?: Object
    }
  ) {
    this._apiUrl = options.apiUrl || API_URL;
    this._apiVersion = options.apiVersion || API_VERSION;
    this._applicationId = options.applicationId;
    this._secret = options.secret;
    this._callbackUrl = options.callbackUrl;
    this._bearerToken = options.bearerToken;
    this._headers = options.headers || {};

    this.auth = auth.bind(this)();
    this.currentUser = currentUser.bind(this)();
    this.users = users.bind(this)();
    this.photos = photos.bind(this)();
    this.categories = categories.bind(this)();
    this.collections = collections.bind(this)();
    this.search = search.bind(this)();
    this.stats = stats.bind(this)();
  }

  request(
    requestOptions: {
      url: string,
      method: string,
      query: Object,
      headers: Object,
      body: Object,
      oauth: boolean
    }
  ):Promise<any> {
    var { url, options } = buildFetchOptions.bind(this)(requestOptions);

    return fetch(url, options);
  }
}

export function toJson(res: Object): Object {
  return typeof res.json === "function" ? res.json() : res;
}
