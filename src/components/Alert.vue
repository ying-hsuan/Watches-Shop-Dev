<template>
	<div class="alert_all">
		<div class="overlay"></div>
		<div class="alert_msg_all">
			<!-- 根據不同狀態綁定樣式 (status) -->
			<div
				class="alert_msg d-flex justify-content-between"
				:class="'alert-' + item.status"
				v-for="(item, i) in alertMsgs"
				:key="i"
			>
				<p>{{ item.message }}</p>

				<button type="button" class="btn_close" @click="removeMessage(i)" aria-label="Close">
					<span class="close_txt" aria-hidden="true">&times;</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.alert_all {
		.overlay {
			display: none;
			position: fixed;
			top: 0;
			width: 100%;
			height: 100vh;
			background-color: rgba(255, 255, 255, 0.5);
			z-index: 1000;
		}

		.alert_msg_all {
			max-width: 180px;
			// width: 300px;
			position: fixed;
			top: 30vh;
			left: 0;
			right: 0;
			margin: 0 auto;
			text-align: center;
			box-shadow: 2px 2px 5px rgb(204, 204, 204);
			z-index: 1100;

			p {
				margin: 0;
			}

			.alert_msg {
				font-size: 16px;
				padding: 8px 15px;
			}

			.btn_close {
				padding: 0;
				border: 0;
				background-color: transparent;
				margin-left: 10px;
				.close_txt {
					font-size: 12px;
				}
			}
		}
	}
</style>

<script>
	export default {
		name: 'Navbar',
		data() {
			return {
				// 放彈出的訊息內容
				// 更新進來的資料屬性會是以下幾項
				// alertMsgs: [{
				//		message: '訊息內容',
				//		status: 'danger',  //樣式
				// 		timestamp: 123  // 類似 id
				// }],

				alertMsgs: [],
			};
		},
		computed: {
			
		},
		methods: {
			// 加入訊息的屬性，然後把自己移除
			updateMessage(message, status) {
				// 把 timestamp 轉成整數
				const timestamp = Math.floor(new Date() / 1000);
				this.alertMsgs.push({
					message,
					status,
					timestamp,
				});
				
				this.removeMessageWithTiming(timestamp);

				document.querySelector('.overlay').style.display = "block";
			},

			// 五秒過後自動刪除自己，從 updateMessage 裡傳進來的 timestamp參數才會自動移除
			removeMessageWithTiming(timestamp) {
				const vm = this;
				setTimeout(() => {
					vm.alertMsgs.forEach((item, i) => {
						if (item.timestamp === timestamp) {
							vm.alertMsgs.splice(i, 1);
						}
					});
					document.querySelector('.overlay').style.display = "none";
				}, 2000);
			},

			// 手動刪除
			removeMessage(num) {
				this.alertMsgs.splice(num, 1);
				document.querySelector('.overlay').style.display = "none";
			},
		},
		created() {
			const vm = this;

			// 0. 從 admin/Products.vue傳來
			// 1. 呼叫event bus，$bus 是在 bus.js 呼叫的變數
			// 2. 接收內層 ($on) 'messsage:push' 的方法，可自定義名稱 
			// 3. 傳入參數 
			// 		=> message: data裡的變數，
			// 		=> status: 樣式，預設值為 warning
			// 4. 執行更新訊息的方法
			vm.$bus.$on('messsage:push', (message, status = 'warning') => {
				vm.updateMessage(message, status);
			});
		},
	};
</script>