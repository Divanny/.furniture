<template>
<div class="pb-2">
    <div v-if="busqueda" class="text-xl font-bold mx-3 my-4">Resultados para "{{ busqueda }}"</div>
    <DataView :value="products" :layout="layout" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
        <template #header>
            <div class="flex justify-content-end">
                <DataViewLayoutOptions v-model="layout" />
            </div>
        </template>
    
        <template #list="slotProps">
            <div class="grid grid-nogutter">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                    <div class="flex flex-column xl:flex-row xl:align-items-start px-4 py-3 gap-4" :class="{ 'border-top-1 surface-border': index !== 0 }">
                        <div class="relative w-full sm:w-16rem xl:w-14rem block xl:block mx-auto border-round">
                            <div :style="{ backgroundImage: `url(${($store.state.storageUrl + item.idProducto + '.png')})` }" class="border-round-3xl h-10rem w-full bg-cover bg-no-repeat bg-center" />
                            <div class="absolute top-0 right-0 m-2 cart-quantity">
                                <FavoriteComponent :idProducto="item.idProducto" :id="item.idProducto"/>
                            </div>
                        </div>
                        <!-- <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name" /> -->
                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 h-9rem my-2">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3 h-full">
                                <div>
                                    <div class="text-2xl mb-1 font-bold text-700 cursor-pointer" @click="$router.push(`/Producto/${item.idProducto}`)">{{ item.NombreProducto }}</div>
                                    <div class="flex align-items-center justify-content-start gap-2">
                                        <i :class="item.Categoria.Icono + ' text-sm'"></i>
                                        <div class="font-semibold text-sm">{{ item.Categoria.NombreCategoria }}</div>
                                    </div>
                                </div>
                                <Rating :modelValue="item.Valoracion" readonly :cancel="false"></Rating>
                                <div class="flex align-items-center gap-3 mt-auto">
                                    <div class="text-xs text-red-500 font-bold" v-if="item.Disponible == 0">No disponible</div>
                                    <div class="text-xs text-green-600 font-bold" v-else-if="item.Disponible > 10">Disponible</div>
                                    <div class="text-xs text-orange-500 font-bold" v-else>Solo quedan {{ item.Disponible }} disponibles</div>
                                </div>
                            </div>
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2 h-full">
                                <div class="text-2xl font-bold text-700">${{ item.Precio.toFixed(2) }}DOP</div>
                                <Button icon="pi pi-eye" @click="$router.push(`/Producto/${item.idProducto}`)" class="p-0 w-2rem h-2rem mt-auto bg-white text-black-alpha-80 font-bold border-1" severity="secondary" size="small" rounded></Button>
                                <Button v-if="$store.state.cartProducts.some(x => x.idproducto == item.idProducto)" @click="removeToCart(item)" icon="pi pi-shopping-bag" class="p-0 w-2rem h-2rem" v-tooltip.top="'Retirar del carrito'" size="small" rounded :disabled="item.Disponible == 0"></Button>
                                <Button v-else icon="pi pi-shopping-bag" @click="addToCart(item)" class="p-0 w-2rem h-2rem" v-tooltip.top="'Agregar al carrito'" size="small" rounded outlined :disabled="item.Disponible == 0"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    
        <template #grid="slotProps">
            <div class="grid grid-nogutter">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                    <div class="m-2 border-round-lg	cursor-pointer relative">
                        <div  @click="$router.push(`/Producto/${item.idProducto}`)">
                            <div :style="{ backgroundImage: `url(${($store.state.storageUrl + item.idProducto + '.png')})` }" class="border-round-3xl h-15rem w-full bg-cover bg-no-repeat bg-center" />
                            <div class="mt-2 font-bold text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis w-full">{{ item.NombreProducto }}</div>
                            <div class="mb-2 mt-1 text-xs white-space-nowrap overflow-hidden text-overflow-ellipsis w-full"><i :class="item.Categoria.Icono + ' text-sm mr-2'"></i>{{ item.Categoria.NombreCategoria }}</div>
                            <div class="font-bold text-base">${{ item.Precio.toFixed(2) }}DOP</div>
                        </div>
                        <div class="absolute top-0 right-0 m-3 cart-quantity">
                            <FavoriteComponent :idProducto="item.idProducto" :id="item.idProducto"/>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #empty><div class="p-3">No se han encontrado resultados</div></template>
    </DataView>
</div>
</template>

<style>
.p-dataview-header {
    background-color: white !important;
    border: 0px !important; 
    padding: 0rem 1rem;
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
        home: {
            icon: 'pi pi-home',
            route: '/'
        },
        busqueda: null,
        items:[
            { label: 'Productos', route: '/Productos' }, 
        ],
        layout: 'grid',
        products: null,
        orderBy: null,
        itemsOrderBy: [
            {label:"Recomendado", value: "rec"},
            {label:"Precio Ascendente", value: "asc"},
            {label:"Precio Descendente", value: "desc"},
            {label:"Más vendido", value: "mv"}
        ],
        responsiveOptions: [
            {
                breakpoint: '1400px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '1199px',
                numVisible: 3,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '575px',
                numVisible: 1,
                numScroll: 1
            }
        ]
    }
  },
  created() {
    this.busqueda = this.$route.query.q || null;
  },
  watch: {
    '$route.query.q': function(newQ, oldQ) {
      this.busqueda = newQ || null;
      this.loadProducts();
    }
  },
  mounted() {
    this.loadProducts();    
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
            .eq('idProducto', Producto.idProducto)
            .eq('idCarrito', Carritos.idCarrito)

            if (error) {
                push.error(error.message)
            }
            else {
                this.$store.dispatch('fetchCart');
                push.success(`Se ha retirado "${Producto.NombreProducto}" del carrito`)
            }
        }
    },
    async loadProducts() {
        if (this.busqueda) {
            let { data, error } = await supabase
            .rpc('searchproduct', {
                texto_busqueda: this.busqueda
            })

            if (error) {
                push.error(error.message)
            }
            else this.products = data;
        }
        else {
            let { data: Productos, error } = await supabase
            .from('Productos')
            .select(`
                    *,
                    Categoria (
                        NombreCategoria,
                        Icono
                    )
                `)
            if (error) push.error(error.message);
            else this.products = Productos;
        }
    },
    getSeverity(status) {
        switch (status) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    }
  }
};
</script>