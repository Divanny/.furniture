<template>
  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
        <Notifications :item="item" :theme="pastelTheme" />
    </NotivueSwipe>
  </Notivue>
  <div class="bg-bluegray-900 text-gray-100 p-2 flex justify-content-between lg:justify-content-center align-items-center flex-wrap">
      <div class="font-bold mr-8">🔥 Hot Deals!</div>
      <div class="align-items-center hidden lg:flex">
          <span class="line-height-3 text-sm">Libero voluptatum atque exercitationem praesentium provident odit.</span>
      </div>
  </div>
  <div class="mx-0 lg:mx-8">
    <div class="mx-0 xl:mx-8">
      <NavbarComponent/>
      <RouterView />
    </div>
  </div>
  <button @click="push.success('Something good has been pushed!')">Push</button>

  <FooterComponent/>
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
  margin-bottom: 56px;
}
</style>