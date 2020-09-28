<template>
	<div id="app">
		<router-view/>

		<!-- 所有元件統一使用這個 loading 效果 -->
		<loading :active.sync="isLoading"></loading>
	</div>
</template>

<script>
	export default {
		computed: {
			isLoading(){
				return this.$store.state.isLoading;
			}
		},
	}
</script>

<style lang="scss">
	// 統一管理 scss 樣式
	@import "./assets/all";
</style>
