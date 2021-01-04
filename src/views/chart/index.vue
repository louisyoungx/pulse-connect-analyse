<template>
	<van-nav-bar title="Pulse-Chart" left-text="返回" left-arrow>
		<template #right>
			<van-icon name="search" size="18" />
		</template>
	</van-nav-bar>
	<div class="chart-main">
		<br>
		<br>
		<div class="Echarts">
			<div id="main" style="width: 100vw;height: 50vh"></div>
		</div>
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
					title:{
						left: 'center',
						text: '心电图',
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
			}
		},
		mounted() {
			this.main(5000, 100, 100);
		},
		methods:{
			TCPClient() {
				// 创建一个Socket实例bai
				var socket = new WebSocket("ws://louisyoung.work:12000");
				var that = this;
				// 打开Socket
				socket.onopen = function(event) {
					// 发送初始化消息
					socket.send("Receiver Ready");
					that.$toast.success('连接服务器成功');
					console.log("Receiver Ready");

					var self = that
					// 监听消息
					socket.onmessage = function(event) {
						self.DATA.shift()
						self.DATA.push(event.data)
						console.log(event.data);
					};

					// 监听Socket的关闭
					socket.onclose = function(event) {
						that.$toast.fail('断开连接');
						console.log("Connection closed");
					};

					// 关闭Socket…
					//socket.close()
				};
			},

			init(Num) {
				let i = 1;
				this.DATA = [];
				this.VALUE = [];
				this.DATALength = Num;
				// 初始化，Num决定图表长度
				while (true) {
					this.DATA.push(0)
					this.VALUE.push("time")
					if (i === Num) {
						i = null;
						break;
					}
					i ++;
				}
			},

			main(Num, Speed, Flash) {
				/* Num：数据显示宽度
				 * Speed：单次更新个数
				 * Flash：更新间隔时间
				 */


				// 数据初始化
				this.init(Num)
				// console.log(this.DATA);

				// 建立WebSocket连接
				this.TCPClient()

				// 基于准备好的dom，初始化echarts实例
				this.GlobalInit()
				// this.RequireInit()

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
				// 更新图表
				setInterval(function () {
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

<style scoped>
	.chart-main{
		background-color: #fff;
	}
</style>
