// API網址 https://github.com/hexschool/vue-course-api-wiki/wiki

import Vue from "vue";
import axios from "axios"; // Ajax 撈資料外掛
import VueAxios from "vue-axios";
import 'bootstrap'; // 載入 bootstrap 的套件
import Loading from 'vue-loading-overlay'; // 讀取中效果套件
import 'vue-loading-overlay/dist/vue-loading.css'; // 讀取中效果套件
import VeeValidate from 'vee-validate'; // 表單驗證套件
import zhTWValidate from 'vee-validate/dist/locale/zh_TW' // 中文語系的表單驗證
import VTooltip from 'v-tooltip';

// 通常上放載入 npm 套件內容

// 下方載入自定義的內容
import App from "./App.vue";
import router from "./router";
import './bus'; // 匯入 event bus
import currencyFilter from "./filters/currency";
import dateFilter from "./filters/date";
import store from "./store";

Vue.use(VueAxios, axios);
Vue.use(VeeValidate);
Vue.use(VTooltip);

VeeValidate.Validator.localize('zh_TW', zhTWValidate); // 使用中文驗證
Vue.config.productionTip = false;

Vue.component('Loading', Loading); // 全局註冊 loading 效果
Vue.filter('currency', currencyFilter); // 全局註冊 filter，套用在價格上
Vue.filter('date', dateFilter);

// 跨域使用者登入的時候，會把 cookies 存到前端
axios.defaults.withCredentials = true;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");



// 導航守衛，管理從哪個分頁切過來，和即將前往哪一個分頁
// 要有切換頁面(to, from)才會觸發，如果在同一頁重新整理就不會觸發
router.beforeEach((to, from, next) => {
    console.log('to', to, 'from', from, 'next', next);

    // 如果抵達分頁的 meta.requiresAuth = true，就會被擋下，跳轉到登入(login)頁面
    if (to.meta.requiresAuth) {
        console.log('這裡需要驗證');

        // 檢查用戶是否仍持續登入
        const api = `${process.env.VUE_APP_APIPATH}/api/user/check`;

        // this.$http 是在 vue 的元件內才能使用，因現在主詞對象是指向 "router"(第一個詞)，所以下方撈資料必須改成 "axios"
        // this.$http.post(api).then((response) => {
        axios.post(api).then((response) => {
            console.log(response.data);

            // 如果用戶有持續登入就前往分頁
            if (response.data.success) {
                next();
            } else {
                next({
                    path: '/login'
                });
            }
        });
    } else {
        // 如果沒寫 next()，就無法進入指定頁面
        next();
    }

});