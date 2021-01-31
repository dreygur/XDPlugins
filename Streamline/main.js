const toggle = require("./js/toggle");
const { notification, getRenderSize } = require("./js/util");
const {
  getIconsAPI,
  signInAPI,
  getFamiliesAPI,
  searchAPI,
  clearToken
} = require("./js/api");
const {
  changeMenuItems,
  changeInnerText,
  updateUserDetails,
} = require("./js/modifiers");
const {
  registerIconsEvents,
  registerFamiliesListEvents,
  registerCategoriesListEvents,
} = require("./js/events-register");
const {
  IconSubCategoryTemplate,
  renderIconDisplayContainer,
  renderIconsCategoryGroupContainer,
  renderPng,
  renderSVG,
  renderFamilyListMenu,
  renderCategoriesListMenu,
} = require("./js/templates");
const { loadPage } = require("./js/xd");

const $ = require("./js/jquery");

let categories = {};
let families = [];
let family = "";
let familySlug = "";
let category = "";
let familyPosition = 0;
let categorySlug = "";
let categoryPosition = 0;
let icons = [];
let user;
let panel;

//gets list of families
async function getFamilies() {
  changeMenuItems(user);
  const response = await getFamiliesAPI();
  families = response;
  let { name, slug } = families[0].family;
  updateCurrentFamily(name, 0, slug);
  updateFamilyCategories();
  renderFamilyListMenu(families);
  renderCategoriesListMenu(categories);
  registerFamiliesListEvents(families, toggleListMenu);
  registerCategoriesListEvents(categories, toggleListMenu);
  getIcons();
}

async function getIcons() {
  try {
    toggle.toggleLoader();
    toggle.toggleIconListDisplay();
    const data = await getIconsAPI(familySlug, categorySlug);
    icons = data;
    toggle.toggleLoader();
    toggle.toggleIconListDisplay();
    renderIcons();
  } catch (error) {
    throw error;
  }
}

async function signin() {
  const email = $("#email").val();
  const password = $("#password").val();
  const response = await signInAPI(email, password);
  if (response.success) {
    user = response.user;
    changeMenuItems(user);
    if (user !== null && user.status !== "free user") {
      toggle.toggleUpgradeInfoBoxOff();
    }
    toggle.toggleSigninPage();
    toggle.toggleIconsPage();

    await getIcons();
  } else {
    notification.error(response.error);
  }
}

async function signOut() {
  user = null;
  changeMenuItems(user);
  clearToken()
  if (user !== null && user.status !== "free user") {
    toggle.toggleUpgradeInfoBoxOff();
  } else {
    toggle.toggleUpgradeInfoBox();
  }

  await getIcons();
}

function updateCurrentFamily(name, position = 0, slug) {
  family = name;
  familyPosition = position;
  familySlug = slug;
  updateCurrentCategory(
    families[position].categories[0].name,
    0,
    families[position].categories[0].slug
  );

  changeInnerText("family", family);
}

function updateCurrentCategory(name, position = 0, slug) {
  category = name;
  categoryPosition = position;
  categorySlug = slug;
  changeInnerText("category", category);
}

//sets categories to that of the current family
function updateFamilyCategories() {
  families.forEach((f) => {
    if (f.family.name === family) {
      categories = f.categories;
      renderCategoriesListMenu(categories);
      registerCategoriesListEvents(categories, toggleListMenu);
    }
  });
}

function toggleListMenu(name, slug, position, type, skipIcons = false) {
  position = parseInt(position);

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

  console.log("user", user);

  user == null || user.status == "free user"
    ? toggle.toggleUpgradeInfoBoxOff()
    : null;

  // toggle.toggleUpgradeInfoBox();

  updateFamilyCategories();
}

//adds list of icons to the dom
function renderIcons(overrideIcons) {
  $("#icon-list-display").empty(); // empties the icon list to prevent old icons being displayed in the dom.

  if (overrideIcons) {
    icons = overrideIcons;
  }

  let lengthCounter = 0;
  Object.entries(icons).forEach(([key, value]) => {
    const keyID = key.replace(/\s/g, ""); //removes all space in the category name. html ids are not allowed to have white spaces

    $("#icon-list-display").append(renderIconDisplayContainer(keyID)); //creates and appends an icon container. it is a holder for a icon category and it's icons. hold subcategory title and list of icons associated with the subcategory

    $(`#${keyID}`).append(IconSubCategoryTemplate(key)); // appends icon subcategory title to icons container.

    $(`#${keyID}`).append(renderIconsCategoryGroupContainer(keyID)); // appends a holder for all icons in the current subcategory.

    value.forEach((icon, index) => {
      $(`#${keyID}-icons`).append(
        icon.representation == null
          ? renderPng(icon.base64, index, lengthCounter, familySlug)
          : renderSVG(icon.representation, index, lengthCounter, familySlug)
      );
    }); // appends icons associated with the current subcategory to the icon list holder.

    lengthCounter += value.length;
  });

  registerIconsEvents(icons);
}

//creates the plugin interface
async function loadIconsPage() {
  const html = await loadPage("index");

  panel = document.createElement("div");
  panel.innerHTML = html;

  panel.querySelector("#family-dropdown").addEventListener("click", () => {
    toggleListMenu(family, familySlug, 0, "families", true);
  });
  panel.querySelector("#category-dropdown").addEventListener("click", () => {
    toggleListMenu(category, categorySlug, 0, "categories", true);
  });

  panel.querySelector("#search").addEventListener("change", (e) => {
    const value = $("#search").val();
    searchAPI(value, renderIcons, getIcons, familySlug);
  });

  panel.querySelector("#menu").addEventListener("click", () => {
    toggle.toggleFooterMenu();
  });

  panel.querySelector("#logout").addEventListener("click", async () => {
    await signOut()
  });

  panel.querySelector("#menu-login").addEventListener("click", () => {
    toggle.toggleIconsPage();
    toggle.toggleSigninPage();
    toggle.toggleFooterMenu();
  });

  panel.querySelector("#icons-page").addEventListener("click", (e) => {
    let classList = $("#menu-container").attr("class").split(/\s+/);
    let target = ["menu", "menu-img"];
    let clickedOn = e.target.id;
    if (
      classList.includes("Footer__Menu--Show") &&
      !target.includes(clickedOn)
    ) {
      toggle.toggleFooterMenu();
    }
  });

  panel.querySelector("#signin").addEventListener("click", async () => {
    await signin();
  });
  return panel;
}

async function show(event) {
  if (!panel) event.node.appendChild(await loadIconsPage());
  await getFamilies();
}

module.exports = {
  panels: {
    showIcons: {
      show,
    },
  },
};
