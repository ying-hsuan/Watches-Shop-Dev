<template>
	<footer>
		<div class="container footer_content">
			<div class="d-flex justify-content-center icon_row">
				<a class="contact_icon" href="#">
					<i class="fab fa-facebook-f"></i>
				</a>
				<a class="contact_icon" href="#">
					<i class="fab fa-github"></i>
				</a>
				<a class="contact_icon" href="#">
					<i class="fab fa-instagram"></i>
				</a>
				<a class="contact_icon" href="#">
					<i class="far fa-envelope"></i>
				</a>
			</div>
			<p class="text-center copyright">
				© Copright {{nowYears}} by Kayla
				<br>
				個人練習用，無商業用途
			</p>
		</div>
	</footer>
</template>

<script>
export default {
	computed: {
		nowYears(){
			let date = new Date();
			return date.getFullYear();
		}
	},
}
</script>