const { getRenderSize, getIconSize, notification } = require("./util");
const $ = require("./jquery");

const listTemplate = (type, position, name, slug) => {
  return `<div id="${type}-${position}"><p>${name}</p><img id="${slug}" style="fill:black" class="hide" src="./assets/icons/check.svg"></div>`;
};

exports.IconSubCategoryTemplate = (subcategory) => {
  return `<div class="IconSubcategory"><div class="IconSubcategory_Title"><span class="IconSubcategory_SubCategory">${subcategory}</span></div></div>`;
};

exports.renderIconDisplayContainer = (keyID) => {
  return `<div id='${keyID}' class='icon-list__display__container'></div>`;
};

exports.renderIconsCategoryGroupContainer = (keyID) => {
  return `<div id='${keyID}-icons' class='icon-list__icons'></div>`;
};


//appends list of families to list menu
exports.renderFamilyListMenu = (families) => {
  families.forEach((f, i) => {
    $("#families-menu-list").append(
      listTemplate("f", i, f.family.name, f.family.slug)
    );
  });
}

//appends list of family categories to list menu
exports.renderCategoriesListMenu = (categories) => {
  $("#categories-menu-list").empty();
  categories.forEach((c, i) => {
    $("#categories-menu-list").append(listTemplate("c", i, c.name, c.slug));
  });
}


exports.renderPng = (base64, index, length, familySlug) => {
  const renderSize = getRenderSize(familySlug);
  const height = renderSize.height;
  const width = renderSize.width;
  return `<div id="icon-${
    length + index
  }" class="icon-list__icons__icon"><img draggable="true"  style="width:${width}px; height:${height}px;"  src="${base64}" /></div>`;
};

function renderPaths(icon) {
  return icon[4].map((path, index) => {
    const stroke = icon[3][index]["stroke"];
    const fill = icon[3][index]["fill"];
    const strokelinecap = icon[3][index]["stroke-linecap"];
    const strokelinejoin = icon[3][index]["stroke-linejoin"];
    const strokewidth = icon[3][index]["stroke-width"];
    return `  <path fill="${fill}" stroke="${stroke}" stroke-linecap="${strokelinecap}"  stroke-linejoin="${strokelinejoin}" stroke-width="${
      strokewidth ? strokewidth : 1
    }" d="${path}" />`;
  });
}

function renderSvgPaths (icon, familySlug) {
  const renderSize = getRenderSize(familySlug);
  const height = renderSize.height;
  const width = renderSize.width;

  return `
    <svg style="padding:2px;"  viewBox="0 0 ${width} ${height}" height="${height}" width="${width}">
    <g transform="scale(${width / icon[1]}, ${height / icon[2]})">
    ${renderPaths(icon)}
    </g>
    </svg>
    `;
};

exports.renderSvgPathsNoStyle = (icon) => {
  const size = getIconSize();
  const height = size;
  const width = size;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" viewBox="0 0 ${width} ${height}" height="${height}" width="${width}">
    <g transform="scale(${width / icon[1]}, ${height / icon[2]})">
    ${renderPaths(icon)}
    </g>
    </svg>
    `;
};

exports.renderSVG = (icon, index, length, familySlug) => {
  return `<div draggable="true" id=icon-${
    length + index
  } class="icon-list__icons__icon">
    ${renderSvgPaths(icon, familySlug)}
    </div>`;
};
