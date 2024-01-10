<template>
  <div class="container">
    <NavbarComponent/>
    <RouterView />
    <ScrollTop />
  </div>
</template>
<script setup>
import NavbarComponent from "./layout/NavbarComponent.vue";
</script>

<style>
:root {
  font-size: smaller;
}
body {
  margin: 0;
}
</style>