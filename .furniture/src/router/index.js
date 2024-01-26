import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductosView from '../views/ProductosView.vue'
import ProductosDetailView from '../views/ProductosDetailView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PagoView from '../views/PagoView.vue'
import PedidosView from '../views/PedidosView.vue'
import AdministrarProductosView from '../views/AdministrarProductosView.vue'
import NotFound from "../views/NotFound.vue";
import supabase from '@/lib/supabaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        authenticated: false,
        administrador: false,
      }
    },
    {
      path: '/Productos',
      name: 'Productos',
      component: ProductosView,
      meta: {
        authenticated: false,
        administrador: false,
      },
      props: (route) => ({ q: route.query.q || null }),
    },
    {
      path: '/SignIn',
      name: 'SignIn',
      component: LoginView,
      meta: {
        authenticated: false,
        administrador: false,
      }
    },
    {
      path: '/SignUp',
      name: 'SignUp',
      component: RegisterView,
      meta: {
        authenticated: false,
        administrador: false,
      }
    },
    {
      path: '/Producto/:idProducto',
      name: 'ProductosDetail',
      component: ProductosDetailView,
      meta: {
        authenticated: false,
        administrador: false,
      },
      props: true
    },
    {
      path: '/Pago',
      name: 'Pago',
      component: PagoView,
      meta: {
        authenticated: true,
        administrador: false,
      }
    },
    {
      path: '/Pedidos',
      name: 'Pedidos',
      component: PedidosView,
      meta: {
        authenticated: true,
        administrador: false,
      }
    },
    {
      path: '/AdministrarProductos',
      name: 'AdministrarProductos',
      component: AdministrarProductosView,
      meta: {
        authenticated: true,
        administrador: true,
      }
    },
    { path: "/:pathMatch(.*)*", name: "404", component: NotFound, authenticated: false, administrador: true },
  ]
})

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession();
  if (to.meta.authenticated) {
    if (!data.session && to.meta.authenticated) {
      return { name: "404" };
    }

    let { data: Administradores } = await supabase
            .from('Administradores')
            .select('*')
            .eq('idUsuario', data.session.user.id)

    if (Administradores.length == 0 && to.meta.administrador) {
      return { name: "404" };
    }
  }
})


export default router
