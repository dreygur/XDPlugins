const {copyToClipBoard, insertPng} = require('./xd')
const {renderSvgPathsNoStyle} = require('./templates')
const {getIconSize, notification} = require('./util')

exports.registerIconsEvents = (icons) => {
    let allIcons = [];
    Object.entries(icons).forEach(([key, value]) => {
      allIcons.push(...value);
    });
  
    allIcons.forEach((icon, i) => {
      document.querySelector(`#icon-${i}`).addEventListener("click", () => {
        if (icon.base64 !== null) {
          const size = getIconSize();
          insertPng(icon.base64, size);
        } else {
          copyToClipBoard(renderSvgPathsNoStyle(icon.representation));
        }
      });
    });
  }
  
  exports.registerFamiliesListEvents = (families, toggleListMenu) => {
    families.forEach((f, i) => {
      document.querySelector(`#f-${i}`).addEventListener("click", () => {
        const { name, slug } = families[parseInt(i)].family;
        toggleListMenu(name, slug, i, "families");
      });
    });
  }
  
  exports.registerCategoriesListEvents = (categories, toggleListMenu) => {
    categories.forEach((c, i) => {
      document.querySelector(`#c-${i}`).addEventListener("click", () => {
        const { name, slug } = categories[parseInt(i)];
        toggleListMenu(name, slug, i, "categories");
      });
    });
  }