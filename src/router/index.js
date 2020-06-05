import Vue from "vue";
import VueRouter from "vue-router";
import Chat from "../views/Chat.vue";
import Landing from "../views/Landing.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat
  },
  {
    path: "/profile",
    name: "Profile",
    component: () =>
      import(
        /* webpackChunkName: "ProfilePage" */ "../components/ProfilePage.vue"
      )
  },
  {
    path: "/signin",
    name: "SignIn",
    component: () =>
      import(/* webpackChunkName: "SignIn" */ "../components/SignIn.vue")
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () =>
      import(/* webpackChunkName: "SignUp" */ "../components/SignUp.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
