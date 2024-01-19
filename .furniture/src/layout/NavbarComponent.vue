<template>
  <div class="navbar-container flex justify-content-between p-3 mb-2">
    <!-- LOGO -->
    <router-link to="/">
      <div class="logo" />
    </router-link>
    <!-- SEARCH BAR -->
    <div class="search-bar w-6 flex align-items-center">
      <AutoComplete optionLabel="NombreProducto" placeholder="Buscar productos..."  @keyup.enter="search()" v-model="busqueda" style="" size="small" class="w-full" :suggestions="productosFiltrados" @complete="searchSuggestion">
        <template #option="slotProps">
          <div class="flex align-options-center">
              <img :src="$store.state.storageUrl + slotProps.option.idProducto + '.png'" :class="`mr-2`" style="width: 20px" />
              <div class="text-sm">{{ slotProps.option.NombreProducto }}</div>
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
      <ProfileButton />
      <Button size="large" @click="openFavorites()" icon="pi pi-heart" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded />
      <Button size="large" @click="openCart()" v-badge="2" icon="pi pi-shopping-bag p-overlay-badge" severity="secondary"
      class="text-black-alpha-90 mx-1 rounded-5" text rounded />
    </div>
    <!-- CARRITO -->
    <Sidebar v-model:visible="cartSidebar" position="right">
      <template #header>
        <span class="inline-flex align-items-center gap-2">
          <span class="text-black-alpha-90 font-bold text-xl pi pi-shopping-bag"></span>
          <span class="text-black-alpha-90 font-bold text-xl">Mi Carrito</span>
        </span>
      </template>
      <div class="flex flex-column h-full">
        <div class="overflow-y-auto">
          <div v-if="$store.state.cartProducts.length == 0" class=""><div class="flex justify-content-start gap-2 flex-wrap"><div>No existen productos en el carrito.</div><div @click="goToShop()" class="text-primary cursor-pointer font-bold underline">Empezar a explorar</div></div></div>
          <div v-for="item in $store.state.cartProducts"
            class="border-1 mb-3 border-round-sm p-2 border-200 shadow-1 hover:shadow-none hover:surface-100 transition-duration-150 transition-colors cursor-pointer flex flex-wrap gap-2 justify-content-start"
            rounded>
            <div :style="{ backgroundImage: `url(${($store.state.storageUrl + item.idproducto + '.png')})` }" class="cart-product" />
            <div class="cart-product-summary" style="width:60%; height: 90px">
              <div class="text-sm	mt-1 font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                {{ item.nombreproducto }}
              </div>
              <div class="text-md	mt-2 font-bold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                ${{ item.precio }}DOP
              </div>
              <div class="flex text-xs cart-quantity justify-content-between" style="margin-top: 15px">
                <InputNumber v-model="item.cantidad" @input="changeCantidad(item)" size="small" inputStyle="font-size: 0.75rem; padding: 0px;" :min="1"
                  :max="100" showButtons buttonLayout="horizontal" decrementButtonClassName="cart-quantity"
                  incrementButtonClassName="cart-quantity">
                  <template #incrementbuttonicon>
                    <span class="pi pi-plus" />
                  </template>
                  <template #decrementbuttonicon>
                    <span class="pi pi-minus" />
                  </template>
                </InputNumber>
                <Button icon="pi pi-trash" @click="removeToCart(item)" size="small" style="padding: 0px 12px" severity="danger" outlined />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-auto">
          <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
          <div class="w-full px-3">
            <div class="flex justify-content-between mb-2">
              <div class="text-base text-black-alpha-90 font-bold">Total:</div>
              <div class="text-lg text-black-alpha-90 font-bold">
                ${{ $store.state.cartProducts.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2) }}DOP
              </div>
            </div>
            <Button label="Proceder al Pago" @click="goToPay()" class="w-full mt-2 hover:teal-100 transition-duration-150 transition-colors" />
          </div>
        </div>
      </div>

    </Sidebar>
    <!-- FAVORITOS -->
    <Sidebar v-model:visible="favoriteSidebar" position="right">
      <template #header>
        <span class="inline-flex align-items-center gap-2">
          <span class="text-black-alpha-90 font-bold text-xl fa-solid fa-heart"></span>
          <span class="text-black-alpha-90 font-bold text-xl">Mis Favoritos</span>
        </span>
      </template>
      <div class="flex flex-column h-full">
        <div class="overflow-y-auto">
          <div v-if="$store.state.favoritesProducts.length == 0" class=""><div class="flex justify-content-start gap-2 flex-wrap"><div>No existen productos en favoritos.</div><div @click="goToShop()" class="text-primary cursor-pointer font-bold underline">Empezar a explorar</div></div></div>
          <div v-for="item in $store.state.favoritesProducts"
            class="border-1 mb-3 border-round-sm p-2 border-200 shadow-1 hover:shadow-none hover:surface-100 transition-duration-150 transition-colors cursor-pointer flex flex-wrap gap-2 justify-content-start"
            rounded>
            <div :style="{ backgroundImage: `url(${($store.state.storageUrl + item.idProducto + '.png')})` }" class="cart-product" />
            <div class="cart-product-summary" style="max-width:60%; height: 90px">
              <div class="text-sm	mt-1 font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                {{ item.NombreProducto }}
              </div>
              <div class="text-md	mt-1 font-bold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                ${{ item.Precio.toFixed(2) }}DOP
              </div>
              <div class="flex text-xs cart-quantity justify-content-start gap-2 mt-3">
                <Button @click="removeToCart(item)" v-if="$store.state.cartProducts.some(x => x.idproducto == item.idProducto)"  icon="pi pi-shopping-bag" size="small" style="padding: 4px 14px" severity="primary" />
                <Button @click="addToCart(item)" v-else icon="pi pi-shopping-bag" size="small" style="padding: 4px 14px" outlined severity="primary" />
                <Button icon="fa-solid fa-heart" size="small" style="padding: 4px 14px" severity="secondary" @click="removeFavorite(item.idProducto)" />
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
import ProfileButton from './ProfileButton.vue';

