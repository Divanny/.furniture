<template>
    <div class="grid grid-nogutter surface-section text-800 my-2">
        <div class="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
            <section>
                <span class="text-4xl font-bold">.furniture</span>
                <div class="text-6xl text-primary font-bold mb-3 line-height-1">Organiza la vida a tu manera</div>
                <p class="mt-0 mb-4 text-700 line-height-3">Nuevas ideas, soluciones de organización inteligentes y trucos
                    para decorar tu casa mientras ordenas tus días.</p>
            </section>
        </div>
        <div class="col-12 md:col-6 overflow-hidden">
            <img src="../assets/portrait-home.jpg" alt="Image" class="md:ml-auto block md:h-full"
                style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" />
        </div>
    </div>
    <div class="grid gap-3 m-4">
        <div class="border-round col-12 md:col surface-100 p-4">
            <i class="text-xl fa-solid font-bold  fa-warehouse w-full"></i>
            <div class="my-2 w-full font-bold ">Recoge tu compra</div>
            <div class="text-sm w-full">Compra online y recoge tu compra gratis. En Santo Domingo tienes disponible la
                recogida desde carro.</div>
        </div>
        <div class="border-round col-12 md:col surface-100 p-4">
            <i class="text-xl fa-solid font-bold fa-box-open w-full"></i>
            <div class="my-2 w-full font-bold ">Envío por paquetería</div>
            <div class="text-sm w-full">Compra todos los artículos que quieras y recíbelos en casa por RD$290.</div>
        </div>
        <div class="border-round col-12 md:col surface-100 p-4">
            <i class="text-xl fa-solid font-bold fa-truck w-full"></i>
            <div class="my-2 w-full font-bold ">Servicio de transporte</div>
            <div class="text-sm w-full">Te enviamos tu compra a casa por un pequeño coste adicional.</div>
        </div>
        <div class="border-round col-12 md:col surface-100 p-4">
            <i class="text-xl fa-solid font-bold fa-phone w-full"></i>
            <div class="my-2 w-full font-bold ">Servicio de venta telefónica</div>
            <div class="text-sm w-full">Si necesitas ayuda con tu compra, llámanos al +1 809 567 (4532).</div>
        </div>
    </div>
    <div class="my-4">
        <div class="flex justify-content-between m-2 mt-3 px-6 align-items-center">
            <div class="text-2xl font-bold">Productos Destacados</div>
            <div class="text-sm underline cursor-pointer" @click="this.$router.push('/Productos')">Ver todos</div>
        </div>
        <Carousel :value="trendingProducts" :numVisible="5" :numScroll="1" :responsiveOptions="responsiveOptions" circular
            :autoplayInterval="3000">
            <template #item="slotProps">
                <div class="m-2 border-round-lg	cursor-pointer relative">
                    <div :style="{ backgroundImage: `url(${($store.state.storageUrl + slotProps.data.idProducto + '.png')})` }"
                        class="border-round-3xl h-15rem w-full bg-cover bg-no-repeat bg-center" />
                    <div class="my-2 white-space-nowrap overflow-hidden text-overflow-ellipsis w-16rem">{{
                        slotProps.data.NombreProducto }}</div>
                    <div class="font-bold">${{ slotProps.data.Precio }}DOP</div>
                    <div class="absolute top-0 right-0 m-3 cart-quantity">
                        <FavoriteComponent :idProducto="slotProps.data.idProducto" :id="slotProps.data.idProducto"/>
                    </div>
                </div>
            </template>
        </Carousel>
    </div>
</template>

<script>
import supabase from '../lib/supabaseClient'
import { push } from 'notivue'
import FavoriteComponent from '@/layout/FavoriteComponent.vue';

export default {
    components: { FavoriteComponent },
    data() {
        return {
            trendingProducts: null,
            responsiveOptions: [
                {
                    breakpoint: '1600px',
                    numVisible: 4,
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
    watch: {

    },
    mounted() {
        this.loadTrendindProducts();
    },
    methods: {
        async loadTrendindProducts() {
            let { data, error } = await supabase.rpc('loadProductosMasVendidos')
            console.log(data);
            if (error) {
                push.error(error.message)
            }
            else this.trendingProducts = data;
        },
    }
};
</script>