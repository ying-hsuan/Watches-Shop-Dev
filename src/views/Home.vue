<template>
	<div class="home">
		<Navbar/>
		<Alert/>
		
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>

		<router-view v-if="!$route.meta.keepAlive">
			<!-- 不用 cache 的分頁 -->
		</router-view>
		
		<Footer/>
	</div>
</template>

<script>
	import Navbar from '@/components/Navbar.vue';
	import Alert from '@/components/Alert.vue';
	import Footer from '@/components/Footer.vue';

	export default {
		name: 'home',
		components: {
			Navbar,
			Alert,
			Footer
		},
	}
</script>
