<template>
	<div class="home">
		<Navbar/>
		<Alert/>
		<router-view/>
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
