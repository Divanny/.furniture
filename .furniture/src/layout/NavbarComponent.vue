<template>
  <div class="navbar-container d-flex justify-content-between p-3">
    <div class="logo" />
    <div class="d-flex">
      <Button icon="pi pi-truck" severity="secondary" class="text-black mx-1 rounded-5" text rounded aria-label="Bookmark" />
      <Button icon="pi pi-user" severity="secondary" class="text-black mx-1 rounded-5" text rounded aria-label="Bookmark" />
      <Button icon="pi pi-heart" severity="secondary" class="text-black mx-1 rounded-5" text rounded aria-label="Bookmark" />
      <Button icon="pi pi-shopping-bag" severity="secondary" class="text-black mx-1 rounded-5" text rounded aria-label="Bookmark" />
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
  background-image: url("assets/logo-black.png");
}
</style>

<script>
export default {
};
</script>