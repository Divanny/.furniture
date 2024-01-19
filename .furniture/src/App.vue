<template>
  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
        <Notifications :item="item" :theme="pastelTheme" />
    </NotivueSwipe>
  </Notivue>
  <div class="app-layout">
    <div class="bg-bluegray-900 text-gray-100 p-2 flex justify-content-between lg:justify-content-center align-items-center flex-wrap">
      <div class="font-bold mr-8">🔥 Hot Deals!</div>
      <div class="align-items-center hidden lg:flex">
          <span class="line-height-3 text-sm">Aprovecha las ofertas de año nuevo.</span>
      </div>
    </div>
    <div class="mx-0 xl:mx-6">
      <div class="mx-0 xl:mx-8">
        <NavbarComponent/>
        <RouterView />
      </div>
    </div>
    <FooterComponent/>
  </div>
  <ScrollTop />
</template>
<script setup>
import NavbarComponent from "./layout/NavbarComponent.vue";
import FooterComponent from "./layout/FooterComponent.vue";
import { Notivue, Notifications, NotivueSwipe, pastelTheme, push } from 'notivue'

</script>

<style>
html {
  min-height: 100%;
  position: relative;
}
body {
  margin: 0;
}
.app-layout {
  margin-bottom: 56px;
}
</style>