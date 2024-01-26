<template>
  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
        <Notifications :item="item" :theme="pastelTheme" />
    </NotivueSwipe>
  </Notivue>
  <div class="app-layout">
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
import { onMounted, onBeforeUnmount } from 'vue';
import NavbarComponent from "./layout/NavbarComponent.vue";
import FooterComponent from "./layout/FooterComponent.vue";
import { Notivue, Notifications, NotivueSwipe, pastelTheme, push } from 'notivue'
import { useStore } from 'vuex';

const store = useStore();

const handleResize = () => {
  store.commit('setIsMobile', window.innerWidth <= 768);
};

// Initial check and setup on component mount
const setupMobileCheck = () => {
  handleResize();
  window.addEventListener('resize', handleResize);
};

// Cleanup when component is unmounted
const cleanupMobileCheck = () => {
  window.removeEventListener('resize', handleResize);
};

// Call the setup function when the component is mounted
onMounted(() => {
  setupMobileCheck();
});

// Call the cleanup function when the component is unmounted
onBeforeUnmount(() => {
  cleanupMobileCheck();
});
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