const Vue = require("vue").default;
const store = require("./store").default;
const style = require("./style/styles.css");
const App = require("./App.vue").default;
const router = require("./router.js").default;
const { selection, root } = require("scenegraph");

Vue.mixin({
    methods: {
        debounce(fn, delay) {
            let timeoutID = null;
            return function () {
                clearTimeout(timeoutID);
                let args = arguments;
                let that = this;
                timeoutID = setTimeout(function () {
                    fn.apply(that, args);
                }, delay);
            };
        },
    }
})

function show() {
    store.dispatch("updateConnection")
    store.dispatch("setSelection", selection);
    store.dispatch("setRoot", root);

    document.createElement('body');
    document.body.innerHTML = `<panel id="plugin"></panel>`

    const app = new Vue({
        el: "#plugin",
        store,
        style,
        router,
        components: { App },
        render(h) {
            return h(App)
        },
    })
}


function update(selection, root) {
    store.dispatch("setSelection", selection);
    store.dispatch("setRoot", root);
    store.dispatch("setUpdateFlag");
}


module.exports = {
    panels: {
        marpipe: {
            show,
            update
        }
    }
};