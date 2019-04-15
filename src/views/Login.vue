<template>
	<div>
		<form class="form-signin" @submit.prevent="signin">
			<img class="mb-4" src="/docs/4.3/assets/brand/bootstrap-solid.svg" alt width="72" height="72">
			<h1 class="h3 mb-3">會員登入</h1>
			<label for="inputEmail" class="sr-only">Email address</label>
			<input
				type="email"
				id="inputEmail"
				class="form-control"
				placeholder="Email address"
				required
				autofocus
				v-model="user.username"
			>
			<label for="inputPassword" class="sr-only">Password</label>
			<input
				type="password"
				id="inputPassword"
				class="form-control"
				placeholder="Password"
				required
				v-model="user.password"
			>
			<button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
		</form>
	</div>
</template>

<style scoped lang="scss">
	$main-color3: #5a6c7d;
	h1 {
		color: $main-color3;
	}

	input {
		border-radius: 0;
	}

	.btn {
		background-color: $main-color3;
		border-radius: 0;
	}
</style>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				//  對照 API 裡的參數
				user: {
					username: '',
					password: '',
				}
			}
		},
		methods: {
			signin() {
				const api = `${process.env.VUE_APP_APIPATH}/admin/signin`;
                const vm = this;

                // 登入的 API 需傳入使用者帳密: 參數 (vm.user)
				this.$http.post(api, vm.user).then((response) => {
                    console.log(response.data);
                    if(response.data.success) {
                        vm.$router.push('/admin/products');
                    }
				})
			}
		}
	}
</script>

<style scoped>
	html,
	body {
		height: 100%;
	}

	body {
		display: -ms-flexbox;
		display: flex;
		-ms-flex-align: center;
		align-items: center;
		padding-top: 40px;
		padding-bottom: 40px;
		background-color: #f5f5f5;
	}

	.form-signin {
		width: 100%;
		max-width: 330px;
		padding: 15px;
		margin: auto;
	}
	.form-signin .checkbox {
		font-weight: 400;
	}
	.form-signin .form-control {
		position: relative;
		box-sizing: border-box;
		height: auto;
		padding: 10px;
		font-size: 16px;
	}
	.form-signin .form-control:focus {
		z-index: 2;
	}
	.form-signin input[type="email"] {
		margin-bottom: -1px;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}
	.form-signin input[type="password"] {
		margin-bottom: 10px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
</style>

