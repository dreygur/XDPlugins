const styles = require("./styles.css");
const Vue = require("vue").default;
const index = require("./index.vue").default


const show = event => {
  document.body.innerHTML = `<div id="container"></div>`
  let app4 = new Vue({
    el: "#container",
    components: { 
      index 
    },
    render(h) {
      return h(index)
    }
  })
}

const hide = () => console.log('hiding');

module.exports = {
  panels: {
    "fetchShortCuts": {show, hide}
  }
};
