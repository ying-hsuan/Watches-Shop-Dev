<template>
	<main>
		<Banner></Banner>

		<!-- 商品區 -->
		<div class="container products_all">
			<div class="row">
				<!-- 讀取效果 -->
				<loading :active.sync="isLoading"></loading>

				<!-- 左側選單 (List group) -->
				<div class="col-md-3 pds_menu_all mb-4">
					<!-- <div class="list-group sticky-top"> -->
					<div class="list-group pds_menu">
						<a
							href="#"
							class="list-group-item"
							data-toggle="list"
							@click.prevent="category = '全部商品'"
							:class="{'active': category == '全部商品'}"
						>
							<i class="far fa-clock"></i>
							全部商品
						</a>
						<a
							href="#"
							class="list-group-item"
							data-toggle="list"
							@click.prevent="category = item"
							:class="{'active': category == item}"
							v-for="item in categoryList"
							:key="item"
						>
							<i class="far fa-clock"></i>
							{{item}}
						</a>
					</div>
				</div>

				<!-- 產品列表 -->
				<div class="container col-md-9 prod_all">
					<div v-if="category == '全部商品'">
						<Product :products="pageProducts"></Product>
						<Pagination :pages="pagination" @emitPages="getPageProducts"></Pagination>
					</div>
					<div v-else>
						<Product :products="filterProducts"></Product>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import $ from 'jquery';
	import Banner from './Banner.vue';
	import Product from './CustomerProduct.vue';
	import Pagination from './Pagination.vue';

	export default {
		data() {
			return {
				category: '全部商品',
				categoryList: [],

				products: [],
				pageProducts: [],
				
				cart: {},

				isLoading: false,
				pagination: {},
			};
		},

		components: {
			Banner,
			Product,
			Pagination,
		},

		created() {
			this.getAllProducts();
			this.getPageProducts();
			this.getCart();
		},

		computed: {
			filterProducts() {
				const vm = this;
				if (vm.category == '全部商品') {
					return vm.products
				} else {
					return vm.products.filter(item => item.category == vm.category)
				}
				console.log(vm.products)
			}
		},

		methods: {
			getAllProducts() {
				const vm = this;
				const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;

				this.$http.get(api).then((response) => {
					console.log(response);
					if (response.data.success) {
						vm.products = response.data.products;

						var resDataPds = response.data.products;
						resDataPds.forEach((item, i) => {
							// console.log(item.category)
							vm.categoryList.push(item.category);
							vm.category = item.category;
							// console.log(vm.category)
						});
						// console.log(vm.categoryList)
						var finCategoryList = vm.categoryList.filter((item, i, arr) => {
							return arr.indexOf(item) === i;
						})
						// console.log(finCategoryList)
						vm.categoryList = finCategoryList;
					}
					vm.category = '全部商品';
				});
			},

			getPageProducts(page = 1) {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`;
				vm.isLoading = true;
				this.$http.get(url).then((response) => {
					console.log(response);

					if (response.data.success) {
						vm.isLoading = false;
						vm.pageProducts = response.data.products;
						vm.pagination = response.data.pagination;
					}
				});
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
		},
	};
</script>