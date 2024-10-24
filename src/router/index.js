import { route } from "quasar/wrappers";
import { createRouter, createWebHistory } from "vue-router";
import { useDatabaseStore } from "src/stores/database";
import { getAuth } from "firebase/auth";
import routes from "./routes";

export default route(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(),
  });

  Router.beforeEach((to, from, next) => {
    const useDatabase = useDatabaseStore(); // Obtén el store del usuario donde almacenas la info de autenticación
    const auth = getAuth();
    const user = auth.currentUser;
    if (to.meta.requiresAuth) {
      if (user) {
        if (
          to.meta.role_admin === useDatabase.userData?.role ||
          to.meta.role === useDatabase.userData?.role
        ) {
          next();
        } else {
          next("/");
        }
      } else {
        next("/inicio-sesion");
      }
    } else {
      next();
    }
  });
  return Router;
});
