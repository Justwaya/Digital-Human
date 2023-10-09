import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes/index'
import Vant from 'vant'
import 'vant/lib/index.css';
import { Icon } from 'vant';
import mitt from 'mitt'
import './utils/rem.js'
import 'animate.css/animate.min.css'



const Mit = mitt()
declare module "vue" {
    export interface ComponentCustomProperties {
        $Bus: typeof Mit
    }
}

const app = createApp(App)
app.config.globalProperties.$Bus = Mit

app.use(router).use(Icon).use(Vant).mount('#app')
