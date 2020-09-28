import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLoading: true,

        cart: {
            carts: [],
        },
        hasCoupon: false,
    },
    actions: {
        updateLoading(context, payload) {
            // payload 從元件傳來，loading true or false
            context.commit('LOADING', payload);
        },

        // ------購物車---------
        getCart(context) {
            const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;

            context.commit('LOADING', true);

            axios.get(url).then((response) => {
                if (response.data.data.carts) {
                    context.commit('CART', response.data.data)
                        // vm.cart = response.data.data;
                }
                console.log('取得購物車', response.data.data);

                context.commit('LOADING', false);

                // 如果有套用優惠券，價格要顯示綠色
                let resCarts = response.data.data.carts
                resCarts.forEach(el => {
                    if (el.coupon) {
                        context.commit('HASCOUPON', true)
                            // vm.hasCoupon = true
                    }
                })
            });
        },

        addtoCart(context, { id, qty }) {
            const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
            context.commit('LOADING', true);

            // API 會傳入的參數屬性(product_id、qty)
            const cart = {
                product_id: id,
                qty
            }

            axios.post(url, { data: cart }).then((response) => {
                context.commit('LOADING', false);
                context.dispatch('getCart');
                console.log("加入購物車: ", response)
            })

        },

        removeCart(context, id) {
            const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
            context.commit('LOADING', true);
            axios.delete(url).then((response) => {
                context.commit('LOADING', false);
                context.dispatch('getCart');
                console.log('刪除購物車項目', response);
            });
        },
    },
    mutations: {
        LOADING(state, payload) {
            // payload 從 actions updateLoading()傳入
            state.isLoading = payload;
        },

        CART(state, payload) {
            state.cart = payload;
        },

        HASCOUPON(state, payload) {
            state.hasCoupon = payload;
        },
    },
})