<template>
<div class="p-4">
  <div class="flex justify-content-between align-items-center">
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
    <div class="col-12 p-0">
      <div v-if="pedidos.length == 0" class=""><div class="flex justify-content-start gap-2"><div>No existen pedidos.</div><div @click="$router.push('/Productos')" class="text-primary cursor-pointer font-bold underline">Empezar a explorar</div></div></div>
      <div class="border-round border-1 surface-border mb-3" v-for="pedido in pedidos">
        <div class="surface-100	p-3 flex justify-content-between">
          <div class="flex flex-column gap-1">
            <div class="text-sm font-bold text-600">Número de Orden</div>
            <div class="text-sm">{{pedido.idPedido}}</div>
          </div>
          <div class="flex flex-column gap-1">
            <div class="text-sm font-bold text-600">Fecha de la Orden</div>
            <div class="text-sm">{{(pedido.FechaPedido != null) ? formatearFecha(pedido.FechaPedido) : pedido.FechaPedido}}</div>
          </div>
          <div class="flex flex-column gap-1">
            <div class="text-sm font-bold text-600">Costo Total</div>
            <div class="text-sm">${{pedido.Total}}DOP</div>
          </div>
        </div>
        <div class="p-3">
          <div v-for="producto in pedido.Productos">
            <div class="flex flex-column xl:flex-row xl:align-items-start px-4 py-3 gap-4">
              <div class="relative w-full sm:w-16rem xl:w-14rem block xl:block mx-auto border-round">
                  <div :style="{ backgroundImage: `url(${($store.state.storageUrl + producto.idProducto + '.png')})` }" class="border-round-3xl h-10rem w-full bg-cover bg-no-repeat bg-center" />
                  <div class="absolute top-0 right-0 m-2 cart-quantity">
                      <FavoriteComponent :idProducto="producto.idProducto" :id="1"/>
                  </div>
              </div>
              <div class="flex flex-column sm:flex-row justify-content-between align-items-start xl:align-items-start flex-1 gap-4 h-9rem my-2">
                <div class="flex flex-column align-items-center sm:align-items-start gap-1 h-full">
                    <div>
                        <div class="text-2xl mb-1 font-bold text-700 cursor-pointer" @click="$router.push(`/Producto/${producto.idProducto}`)">{{ producto.NombreProducto }}</div>
                        <div class="flex align-items-center justify-content-start gap-2">
                            <i :class="producto.IconoCategoria + ' text-sm'"></i>
                            <div class="font-semibold text-sm"> {{ producto.NombreCategoria }} </div>
                        </div>
                    </div>
                    <div class="mt-auto">
                      <div class="text-700 text-sm font-bold mb-2">Cantidad:</div>
                      <div class="text-700 text-sm font-bold mb-2">{{ producto.Cantidad }}</div>
                    </div>
                </div>
                <div class="flex sm:flex-column align-items-start sm:align-items-end gap-3 sm:gap-2 h-full justify-content-around">
                    <div class="text-2xl font-bold text-700">${{ producto.Precio.toFixed(2) }}DOP</div>
                    <div class="mt-auto flex sm:flex-column align-items-start sm:align-items-end gap-3 sm:gap-2">
                      <Button icon="pi pi-eye" @click="$router.push(`/Producto/${producto.idProducto}`)" class="p-0 w-2rem h-2rem mt-auto bg-white text-black-alpha-80 font-bold border-1" severity="secondary" size="small" rounded></Button>
                      <Button v-if="$store.state.cartProducts.some(x => x.idproducto == producto.idProducto)" @click="removeToCart(producto)" icon="pi pi-shopping-bag" class="p-0 w-2rem h-2rem" v-tooltip.top="'Retirar del carrito'" size="small" rounded :disabled="0 == 0"></Button>
                      <Button v-else icon="pi pi-shopping-bag" @click="addToCart(producto)" class="p-0 w-2rem h-2rem" v-tooltip.top="'Agregar al carrito'" size="small" rounded outlined :disabled="producto.Disponible == 0"></Button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      pedidos: [],
      itemsBread: [ {label: "Mi cuenta" }, {label: "Mis Pedidos", route: '/Pedidos'} ],
    }
  },
  created() {
  },
  watch: {

  },
  mounted() {
    this.loadPedidos();
  },
  methods: {
    formatearFecha(fechaRaw) {
      const fechaFormateada = new Date(fechaRaw);

      const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        hour12: false, // Usar formato de 24 horas
      };

      const formateadorFecha = new Intl.DateTimeFormat('es-ES', opciones);

      return formateadorFecha.format(fechaFormateada);
    },
    async loadPedidos() {
      let { data, error } = await supabase.rpc('loadPedidos').order('FechaPedido', { ascending: false })
      this.pedidos = data;
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
    async changeCantidad(item) {
      const { data, error } = await supabase
        .from('ProductosCarrito')
        .update({ Cantidad: item.cantidad })
        .eq('idProductoCarrito', item.idproductocarrito)
        .select()

      if (error) push.error(error.message);
    },
  }
};
</script>