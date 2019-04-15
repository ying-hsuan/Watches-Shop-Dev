<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
	export default {
		// created() {
        //     // 2. 貼上自己的 APIPath (ying)
        //     // 3. 加上 API 伺服器路徑
        //     const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products`
            
		// 	console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH)
			
        //     // 1. 使用 axios 套件向遠端撈取資料 (this.$http...)
		// 	this.$http.get(api).then((response) => {
		// 		console.log(response.data)
		// 	})
		// }
	}
</script>

<style lang="scss">
	// 統一管理 scss 樣式
	@import "./assets/all";
</style>
