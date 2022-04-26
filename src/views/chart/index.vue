<template class="main-container">
    <van-nav-bar title="实时数据" :fixed="true">
        <template #right>
            <div v-if="!isRecord" @click="recordStart" class="record-container"><van-button round plain type="primary" class="record">开始录制</van-button></div>
            <div v-if="isRecord" @click="recordEnd" class="record-container"><van-button round loading type="danger" loading-text="停止录制" class="record" /></div>
        </template>
    </van-nav-bar>
    <div class="chart-main">
        <div class="Echarts">
            <div id="main" style="width: 100vw; height: 50vh"></div>
        </div>
    </div>
    <div class="args-container">
        <div class="args-content">
            <div class="args-div">
                <p>服务器: {{ url }}</p>
            </div>
            <div class="args-div">
                <p>
                    宽度:{{ settings.Width }} | FPS:{{ fps }}HZ | 刷新:{{
                        settings.Flash / 1000
                    }}s
                </p>
            </div>
            <br />
            <div class="args-div args-colomn">
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
    <nav-bottom></nav-bottom>
</template>

<script>
import NavBottom from '@/components/NavBottom'
import { mapState } from 'vuex'

export default {
    name: 'index',
    components: { NavBottom },
    data() {
        return {
            settings: {},
            isRecord: false,
            url: '',
            fps: '',
            shouldHandleData: true,
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
                        markPoint: null,
                    },
                ],
            },
            DATA: [],
            VALUE: [],
            DATALength: 0,
            peaks: [],
            cache: [],
            cacheStartTime: null,
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
                data: this.peaks,
                symbol: 'circle',
                symbolSize: 10,
                itemStyle: {color: 'rgba(255,0,0,0.4)'},
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
        ReceiveClient() {
            const timing = setTimeout(() => {
                this.ConnectStatus = false
                this.$toast.fail('连接超时')
                client.close()
            }, 5000)
            const client = new WebSocket('ws://' + this.url) // 创建一个WebSocket实例
            client.onerror = () => {
                this.ConnectStatus = false
                this.$toast.fail('连接失败')
                clearTimeout(timing)
                client.close()
            }
            client.onopen = event => {
                // 打开WebSocket
                // 发送初始化消息
                clearTimeout(timing)
                client.send('Receiver Ready')
                this.$toast.success('连接服务器成功')
                console.log('Receiver Ready')
                let firstData = true

                // 监听消息
                client.onmessage = event => {
                    if (firstData) {
                        // 首次连接成功拿到第一个数据，将该数据填充到图表中
                        this.init(parseInt(this.settings.Width), event.data) // 数据初始化
                        firstData = false
                    }
                    if (this.isPlayback) {
                        // 如果录制开启，将数据存入缓存
                        this.cache.push(event.data)
                    }
                    const eachOneData = () => {
                        this.DATA.shift()
                        this.DATA.push(parseInt(event.data))
                        this.VALUE.shift()
                        this.VALUE.push(new Date().toLocaleTimeString())
                    }
                    eachOneData()
                    if (this.settings.choice.eigenvalueOpen) {
                        this.peaks = this.heartPeaks(this.DATA)
                    }
                    const dataHandler = () => {
                        // 数据处理
                        let pulseWave = JSON.parse(JSON.stringify(this.DATA))
                        pulseWave = pulseWave.filter(val => val > 0)
                        this.heart_beats = this.countHeartBeats(pulseWave)
                        this.amplitude = this.heartAmplitude(pulseWave)
                        let time = this.settings.Width / this.fps
                        this.heart_rate = this.calculateHeartRate(
                            this.heart_beats,
                            time
                        ).toFixed(1)
                        this.heart_voltage = this.heartVoltage(
                            this.amplitude
                        ).toFixed(3)
                    }
                    const debounce = () => {
                        if (this.shouldHandleData) {
                            this.shouldHandleData = false
                            setTimeout(() => {
                                dataHandler()
                                this.shouldHandleData = true
                            }, 1000)
                        }
                    }
                    debounce()
                }

                // 监听WebSocket的关闭
                client.onclose = event => {
                    this.$toast.fail('断开连接')
                    console.log('Connection closed')
                    client.close()
                }
            }
        },

        init(Width, fillInBlank) {
            let i = 1
            this.DATA = []
            this.VALUE = []
            this.DATALength = Width
            // 初始化，Num决定图表长度
            while (true) {
                this.DATA.push(fillInBlank)
                this.VALUE.push('00:00:00')
                if (i === Width) {
                    i = null
                    break
                }
                i++
            }
        },
        main(Flash) {
            /*
             * Flash: 更新间隔时间
             */
            this.ReceiveClient() // 建立WebSocket连接
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
                        markPoint: {
                            data: this.peaks,
                        },
                    },
                ],
            })
            setInterval(() => {
                this.myChart.setOption({
                    xAxis: {
                        data: this.VALUE,
                    },
                    series: [
                        {
                            data: this.DATA,
                            markPoint: {
                                data: this.peaks,
                            },
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

        // 寻峰
        heartPeaks(heartSignal) {
            const windowWidth = parseInt(this.settings.Width / this.countHeartBeats(heartSignal)) // 窗口宽度 = 图表宽度 / 心跳数量
            const threshold = this.average(heartSignal) // 阈值需大于平均值
            const peaks = []
            for (let i = 0; i < heartSignal.length; i++) {
                if (
                    heartSignal[i] < threshold ||
                    heartSignal[i] < heartSignal[i - 1] ||
                    heartSignal[i] < heartSignal[i + 1]
                ) {
                    continue
                }
                const start = Math.max(0, i - windowWidth)
                const end = Math.min(heartSignal.length, i + windowWidth)
                let tag = true
                for (let j = start; j < end; j++) {
                    if (j === i) {
                        continue
                    }
                    if (heartSignal[j] > heartSignal[i]) {
                        tag = false
                        break
                    }
                }
                if (tag) {
                    peaks.push({
                        coord: [i, heartSignal[i]],
                    })
                }
            }
            return peaks
        },

        // 标准偏差
        standardDeviation(values) {
            const avg = this.average(values)

            const squareDiffs = values.map(value => {
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
            const sum = data.reduce((sum, value) => {
                return sum + value
            }, 0)
            const avg = sum / data.length
            return avg
        },

        // 心率计数
        countHeartBeats(heartSignal) {
            heartSignal = heartSignal.slice()
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

        recordStart() {
            this.$toast.fail('开始录制')
            this.isRecord = true
            this.cacheStartTime = new Date().getTime()
        },

        recordEnd() {
            this.$store.commit('recording_save', {
                recordingData: this.cache,
                startTime: this.cacheStartTime,
                endTime: new Date().getTime()
            })
            this.isRecord = false
            this.$toast.success('保存成功')
        }
    },
}
</script>

<style scoped>
.record-container {
    height: 100%;
    transform: translateY(0.6em);
}

.record {
    height: 80%;
}

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

.args-colomn {
    width: 70%;
    padding-left: 25%;
}

.args-div p {
    margin: 0;
}

</style>
