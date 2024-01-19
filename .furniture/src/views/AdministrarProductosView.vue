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
  <DataTable :value="products" showGridlines sortMode="multiple" tableStyle="min-width: 50rem" size="small" paginator :rows="15" :rowsPerPageOptions="[10, 15, 20, 50]">
    <Column key="" field="idProducto" header="ID Producto"></Column>
    <Column key="" field="NombreProducto" header="Nombre Producto"></Column>
    <Column key="" field="Categoria.NombreCategoria" header="Nombre Categoria"></Column>
    <Column key="" field="Precio" header="Precio">
      <template #body="slotProps">
          ${{ slotProps.data.Precio }}DOP
      </template>
  </Column>
    <Column key="" field="Disponible" header="Disponibilidad"></Column>
    <Column bodyStyle="text-align:center"><template #body>
      <Button size="small" icon="pi pi-pencil" text rounded severity="secondary"></Button>
    </template></Column>
  </DataTable>
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
      itemsBread: [ {label: "Administración"}, {label: "Administrar Productos", route: '/AdministrarProductos'} ],
      products: []
    }
  },
  created() {
  },
  watch: {

  },
  mounted() {
    this.loadProducts();
  },
  methods: {
    async loadProducts() {
      let { data: Productos, error } = await supabase
      .from('Productos')
      .select(`
              *,
              Categoria (
                  NombreCategoria,
                  Icono
              )
          `)

      console.log(Productos);
      if (error) push.error(error.message);
      else this.products = Productos;
    }
  }
};
</script>