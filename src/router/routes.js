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
        component: () => import("src/pages/DashboardPage.vue"),
        beforeEnter: requireAuth,
      },
      {
        path: "inicio-sesion",
        component: () => import("pages/LoginPage.vue"),
        beforeEnter: userIsAuthenticated,
      },
      {
        path: "registro",
        component: () => import("pages/RegisterPage.vue"),
        beforeEnter: userIsAuthenticated,
      },
      {
        path: "mi-cuenta",
        component: () => import("pages/UserProfile.vue"),
        beforeEnter: requireAuth,
      },
      {
        path: "agregar-usuario",
        component: () => import("src/components/Admin/Users/AddUser.vue"),
        meta: { requiresAuth: true, role_admin: "admin" },
      },
      {
        path: "solicitud-inspeccion",
        component: () => import("src/pages/RequestInspection.vue"),
        meta: { requiresAuth: true, role_admin: "admin", role: "user" },
      },

      {
        path: "calendario-inspecciones",
        component: () => import("src/pages/InspectionCalendar.vue"),
        meta: { requiresAuth: true, role_admin: "admin", role: "inspector" },
      },
    ],
  },
  {
    path: "/inspector",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/DashboardPage.vue"),
        beforeEnter: requireAuth,
      },
      {
        path: "inicio-sesion",
        component: () => import("pages/LoginPage.vue"),
        beforeEnter: userIsAuthenticated,
      },
      {
        path: "mi-cuenta",
        component: () => import("pages/UserProfile.vue"),
        beforeEnter: requireAuth,
      },
    ],
  },
  ,
  {
    path: "/admin",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/DashboardPage.vue"),
        beforeEnter: requireAuth,
      },
      {
        path: "inicio-sesion",
        component: () => import("pages/LoginPage.vue"),
        beforeEnter: userIsAuthenticated,
      },
      {
        path: "mi-cuenta",
        component: () => import("pages/UserProfile.vue"),
        beforeEnter: requireAuth,
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/inicio-sesion",
  },
];

export default routes;
