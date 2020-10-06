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

        alertMsgs: [],
        alertDisplay: false
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


            // ---------------------------
            // 傳給 updateAlert
            const timestamp = Math.floor(new Date() / 1000);

            let successAlert = {
                alertMsg: "已加入購物車",
                status: "success",
                timestamp
            }

            let errorAlert = {
                alertMsg: "加入購物車失敗",
                status: "warning",
                timestamp
            }

            axios.post(url, { data: cart }).then((response) => {
                if (response.status == 200) {
                    context.commit('LOADING', false);
                    context.dispatch('updateAlert', successAlert)
                    context.dispatch('getCart');
                    console.log("加入購物車: ", response)
                } else {
                    context.dispatch('updateAlert', errorAlert)
                }
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


        // ----------------------------------
        // 跳提醒

        // 加入訊息的屬性，然後把自己移除
        updateAlert(context, payload) {
            context.commit("alertMsgs", payload)
            context.commit("alertDisplay", true)
            context.dispatch("removeAlertWithTiming", payload.timestamp)
        },

        // 五秒過後自動刪除自己，從 updateAlert 裡傳進來的 timestamp參數才會自動移除
        removeAlertWithTiming(context, timestamp) {
            setTimeout(() => {
                context.commit("removeAlertWithTiming", timestamp)
                context.commit("alertDisplay", false)
            }, 2000);
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


        // --------------------------------
        // 跳提醒

        alertMsgs(state, payload) {
            state.alertMsgs.push({
                alertMsg: payload.alertMsg,
                status: payload.status,
                timestamp: payload.timestamp,
            });
            console.log(state.alertMsgs)
            console.log(payload)
        },

        alertDisplay(state, payload) {
            state.alertDisplay = payload;
        },

        removeAlertWithTiming(state, timestamp) {
            state.alertMsgs.forEach((item, i) => {
                if (item.timestamp === timestamp) {
                    state.alertMsgs.splice(i, 1);
                }
            });
        }
    },
})