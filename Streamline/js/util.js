const $ = require("./jquery");
const BASEURL = "https://api.streamlineicons.com";

exports.notification = {
  reset: function () {
    setTimeout(function () {
      const elm = $("#notification");
      elm.html(`<p></p>`);
      elm.removeClass("notification--success");
      elm.removeClass("notification--error");
    }, 2000);
  },
  success: function (message) {
    const elm = $("#notification");
    elm.html(`<p>${message}</p>`);
    elm.addClass("notification--success");
    this.reset();
  },
  error: function (error) {
    const elm = $("#notification");
    elm.html(`<p>${error}</p>`);
    elm.addClass("notification--error");
    this.reset();
  },
};

//Request helps make http calls to remote servers easier
// @params url
// @params method
// @params data
exports.request = async (url, method, data, API_TOKEN) => {
  try {
    const responseJson = await fetch(BASEURL + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-Requester": "API_Streamline",
        "X-API-Version": "2",
        "X-API-Language": "EN",
        "X-API-Environment": "production",
        Authorization: `Bearer ${API_TOKEN}`,
      },

      body: JSON.stringify(data),
    });
    const body = await responseJson.json();
    return body;
  } catch (error) {
    console.log('here',error);
  }
};

exports.getRenderSize = (familySlug) => {
  let height = 24;
  let width = 24;

  let containsMicroMini = new RegExp(
    /streamline-mini-bold|streamline-mini-line|streamline-micro-line|streamline-micro-bold/
  ).test(familySlug);
  let containsIllustration = new RegExp(
    /illustrations-line|freebies-elections|illustrations-duotone|illustrations-multicolor/
  ).test(familySlug);
  let containsSticker = new RegExp(/freebies-stickers/).test(familySlug);
  let containsFreeMoji = new RegExp(/freebies-freemojis/).test(familySlug);
  if (containsIllustration) {
    height = 60;
    width = 60;
  }

  if (containsMicroMini) {
    height = 16;
    width = 16;
  }

  if (containsSticker) {
    height = 90;
    width = 90;
  }

  if (containsFreeMoji) {
    height = 36;
    width = 36;
  }
  return { height, width };
};

exports.getIconSize = () => {
  const maxIconSize = 1024;
  const size = document.getElementById("size").value;
  return Math.min(maxIconSize, parseInt(size));
};
