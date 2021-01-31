const $ = require("./jquery");

exports.toggleIconList = () => {
  $("#iconlist").toggleClass("hide");
};

exports.toggleIconListDisplay = () => {
  $("#icon-list-display").toggleClass("hide");
};

exports.toggleTopNav = () => {
  $("#nav").toggleClass("hide");
};

exports.toggleFooter = () => {
  $("#footer").toggleClass("hide");
};

exports.toggleLoader = () => {
  $("#loader").toggleClass("hide");
};

exports.toggleFooterMenu = () => {
  $("#menu-container").toggleClass("Footer__Menu--Show");
};

exports.toggleSigninPage = () => {
  $("#signin-page").toggleClass("hide");
};

exports.toggleAccountMenuItem = () => {
  $("#myaccount").toggleClass("hide");
};
exports.toggleLogoutMenuItem = () => {
  $("#logout").toggleClass("hide");
};

exports.toggleUpgradeMenuItem = () => {
  $("#upgrade").toggleClass("hide");
};

exports.toggleLoginMenuItem = () => {
  $("#menu-login").toggleClass("hide");
};

exports.toggleOffAccountMenuItem = () => {
  let classList = $(`#myaccount`).attr("class").split(/\s+/);

  if (!classList.includes("hide")) {
    $("#myaccount").toggleClass("hide");
  }

};
exports.toggleOffLogoutMenuItem = () => {
  let classList = $(`#logout`).attr("class").split(/\s+/);

  if (!classList.includes("hide")) {
    $("#logout").toggleClass("hide");
  }

};

exports.toggleOffUpgradeMenuItem = () => {
  let classList = $(`#upgrade`).attr("class").split(/\s+/);

  if (!classList.includes("hide")) {
    $("#upgrade").toggleClass("hide");
  }

};

exports.toggleOffLoginMenuItem = () => {
  let classList = $(`#menu-login`).attr("class").split(/\s+/);

  if (!classList.includes("hide")) {
    $("#menu-login").toggleClass("hide");
  }
};



exports.toggleIconsPage = () => {
  $("#icons-page").toggleClass("hide");
};

exports.toggleUpgradeInfoBox = () => {
  $("#infoBox").toggleClass("hide");
};

exports.toggleUpgradeInfoBoxOff = () => {
  let classList = $(`#infoBox`).attr("class").split(/\s+/);

  if (!classList.includes("hide")) {
    $("#infoBox").toggleClass("hide");
  }
};

exports.turnActiveFamilyOff = (type) => {
  let classList = $(`#${type}-menu-list`).attr("class").split(/\s+/);

  if (!classList.includes("hide")) {
    $(`#${type}-menu-list`).toggleClass("hide");
  }
};

exports.toggleListMenu = (name, slug, position, type, skipIcons = false, user, updateCurrentFamily, updateCurrentCategory) =>{
  position = parseInt(position);

  console.log("user",user)
  if (type === "families") {
    toggle.turnActiveFamilyOff("categories");
    $(`#families-menu-list`).toggleClass("hide");
    updateCurrentFamily(name, position, slug);
  } else {
    toggle.turnActiveFamilyOff("families");
    $(`#categories-menu-list`).toggleClass("hide");
    updateCurrentCategory(name, position, slug);
  }
  if (!skipIcons) {
    getIcons();
  } //skips getting icons after toggle. this is useful for when you want to just show or hide the family or category list without updating the current icons.


  user == null || user.status == "free user"
    ? toggle.toggleUpgradeInfoBoxOff()
    : null;

  toggle.toggleUpgradeInfoBox();

  updateFamilyCategories();
}
