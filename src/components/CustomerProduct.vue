<template>
    <!-- 產品列表 -->
	<div class="row product_card_all">
		<div 
			class="col-lg-4 col-md-6 mb-4" 
			v-for="item in products" :key="item.id" 
		>
			<div class="card">
				<!-- 產品圖片 -->
				<!-- :style => 動態綁定產品的圖片  -->
				<a
					href="#"
					style="height: 150px; background-size: cover; background-position: center"
					:style="{backgroundImage: `url(${item.imageUrl})`}"
					@click.prevent="viewDetail(item.id)"
				></a>
				<div class="card-body">
					<span class="badge badge-secondary">{{ item.category }}</span>
					<h5>
						<a class="card-title" href="#" @click.prevent="viewDetail(item.id)">{{ item.title }}</a>
					</h5>
					<p class="card-text card_content">{{ item.content }}</p>
					<div class="d-flex justify-content-between align-items-center price_addCart_all">
						<div class="price_section">
							<div class="price_txt" v-if="!item.price">NT${{ item.origin_price }}</div>
							<del class="ori_price_txt" v-if="item.price">NT${{ item.origin_price }}</del>
							<div class="price_txt" v-if="item.price">NT${{ item.price }}</div>
						</div>
						<div class>
							<button
								class="btn_addcart ml-auto"
								data-toggle="tooltip"
								data-placement="top"
								title="已加入購物車"
								@click="addtoCart(item.id)"
							>
								<i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
								<i class="fa fa-cart-plus" aria-hidden="true" v-else></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import $ from 'jquery';

	export default {
        props: ['products'],
		data() {
			return {
                // 判斷畫面上哪個元素正在讀取中 
				status: {
					loadingItem: '', // 放產品的 id
				},
                cart: {},
			}
		},

		methods: {
			viewDetail(id) {
				this.$router.push(`/detail/${id}`)
            },
			
			// 取得購物車列表
			getCart() {
				this.$store.dispatch('getCart');
			},

            // 加入購物車
			addtoCart(id, qty = 1) {
				this.$store.dispatch('addtoCart', {id, qty});
				this.addtoCartAlert();
			},

			addtoCartAlert() {
				let tooltip = $('[data-toggle="tooltip"]');
				tooltip.tooltip({
					trigger: 'click',
				});
				

				setTimeout(function () {
					tooltip.tooltip('hide');
				}, 2000)
			},
		},
	}
</script>
