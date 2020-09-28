<template>
	<div class="container customer_checkout">
		<!-- <loading :active.sync="isLoading"></loading> -->

		<div class="mt-3">
			<button class="btn btn_backto_pd" @click="backtoHome">&lt;&nbsp; 回到產品列表</button>
		</div>
		
		<!-- 用戶付款訂單流程 -->
		<section class="row justify-content-center mt-4">
			<div class="step_all col-md-8">
				<div class="step_list text-center active">
					<div class="step">
						<div class="step_txt active">1</div>
					</div>
					<p class="step_ct">輸入資料</p>
					<div class="bg_line_all"></div>
				</div>

				<div class="step_list text-center">
					<div class="step">
						<div class="step_txt step_txt2">2</div>
					</div>
					<p class="step_ct">金流付款</p>
				</div>
				<div class="step_list text-center">
					<div class="step">
						<div class="step_txt step_txt3">3</div>
					</div>
					<p class="step_ct">完成</p>
				</div>
			</div>
		</section>

		<!-- 用戶表單、購物車清單 -->
		<div class="check_ct_all container mt-3">
			<div class="row">
				<!-- 購物車清單 -->
				<div class="cart_list_all col-lg-5 order-lg-2">
					<div class="cart_head_all">
						<div class="cart_head d-flex justify-content-between align-items-center mb-1">
							<h5 class="cart_title">購物清單</h5>
							<div class="cart_length" v-if="cart.carts">
								<p class="cart_length_txt">{{ cart.carts.length }}</p>
							</div>
						</div>
					</div>
					<table class="table" v-if="cart.carts">
						<tbody>
							<tr 
								class="total_row" 
								v-for="item in cart.carts" :key="item.id"
							>
								<td class="align-middle text-left">
									<button class="trash_btn" @click.prevent="removeCart(item.id)">
										<i class="fas fa-trash-alt" ></i>

										<!-- <i class="fas fa-spinner fa-spin" v-if="status.delitem == item.id"></i>
										<i class="fas fa-trash-alt" v-else></i> -->
									</button>
									<img class="pd_img pd_img_mob mt-2" :src="item.product.imageUrl" alt>
								</td>

								<td class="align-middle">
									<img class="pd_img pd_img_lg" :src="item.product.imageUrl" alt>
								</td>
								<td class="align-middle text-left">
									<div class="text-success" v-if="item.coupon">已套用優惠券</div>
									{{ item.product.title }}
									<!-- <div>{{ item.qty }}/{{item.product.unit}}</div> -->
								</td>

								<td class="align-middle">{{ item.qty }}/{{item.product.unit}}</td>
								<td class="align-middle text-right">
									<!-- 原價 -->
									<span>{{item.total | currency}}</span>  

									<br>
									<!-- 折扣後 -->
									<span v-if="item.final_total != item.total" class="text-success">{{item.final_total | currency}}</span>  
								</td>
							</tr>
							<tr class="total_row">
								<td colspan="5" class="total text-right">
									<p class="total_txt">總計 {{ cart.total | currency }}</p>
								</td>
							</tr>
							<tr class="total_row" v-if="cart.total != cart.final_total">
								<td colspan="5" class="total text-right">
									<p class="text-success">折扣後 {{ cart.final_total | currency }}</p>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- 優惠碼輸入 -->
					<div class="coupon_all">
						<h6 class="text-success">輸入優惠碼 "0080"，可享8折優惠</h6>
						<div class="coupon_input_all mb-3">
							<input
								type="text"
								class="coupon_input"
								v-model="coupon_code"
								@keyup.enter="addCouponCode"
								placeholder="請輸入優惠碼"
							>

							<button class="btn_add_coupon" type="button" @click.enter="addCouponCode">套用優惠碼</button>
						</div>
					</div>
				</div>

				<!-- 消費者填寫表單 -->
				<div class="user_form text-left col-lg-7">
					<h5 class="mb-3">訂單資訊</h5>
					<form class @submit.prevent="createOrder">
						<div class="form-group">
							<label for="useremail">Email</label>
							<br>
							<!-- 欄位驗證: 現在使用 vee-validate 套件驗證(createOrder方法) -->
							<!-- 也可直接在 input 裡直接下 required 語法 -->
							<input
								type="email"
								name="email"
								id="useremail"
								placeholder="請輸入 Email"
								v-model="form.user.email"
								:class="{'is-invalid': errors.has('email')}"
								v-validate="'required|email'"
							>
							<!-- errors.first('email'): 會告知 email 錯誤在哪 -->
							<span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
						</div>

						<div class="form-group">
							<label for="username">收件人姓名</label>
							<br>
							<input
								type="text"
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
							<br>
							<input
								type="tel"
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
							<br>
							<input
								type="address"
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
							<br>
							<textarea name id cols="30" rows="10" v-model="form.message"></textarea>
						</div>
						<div class="text-right">
							<button class="btn btn-danger btn_form_output">送出訂單</button>
						</div>
					</form>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery';

	export default {
		data() {
			return {
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
				},
			};
		},
		computed: {
			cart(){
				return this.$store.state.cart;
			},
			hasCoupon(){
				return this.$store.state.hasCoupon;
			},
		},

		created() {
			this.getCart();

			// 從 /Navbar.vue removeCart(id) 傳來 
			this.$bus.$on('regetCart', () => {
				console.log('regetCart');
				this.getCart();
			});
		},

		methods: {
			// 取得購物車列表
			getCart() {
				this.$store.dispatch('getCart');
			},

			removeCart(id) {
				this.$store.dispatch('removeCart', id);
			},

			createOrder() {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
				vm.$store.dispatch('updateLoading', true);

				const order = vm.form;

				// Vee-validate驗證表單，如果有不符合規定的欄位就會阻止前往下一頁
				// 也可直接在 html 裡的 input 上下 required 的語法
				vm.$validator.validate().then((result) => {
					if (result) {
						vm.axios.post(url, { data: order }).then((response) => {
							console.log('訂單已建立', response);
							vm.$store.dispatch('updateLoading', false);
							if (response.data.success) {
								vm.$router.push(`/Payment/${response.data.orderId}`)
							} 
						});
					}
				});
			},

			// 套用優惠碼
			addCouponCode() {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
				vm.$store.dispatch('updateLoading', true);
				const coupon = {
					code: vm.coupon_code,
				}

				this.$http.post(url, { data: coupon }).then((response) => {
					console.log(response);
					vm.getCart();
					vm.$store.dispatch('updateLoading', false);

					// 傳給 /Navbar.vue
					// 套用優惠券後，購物車列表也要同步更新折扣後價格
					this.$bus.$emit('couponRegetCart')
				});
			},

			backtoHome() {
				this.$router.push('/');
			}
		},
	};
</script>