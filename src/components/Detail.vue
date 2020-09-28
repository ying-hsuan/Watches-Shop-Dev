<template>
	<div class="container detail_all">
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
								加入購物車
							</a>
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
			};
		},

		created() {
			this.pdId = this.$route.params.product_id;
			this.getProduct(this.pdId);
			console.log(this.pdId);
		},

		methods: {
			// 取得當下點擊的商品
			getProduct(id) {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
				vm.$store.dispatch('updateLoading', true);
				this.$http.get(url).then((response) => {
					console.log(response);
					vm.product = response.data.product;

					// 一開始設定數量是 1，不然選擇框會空白
					vm.product.num = 1;
					
					vm.$store.dispatch('updateLoading', false);
				});
			},

			// 取得購物車列表
			getCart() {
				this.$store.dispatch('getCart');
			},

			// 加入購物車
			addtoCart(id, qty = 1) {
				this.$store.dispatch('addtoCart', {id, qty});
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