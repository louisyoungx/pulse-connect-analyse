<template class="main-container">
    <van-nav-bar title="Pulse-Chart">
        <template #right>
            <van-icon name="search" size="18" />
        </template>
    </van-nav-bar>
    <div class="chart-main">
        <br />
        <br />
        <div class="Echarts">
            <div id="main" style="width: 100vw;height: 50vh"></div>
        </div>
    </div>
    <div class="args-container">
        <div class="args-content">
            <div class="args-div">
                <p>服务器: {{ url }}</p>
            </div>
            <div class="args-div">
                <p>
                    数据量:{{ settings.Width }} | FPS:{{ fps }}HZ | 刷新:{{
                        settings.Flash / 1000
                    }}s
                </p>
            </div>
            <br />
            <div class="args-div">
                <p>幅值: {{ amplitude }}</p>
                <p>心跳: {{ heart_beats }} 次</p>
                <p>心率: {{ heart_rate }} 次/分</p>
                <p>心电压: {{ heart_voltage }} V</p>
            </div>
            <br />
            <div class="args-div">
                <p>
                    特征值显示:{{ isEigenvalue }} | 动画效果:{{ isAnimation }}
                </p>
            </div>
        </div>
    </div>
    <br />
    <br />
    <nav-buttom></nav-buttom>
</template>

<script>
import NavButtom from '@/components/NavButtom'
import { mapState } from 'vuex'

