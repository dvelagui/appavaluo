import { getAuth } from "firebase/auth";

const userIsAuthenticated = async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    next();
  } else {
    next("/");
  }
};
const requireAuth = (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    next("/inicio-sesion"); // Redirige a login si no está autenticado
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        beforeEnter: requireAuth,
      },
      {
        path: "/inicio-sesion",
        component: () => import("pages/LoginPage.vue"),
        beforeEnter: userIsAuthenticated,
      },
      {
        path: "/registro",
        component: () => import("pages/RegisterPage.vue"),
        beforeEnter: userIsAuthenticated,
      },
      {
        path: "/mi-cuenta",
        component: () => import("pages/UserProfile.vue"),
        beforeEnter: requireAuth,
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
