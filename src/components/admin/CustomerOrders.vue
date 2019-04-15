<template>
	<div>
		<loading :active.sync="isLoading"></loading>

		<!-- 產品列表 -->
		<div class="row mt-4">
			<!-- 產品列表， bs4卡片格式 -->
			<div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
				<div class="card border-0 shadow-sm">
					<!-- 產品圖片 -->
					<!-- :style => 動態綁定產品的圖片  -->
					<div
						style="height: 150px; background-size: cover; background-position: center"
						:style="{backgroundImage: `url(${item.imageUrl})`}"
					></div>
					<div class="card-body">
						<span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
						<h5 class="card-title">
							<a href="#" class="text-dark">{{ item.title }}</a>
						</h5>
						<p class="card-text">{{ item.content }}</p>
						<div class="d-flex justify-content-between align-items-baseline">
							<div class="h5" v-if="!item.price">{{ item.origin_price }}</div>
							<del class="h6" v-if="item.price">{{ item.origin_price }}</del>
							<div class="h5" v-if="item.price">{{ item.price }}</div>
						</div>
					</div>
					<div class="card-footer d-flex">
						<button ype="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
							<i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
							查看更多
						</button>
						<button
							type="button"
							class="btn btn-outline-danger btn-sm ml-auto"
							@click="addtoCart(item.id)">
							<i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
							加到購物車
						</button>
					</div>
				</div>
			</div>
		</div>

		<Pagination :pages="pagination" @emitPages="getProducts"></Pagination>

		<!-- 查看更多視窗 -->
		<div
			class="modal fade"
			id="productModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="exampleModalLabel"
			aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<img :src="product.imageUrl" class="img-fluid" alt>
						<blockquote class="blockquote mt-3">
							<p class="mb-0">{{ product.content }}</p>
							<footer class="blockquote-footer text-right">{{ product.description }}</footer>
						</blockquote>
						<div class="d-flex justify-content-between align-items-baseline">
							<div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
							<del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
							<div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
						</div>
						<select name class="form-control mt-3" v-model="product.num">
							<!-- 動態綁定數量 -->
							<option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
						</select>
					</div>
					<div class="modal-footer">
						<div class="text-muted text-nowrap mr-3">
							小計
							<strong>{{ product.num * product.price }}</strong> 元
						</div>
						<button type="button" class="btn btn-primary" @click="addtoCart(product.id, product.num)">
							<i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
							加到購物車
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- 購物車列表 -->
		<!-- 如果購物車裡有東西才顯示表格 -->
		<div class="my-5 row justify-content-center">
			<div class="my-5 row justify-content-center text-left">
				<table>
					<thead>
						<tr>
							<th></th>
							<th width="200" class="text-left">品名</th>
							<th>數量</th>
							<th>單價</th>
						</tr>
					</thead>
					<tbody>
						<tr class="table mt-4" v-for="item in cart.carts" :key="item.id">
							<td>
								<button
									class="btn btn-outline-danger btn-sm product_btn"
									@click="removeCartItem(item.id)"
								>刪除</button>
							</td>
							<td class="text-left">
								{{ item.product.title }}
								<div class="text-success" v-if="item.coupon">已套用優惠券</div>
							</td>
							<td>{{ item.qty }} {{ item.product.unit }}</td>
							<td class="text-right">{{ item.product.price | currency }}</td>
						</tr>
					</tbody>
					<tfoot class="table mt-4">
						<tr>
							<td colspan="3" class="text-right">總計</td>
							<td class="text-right">{{ cart.total | currency }}</td>
						</tr>
						<tr v-if="cart.final_total !== cart.total">
							<td colspan="3" class="text-right text-success">折扣價</td>
							<td class="text-right text-success">{{ cart.final_total | currency }}</td>
						</tr>
					</tfoot>
				</table>
				<div class="input-group mb-3 input-group-sm">
					<input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
					<div class="input-group-append">
						<button class="btn btn-outline-secondary" type="button" @click.enter="addCouponCode">套用優惠碼</button>
					</div>
				</div>
			</div>
		</div>

		<!-- 消費者資料表單 -->
		<div class="my-5 row justify-content-center text-left">
			<form class="col-md-6" @submit.prevent="createOrder">
				<div class="form-group">
					<label for="useremail">Email</label>
					<!-- 欄位驗證: 現在使用 vee-validate 套件驗證(createOrder方法) -->
					<!-- 也可直接在 input 裡直接下 required 語法 -->
					<input
						type="email"
						class="form-control"
						name="email"
						id="useremail"
						placeholder="請輸入 Email"
						v-model="form.user.email"
						:class="{'is-invalid': errors.has('email')}"
						v-validate="'required|email'"
					>
					<!-- errors.first('email'): 會告知 email 錯誤在哪 -->
					<span class="text-danger" v-if="errors.has('email')">
						{{ errors.first('email') }}
					</span>
				</div>

				<div class="form-group">
					<label for="username">收件人姓名</label>
					<input
						type="text"
						class="form-control"
						:class="{'is-invalid': errors.has('name')}"
						name="name"
						id="username"
						v-model="form.user.name"
						v-validate="'required'"
						placeholder="輸入姓名"
					>
					<!-- errors: v-validate提供的變數 -->
					<!-- 如果 name 不存在，就會跳出內建的錯誤， -->
					<!-- name 是對應上方 input 裡的 name 屬性裡的值 -->
					<span class="text-danger" v-if="errors.has('name')">姓名必須輸入</span>
				</div>

				<div class="form-group">
					<label for="usertel">收件人電話</label>
					<input
						type="tel"
						class="form-control"
						id="usertel"
						name="tel"
						v-model="form.user.tel"
						v-validate="'required'"
						:class="{'is-invalid': errors.has('tel')}"
						placeholder="請輸入電話"
					>
					<span class="text-danger" v-if="errors.has('tel')">電話必須輸入</span>
				</div>

				<div class="form-group">
					<label for="useraddress">收件人地址</label>
					<input
						type="address"
						class="form-control"
						name="address"
						id="useraddress"
						v-model="form.user.address"
						v-validate="'required'"
						:class="{'is-invalid': errors.has('address')}"
						placeholder="請輸入地址"
					>
					<span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
				</div>

				<div class="form-group">
					<label for="useraddress">留言</label>
					<textarea name id class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
				</div>
				<div class="text-right">
					<button class="btn btn-danger" @click="createOrder">送出訂單</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery';
	import Pagination from './Pagination.vue';

	export default {
		data() {
			return {
				products: [],
				product: {},
				isLoading: false,

				// 判斷畫面上哪個元素正在讀取中 
				status: {
					loadingItem: '', // 放產品的 id
				},
				pagination: {},

				cart: {},  // 購物車列表裡的每一筆資料
				coupon_code: '', // 優惠碼

				// 表單內容
				form: {
					user: {
						name: '',
						email: '',
						tel: '',
						address: '',
					},
					message: ''
				}
			};
		},

		components: {
			Pagination,
		},

		methods: {
			getProducts(page = 1) {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`;
				vm.isLoading = true;
				this.$http.get(url).then((response) => {
					console.log(response);

					if (response.data.success) {
						vm.isLoading = false;

						vm.products = response.data.products;
						vm.pagination = response.data.pagination;
					}
				});
			},

			// 取得單一比商品，綁定在 "查看更多"按鈕上
			getProduct(id) {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
				vm.status.loadingItem = id;
				this.$http.get(url).then((response) => {
					console.log(response);
					$('#productModal').modal('show');
					vm.product = response.data.product;
					vm.status.loadingItem = '';
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
					console.log(response);
					vm.status.loadingItem = '';
					vm.getCart();
					$('#productModal').modal('hide');
				})
			},

			// 取得購物車列表
			getCart() {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
				vm.isLoading = true;
				this.$http.get(url).then((response) => {
					console.log(response);
					vm.cart = response.data.data;
					vm.isLoading = false;
				});
			},

			// 刪除購物資料
			removeCartItem(id) {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
				vm.isLoading = true;
				this.$http.delete(url).then((response) => {
					// console.log(response);
					vm.getCart();
					vm.isLoading = false;
				});
			},

			// 套用優惠碼
			addCouponCode() {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
				const coupon = {
					code: vm.coupon_code,
				}

				vm.isLoading = true;
				this.$http.post(url, { data: coupon }).then((response) => {
					console.log(response);
					vm.getCart();
					vm.isLoading = false;
				});
			},

			createOrder() {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
				// vm.isLoading = true;

				const order = vm.form;

				// Vee-validate驗證表單，如果有不符合規定的欄位就會阻止前往下一頁
				// 也可直接在 html 裡的 input 上下 required 的語法
				this.$validator.validate().then((result) => {
					if (result) {
						this.$http.post(url, { data: order }).then((response) => {
							console.log('訂單已建立', response);
							if(response.data.success) {
								vm.$router.push(`/admin/customer_checkout/${response.data.orderId}`)
							}	
							// vm.getCart();
							vm.isLoading = false;
						});
					} else {
						console.log('欄位不完整');
					}
				});
			}
		},
		created() {
			this.getProducts();
			this.getCart();
		},
	};
</script>