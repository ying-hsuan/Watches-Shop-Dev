// 此檔案是用在彈出錯誤訊息的地方
// event bus: 父子元件傳遞事件的方法

import Vue from 'vue';

// event bus 掛載在 vue 的原型下
Vue.prototype.$bus = new Vue();

// /admin/Products.vue uploadFile()