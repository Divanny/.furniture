import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-purple/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css';
const app = createApp(App)

app.use(router)
app.use(PrimeVue);

app.mount('#app')
