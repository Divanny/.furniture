<template>
  <div class="navbar-container flex justify-content-between p-3 mb-2">
    <!-- LOGO -->
    <router-link to="/">
      <div class="logo" />
    </router-link>
    <!-- SEARCH BAR -->
    <div class="search-bar w-6 flex align-items-center">
      <AutoComplete placeholder="Buscar productos..." @keyup.enter="search()" v-model="busqueda" style="" size="small" class="w-full" :suggestions="productosFiltrados" @complete="searchSuggestion">
        <template #option="slotProps">
          <div class="flex align-options-center">
              <img src="/src/assets/empty-img.png" :class="`mr-2`" style="width: 20px" />
              <div class="text-sm">{{ slotProps.option }}</div>
          </div>
        </template>
        <template #empty>
          <div class="flex align-options-center">
              <div class="text-sm px-3">No existen sugerencias</div>
          </div>
        </template>
      </AutoComplete>
      <Button icon="pi pi-search" @click="search()" severity="secondary" class="text-black-alpha-90 mx-2 py-2 px-0 text-xs" style="height: 2rem;" size="small" text  />
    </div>
    <!-- ITEMS -->
    <div class="d-flex">
      <Button size="large" @click="openOrders()" icon="pi pi-truck" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded />
      <Button size="large" @click="openProfile()" icon="pi pi-user" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded />
      <Button size="large" @click="openFavorites()" icon="pi pi-heart" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded />
      <Button size="large" @click="openCart()" icon="pi pi-shopping-bag" severity="secondary"
        class="text-black-alpha-90 mx-1 rounded-5" text rounded />
    </div>
    <Sidebar v-model:visible="cartSidebar" position="right">
      <template #header>
        <span class="inline-flex align-items-center gap-2">
          <span class="text-black-alpha-90 font-bold text-xl pi pi-shopping-bag"></span>
          <span class="text-black-alpha-90 font-bold text-xl">Mi Carrito</span>
        </span>
      </template>
      <div class="flex flex-column h-full">
        <div class="overflow-y-auto">
          <div
            class="border-1 mb-3 border-round-sm p-2 border-200 shadow-1 hover:shadow-none hover:surface-100 transition-duration-150 transition-colors cursor-pointer flex flex-wrap gap-2 justify-content-start"
            rounded>
            <div :style="{ backgroundImage: `url(${('/src/assets/empty-img.png')})` }" class="cart-product" />
            <div class="cart-product-summary" style="max-width:60%; height: 90px">
              <div class="text-sm	mt-1 font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                Producto Nombre asdsadsa dsad sasadsadsadsa
              </div>
              <div class="text-md	mt-2 font-bold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                $80.2DOP
              </div>
              <div class="flex text-xs cart-quantity justify-content-between" style="margin-top: 15px">
                <InputNumber v-model="value" size="small" inputStyle="font-size: 0.75rem; padding: 0px;" :min="1"
                  :max="100" showButtons buttonLayout="horizontal" decrementButtonClassName="cart-quantity"
                  incrementButtonClassName="cart-quantity">
                  <template #incrementbuttonicon>
                    <span class="pi pi-plus" />
                  </template>
                  <template #decrementbuttonicon>
                    <span class="pi pi-minus" />
                  </template>
                </InputNumber>
                <Button icon="pi pi-trash" size="small" style="padding: 0px 12px" severity="danger" outlined />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-auto">
          <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
          <div class="w-full px-3">
            <div class="flex justify-content-between mb-2">
              <div class="text-base text-black-alpha-90 font-bold">Total:</div>
              <div class="text-lg text-black-alpha-90 font-bold">$4965DOP</div>
            </div>
            <Button label="Proceder al Pago" class="w-full mt-2 hover:teal-100 transition-duration-150 transition-colors" />
          </div>
        </div>
      </div>

    </Sidebar>
    <Sidebar v-model:visible="favoriteSidebar" position="right">
      <template #header>
        <span class="inline-flex align-items-center gap-2">
          <span class="text-black-alpha-90 font-bold text-xl fa-solid fa-heart"></span>
          <span class="text-black-alpha-90 font-bold text-xl">Mis Favoritos</span>
        </span>
      </template>
      <div class="flex flex-column h-full">
        <div class="overflow-y-auto">
          <div
            class="border-1 mb-3 border-round-sm p-2 border-200 shadow-1 hover:shadow-none hover:surface-100 transition-duration-150 transition-colors cursor-pointer flex flex-wrap gap-2 justify-content-start"
            rounded>
            <div :style="{ backgroundImage: `url(${('/src/assets/empty-img.png')})` }" class="cart-product" />
            <div class="cart-product-summary" style="max-width:60%; height: 90px">
              <div class="text-sm	mt-1 font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                Producto Nombre asdsadsa dsad sasadsadsadsa
              </div>
              <div class="text-md	mt-1 font-bold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                $80.2DOP
              </div>
              <div class="flex text-xs cart-quantity justify-content-start gap-2 mt-3">
                <Button icon="pi pi-shopping-bag" size="small" style="padding: 4px 14px" severity="primary" />
                <Button icon="fa-solid fa-heart" size="small" style="padding: 4px 14px" severity="secondary"  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  </div>
