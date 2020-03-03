// 此檔案是用在彈出錯誤訊息的地方
// event bus: 父子元件傳遞事件的方法

import Vue from 'vue';

// event bus 掛載在 vue 的原型下
Vue.prototype.$bus = new Vue();

// 重新取得購物車
// 'regetCart'
// $emit: /CustomerProduct addtoCart(id, qty = 1)
// $emit: /Detail addtoCart(id, qty = 1)
// $on: /Navbar created()


// 套用優惠券，重新取得購物車
// 'couponRegetCart'
// $emit: /Navbar created()
// $on: /CustomerCheckout addCouponCode()

// 後台上傳檔案傳錯誤通知
// 'messsage:push'
// 參數：'response.data.message', 'danger'
// $emit: /admin/Products uploadFile()
// $on: /Alert created()

// 建立訂單，使用者資料錯誤
// 'messsage:push'
// 參數：'response.data.message', 'danger'
// $emit: /CustomerCheckout createOrder()
// $on: /Alert created()

// 付款完成
// 'messsage:push'
// 參數：'已付款完成', 'success'
// $emit: /Payment payOrder()
// $on: /Alert created()

// 付款完成後要清空購物車
// 'emptyCart'
// $emit: /Payment emptyCart()
// $on: /Navbar created()