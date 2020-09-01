<template>
	<nav class="my_navbar">
		<loading :active.sync="isLoading"></loading>

		<div class="flex admin">
			<a class="admin_title">管理員</a>
			<router-link class="menu" to="/admin/products">
				產品列表
			</router-link>
			<router-link class="menu" to="/admin/orders">
				訂單列表
			</router-link>
			<router-link class="menu" to="/admin/coupons">
				優惠券
			</router-link>
		</div>
		
		<div class="flex master">
			<router-link to="/" class="menu gohome">回首頁</router-link>
			<a class="menu" href="#" @click="signout">登出</a>
		</div>
	
	</nav>
</template>

<script>
	export default {
		name: 'Navbar',
		data() {
			return {
				isLoading: false,
			}
		},
		methods: {
			signout() {
				const vm = this;
				const api = `${process.env.VUE_APP_APIPATH}/logout`;

				vm.isLoading = true;
				this.$http.post(api).then((response) => {
					console.log(response.data);
					vm.isLoading = false;
					if(response.data.success) {
						vm.$router.push('/signin')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my_navbar{
		background-color: #5a6c7d;
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: bottom;
		padding: 15px 20px 12px 20px;
		flex-wrap: wrap;
		.admin_title {
			font-size: 20px;
			margin: 0 20px 0 0 ;
		}
	}
	.menu{
		display: block;
		margin: 0 10px 0 0;
		color: white;
		position: relative;
		top: 7px;
	}
	.flex{
		display: flex;
		justify-content: space-between;
		align-items: bottom;
	}
</style>