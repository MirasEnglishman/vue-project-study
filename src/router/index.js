import { createRouter, createWebHistory } from "vue-router";
import AdminPage from "../views/AdminPage.vue";
import CategoriesPage from "../views/CategoriesPage.vue";
import OrdersPage from "../views/OrdersPage.vue";
import ProductPage from "../views/ProductPage.vue";
import LoginPage from "../views/LoginPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import CartPage from "../views/CartPage.vue";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/categories",
    name: "Categories",
    component: CategoriesPage,
  },
  {
    path: "/orders",
    name: "Orders",
    component: OrdersPage,
  },
  {
    path: "/products",
    name: "Products",
    component: ProductPage,
  },
  { path: "/cart", name: "cart", component: CartPage },
  { path: '/profile', name: 'profile', component: ProfilePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next("/login");
  } else {
    next();
  }
});

export default router;
