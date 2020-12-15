<template>
	<div class="home-main">
		<p></p>
		<h1>Xiao</h1>
		<h2>Pulse Chart</h2>
		<p></p>
	</div>
	<nav-buttom></nav-buttom>
</template>

<script>
	import NavButtom from "../../components/NavButtom";
	export default {
		components: {NavButtom},
	}
</script>

<style lang="scss" scoped>
	.home-main{
		color: #2c3e50;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		flex-wrap: wrap;
		text-align: center;
		h1 {
			width: 100vw;
		}
		h2 {
			width: 100vw;
		}
		p {
			height: 5vh;
			width: 100vw;
		}
	}
</style>
