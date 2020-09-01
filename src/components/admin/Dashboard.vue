<template>
	<div class="dashboard_all">
		<Navbar></Navbar>
		<Alert></Alert>
		<div class="container-fluid">
			<div class="row justify-content-center">
				<main role="main">
					<router-view></router-view>
				</main>
			</div>
		</div>
	</div>
</template>

<script>
import Navbar from './Navbar';
import Alert from './Alert';


export default {
	components: {
		Navbar,
		Alert,
	}
}
</script>