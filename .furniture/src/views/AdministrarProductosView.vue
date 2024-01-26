<template>
<div class="p-4">
  <div class="flex md:justify-content-between flex-wrap justify-content-start">
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
  <Toolbar class="p-2 mt-2">
    <template #start>
        <Button icon="pi pi-plus" size="small" class="mr-2" @click="addProduct()"/>
        <Button icon="fa-solid fa-file-csv" size="small" class="mr-2" @click="exportCSV()" />
    </template>

    <template #end>
        <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText placeholder="Buscar producto..." v-model="filters['global'].value" size="small" />
        </span>
    </template>
</Toolbar>
  <DataTable v-model:filters="filters" :value="products" ref="dt" showGridlines tableStyle="min-width: 50rem" class="my-3" size="small" paginator :rows="15" :rowsPerPageOptions="[10, 15, 20, 50]">
    <template #empty>No se han encontrado registros</template>
    <Column sortable field="idProducto" header="ID Producto"></Column>
    <Column sortable field="NombreProducto" header="Nombre Producto"></Column>
    <Column sortable field="Categoria.NombreCategoria" header="Nombre Categoria"></Column>
    <Column sortable field="Precio" header="Precio">
        <template #body="slotProps">
            ${{ slotProps.data.Precio }}DOP
        </template>
    </Column>
    <Column sortable field="Disponible" header="Disponibilidad"></Column>
    <Column bodyStyle="text-align:center">
      <template #body="slotProps">
        <Button size="small" icon="pi pi-pencil" @click="editProduct(slotProps.data)" text rounded severity="secondary"></Button>
      </template>
    </Column>
  </DataTable>

  <Dialog v-model:visible="formDialog" :style="{width: '450px'}" header="Detalle Producto" :modal="true" class="p-fluid">
      <div v-if="product.idProducto" :style="{ backgroundImage: `url(${($store.state.storageUrl + product.idProducto + `.png?nocache=${Math.random()}`)})` }" class="field border-round-3xl h-15rem w-full bg-cover bg-no-repeat bg-center" />
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
        <label for="categories">Categoría</label>
        <Dropdown id="categories" v-model="product.idCategoria" optionValue="idCategoria" :options="categories" optionLabel="NombreCategoria" placeholder="Seleccione una categoria"/>
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
      <div class="field">
        <label for="image">Imagen</label>
        <FileUpload id="image" class="w-full" mode="basic" name="demo[]" @select="product.Imagen = $event.files[0]" chooseLabel="Elegir imagen del producto" accept="image/png" customUpload />
      </div>
      <template #footer>
        <Button label="Cancelar" size="small" icon="pi pi-times" text @click="hideDialog()"/>
        <Button label="Guardar" size="small" icon="pi pi-check" text @click="saveProduct()" />
      </template>
  </Dialog>
</div>
<ConfirmPopup />

</template>

<style>
.p-datatable.p-datatable-gridlines .p-datatable-thead > tr > th:last-child {
  border-radius: 0px 10px 0px 0px;
}
.p-datatable.p-datatable-gridlines .p-datatable-thead > tr > th:first-child {
  border-radius: 10px 0px 0px 0px;
}
.p-datatable.p-datatable-gridlines .p-datatable-tbody > tr:last-child > td:first-child {
  border-radius: 0px 0px 0px 10px;
}
.p-datatable.p-datatable-gridlines .p-datatable-tbody > tr:last-child > td:last-child {
  border-radius: 0px 0px 10px 0px;
}
</style>
<script>
import supabase from '../lib/supabaseClient'
import { push } from 'notivue'
import FavoriteComponent from '@/layout/FavoriteComponent.vue';
import ConfirmPopup from 'primevue/confirmpopup';
import { FilterMatchMode } from 'primevue/api';

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
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      },
      itemsBread: [ {label: "Administración"}, {label: "Administrar Productos", route: '/AdministrarProductos'} ],
      products: [],
      product: {},
      categories: [],
      formDialog: false,
    }
  },
  created() {
  },
  watch: {

  },
  mounted() {
    this.loadProducts();
    this.loadCategories();
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    addProduct() {
      this.product = {};
      this.formDialog = true;
    },
    editProduct(producto) {
      this.product = producto;
      this.formDialog = true;
    },
    hideDialog (){
      this.formDialog = false;
      this.product = {};
    },
    async saveProduct() {
      if (this.product.idProducto) {
        // Editar Producto
        const editar = await supabase
          .from('Productos')
          .update({ 
            NombreProducto: this.product.NombreProducto,
            Descripcion: this.product.Descripcion,
            Disponible: this.product.Disponible,
            Precio: this.product.Precio,
            idCategoria: this.product.idCategoria
          })
          .eq('idProducto', this.product.idProducto)
          .select()      
        
        if (editar.error) { push.error(editar.error.message); return }
        else {
          if (this.product.Imagen) {
            const { data, error } = await supabase
              .storage
              .from('productos')
              .update(`${this.product.idProducto}.png`, this.product.Imagen, {
                cacheControl: '3600',
                upsert: false
              })

            if (error && error.statusCode == '404') {
              const nuevoFile = await supabase
              .storage
              .from('productos')
              .upload(`${this.product.idProducto}.png`, this.product.Imagen, {
                cacheControl: '3600',
                upsert: false
              })
              if (nuevoFile.error) { push.error(nuevoFile.error.message); return }
            }
            else if (error) { push.error(error.message); return }
          }
          this.formDialog = false;
          push.success("Producto editado exitosamente");
          this.loadProducts();
        }
      }
      else {
        // Insertar Producto
        if (!this.product.Imagen) {
          push.warning("Debe especificar la imagen para el producto");
          return;
        }

        const insertar = await supabase
          .from('Productos')
          .insert([
            { 
              NombreProducto: this.product.NombreProducto,
              Descripcion: this.product.Descripcion,
              Disponible: this.product.Disponible,
              Precio: this.product.Precio,
              idCategoria: this.product.idCategoria
            },
          ])
          .select()
        if (insertar.error) { push.error(insertar.error.message); return }
        else {
          if (this.product.Imagen) {
            const { data, error } = await supabase
              .storage
              .from('productos')
              .upload(`${insertar.data.idProducto}.png`, this.product.Imagen, {
                cacheControl: '3600',
                upsert: false
              })
            if (error) { push.error(error.message); return }
          }
          this.formDialog = false;
          push.success("Producto registrado exitosamente");
          this.loadProducts();
        }
      }
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
    },
    async loadCategories() {
      let { data: Categoria, error } = await supabase
      .from('Categoria')
      .select('*')

      if (error) push.error(error.message);
      else this.categories = Categoria;
    }
  }
};
</script>