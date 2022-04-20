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
    <nav-bottom></nav-bottom>
</template>

<script>
    import NavBottom from "@/components/NavBottom";
    import pulse from "@/assets/js/fakeData";
    export default {
        name: "index",
        components: {NavBottom},
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
            main(Num, Speed, Flash) {
                let i = 1;
                this.DATA = [];
                this.VALUE = [];
                for (let item in pulse.pulseData){
                    i++;
                    let value = pulse.pulseData.shift();
                    this.DATA.push(value)
                    if (i === Num){
                        break;
                    }
                }

                for (let j = 0; j < Num; j++) {
                    this.VALUE.push("time")
                }

                this.DATALength = this.DATA.length;


                console.log(this.DATA);

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

                    for (let i = 0; i < Speed; i++) {
                        let value = pulse.pulseData.shift();
                        that.DATA.shift();
                        that.DATA.push(value);
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

<style scoped>
    .chart-main{
        background-color: #fff;
    }
</style>
