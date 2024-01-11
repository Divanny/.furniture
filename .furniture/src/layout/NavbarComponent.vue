<template>
  <div class="navbar-container d-flex justify-content-between p-3">
    <div class="logo" />
    <div class="d-flex">
      <Button size="large" icon="pi pi-truck" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded aria-label="Bookmark" />
      <Button size="large" icon="pi pi-user" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded aria-label="Bookmark" />
      <Button size="large" icon="pi pi-heart" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded aria-label="Bookmark" />
      <Button size="large" icon="pi pi-shopping-bag" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded aria-label="Bookmark" />
    </div>
  </div>
</template>

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
</style>

<script>
export default {
};
</script>