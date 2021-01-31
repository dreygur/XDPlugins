const $ = require("./jquery");
const toggle = require("./toggle");

exports.changeMenuItems = (user) => {
  let userDetails = { ...user };
  toggle.toggleOffLoginMenuItem();
  toggle.toggleOffUpgradeMenuItem();
  toggle.toggleOffAccountMenuItem();
  toggle.toggleOffLogoutMenuItem();
  if (user) {
    toggle.toggleAccountMenuItem();
    toggle.toggleLogoutMenuItem();
    if (user.email.length > 18) {
      userDetails.email = user.email.substr(0, 19) + "...";
    }
    document.getElementById(
      "myaccount-link"
    ).innerHTML = `<span> logged in as </span>${userDetails.email}`;
    return;
  } else {
    toggle.toggleLoginMenuItem();
    toggle.toggleUpgradeMenuItem();
  }
};

exports.changeInnerText = (id, text) => {
  document.getElementById(id).innerHTML = text;
};
