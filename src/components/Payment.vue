<template>
	<div class="container orderlist_all">
		<!-- <loading :active.sync="isLoading"></loading> -->
		<!-- <div class="overlay"></div> -->
		<!-- 購物流程 -->
		<section class="d-flex justify-content-center mt-4">
			<div class="step_all mb-4">
				<div class="step_list text-center active">
					<div class="step">
						<div class="step_txt">1</div>
					</div>
					<p class="step_ct">輸入資料</p>
					<div class="bg_line_all"></div>
				</div>

				<div class="step_list text-center">
					<div class="step">
						<div 
							class="step_txt step_txt2"
							:class="{'active': !order.is_paid }">
							2
						</div>
					</div>
					<p class="step_ct">金流付款</p>
				</div>
				<div class="step_list text-center">
					<div class="step">
						<div 
							class="step_txt step_txt3"
							:class="{'active': order.is_paid}">
							3
						</div>
					</div>
					<p class="step_ct">完成</p>
				</div>
			</div>
		</section>
		
		<div class="row justify-content-center text-left">
			<div class="col-md-8">
				<form class @submit.prevent="payOrder">
					<table class="table table_pdlist">
						<thead>
							<th colspan="4">購物明細</th>
						</thead>
						<tbody>
							<tr class="cart_menu_title">
								<td></td>
								<td>品名</td>
								<td>數量</td>
								<td class="text-right">單價</td>
							</tr>
							<tr v-for="item in order.products" :key="item.id">
								<td>
									<img class="pd_img" :src="item.product.imageUrl" alt>
								</td>
								<td class="align-middle">{{ item.product.title }}</td>
								<td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
								<td class="align-middle text-right">{{ item.final_total | currency}}</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="4" class="text-right total_txt">總計 {{ order.total | currency}}</td>
							</tr>
						</tfoot>
					</table>

					<table class="table table_user">
						<thead>
							<th colspan="2">個人資訊</th>
						</thead>
						<tbody>
							<tr>
								<th width="100">Email</th>
								<td>{{ order.user.email }}</td>
							</tr>
							<tr>
								<th>姓名</th>
								<td>{{ order.user.name }}</td>
							</tr>
							<tr>
								<th>收件人電話</th>
								<td>{{ order.user.tel }}</td>
							</tr>
							<tr>
								<th width="120">收件人地址</th>
								<td>{{ order.user.address }}</td>
							</tr>
							<tr class="pay_status_row">
								<th>付款狀態</th>
								<td>
									<span class="not_paid" v-if="!order.is_paid">尚未付款</span>
									<span v-else class="text-success paid_finish">付款完成</span>
								</td>
							</tr>
						</tbody>
					</table>
					<div class="text-right btn_group">
						<button class="btn btn-danger btn_goto_pay" v-if="!order.is_paid" @click="emptyCart">確認付款去</button>
						<button class="btn btn_backto_pd" @click="backtoHome" v-else>&lt;&nbsp; 回到產品列表</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				order: {
					user: {},
				},
				orderId: '',
				cart: {
					carts: [],
				},
				// isLoading: false,
			}
		},

		methods: {
			getOrder() {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order/${vm.orderId}`;
				vm.$store.dispatch('updateLoading', true);
				this.$http.get(url).then((response) => {
					console.log(response);
					vm.order = response.data.order;
					vm.$store.dispatch('updateLoading', false);
				});
			},

			payOrder() {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/pay/${vm.orderId}`;
				vm.$store.dispatch('updateLoading', true);
				this.$http.post(url).then((response) => {
					console.log(response);
					if (response.data.success) {
						vm.getOrder();   // 重新取得訂單列表，會顯示是否付款

						const timestamp = Math.floor(new Date() / 1000);

						let paySuccessAlert = {
							alertMsg: "已付款完成",
							status: "success",
							timestamp
						}	

						vm.$store.dispatch('updateAlert', paySuccessAlert)
						// vm.$bus.$emit('messsage:push', '已付款完成', 'success');

						vm.$store.dispatch('updateLoading', false);
					} 
				});
				// document.querySelector('.overlay').style.display = "block";
			},

			getCart() {
				const vm = this;
				const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
				this.$http.get(url).then((response) => {
					console.log(response);
					vm.cart = response.data.data;
				});
			},

			emptyCart() {
				this.$bus.$emit('emptyCart');
				// cart.carts = [];
			},

			backtoHome() {
				this.$router.push('/');
				// this.$bus.$emit('emptyCart');
			}
		},

		created() {
			// $route.params: 把網址列上的 id 取出來的方法
			// 對應路由上的 "orderId"，兩者名稱必須一樣
			this.getCart();
			this.orderId = this.$route.params.orderId;
			console.log(this.orderId)
			this.getOrder();
		},
	}
</script>