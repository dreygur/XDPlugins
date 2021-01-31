import Vue from "vue"
import Router from "vue-router"
import store from "./store/index.js"
import ExperimentPanel from "@/views/ExperimentPanel.vue"
import SignIn from "@/views/SignIn.vue"
import SignUp from "@/views/SignUp.vue"

// Help
import Help from "@/views/Help.vue"
import HelpIndex from "@/component/help/HelpIndex.vue"
import HelpPage from "@/component/help/HelpPage.vue"

const App = require("./App.vue").default;

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Root',
      component: ExperimentPanel,
      meta: { requiresAuth: true }
    },
    {
      path: "/signin",
      name: "Signin",
      component: SignIn
    },
    {
      path: "/signup",
      name: "Signup",
      component: SignUp
    },
    {
      path: "/help",
      component: Help,
      children: [
        {
          path: "",
          name: "HelpIndex",
          component: HelpIndex
        },
        {
          path: ":topic",
          name: "HelpPage",
          component: HelpPage
        }
      ]
    }
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    store
      .dispatch("getUser")
      .then(() => {
        if (store.getters.USER.signed_in) {
          next();
        } else {
          next({
            path: "/signin",
            query: { redirect: to.fullPath }
          });
        }
      })
      .catch(e => console.error(e));
  } else {
    next();
  }
});

export default router;
