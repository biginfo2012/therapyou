import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router/router";
import store from "./store/store";
import Vuebar from "vuebar";
import "./plugins/base";
import VueSkycons from "vue-skycons";
import InstantSearch from "vue-instantsearch";
import VueFeather from "vue-feather";
import VueI18n from 'vue-i18n'
import { defaultLocale, localeOptions } from './constants/config'
// Multi Language Add
import en from './locales/en.json'
import it from './locales/it.json'

Vue.use(VueFeather);
Vue.use(VueI18n);

const messages = { en: en, it: it };
const locale = (sessionStorage.getItem('currentLanguage') &&
    localeOptions.filter(x => x.id === sessionStorage.getItem('currentLanguage')).length > 0)
    ? sessionStorage.getItem('currentLanguage') : defaultLocale;

const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages
});

Vue.use(VueSkycons, {
  color: "#1e88e5",
});
Vue.use(InstantSearch);
Vue.config.productionTip = false;
Vue.use(Vuebar);


export default new Vue({
  render: (h) => h(App),
  i18n,
  vuetify,
  store,
  router,
}).$mount("#app");
