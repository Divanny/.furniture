import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import { createNotivue } from 'notivue'
import BadgeDirective from 'primevue/badgedirective';
import 'notivue/notifications.css' 
import 'notivue/animations.css'
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'https://kit.fontawesome.com/41f61d2cb3.js'

const notivue = createNotivue({
    position: 'top-right',
    limit: 4,
    enqueue: true,
    notifications: {
      global: {
        duration: 3000
      }
    }
  })

const app = createApp(App)

app.use(notivue)
app.use(router)
app.use(store);
app.use(PrimeVue);
app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);

app.mount('#app')
