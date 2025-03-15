import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/main.css'
import './assets/styles/main.scss'
import { registerPlugins } from './plugins'
import ErrorBoundary from './components/common/ErrorBoundary.vue'
import './assets/tailwind.css'

const app = createApp(App)

// Global components
app.component('ErrorBoundary', ErrorBoundary)

// Register plugins
registerPlugins(app)

// Router ve store'u kullanıyoruz
app.use(router)
app.use(store)

app.mount('#app')
