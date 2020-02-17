<template>
	<div class="message-alert">
        <!-- 根據不同狀態綁定樣式 (status) -->
		<div
			class="alert alert-dismissible"
			:class="'alert-' + item.status"
			v-for="(item, i) in messages"
			:key="i"
		>
			{{ item.message }}
			<button
				type="button"
				class="close"
				@click="removeMessage(i)"
				aria-label="Close"
			>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Navbar',
		data() {
			return {
				// 放彈出的訊息內容
				// 更新進來的資料屬性會是以下幾項
				// messages: [{
                //		message: '訊息內容',
				//		status: 'danger',  //樣式
				// 		timestamp: 123  // 類似 id
				// }],

				messages: [],
			};
		},
		methods: {
			// message, status：接收 / Products.vue $bus 的參數
			// this.$bus.$emit('messsage:push', 'response.data.message', 'danger');
			updateMessage(message, status) {
                // 把 timestamp 轉成整數
				const timestamp = Math.floor(new Date() / 1000);
				this.messages.push({
					message,
					status,
					timestamp,
				});
				this.removeMessageWithTiming(timestamp);
			},

			// 手動刪除
			removeMessage(num) {
				this.messages.splice(num, 1);
			},

			// 五秒過後自動刪除自己，從 updateMessage 裡傳進來的 timestamp參數才會自動移除
			removeMessageWithTiming(timestamp) {
				const vm = this;
				setTimeout(() => {
					vm.messages.forEach((item, i) => {
						if (item.timestamp === timestamp) {
							vm.messages.splice(i, 1);
						}
					});
				}, 5000);
			},
		},
		created() {
			const vm = this;

			// 1. 呼叫event bus，$bus 是在 bus.js 呼叫的變數
			// 2. 接收內層 ($on) 'messsage:push' 的方法，可自定義名稱 
			// 3. 傳入參數 
			// 		=> message: data裡的變數，
			// 		=> status: 樣式，預設值為 warning
			// 4. 執行更新訊息的方法
			// 對照 bus.js、 Products.vue檔案
			vm.$bus.$on('messsage:push', (message, status = 'warning') => {
				vm.updateMessage(message, status);
			});
		},
	};
</script>

<style scope>
	.message-alert {
		position: fixed;
		max-width: 50%;
		top: 56px;
		right: 20px;
		z-index: 1100;
	}
</style>