export default {
  components: {ProfileButton},
  data() {
    return {
      cartSidebar: false,
      favoriteSidebar: false,
      busqueda: null,
      productos: [],
      productosFiltrados: [],
      favoriteProducts: [],
      cartProducts: [],
      itemsProfileMenu: [
          {
              label: 'Administrar productos',
              icon: 'pi pi-cog'
          },
          {
              label: 'Refresh',
              icon: 'pi pi-refresh'
          },
          {
              label: 'Cerrar sesión',
              icon: 'pi pi-sign-out'
          }
      ]
    }
  },
  created() {
    this.loadProducts();
    this.loadFavoriteProducts();
    this.loadCarrito();
  },
  methods: {
    goToShop() {
      this.$router.push('/Productos');
      this.cartSidebar = false;
      this.favoriteSidebar = false;
    },
    goToPay() {
      this.$router.push('/Pago');
      this.cartSidebar = false;
      this.favoriteSidebar = false;
    },
    searchSuggestion(event) {
      if (!event.query.trim().length) {
        this.productosFiltrados = [...this.productos];
      } else {
        this.productosFiltrados = this.productos.filter((producto) => {
            return producto.NombreProducto.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }
    },
    async addToCart(Producto) {
        let { data: Carritos, error } = await supabase
        .from('Carritos')
        .select('idCarrito')
        .eq('Activo', true)
        .single()

        if (error) {
            push.error(error.message)
        }
        else {           
            const { data, error } = await supabase
            .from('ProductosCarrito')
            .insert([
                { idProducto: Producto.idProducto, idCarrito: Carritos.idCarrito, Precio: Producto.Precio, Cantidad: 1 },
            ])
            .select()

            if (error) {
                push.error(error.message)
            }
            else {
                this.$store.dispatch('fetchCart');
                push.success(`Se ha agregado "${Producto.NombreProducto}" al carrito`)
            }
        }
    },
    async removeToCart(Producto) {
        let { data: Carritos, error } = await supabase
        .from('Carritos')
        .select('idCarrito')
        .eq('Activo', true)
        .single()

        if (error) {
            push.error(error.message)
        }
        else {            
            const { error } = await supabase
            .from('ProductosCarrito')
            .delete()
            .eq('idProducto', Producto.idProducto || Producto.idproducto)
            .eq('idCarrito', Carritos.idCarrito)

            if (error) {
                push.error(error.message)
            }
            else {
                this.$store.dispatch('fetchCart');
                push.success(`Se ha retirado "${Producto.NombreProducto || Producto.nombreproducto}" del carrito`)
            }
        }
    },
    async loadFavoriteProducts() {
      this.$store.dispatch('fetchFavorites');
    },
    async loadCarrito() {
      this.$store.dispatch('fetchCart');
    },
    async changeCantidad(item) {
      const { data, error } = await supabase
        .from('ProductosCarrito')
        .update({ Cantidad: item.cantidad })
        .eq('idProductoCarrito', item.idproductocarrito)
        .select()

      if (error) push.error(error.message);
    },
    async removeFavorite(idProducto) {
      const { error } = await supabase
      .from('Favoritos')
      .delete()
      .eq('idProducto', idProducto)

      if (error) push.error(error.message);
      else this.$store.dispatch('fetchFavorites');
    },  
    async loadProducts() {
      let { data: Productos, error } = await supabase
            .from('Productos')
            .select("idProducto, NombreProducto")
      if (Productos) {
        this.productos = Productos;
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
        this.$router.push('/Pedidos')
      }
    },
    async openProfile(event) {
      let authenticated = await this.validateSession();
      if (!authenticated) {
        this.$router.push('/SignIn');
        return;
      } 
      else {
        this.$refs.menu[0].toggle(event)
      }
    },
    async openFavorites() {
      let authenticated = await this.validateSession();
      if (!authenticated) {
        this.$router.push('/SignIn');
        return;
      } 
      else {
        this.$store.dispatch('fetchFavorites');
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
        this.$store.dispatch('fetchCart');
        this.cartSidebar = true;
      }
    },
    search() {
      if (this.busqueda == ''){
        this.$router.push({ path: `/Productos` })
      }
      else {
        console.log(this.busqueda);
        this.$router.push({ path: `/Productos`, query: { q: this.busqueda.NombreProducto } })
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