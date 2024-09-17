import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

loadFonts()

createApp(App)
  .use(vuetify)
  .use(VueJsonPretty)
  .mount('#app')
