import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App).use(router)

// Mount and add data attribute to prevent FOUC
app.mount('#app')

// Add data attribute after mount to show app
document.getElementById('app')?.setAttribute('data-v-app', 'true')

