import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductosView from '../views/ProductosView.vue'
import ProductosDetailView from '../views/ProductosDetailView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/Productos',
      name: 'Productos',
      component: ProductosView,
      props: (route) => ({ q: route.query.q || null })
    },
    {
      path: '/SignIn',
      name: 'SignIn',
      component: LoginView
    },
    {
      path: '/SignUp',
      name: 'SignUp',
      component: RegisterView
    },
    {
      path: '/Producto/:idProducto',
      name: 'ProductosDetail',
      component: ProductosDetailView,
      props: true
    },
  ]
})

export default router
