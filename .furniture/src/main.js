import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'https://kit.fontawesome.com/41f61d2cb3.js'
const app = createApp(App)

app.use(router)
app.use(PrimeVue);

app.mount('#app')
