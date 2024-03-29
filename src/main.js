import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import VuetifyDialog from "vuetify-dialog"
import 'vuetify-dialog/dist/vuetify-dialog.css'
import router from "./router/router"
import store from "./store/store"
import Vuebar from "vuebar"
import "./plugins/base"
import VueSkycons from "vue-skycons"
import InstantSearch from "vue-instantsearch"
import VueFeather from "vue-feather"
import VueI18n from 'vue-i18n'
// import "material-design-icons-iconfont/dist/material-design-icons.css"
import "vuetify/dist/vuetify.min.css";
// import DatetimePicker from './components/commonComponents/DatetimePicker'
//Vue.component('v-datetime-picker', DatetimePicker)
//import "github-markdown-css";

import {defaultLocale, localeOptions} from './constants/config'
// Multi Language Add
import en from './locales/en.json'
import it from './locales/it.json'

Vue.use(VuetifyDialog, {
    context: {
        vuetify
    }
});
Vue.use(VueFeather)
Vue.use(VueI18n)
Vue.use(VuetifyDialog)
//Vue.use(DatetimePicker)

const messages = {en: en, it: it}
const locale = (localStorage.getItem('currentLanguage') &&
    localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0)
    ? localStorage.getItem('currentLanguage') : defaultLocale

const i18n = new VueI18n({
    locale: locale,
    fallbackLocale: 'en',
    messages
})

Vue.use(VueSkycons, {
    color: "#1e88e5",
})
Vue.use(InstantSearch)
Vue.config.productionTip = false
Vue.use(Vuebar)

export default new Vue({
    render: (h) => h(App),
    i18n,
    vuetify,
    store,
    router,
}).$mount("#app")