export default {
    name: 'index',
    components: { NavButtom },
    data() {
        return {
            settings: {},
            url: '',
            fps: '',
            amplitude: null,
            heart_beats: null,
            heart_voltage: null,
            blood_pressure: null,
            heart_rate: null,
            isEigenvalue: '',
            isAnimation: '',
            myChart: {},
            options: {
                animation: false,
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
                    text: 'Pulse Rate Values & Prediction',
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
                        markPoint: null,
                    },
                ],
            },
            DATA: [],
            VALUE: [],
            DATALength: 0,
            ConnectStatus: true,
        }
    },
    computed: {
        ...mapState(['settings']),
    },
    created() {
        this.settings = this.$store.state.settings
    },
    mounted() {
        /* Width: 数据显示宽度
         * Number: 单次更新个数
         * Flash: 更新间隔时间
         */
        let width = parseInt(this.settings.Width)
        let number = parseInt(this.settings.Number)
        let flash = parseInt(this.settings.Flash)
        this.fps = (number / flash) * 1000
        this.url = this.settings.Host + ':' + this.settings.Port

        if (this.settings.choice.eigenvalueOpen) {
            this.options.series[0].markPoint = {
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' },
                ],
            }
            this.isEigenvalue = '开启'
        } else {
            this.isEigenvalue = '关闭'
        }
        if (this.settings.choice.animationOpen) {
            this.options.animation = true
            this.isAnimation = '开启'
        } else {
            this.isAnimation = '关闭'
        }
        this.main(width, number, flash)
    },
    methods: {
        TCPClient() {
            const that = this
            var socket = new WebSocket('ws://' + this.url) // 创建一个Socket实例
            socket.onerror = function() {
                this.ConnectStatus = false
                that.$toast.fail('连接失败')
            }

            socket.onopen = function(event) {
                // 打开Socket
                // 发送初始化消息
                socket.send('Receiver Ready')
                that.$toast.success('连接服务器成功')
                console.log('Receiver Ready')

                const self = that
                // 监听消息
                socket.onmessage = function(event) {
                    // console.log(event.data);
                    if (event.length < 10) {
                        self.DATA.shift()
                        self.DATA.push(event.data)
                    } else {
                        let dataList = event.data
                            .slice(1, event.data.length - 1)
                            .split(',')
                            .map(Number)
                        for (let item in dataList) {
                            if (dataList[item] > 0) {
                                self.DATA.shift()
                                self.DATA.push(dataList[item])
                            }
                        }
                        // 数据处理 -----------------------
                        // console.log(self.DATA);
                        const replacement = JSON.parse(
                            JSON.stringify(self.DATA)
                        )
                        self.heart_beats = self.countHeartBeats(replacement)
                        self.amplitude = self.heartAmplitude(replacement)
                        let time = self.settings.Width / self.fps
                        self.heart_rate = self.calculateHeartRate(
                            self.heart_beats,
                            time
                        )
                        self.heart_voltage = self.heartVoltage(self.amplitude)
                        // ------------------------------
                    }
                }

                // 监听Socket的关闭
                socket.onclose = function(event) {
                    that.$toast.fail('断开连接')
                    console.log('Connection closed')
                }

                // 关闭Socket…
                //socket.close()
            }
        },

        init(Width) {
            let i = 1
            this.DATA = []
            this.VALUE = []
            this.DATALength = Width
            // 初始化，Num决定图表长度
            while (true) {
                this.DATA.push(0)
                this.VALUE.push('time')
                if (i === Width) {
                    i = null
                    break
                }
                i++
            }
        },
        main(Width, Number, Flash) {
            /* Width: 数据显示宽度
             * Number: 单次更新个数
             * Flash: 更新间隔时间
             */
            this.init(Width) // 数据初始化
            this.TCPClient() // 建立WebSocket连接
            this.GlobalInit() // 基于准备好的dom，初始化echarts实例
            if (this.ConnectStatus === true) {
                this.Draw(Flash)
            }
        },

        Draw(Flash) {
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
            // 更新图表
            const that = this
            setInterval(function() {
                that.myChart.setOption({
                    series: [
                        {
                            data: that.DATA,
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

        // 标准偏差
        standardDeviation(values) {
            const avg = this.average(values)

            const squareDiffs = values.map(function(value) {
                const diff = value - avg
                const sqrDiff = diff * diff
                return sqrDiff
            })

            const avgSquareDiff = this.average(squareDiffs)
            const stdDev = Math.sqrt(avgSquareDiff)
            return stdDev
        },

        // 求幅值平均值
        average(data) {
            const sum = data.reduce(function(sum, value) {
                return sum + value
            }, 0)
            const avg = sum / data.length
            return avg
        },

        // 心率计数
        countHeartBeats(heartSignal) {
            let currentMaximum = 0
            let beats = 0
            const mean = this.average(heartSignal)
            const sthreshold = 0.2 * this.standardDeviation(heartSignal)
            for (let i = 0; i < heartSignal.length; i++) {
                if (heartSignal[i] > mean + sthreshold) {
                    heartSignal[i] = mean + sthreshold
                    if (!currentMaximum) {
                        currentMaximum = 1
                        beats += 1
                    }
                } else {
                    currentMaximum = 0
                }
            }
            return beats
        },

        // 幅值
        heartAmplitude(heartSignal) {
            let maxNum = 0
            for (let i = 0; i < heartSignal.length; i++) {
                if (heartSignal[i] > maxNum) {
                    maxNum = heartSignal[i]
                }
            }
            return Math.round(maxNum)
        },

        // 每分钟心率计数
        calculateHeartRate(heartBeats, time) {
            // console.log(heartBeats, time, (heartBeats / time) * 60)
            return (heartBeats / time) * 60
        },

        heartVoltage(amplitude) {
            const voltage = (amplitude / 4096) * 3.3
            return Math.round(voltage * 1000) / 1000
        },
    },
}
</script>

<style scoped>
.main-container {
    background: linear-gradient(
        60deg,
        rgba(84, 58, 183, 1) 0%,
        rgba(0, 172, 193, 1) 100%
    );
}

.chart-main {
    background-color: #fff;
}

.args-container {
    margin: 0 auto;
    width: 90vw;
    height: 35vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5vw;
    filter: drop-shadow(0px 20px 10px rgba(0, 0, 0, 0.3));
    transform: translateY(-10%);
    background: linear-gradient(
        60deg,
        rgb(0, 54, 121) 0%,
        rgba(0, 172, 193, 1) 100%
    );
}

.args-content {
    margin: 0;
    width: 85vw;
    height: 30vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.args-div {
    color: #fff;
    font-size: 20px;
}

.args-div p {
    margin: 0;
}
</style>