</template>
<script>
import { push } from 'notivue'
import supabase from '../lib/supabaseClient'

export default {
  components: {},
  data() {
    return {
      cartSidebar: false,
      favoriteSidebar: false,
      busqueda: null,
      productos: [],
      productosFiltrados: [],
      favoriteProducts: [],
    }
  },
  watch: {

  },
  mounted() {
    
  },
  created() {
    this.loadProducts();
    this.loadFavoriteProducts();
  },
  methods: {
    searchSuggestion(event) {
      if (!event.query.trim().length) {
        this.productosFiltrados = [...this.productos];
      } else {
        this.productosFiltrados = this.productos.filter((producto) => {
            return producto.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }
    },
    async loadFavoriteProducts() {
      let { data: Productos, error } = await supabase
            .from('Productos')
            .select("*")
      if (Productos) {
        this.favoriteProducts = Productos;
      }
    },
    async loadProducts() {
      let { data: Productos, error } = await supabase
            .from('Productos')
            .select("NombreProducto")
      if (Productos) {
        this.productos = Productos.map(producto => producto.NombreProducto);
      }
    },
    async validateSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) return true;
      else { 
        push.warning("Debe iniciar sesión")
        return false;
      }
    },
    async openOrders() {
      let authenticated = await this.validateSession();
      if (!authenticated) {
        this.$router.push('/SignIn');
        return;
      } 
      else {
        
      }
    },
    async openProfile() {
      let authenticated = await this.validateSession();
      if (!authenticated) {
        this.$router.push('/SignIn');
        return;
      } 
      else {
        
      }
    },
    async openFavorites() {
      let authenticated = await this.validateSession();
      if (!authenticated) {
        this.$router.push('/SignIn');
        return;
      } 
      else {
        this.favoriteSidebar = true;
      }
    },
    async openCart() {
      let authenticated = await this.validateSession();
      if (!authenticated) {
        this.$router.push('/SignIn');
        return;
      } 
      else {
        this.cartSidebar = true;
      }
    },
    search() {
      if (this.busqueda == ''){
        this.$router.push({ path: `/Productos` })
      }
      else {
        this.$router.push({ path: `/Productos`, query: { q: this.busqueda } })
      }
    }
  }
};
</script>
<style>
.navbar-container {
  display: flex;
}

.logo {
  height: 3rem;
  width: 90px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("../assets/logo-black-sm.png");
}

.cart-product {
  height: 90px;
  width: 90px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.cart-quantity {
  margin-top: auto;
  padding: 0px !important;
}

.cart-quantity .pi {
  font-size: x-small !important;
}

.cart-quantity .p-button {
  width: 1rem;
  padding: 0px;
}

.cart-quantity .p-inputtext {
  width: 1.4rem;
  height: 1.5rem;
  text-align: center;
}

.search-bar .p-inputtext {
 width: 100% !important;
 padding: 0.5rem 0.5rem;
 font-size: small;
 background-color: #f5f5f5;
}
</style>