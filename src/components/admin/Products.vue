<template>
	<div>
		<loading :active.sync="isLoading"></loading>

		<div class="text-right">
			<!-- data-target 是對應下方 modal 的 id -->
			<!-- <button class="btn btn-primary mt-4" data-toggle="modal" data-target="#productModal">建立新的產品</button> -->
			<!-- openModal(true)代表 isNew 是 true，所以給按鈕一個新物件 -->
			<button class="btn btn-primary mt-4" @click="openModal(true)">建立新的產品</button>
		</div>

		<!-- 產品列表 -->
		<table class="table mt-4">
			<thead>
				<tr>
					<th width="120">分類</th>
					<th>產品圖片</th>
					<th>產品名稱</th>
					<th width="120">原價</th>
					<th width="120">售價</th>
					<th width="80">是否啟用</th>
					<th width="150">編輯</th>
				</tr>
			</thead>
			<tbody>
				<!-- 如果報錯就必須加上 :key，綁定一個唯一的值跟其他資料區分，
				item.id 是唯一的-->
				<!-- 如果 (item, key) 的 key 還沒用到的時候，會報錯 -->
				<tr v-for="item in products" :key="item.id">
					<td>{{ item.category }}</td>
					<td><img :src="item.imageUrl" style="width: 50px"></td>
					<td>{{ item.title }}</td>
					<td class="text-right">{{ item.origin_price | currency }}</td>
					<td class="text-right">{{ item.price | currency }}</td>
					<td>
						<span v-if="item.is_enabled" class="text-success">啟用</span>
						<span v-else>未啟用</span>
					</td>
					<td>
						<button class="btn btn-outline-primary btn-sm product_btn" @click="openModal(false, item)">編輯</button>
						<button class="btn btn-outline-danger btn-sm product_btn" @click="openDelModal(item)">刪除</button>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- 分頁 pagination -->
		<!--
			1. 為了把 pagination 資料傳送到子組件 Pagination.vue 組件裡，
			所以用 :pages 傳到子組件裡
			2. @emitPages 是從子組件傳過來的方法，調用這裡的 getProducts 
		-->
		<Pagination :pages="pagination" @emitPages="getProducts"></Pagination>

		<!-- 建立商品視窗: modal -->
		<div
			class="modal fade"
			id="productModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="exampleModalLabel"
			aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content border-0">
					<div class="modal-header bg-dark text-white">
						<h5 class="modal-title" id="exampleModalLabel">
							<span>新增產品</span>
						</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<div class="row">
							<div class="col-sm-4">
								<div class="form-group">
									<label for="image">輸入圖片網址</label>
									<input
										type="text"
										class="form-control"
										id="image"
										placeholder="請輸入圖片連結"
										v-model="tempProduct.imageUrl"
									>
								</div>
								<div class="form-group">
									<label for="customFile">或 上傳圖片
										<!-- 如果有上傳圖片的時候才會顯示動態效果，fileUploading = true  -->
										<i class="fas fa-spinner fa-spin" v-if="fileUploading"></i>
									</label>
									<input type="file" id="customFile" class="form-control" ref="files" @change="uploadFile">
								</div>
								<img
									img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
									class="img-fluid"
									:src="tempProduct.imageUrl"
									alt
								>
							</div>
							<div class="col-sm-8">
								<div class="form-group">
									<label for="title">標題</label>
									<input
										type="text"
										class="form-control"
										id="title"
										placeholder="請輸入標題"
										v-model="tempProduct.title"
									>
								</div>

								<div class="form-row">
									<div class="form-group col-md-6">
										<label for="category">分類</label>
										<input
											type="text"
											class="form-control"
											id="category"
											placeholder="請輸入分類"
											v-model="tempProduct.category"
										>
									</div>
									<div class="form-group col-md-6">
										<label for="price">單位</label>
										<input
											type="unit"
											class="form-control"
											id="unit"
											placeholder="請輸入單位"
											v-model="tempProduct.unit"
										>
									</div>
								</div>

								<div class="form-row">
									<div class="form-group col-md-6">
										<label for="origin_price">原價</label>
										<input
											type="number"
											class="form-control"
											id="origin_price"
											placeholder="請輸入原價"
											v-model="tempProduct.origin_price"
										>
									</div>
									<div class="form-group col-md-6">
										<label for="price">售價</label>
										<input
											type="number"
											class="form-control"
											id="price"
											placeholder="請輸入售價"
											v-model="tempProduct.price"
										>
									</div>
								</div>
								<hr>

								<div class="form-group">
									<label for="description">產品描述</label>
									<textarea
										type="text"
										class="form-control"
										id="description"
										placeholder="請輸入產品描述"
										v-model="tempProduct.description"
									></textarea>
								</div>
								<div class="form-group">
									<label for="content">說明內容</label>
									<textarea
										type="text"
										class="form-control"
										id="content"
										placeholder="請輸入產品說明內容"
										v-model="tempProduct.content"
									></textarea>
								</div>
								<div class="form-group">
									<div class="form-check">
										<!-- is_enabled 有 1 跟 0 的切換，
										所以需要動態綁定 true 和 false value-->
										<input
											class="form-check-input"
											type="checkbox"
											id="is_enabled"
											v-model="tempProduct.is_enabled"
											:true-value="1"
											:false-value="0"
										>
										<label class="form-check-label" for="is_enabled">是否啟用</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
						<button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
					</div>
				</div>
			</div>
		</div>

		<!-- 刪除商品視窗 -->
		<div
			class="modal fade"
			id="delProductModal"
			tabindex="-1"
			role="dialog"
			aria-labelledby="exampleModalLabel"
			aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content border-0">
					<div class="modal-header bg-danger text-white">
						<h5 class="modal-title" id="exampleModalLabel">
							<span>刪除產品</span>
						</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						是否刪除
						<strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
						<button type="button" class="btn btn-danger" @click="delProduct">確認刪除</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery';	// 匯入 jquery 的 "$" 字號
	import Pagination from '../Pagination.vue';  // 匯入分頁元件

	export default {
		data() {
			return {
				products: [],  // 商品列表
				pagination: {},

				// 新增產品的那一筆資料，綁定在modal欄位裡
				tempProduct: {},
				isNew: false,
				isLoading: false,  // 讀取效果的開關
				fileUploading: false,  // 上傳檔案的讀取效果(小的轉圈圈)
			}
		},

		components: {
			Pagination,
		},

		methods: {
			// 取得商品列表
			getProducts(page = 1) {
				const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products?page=${page}`;

				// 把撈回來的資料存到 data 裡的 products 裡，也就是此時的 "vm"，然後在 html 裡印出
				const vm = this;
				vm.isLoading = true;
				this.$http.get(api).then((response) => {
					console.log(response.data);

					if (response.data.success) {
						vm.isLoading = false;

						// 把撈回來的產品列表存回 data 裡的 products
						vm.products = response.data.products;
						vm.pagination = response.data.pagination;
					}
				})
			},

			// 新增或編輯產品，綁定在 "建立新的產品" 和 "編輯" 按鈕上
			openModal(isNew, item) {
				// 如果要建立新產品，就把 isNew 設為 true，並且給 tempProduct 一個空物件
				// 如果要編輯商品內容，就把 isNew 設為 false，並且將 item 傳入 tempProduct，此時的 item 是既有的商品 
				if (isNew) {
					this.tempProduct = {};
					this.isNew = true;
				} else {
					// Object.assign 會把 item 傳入空的物件裡，可避免等號右邊的數值等於左邊，此為 ES6 物件傳參考的特性
					this.tempProduct = Object.assign({}, item);
					this.isNew = false;
				}

				$('#productModal').modal('show');
			},

			// 新增產品或編輯產品調用的方法，綁定在 Modal 裡的 "確認" 按鍵上，然後存到 "tempProduct" 變數裡
			updateProduct() {
				const vm = this;
				let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;

				// 一開始新增產品的 API 方法是 post
				let httpMethod = 'post';

				if (!vm.isNew) {
					api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
					httpMethod = 'put';
				}

				// 因為 API 的參數裡有槽狀結構，最外層是 "data" 屬性，所以參數必須用物件型式傳入: { data: vm.tempProduct }
				this.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => {
					console.log(response.data)
					if (response.data.success) {
						$('#productModal').modal('hide');
						vm.getProducts();  // 新增產品完，需再次取得產品資料
					} else {
						$('#productModal').modal('hide');
						vm.getProducts();  // 新增產品完，需再次取得產品資料
						console.log('新增失敗')
					}
				})
			},

			// 打開刪除的視窗，綁定在 "刪除" 按鈕上
			openDelModal(item) {
				$('#delProductModal').modal('show');
				this.tempProduct = Object.assign({}, item);
			},

			// 刪除產品，綁定在 Modal 裡 "確認刪除" 按鈕上
			delProduct() {
				const vm = this;
				const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;

				this.$http.delete(api).then((response) => {
					console.log(response.data)
					$('#delProductModal').modal('hide');
					vm.getProducts();  // 刪除產品完，需再次取得產品資料
				})
			},

			// 上傳檔案
			uploadFile() {
				console.log(this);  // this 是 VueComponent 物件
				const uploadedFile = this.$refs.files.files[0];  // 取出上傳的檔案
				const vm = this;

				// 建立 formData 物件，上傳檔案必須使用 formData 規定的型式
				const formData = new FormData();

				// 然後加入你要新增的欄位和檔案
				formData.append('file-to-upload', uploadedFile);

				const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`;

				// 當上傳圖片的時候就開啟讀取效果開關
				vm.fileUploading = true;

				// 送出 formData 的規定寫法
				this.$http.post(api, formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}).then((response) => {
					console.log(response.data);

					// 撈完資料後就關閉讀取效果
					vm.fileUploading = false;

					// 
					if (response.data.success) {
						// 此時 tempProduct.image 裡並沒有包含 getter 與 setter，所以並沒有正確寫入資料，所以需要用 "$set" 強制寫入
						// vm.tempProduct.imageUrl = response.data.imageUrl;  // 存入 tempProduct
						console.log(vm.tempProduct);

						//     1.被存入的資料 2.資料裡的欄位 3.要存入什麼資料
						vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl)
					} else {
						// 對照 bus.js、 Alert.vue檔案
						// 透過 event bus 往外層傳送 ($emit) 要顯示的錯誤訊息內容
						this.$bus.$emit('messsage:push', 'response.data.message', 'danger');
					}
				});
			}
		},

		// 當畫面載入完畢就執行
		created() {
			this.getProducts();
		}
	}
</script>


	