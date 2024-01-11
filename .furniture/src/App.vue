<template>
  <div class="mx-0 lg:mx-8">
    <div class="mx-0 xl:mx-8">
      <NavbarComponent/>
      <RouterView />
      <ScrollTop />
    </div>
  </div>
</template>
<script setup>
import NavbarComponent from "./layout/NavbarComponent.vue";
</script>

<style>
body {
  margin: 0;
}
</style>