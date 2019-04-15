<template>
	<header class="banner">
		<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
			<ol class="carousel-indicators">
				<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
				<li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
				<li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
			</ol>
			<div class="carousel-inner">
				<div class="carousel-item active">
					<img class="d-block w-100" src="../assets/banner/ban1.jpg" alt="First slide">
				</div>
				<div class="carousel-item">
					<img class="d-block w-100" src="../assets/banner/ban1.jpg" alt="First slide">
				</div>
				<div class="carousel-item">
					<img class="d-block w-100" src="../assets/banner/ban1.jpg" alt="First slide">
				</div>
			</div>
		</div>

		<div class="logo_slogan_all">
			<router-link class="logo-all" to="/">
				<img class="logo" src="../assets/clock_logo.png" alt>
			</router-link>

			<div class="slogan_all">
				<p class="slogan">To value your time.</p>
				<p class="slogan-ch">珍惜生命每個時光</p>
			</div>
		</div>
	</header>
</template>


