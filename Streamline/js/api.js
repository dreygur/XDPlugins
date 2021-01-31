const { request } = require("./util");
const io = require("./socket");
const toggle = require("./toggle");
let API_TOKEN;
const BASEURL = "https://api.streamlineicons.com";

exports.getIconsAPI = async (familySlug, categorySlug) => {
  const response = await request(
    `/v2/icons/${familySlug}/${categorySlug}`,
    "GET",
    undefined,
    API_TOKEN
  );
  return response.data;
};

exports.signInAPI = async (email, password) => {
  const requestData = {
    email: email,
    password: password,
  };
  const response = await request("/v2/users", "PATCH", requestData, API_TOKEN);
  API_TOKEN = response.token;
  return response;
};

exports.getFamiliesAPI = async () => {
  const response = await request(
    "/v2/families?showCategories=true",
    "GET",
    API_TOKEN
  );
  return response;
};

exports.searchAPI = (query, renderIcons, getIcons, familySlug) => {
  const socket = io(BASEURL);
  let timeout = null;
  if (timeout) clearTimeout(this.timeout);
  timeout = setTimeout(() => {
    toggle.toggleLoader();

    toggle.toggleIconListDisplay();
    socket.emit("SEARCH_ICONS", { query, family: familySlug, jwt: API_TOKEN });
  }, 300);

  socket.on("SEARCH_ICONS_SUCCESS", (res) => {
    toggle.toggleLoader();
    toggle.toggleIconListDisplay();
    renderIcons(res.icons);
  });

  socket.on("SEARCH_ICONS_FAILURE", (res) => {
    getIcons();
  });
};

exports.clearToken = () => {
  API_TOKEN = 'no-token'
}
