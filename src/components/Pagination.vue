<template>
	<div>
		<nav aria-label="Page navigation example">
			<ul class="pagination d-flex justify-content-center">
				<!-- 前一頁 -->
				<!-- 前一頁是 getProducts方法傳入當前頁數 -1 的頁面-->
				<li
					class="page-item"
					:class="{'disabled': !pages.has_pre}"
					@click.prevent="updatePage(pages.current_page - 1)"
				>
					<a class="page-link" href="#" aria-label="Previous">
						<span aria-hidden="true">&laquo;</span>
					</a>
				</li>

				<!-- 當下的頁數 -->
				<!-- 如果後端的 current_page屬性值等於當下的第幾頁就套用 active 樣式-->
				<li
					class="page-item"
					v-for="page in pages.total_pages"
					:key="page"
					:class="{'active': pages.current_page === page}"
				>
					<a class="page-link" href="#" @click.prevent="updatePage(page)">{{ page }}</a>
				</li>

				<!-- 下一頁 -->
				<li
					class="page-item"
					:class="{'disabled': !pages.has_next}"
					@click.prevent="updatePage(pages.current_page + 1)"
				>
					<a class="page-link" href="#" aria-label="Next">
						<span aria-hidden="true">&raquo;</span>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</template>

<style scoped lang="scss">
	$main-color4: #5a6c7d;

	.page-link{
		color: $main-color4;
		&:focus {
			box-shadow: 0px 0px 0px;
		}
	}

	.page-item.active .page-link {
		background-color: $main-color4;
		border-color: $main-color4;
	}

	
</style>

<script>
	export default {
		// 從父組件 Products.vue 傳過來的參數，代表父組件裡的 pagination 參數
		props: ['pages'],
		data() {
			return {

			}
		},
		methods: {
			// page: 在 pagination 裡的每一頁
			// $emit: 往父組件 Products.vue 傳送 emitPages 的方法，在父組件裡調用 getProducts 的方法
			// 效果: 點擊第幾頁就能前往那一頁面
			updatePage(page) {
				this.$emit('emitPages', page);
			}
		},
	}
</script>