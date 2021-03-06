import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
            // 避免使用者進入不存在的頁面(使用者自己在網址亂打網址)，重新導向登入頁面
            path: '*',
            redirect: 'login',
        },

        // 首頁
        {
            path: '',
            // name: 'home',

            // vue cli3 可以直接在 routes 裡的 component 匯入分頁路徑
            component: () =>
                import ('./views/Home.vue'),
            children: [{
                    path: '/',
                    name: 'CustomerProducts',
                    component: () =>
                        import ('@/components/CustomerProducts.vue'),
                },
                {
                    path: '/detail/:product_id',
                    name: 'Detail',
                    component: () =>
                        import ('@/components/Detail.vue'),
                },
                {
                    path: '/customer_checkout',
                    name: 'CustomerCheckout',
                    meta: {
                        keepAlive: true // 需要缓存
                    },
                    component: () =>
                        import ('@/components/CustomerCheckout.vue'),
                },
                {
                    path: '/payment/:orderId',
                    name: 'Payment',
                    component: () =>
                        import ('@/components/Payment.vue'),
                },
            ]
        },

        // 登入
        {
            path: '/login',
            name: 'Login',
            component: () =>
                import ('./views/Login.vue')
        },

        // 後台管理
        {
            path: '/admin',
            name: 'Dashboard',
            component: () =>
                import ('@/components/admin/Dashboard.vue'),
            redirect: '/admin/products',
            children: [

                // 管理商品
                {
                    path: 'products',
                    name: 'Products',
                    component: () =>
                        import ('@/components/admin/Products.vue'),
                    meta: { requiresAuth: true },
                },

                // 管理訂單
                {
                    path: 'orders',
                    name: 'Orders',
                    component: () =>
                        import ('@/components/admin/Orders.vue'),
                },

                // 管理優惠券
                {
                    path: 'coupons',
                    name: 'Coupons',
                    component: () =>
                        import ('@/components/admin/Coupons.vue'),
                },
            ]
        },
    ]
})