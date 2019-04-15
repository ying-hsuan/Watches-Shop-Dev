<template>
	<div>
		<loading :active.sync="isLoading"></loading>

		<div class="text-right">
			<button class="btn btn-primary mt-4" @click="openCouponModal(true)">新增優惠券</button>
		</div>

		<!-- 優惠券列表 -->
		<table class="table mt-4">
			<thead>
				<tr>
					<th width="120">標題</th>
					<th>優惠碼</th>
					<th width="120">到期日</th>
					<th width="120">折扣百分比</th>
					<th width="80">是否啟用</th>
					<th width="150">編輯</th>
				</tr>
			</thead>
			<tbody>
				<!-- 如果報錯就必須加上 :key，綁定一個唯一的值跟其他資料區分，
				item.id 是唯一的-->
				<!-- 如果 (item, key) 的 key 還沒用到的時候，會報錯 -->
				<tr v-for="item in coupons" :key="item.id">
					<td>{{ item.title }}</td>
					<td>{{ item.code }}</td>
					<td class="text-right">{{ item.due_date }}</td>
					<td class="text-right">{{ item.percent }}</td>
					<td>
						<span v-if="item.is_enabled" class="text-success">啟用</span>
						<span v-else>未啟用</span>
					</td>
					<td>
						<button
							class="btn btn-outline-primary btn-sm product_btn"
							@click="openCouponModal(false, item)"
						>編輯</button>
						<button class="btn btn-outline-danger btn-sm product_btn" @click="delCoupon(item)">刪除</button>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- 分頁 pagination -->
		<Pagination :pages="pagination" @emitPages="getCoupons"></Pagination>

		<!-- 建立優惠券 -->
		<div
			class="modal fade"
			id="couponModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="exampleModalLabel"
			aria-hidden="true"
		>
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label for="title">標題</label>
							<input
								type="text"
								class="form-control"
								id="title"
								v-model="tempCoupon.title"
								placeholder="請輸入標題"
							>
						</div>
						<div class="form-group">
							<label for="coupon_code">優惠碼</label>
							<input
								type="text"
								class="form-control"
								id="coupon_code"
								v-model="tempCoupon.code"
								placeholder="請輸入優惠碼"
							>
						</div>
						<div class="form-group">
							<label for="due_date">到期日</label>
							<input type="date" class="form-control" id="due_date" v-model="tempCoupon.due_date">
						</div>
						<div class="form-group">
							<label for="price">折扣百分比</label>
							<input
								type="number"
								class="form-control"
								id="price"
								v-model="tempCoupon.percent"
								placeholder="請輸入折扣百分比"
							>
						</div>
						<div class="form-group">
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									id="is_enabled"
									v-model="tempCoupon.is_enabled"
									:true-value="1"
									:false-value="0"
								>
								<label class="form-check-label" for="is_enabled">是否啟用</label>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						<button type="button" class="btn btn-primary" @click="updateCoupon">更新優惠券</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.product_btn {
		margin: 0 3px;
	}
</style>

<script>
	import $ from 'jquery';	// 匯入 jquery 的 "$" 字號
	import Pagination from '../Pagination.vue'  // 匯入分頁元件

	export default {
		data() {
			return {
				coupons: [],  // 商品列表
				pagination: {},
				tempCoupon: {
					title: "",
					is_enabled: 0,
					percent: 100,
					due_date: 0,
					code: "",
				},
				isNew: false,
				isLoading: false,  // 讀取效果的開關
			}
		},

		components: {
			Pagination,
		},

		methods: {
			// 新增或編輯產品，綁定在 "建立新的產品" 和 "編輯" 按鈕上
			openCouponModal(isNew, item) {
				if (isNew) {
					this.tempCoupon = {};
					this.isNew = true;
				} else {
					// Object.assign 會把 item 傳入空的物件裡，可避免等號右邊的數值等於左邊，此為 ES6 物件傳參考的特性
					this.tempCoupon = Object.assign({}, item);
					this.isNew = false;
				}

				$('#couponModal').modal('show');
			},

			getCoupons(page = 1) {
				const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`;

				const vm = this;
				vm.isLoading = true;
				this.$http.get(api).then((response) => {
					console.log(response.data);
					vm.isLoading = false;

					// 把撈回來的產品列表存回 data 裡的 products
					vm.coupons = response.data.coupons;
					vm.pagination = response.data.pagination;
				})
			},

			updateCoupon() {
				const vm = this;
				let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;

				// 一開始新增產品的 API 方法是 post
				let httpMethod = 'post';

				if (!vm.isNew) {
					api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
					httpMethod = 'put';
				}


				// 因為 API 的參數裡有槽狀結構，最外層是 "data" 屬性，所以參數必須用物件型式傳入: { data: vm.tempProduct }
				this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
					console.log(response.data)
					if (response.data.success) {
						$('#couponModal').modal('hide');
						vm.getCoupons();  // 新增產品完，需再次取得產品資料
					} else {
						$('#couponModal').modal('hide');
						vm.getCoupons();  // 新增產品完，需再次取得產品資料
						console.log('新增失敗')
					}
				})
			},

			delCoupon(item) {
				const vm = this;
				const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${item.id}`;

				this.$http.delete(api).then((response) => {
					console.log(response.data)
					// $('#delProductModal').modal('hide');
					vm.getCoupons();  // 刪除產品完，需再次取得產品資料
				})
			},

		},

		// 當畫面載入完畢就執行
		created() {
			this.getCoupons();
		}
	}
</script>


	