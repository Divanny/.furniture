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
    <div class="col-12 md:col-8 p-0">
      <div v-if="$store.state.cartProducts.length == 0" class=""><div class="flex justify-content-start gap-2"><div>No existen productos en el carrito.</div><div @click="$router.push('/Productos')" class="text-primary cursor-pointer font-bold underline">Empezar a explorar</div></div></div>
      <div class="border-1 border-round surface-border mb-2" v-for="item in $store.state.cartProducts">
        <div class="flex flex-column xl:flex-row xl:align-items-start px-4 py-3 gap-4">
          <div class="relative w-full sm:w-16rem xl:w-14rem block xl:block mx-auto border-round">
              <div :style="{ backgroundImage: `url(${($store.state.storageUrl + item.idproducto + '.png')})` }" class="border-round-3xl h-10rem w-full bg-cover bg-no-repeat bg-center" />
              <div class="absolute top-0 right-0 m-2 cart-quantity">
                  <FavoriteComponent :idProducto="item.idproducto" :id="item.idproducto"/>
              </div>
          </div>
          <div class="flex flex-column sm:flex-row justify-content-between align-items-start xl:align-items-start flex-1 gap-4 h-9rem my-2">
            <div class="flex flex-column align-items-center sm:align-items-start gap-1 h-full">
                <div>
                    <div class="text-2xl mb-1 font-bold text-700 cursor-pointer" @click="$router.push(`/Producto/${item.idproducto}`)">{{ item.nombreproducto }}</div>
                    <div class="flex align-items-center justify-content-start gap-2">
                        <i :class="item.iconocategoria + ' text-sm'"></i>
                        <div class="font-semibold text-sm"> {{ item.nombrecategoria }} </div>
                    </div>
                </div>
                <div class="my-3">
                  <div class="text-700 text-sm font-bold mb-2">Cantidad:</div>
                  <div class="w-2rem">
                    <InputNumber v-model="item.cantidad" @input="changeCantidad(item)" size="small" inputStyle="font-size: 1rem; padding: 0px 10px; width: 100px" :min="1"
                    :max="100" showButtons buttonLayout="horizontal" decrementButtonClassName="cart-quantity" incrementButtonClassName="cart-quantity">
                      <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                      </template>
                      <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                      </template>
                    </InputNumber>
                  </div>
                <div class="flex align-items-center gap-3 mt-1">
                    <div class="text-xs text-red-500 font-bold" v-if="item.disponible == 0">No disponible</div>
                    <div class="text-xs text-green-600 font-bold" v-else-if="item.disponible > 10">Disponible</div>
                    <div class="text-xs text-orange-500 font-bold" v-else>Solo quedan {{ item.disponible }} disponibles</div>
                </div>
                </div>
            </div>
            <div class="flex sm:flex-column align-items-start sm:align-items-end gap-3 sm:gap-2 h-full justify-content-around">
                <div class="text-2xl font-bold text-700">${{ item.precio.toFixed(2) }}DOP</div>
                <div class="mt-auto flex sm:flex-column align-items-start sm:align-items-end gap-3 sm:gap-2">
                  <Button icon="pi pi-eye" @click="$router.push(`/Producto/${item.idproducto}`)" class="p-0 w-2rem h-2rem mt-auto bg-white text-black-alpha-80 font-bold border-1" severity="secondary" size="small" rounded></Button>
                  <Button v-if="$store.state.cartProducts.some(x => x.idproducto == item.idproducto)" @click="removeToCart(item)" icon="pi pi-shopping-bag" class="p-0 w-2rem h-2rem" v-tooltip.top="'Retirar del carrito'" size="small" rounded :disabled="0 == 0"></Button>
                  <Button v-else icon="pi pi-shopping-bag" @click="addToCart(item)" class="p-0 w-2rem h-2rem" v-tooltip.top="'Agregar al carrito'" size="small" rounded outlined :disabled="item.disponible == 0"></Button>
                </div>
            </div>
        </div>
        </div>
      </div>
    </div>
    <div class="col flex flex-column p-0">
      <div class="border-1 border-round surface-border">
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
        <Button label="Tramitar pedido" :disabled="$store.state.cartProducts.length == 0" @click="confirmPay($event)" class="w-full mt-4 hover:teal-100 transition-duration-150 transition-colors" />
      </div>
      <div class="surface-100	p-4">
        <div class="text-700 font-bold text-sm"><i class="fa-solid fa-lock mr-3"></i>  Pago 100% seguro (Seguridad SSL)</div>
      </div>
    </div>
  </div>
  </div>
</div>
<ConfirmPopup />

</template>

<style>

</style>
<script>
import supabase from '../lib/supabaseClient'
import { push } from 'notivue'
import FavoriteComponent from '@/layout/FavoriteComponent.vue';
import ConfirmPopup from 'primevue/confirmpopup';

export default {
  components: {
    FavoriteComponent,
    ConfirmPopup
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
    goToPay() {
      
    },
    confirmPay(event) {
      this.$confirm.require({
          target: event.currentTarget,
          message: '¿Está seguro que desea realizar el pedido?',
          icon: 'pi pi-shopping-bag',
          acceptLabel: 'Si',
          accept: async () => {
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
              .from('Pedidos')
              .insert([
                { idCarrito: Carritos.idCarrito, 
                  idUsuario: this.$store.state.authenticated.id, 
                  Total: this.$store.state.cartProducts.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2),
                },
              ])
              .select()

              if (error) push.error(error.message);
              else {
                const carritoActualizado = await supabase
                .from('Carritos')
                .update({ Activo: false })
                .eq('idCarrito', Carritos.idCarrito)
                .select()
          
                if (carritoActualizado.error) {
                  push.error(carritoActualizado.error.message);
                }
                else {
                  const { data, error } = await supabase
                  .from('Carritos')
                  .insert([
                      { idUsuario: this.$store.state.authenticated.id, Activo: true },
                  ])
                  .select()
                  
                  if (error) {
                    push.error(error.message)
                  }
                  else {
                    push.success("Pedido completado exitosamente");
                    this.$store.dispatch('fetchCart');
                    this.$router.push('/Pedidos');
                  }
                }
              }
            }
          }
      });
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