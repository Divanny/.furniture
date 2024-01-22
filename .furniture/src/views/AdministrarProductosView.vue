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
    <Column bodyStyle="text-align:center">
      <template #body="slotProps">
        <Button size="small" icon="pi pi-pencil" @click="editProduct(slotProps.data)" text rounded severity="secondary"></Button>
      </template>
    </Column>
  </DataTable>

  <Dialog v-model:visible="formDialog" :style="{width: '450px'}" header="Detalle Producto" :modal="true" class="p-fluid">
      <div v-if="product.idProducto" :style="{ backgroundImage: `url(${($store.state.storageUrl + product.idProducto + '.png')})` }" class="border-round-3xl h-15rem w-full bg-cover bg-no-repeat bg-center" />
      <div class="field">
          <label for="name">Nombre</label>
          <InputText id="name" v-model.trim="product.NombreProducto" required="true" autofocus :class="{'p-invalid': submitted && !product.NombreProducto}" />
          <small class="p-error" v-if="submitted && !product.NombreProducto">Nombre del producto es requerido.</small>
      </div>
      <div class="field">
          <label for="description">Descripción</label>
          <Textarea id="description" autoResize v-model="product.Descripcion" required="true" rows="3" cols="20" />
      </div>

      <div class="field">
        <label for="inventoryStatus" class="mb-3">Categoría</label>
        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
          <template #value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
                            <Tag :value="slotProps.value.value" :severity="getStatusLabel(slotProps.value.label)" />
                        </div>
                        <div v-else-if="slotProps.value && !slotProps.value.value">
                            <Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value)" />
                        </div>
            <span v-else>
              {{slotProps.placeholder}}
            </span>
          </template>
        </Dropdown>
      </div>

      <div class="formgrid grid">
          <div class="field col">
              <label for="price">Precio</label>
              <InputNumber id="price" v-model="product.Precio" mode="currency" currency="DOP" locale="es-DO" />
          </div>
          <div class="field col">
              <label for="quantity">Cantidad</label>
              <InputNumber id="quantity" v-model="product.Disponible" integeronly />
          </div>
      </div>
      <template #footer>
          <Button label="Cancelar" size="small" icon="pi pi-times my-2" text @click="hideDialog()"/>
          <Button label="Guardar" size="small" icon="pi pi-check" text @click="saveProduct()" />
      </template>
  </Dialog>
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
      products: [],
      product: {},
      formDialog: false,
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
    editProduct(producto) {
      this.product = producto;
      this.formDialog = true;
    },
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

      if (error) push.error(error.message);
      else this.products = Productos;
    }
  }
};
</script>