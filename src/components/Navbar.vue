<template>
	<!-- 導覽列 -->
	<nav class="navbar custom_navbar">
		<div class="navbar-top navbar-icon-all">
			<div class="nav_brand_all">
				<div>
					<router-link to="/" class="nav_brand">WHACHES SHOP</router-link>
				</div>
				<!-- 手機導覽列 -->
				<div class="nav_mob">
					<router-link to="/" class="nav-title">首頁 | 產品列表</router-link>
					<router-link to="/admin" class="nav-title">後台管理</router-link>
					<!-- <router-link to="/login" class="nav-title">登入</router-link> -->
				</div>
			</div>

			<div class="nav_title_all">
				<!-- 電腦導覽列 -->
				<div class="nav_pc">
					<router-link to="/" class="nav-title">首頁 | 產品列表</router-link>
					<router-link to="/about" class="nav-title">後台管理</router-link>
					<!-- <router-link to="/about" class="nav-title">登入</router-link> -->
				</div>
				<!-- 購物車按鈕 -->
				<button
					class="btn btn-sm btn-cart"
					data-toggle="dropdown"
					data-flip="false"
					@click="toggleCartbox"
				>
					<i class="fa fa-shopping-cart" aria-hidden="true"></i>

					<!-- 購物車右上角數量 -->
					<span class="badge badge-pill badge-danger">{{cart.carts.length}}</span>
					<span class="sr-only">unread messages</span>
				</button>
			</div>
		</div>
		<!-- 購物車列表 -->
		<div class="cart_box p-3" v-show="isShow">
			<div class="cart_head">
				<h6>已選擇商品</h6>
				<p class="final_total">總計 {{ cart.final_total | currency }}</p>
				<!-- <div class="btn_close">
						<i class="fas fa-times"></i>
				</div>-->
			</div>

			<div class="cart_menu_all mb-3">
				<table class="table table-sm" v-if="cart.carts.length">
					<tbody>
						<tr v-for="item in cart.carts" :key="item.id" :regetCart="getCart">
							<td class="align-middle text-center">
								<button class="trash_btn" @click.prevent="removeCart(item.id)">
									<i class="fas fa-spinner fa-spin" v-if="status.delitem == item.id"></i>
									<i class="fas fa-trash-alt" v-else></i>
								</button>
							</td>

							<td class="align-middle">
								<img class="pd_img" :src="item.product.imageUrl" alt>
							</td>
							<td class="align-middle text-center">{{ item.product.title }}</td>
							<td class="align-middle">{{ item.qty }}/{{item.product.unit}}</td>
							<td class="align-middle text-right">{{item.total | currency}}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<router-link class="goto_check_link" to="/customer_checkout">
				<button class="btn btn-block btn_cart" @click="closeCartbox">
					<i class="fa fa-cart-plus" aria-hidden="true"></i> 結帳去
				</button>
			</router-link>
		</div>
	</nav>
</template>

<script>
	import $ from 'jquery';

	export default {
		name: 'App',
		data() {
			return {
				cart: {
					carts: [],
				},
				isLoading: false,
				status: {
					delitem: '',
				},
				isShow: false,
			};
		},

		created() {
			this.getCart();
			this.$bus.$on('regetCart', () => {
				console.log('emit on')
				this.getCart();
			});

			this.$bus.$on('emptyCart', () => {
				console.log('emptyCart')
				this.removeAllCart();
			});
		},

		// updated() {
		// 	this.$bus.$on('emptyCart', () => {
		// 		console.log('emptyCart')
		// 		this.removeAllCart();
		// 	});
		// },

		methods: {
			getCart() {
				const vm = this;
				vm.isLoading = true;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
				this.$http.get(url).then((response) => {
					if (response.data.data.carts) {
						vm.cart = response.data.data;
					}
					vm.isLoading = false;
					console.log('取得購物車', response.data.data);
				});
			},
			removeCart(id) {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
				vm.status.delitem = id;
				this.$http.delete(url).then((response) => {
					vm.status.delitem = '';
					vm.getCart();
					console.log('刪除購物車項目', response);
				});
			},

			removeAllCart() {
				this.cart.carts = [];
			},

			toggleCartbox() {
				this.isShow = !this.isShow
			},

			closeCartbox() {
				this.isShow = false;
			}

		},
	};
</script>

