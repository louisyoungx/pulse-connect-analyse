<template>
    <van-nav-bar title="PCA" :fixed="true">
        <template #right> </template>
    </van-nav-bar>
    <div class="home-main">
        <div class="Echarts">
            <div id="main" style="width: 100vw;height: 50vh"></div>
        </div>
        <h2 class="setting-title">历史记录</h2>
        <van-cell-group inset>
            <van-cell
                v-for="(item, index) in $store.state.recording"
                :key="index"
                :title="item.name"
                :label="duration(item.startTime, item.endTime)"
            >
                <template #right-icon>
                    <van-icon
                        name="arrow"
                        class="custom-icon"
                        size="1.2em"
                    />
                </template>
            </van-cell>
        </van-cell-group>
    </div>
    <nav-bottom></nav-bottom>
</template>

<script>
import NavBottom from '@/components/NavBottom'
import pulse from '@/assets/js/fakeData'
export default {
    name: 'index',
    components: { NavBottom },
    data() {
        return {
            myChart: {},
            options: {
                // Make gradient line here
                visualMap: {
                    show: false,
                    type: 'continuous',
                    seriesIndex: 1,
                    dimension: 0,
                    min: 0,
                    max: this.DATALength - 1,
                },
                title: {
                    left: 'center',
                    text: 'Pulse Wave & Prediction',
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category',
                    data: this.VALUE,
                },
                yAxis: {
                    boundaryGap: [0, '80%'],
                    type: 'value',
                    scale: true,
                },
                series: [
                    {
                        data: this.DATA,
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                    },
                ],
            },
            DATA: [],
            VALUE: [],
            DATALength: 0,
            TEMP: [],
        }
    },
    mounted() {
        this.main(150, 1, 20)
        this.$store.state.recording.forEach(item => {
            console.log(item)
        })
        // this.$store.commit('recording_delete', 0)
        // this.$store.commit('recording_delete', 1)
        // this.$store.commit('recording_delete', 2)
        // this.$store.commit('recording_delete', 3)
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.path !== '/') {
                location.reload()
            }
        })
    },
    methods: {
        main(Num, Speed, Flash) {
            let i = 1
            this.DATA = []
            this.VALUE = []
            this.TEMP = []

            let time = new Date().toLocaleTimeString()

            this.TEMP = Array.from(pulse.pulseData)

            for (let item in pulse.pulseData) {
                i++
                let value = pulse.pulseData.shift()
                this.DATA.push(value)
                this.VALUE.push(time)
                if (i === Num) {
                    break
                }
            }

            this.DATALength = this.DATA.length

            /// console.log(this.DATA);

            // 基于准备好的dom，初始化echarts实例
            this.GlobalInit()

            // 绘制图表
            this.myChart.setOption(this.options)

            this.myChart.setOption({
                xAxis: {
                    data: this.VALUE,
                },
                series: [
                    {
                        data: this.DATA,
                    },
                ],
            })

            setInterval(() => {
                time = new Date().toLocaleTimeString()

                if (pulse.pulseData.length < 10) {
                    pulse.pulseData = Array.from(this.TEMP)
                }

                // console.log(pulse.pulseData.length);
                // console.log(pulse.pulseData);

                for (let i = 0; i < Speed; i++) {
                    let value = pulse.pulseData.shift()
                    this.DATA.shift()
                    this.DATA.push(value)
                    this.VALUE.shift()
                    this.VALUE.push(time)
                }

                this.myChart.setOption({
                    series: [
                        {
                            data: this.DATA,
                        },
                    ],
                })
            }, Flash)
        },

        GlobalInit() {
            // 全局引入
            const echarts = require('echarts')
            // 基于准备好的dom，初始化echarts实例
            this.myChart = echarts.init(document.getElementById('main'))
        },

        RequireInit() {
            // 按需引入
            // 引入 ECharts 主模块
            const echarts = require('echarts/lib/echarts')
            // 引入柱状图
            require('echarts/lib/chart/bar')
            // 引入提示框和标题组件
            require('echarts/lib/component/tooltip')
            require('echarts/lib/component/title')
            this.myChart = echarts.init(document.getElementById('main'))
        },

        duration(startTime, endTime) {
            let durTime = endTime - startTime
            durTime = (durTime / 1000).toFixed(1)
            if (durTime < 60) {
                return durTime + '秒'
            } else if (durTime < 3600) {
                return (durTime / 60).toFixed(1) + '分'
            } else {
                return (durTime / 3600).toFixed(1) + '时'
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.home-main {
    color: #2c3e50;
	background-color: #f7f8fa;
    width: 100vw;
}
.setting-title {
    margin: 0;
    padding: 15px 16px 5px;
    color: rgba(69, 90, 100, 0.6);
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
}
</style>
