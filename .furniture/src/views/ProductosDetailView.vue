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
    <div :style="{ backgroundImage: `url(${($store.state.storageUrl + producto.idProducto + '.png')})` }" class="col-12 md:col-6 border-round-3xl h-28rem bg-cover bg-no-repeat bg-center">    </div>
    <div class="col flex flex-column">
      <div class="flex justify-content-between align-items-center">
        <div>
          <div class="text-xl font-bold">{{ producto.NombreProducto }}</div>
        </div>
        <div class="text-2xl font-bold">${{ (producto.Precio) ? producto.Precio.toFixed(2) : '0' }}DOP</div>
      </div>
      <div class="flex align-items-center justify-content-start gap-2 mb-3 mt-1">
        <i :class="producto.Categoria.Icono + ' text-sm'"></i>
        <div class="font-semibold text-sm">{{ producto.Categoria.NombreCategoria }}</div>
      </div>
      <Rating :modelValue="producto.Valoracion" readonly class="my-2" :cancel="false"></Rating>
      <div class="text-base my-4">{{ producto.Descripcion }}</div>
      <div class="my-3">
        <div class="text-base font-bold mb-4">Cantidad:</div>
        <div class="w-2rem">
          <InputNumber v-model="cantidad" size="small" class="cantidad-producto" showButtons buttonLayout="horizontal" style="width: 20%" :min="1" :max="producto.Disponible" decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary">
            <template #incrementbuttonicon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>
        </div>
        <InlineMessage class="my-2" v-if="producto.Disponible == 0" severity="error">No está disponible</InlineMessage>
        <InlineMessage class="my-2" v-else-if="producto.Disponible <= 10" severity="warn">Solo quedan <b>{{ producto.Disponible }}</b> disponibles</InlineMessage>
      </div>
      <div class="mt-auto">
        <hr class="mb-3 border-top-1 border-none surface-border" />
        <Button severity="primary" v-tooltip.top="'Retirar del carrito'" v-if="$store.state.cartProducts.some(x => x.idproducto == producto.idProducto)" :disabled="true" class="w-full mt-2 transition-duration-150 transition-colors justify-content-center" @click="addToCart(producto)">
          <i class="pi pi-shopping-bag mx-2" />Agregar al carrito
        </Button>
        <Button severity="primary" v-else class="w-full mt-2 transition-duration-150 transition-colors justify-content-center" @click="addToCart(producto)">
          <i class="pi pi-shopping-bag mx-2" />Agregar al carrito
        </Button>
      </div>
    </div>
  </div>
</div>
</template>

<style>
.cantidad-producto .p-input-text{
  width: 60px !important;
}
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
      idProducto: null,
      producto: {},
      home: {
        icon: 'pi pi-home',
        route: '/'
      },
      busqueda: null,
      itemsBread: [],
      cantidad: 1,
    }
  },
  created() {
    this.idProducto = this.$route.params.idProducto;
    this.loadProduct();    
  },
  watch: {
    '$route.params.idProducto': function(newQ, oldQ) {
      this.idProducto = newQ || null;
      this.loadProduct();
    }
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
    async loadProduct() {
      let { data: Producto, error } = await supabase
        .from('Productos')
        .select(`
                    *,
                    Categoria (
                        NombreCategoria,
                        Icono
                    )
                `)
        .eq("idProducto", this.idProducto)
        .single()

      if (error) push.error(error.message);
      else { 
        this.producto = Producto; 
        this.itemsBread = [
          { label: 'Productos' }, 
          { label: Producto.NombreProducto, route: this.$router.options.history.state.current }, 
        ]
      }
    },
  }
};
</script>