<template>
	<div class="home-main">
		<p></p>
		<h1>脉搏悦动</h1>
		<h2>Pulse Chart</h2>
		<div class="Echarts">
			<div id="main" style="width: 100vw;height: 50vh"></div>
		</div>
		<p></p>
	</div>
	<nav-buttom></nav-buttom>
</template>

<script>
	import NavButtom from "../../components/NavButtom";
	import pulse from "../../assets/js/fakeData";
	export default {
		name: "index",
		components: {NavButtom},
		data() {
			return{
				myChart:{},
				options:{
					// Make gradient line here
					visualMap: {
						show: false,
						type: 'continuous',
						seriesIndex: 1,
						dimension: 0,
						min: 0,
						max: this.DATALength - 1
					},
					tooltip: {
						trigger: 'axis'
					},
					xAxis: {
						type: 'category',
						data: this.VALUE
					},
					yAxis: {
						boundaryGap: [0, '80%'],
						type: 'value',
						scale:true
					},
					series: [{
						data: this.DATA,
						type: 'line',
						smooth: true,
						symbol: 'none',
					}]
				},
				DATA: [],
				VALUE: [],
				DATALength: 0,
				TEMP:[],
			}
		},
		mounted() {
			this.main(150, 1, 20);
		},
		beforeRouteEnter(to, from, next) {
			next(vm=>{
				if (from.path !== "/") {
					location.reload();
				}
			})
		},
		methods:{
			main(Num, Speed, Flash) {
				let i = 1;
				this.DATA = [];
				this.VALUE = [];
				this.TEMP = [];

				let Now = new Date();
				let hour = Now.getHours();       //获取当前小时数(0-23)
				let min = Now.getMinutes();     //获取当前分钟数(0-59)
				let sec = Now.getSeconds();     //获取当前秒数(0-59)
				let time = hour.toString() + ":" + min.toString() + ":" + sec.toString()

				this.TEMP = Array.from(pulse.pulseData)

				for (let item in pulse.pulseData){
					i++;
					let value = pulse.pulseData.shift();
					this.DATA.push(value)
					this.VALUE.push(time)
					if (i === Num){
						break;
					}
				}


				this.DATALength = this.DATA.length;


				/// console.log(this.DATA);

				// 基于准备好的dom，初始化echarts实例
				this.GlobalInit()

				// 绘制图表
				this.myChart.setOption(this.options);

				this.myChart.setOption({
					xAxis: {
						data: this.VALUE
					},
					series: [{
						data: this.DATA
					}]
				});

				const that = this;
				setInterval(function () {
					Now = new Date();
					hour = Now.getHours();       //获取当前小时数(0-23)
					min = Now.getMinutes();     //获取当前分钟数(0-59)
					sec = Now.getSeconds();     //获取当前秒数(0-59)
					time = hour.toString() + ":" + min.toString() + ":" + sec.toString()

					if (pulse.pulseData.length < 10) {
						pulse.pulseData = Array.from(that.TEMP)
					}

					// console.log(pulse.pulseData.length);
					// console.log(pulse.pulseData);

					for (let i = 0; i < Speed; i++) {
						let value = pulse.pulseData.shift();
						that.DATA.shift();
						that.DATA.push(value);
						that.VALUE.shift();
						that.VALUE.push(time);
					}

					that.myChart.setOption({
						series: [{
							data: that.DATA
						}]
					});
				}, Flash);
			},

			GlobalInit() {
				// 全局引入
				const echarts = require('echarts');
				// 基于准备好的dom，初始化echarts实例
				this.myChart = echarts.init(document.getElementById('main'));
			},

			RequireInit() {
				// 按需引入
				// 引入 ECharts 主模块
				const echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/bar');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/title');
				this.myChart = echarts.init(document.getElementById('main'));
			},
		}
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
