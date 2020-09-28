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
					<!-- <router-link to="/admin" class="nav-title">後台管理</router-link> -->
				</div>
			</div>

			<div class="nav_title_all">
				<!-- 電腦導覽列 -->
				<div class="nav_pc">
					<router-link to="/" class="nav-title">首頁 | 產品列表</router-link>
					<!-- <router-link to="/admin" class="nav-title">後台管理</router-link> -->
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
			<!-- cart nav -->
			<div 
				class="cart_head"
				:class="{ 'text-success': 'hasCoupon' }">

				<h6>已選擇商品</h6>
				<p class="final_total">
					<span class="text-success" v-if="hasCoupon">折扣後 </span>   
					<span v-else>總計 </span>

					<span class="text-success" v-if="hasCoupon">{{ cart.final_total | currency }}</span>
					<span v-else>{{ cart.final_total | currency }}</span>
				</p>
			</div>

			<!-- cart list -->
			<div class="cart_menu_all mb-3">
				<table class="table table-sm" v-if="cart.carts.length">
					<tbody>
						<!-- <tr v-for="item in cart.carts" :key="item.id" :regetCart="getCart"> -->
						<tr v-for="item in cart.carts" :key="item.id">
							<td class="align-middle text-center">
								<button class="trash_btn" @click.prevent="removeCart(item.id)">
									<i class="fas fa-trash-alt" ></i>

									<!-- 垃圾桶單獨轉圈 -->
									<!-- <i class="fas fa-spinner fa-spin" v-if="status.delitem == item.id"></i> -->
									<!-- <i class="fas fa-trash-alt" v-else></i> -->
								</button>
							</td>

							<td class="align-middle">
								<img class="pd_img" :src="item.product.imageUrl" alt>
							</td>
							<td class="align-middle text-center">{{ item.product.title }}</td>
							<td class="align-middle">{{ item.qty }}/{{item.product.unit}}</td>

							<td class="align-middle text-right text-success" v-if="hasCoupon">{{item.final_total | currency}}</td>
							<td class="align-middle text-right" v-else>{{item.total | currency}}</td>
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
				isShow: false,
			};
		},
		computed: {
			cart(){
				return this.$store.state.cart;
			},
			hasCoupon(){
				return this.$store.state.hasCoupon;
			}
		},

		created() {
			this.getCart();

			// 從 /CustomerCheckout.vue addCouponCode() 傳來
			// 如果有套用優惠券，價格要顯示綠色
			// this.$bus.$on('couponRegetCart', ()=>{
			// 	console.log('on couponRegetCart')
			// 	this.getCart();
			// })
		},

		methods: {
			getCart() {
				this.$store.dispatch('getCart');
			},

			removeCart(id) {
				this.$store.dispatch('removeCart', id);
			},

			toggleCartbox() {
				this.isShow = !this.isShow
			},

			closeCartbox() {
				this.isShow = false;
			},
		},
	};
</script>

