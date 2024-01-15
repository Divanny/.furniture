<template>
  <div class="navbar-container flex justify-content-between p-3 mb-2">
    <!-- LOGO -->
    <router-link to="/">
      <div class="logo" />
    </router-link>
    <!-- SEARCH BAR -->
    <div class="search-bar w-6 flex align-items-center">
      <AutoComplete v-model="selectedCountry" style="" size="small" optionLabel="name" class="w-full" :suggestions="filteredCountries" @complete="search" />
      <Button icon="pi pi-search" @click="" severity="secondary" class="text-black-alpha-90 mx-2 py-2 px-0 text-xs" style="height: 2rem;" size="small" text  />
    </div>
    <!-- ITEMS -->
    <div class="d-flex">
      <Button size="large" icon="pi pi-truck" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded
        aria-label="Bookmark" />
      <Button size="large" icon="pi pi-user" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded
        aria-label="Bookmark" />
      <Button size="large" icon="pi pi-heart" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded
        aria-label="Bookmark" />
      <Button size="large" icon="pi pi-shopping-bag" @click="cartSidebar = true" severity="secondary"
        class="text-black-alpha-90 mx-1 rounded-5" text rounded aria-label="Bookmark" />
    </div>
    <Sidebar v-model:visible="cartSidebar" position="right">
      <template #header>
        <span class="inline-flex align-items-center gap-2">
          <span class="text-black-alpha-90 font-bold text-xl pi pi-shopping-bag"></span>
          <span class="text-black-alpha-90 font-bold text-xl">Mi Carrito</span>
        </span>
      </template>
      <div class="flex flex-column h-full">
        <div class="overflow-y-auto">
          <div
            class="border-1 mb-3 border-round-sm p-2 border-200 shadow-1 hover:shadow-none hover:surface-100 transition-duration-150 transition-colors p-ripple cursor-pointer flex flex-wrap gap-2 justify-content-start"
            rounded>
            <div :style="{ backgroundImage: `url(${('/src/assets/empty-img.png')})` }" class="cart-product" />
            <div class="cart-product-summary" style="max-width:60%; height: 90px">
              <div class="text-sm	mt-1 font-semibold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                Producto Nombre asdsadsa dsad sasadsadsadsa
              </div>
              <div class="text-md	mt-2 font-bold white-space-nowrap overflow-hidden text-overflow-ellipsis">
                $80.2DOP
              </div>
              <div class="flex text-xs cart-quantity justify-content-between" style="margin-top: 15px">
                <InputNumber v-model="value" size="small" inputStyle="font-size: 0.75rem; padding: 0px;" :min="1"
                  :max="100" showButtons buttonLayout="horizontal" decrementButtonClassName="cart-quantity"
                  incrementButtonClassName="cart-quantity">
                  <template #incrementbuttonicon>
                    <span class="pi pi-plus" />
                  </template>
                  <template #decrementbuttonicon>
                    <span class="pi pi-minus" />
                  </template>
                </InputNumber>
                <Button icon="pi pi-trash" size="small" style="padding: 0px 12px" severity="danger" outlined />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-auto">
          <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
          <div class="w-full px-3">
            <div class="flex justify-content-between mb-2">
              <div class="text-base text-black-alpha-90 font-bold">Total:</div>
              <div class="text-lg text-black-alpha-90 font-bold">$4965DOP</div>
            </div>
            <Button v-ripple label="Proceder al Pago" class="w-full mt-2 hover:teal-100 transition-duration-150 transition-colors p-ripple" />
          </div>
        </div>
      </div>

    </Sidebar>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      cartSidebar: false
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {}
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