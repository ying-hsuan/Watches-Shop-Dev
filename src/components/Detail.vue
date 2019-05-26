<template>
	<div class="container detail_all">
		<loading :active.sync="isLoading"></loading>
		<div class="detail_content">
			<div class="d-flex top_btn_all">
				<button class="top_btn" @click="backPage">
					<i class="fas fa-arrow-left"></i>&nbsp;&nbsp; 上一頁
				</button>
				<button class="top_btn" @click="reloadPage()">
					<i class="fas fa-redo-alt"></i>&nbsp;&nbsp;重新整理
				</button>
			</div>

			<div class="row mt-4">
				<!-- 商品圖片 -->
				<div class="col-md-7 pd_img_all">
					<img class="pd_img" :src="product.imageUrl" alt>
					<!-- <div class="pd_img_bg"></div> -->
				</div>
				<!-- // 商品圖片 -->
				<!-- 商品資訊 -->
				<div class="col-md-5 pd_info">
					<p class="badge badge-secondary">{{ product.category }}</p>
					<h1 class="h2 pd_title">{{ product.title }}</h1>
					<hr>
					<p class="pd_content">{{ product.content }}</p>
					<p class="pd_description">{{ product.description }}</p>
					<div class="my-3">
						<del class="text-muted">NT${{ product.origin_price }}</del>
						<strong class="h3 mb-0 ml-1 pd_price">NT${{ product.price }}</strong>
					</div>
					<hr>

					<!-- 數量 -->
					<div class="mt-3">
						<div>
							數量：&nbsp;
							<select
								v-model="product.num"
								name="select_num"
								class="select_num"
								placeholder="請選擇數量"
							>
								<!-- <option selected="selected" disabled>請選擇數量</option> -->
								<option :value="num" v-for="num in 10" :key="num">{{num}}</option>
							</select>
						</div>

						<div class="addcart_tooltip mt-3">
							<a
								href="#"
								class="btn btn_addcart"
								data-toggle="tooltip"
								data-placement="right"
								title="已加入購物車"
								@click.prevent="addtoCart(product.id, 
								product.num)"
								@click="addtoCartAlert"
							>
								<i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
								<i class="fa fa-cart-plus" aria-hidden="true" v-else></i>
								加入購物車
							</a>
							<!-- <div class="tooltip_custom">
								<div class="arrow"></div>
								<div class="tooltip_inner">已加入購物車</div>
							</div>-->
						</div>
					</div>
				</div>
				<!-- // 商品資訊 -->
			</div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery';

	export default {
		data() {
			return {
				product: {},
				pdId: '',
				isLoading: false,
				status: {
					loadingItem: '', // 放產品的 id
				},
				cart: {},  // 購物車列表裡的每一筆資料
			};
		},

		created() {
			this.pdId = this.$route.params.product_id;
			this.getProduct(this.pdId);
			console.log(this.pdId);
			// this.getCart();
		},

		methods: {
			// 取得當下點擊的商品
			getProduct(id) {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
				vm.isLoading = true;
				this.$http.get(url).then((response) => {
					console.log(response);
					vm.product = response.data.product;
					vm.product.num = 1;
					vm.isLoading = false;
				});
			},

			// 加入購物車
			addtoCart(id, qty = 1) {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
				vm.status.loadingItem = id;

				// API 會傳入的參數屬性(product_id、qty)
				const cart = {
					product_id: id,
					qty
				}

				this.$http.post(url, { data: cart }).then((response) => {
					if (response.data.success) {
						console.log(response);
						vm.status.loadingItem = '';
						vm.getCart();
						vm.addtoCartAlert();
					}
				})

				this.$bus.$emit('regetCart');
			},


			addtoCartAlert() {
				let tooltip = $('[data-toggle="tooltip"]');
				tooltip.tooltip({
					trigger: 'click',
				});

				setTimeout(function () {
					tooltip.tooltip('hide');
				}, 1200)
			},

			// 取得購物車列表
			getCart() {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
				this.$http.get(url).then((response) => {
					console.log(response);
					vm.cart = response.data.data;
				});
			},

			backPage() {
				this.$router.back();
			},

			reloadPage() {
				window.location.reload()
				// this.$router.push(`/detail/${id}`)
			}

		},

	};
</script>