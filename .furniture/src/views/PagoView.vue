<template>
<div class="p-4">
  <div class="flex justify-content-between">
    <Breadcrumb :home="home" :model="itemsBread" class="p-1 align-items-center border-0">
      <template #item="{ item, props }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :href="href" v-bind="props.action" @click="navigate">
                  <span :class="[item.icon, 'text-color']" />
                  <span class="text-primary font-semibold">{{ item.label }}</span>
              </a>
          </router-link>
          <a v-else :href="item.url" :target="item.target" v-bind="props.action">
              <span class="text-color">{{ item.label }}</span>
          </a>
      </template>
    </Breadcrumb>
    <Button label="Volver" @click="$router.go(-1)" text class="mx-3" size="small" severity="secondary" icon="fa-solid fa-arrow-left" />
  </div>
  <div class="grid my-4 gap-4">
    <div class="col-12 md:col-8">

    </div>
    <div class="col flex flex-column border-1 border-round surface-border p-0">
      <div class="p-4">
        <div class="font-bold mb-3">Resumen</div>
        <div class="flex justify-content-between">
          <div class="text-sm">Artículos:</div>
          <div class="text-sm">{{ $store.state.cartProducts.reduce((total, item) => total + item.cantidad, 0) }}</div>
        </div>
        <hr class="my-3 mx-0 border-top-1 border-none surface-border" />
        <div class="text-2xl font-bold my-2 mb-5">Resumen Pedido</div>
        <div class="flex justify-content-between my-3">
          <div class="text-700 font-bold text-sm">Artículos</div>
          <div class="text-700 font-bold text-sm">${{ $store.state.cartProducts.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2) }}DOP</div>
        </div>
        <hr class="my-1 mx-0 border-top-1 border-none" />
        <div class="flex justify-content-between my-3">
          <div class="text-700 font-bold">Total incl. impuestos</div>
          <div class="text-700 font-bold text-lg">${{ $store.state.cartProducts.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2) }}DOP</div>
        </div>
        <Button label="Tramitar pedido" @click="{ $router.push('/Pago'); cartSidebar = false } " class="w-full my-4 hover:teal-100 transition-duration-150 transition-colors" />
      </div>
      <div class="surface-100	p-4">
        <div class="text-700 font-bold text-sm"><i class="fa-solid fa-lock mr-3"></i>  Pago 100% seguro (Seguridad SSL)</div>
      </div>
    </div>
  </div>
</div>
</template>

<style>

</style>
<script>
import supabase from '../lib/supabaseClient'
import { push } from 'notivue'
import FavoriteComponent from '@/layout/FavoriteComponent.vue';

export default {
  components: {
    FavoriteComponent
  },
  data() {
    return {
      home: {
        icon: 'pi pi-home',
        route: '/'
      },
      itemsBread: [ {label: "Proceder pago", route: '/Pago'}],
    }
  },
  created() {
  },
  watch: {

  },
  mounted() {
  },
  methods: {
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
                { idProducto: Producto.idProducto, idCarrito: Carritos.idCarrito, Precio: Producto.Precio, Cantidad: this.cantidad },
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
  }
};
</script>