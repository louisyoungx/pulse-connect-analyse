<template class="main-container">
    <van-nav-bar title="PCA" :fixed="true">
        <template #right>
            <div
                v-if="isPlayback"
                @click="stopPlayback"
                class="record-container"
            >
                <van-button
                    round
                    loading
                    type="danger"
                    loading-text="退出回放"
                    class="record"
                />
            </div>
        </template>
    </van-nav-bar>
    <div class="chart-main">
        <div class="Echarts">
            <div id="main" style="width: 100vw; height: 50vh"></div>
        </div>
    </div>
    <div v-if="!isPlayback">
        <h2 class="cell-title">历史记录</h2>
        <van-cell-group class="history-container last-element" inset>
            <van-cell
                v-for="(item, index) in $store.state.recording"
                :key="index"
                :title="item.name"
                :label="duration(item.startTime, item.endTime)"
                @click="sheetShow = true; sheetNo = index"
            >
                <template #right-icon>
                    <van-icon name="arrow" class="custom-icon" size="1.2em" />
                </template>
            </van-cell>
        </van-cell-group>
        <van-action-sheet
            v-model:show="sheetShow"
            :actions="sheetActions"
            @select="sheetSelect"
        />
    </div>
    <div v-if="isPlayback">
        <div class="display-options offset-top">
            <div @click="stopPlayback" class="display-choice">
                <van-icon name="close" color="rgb(25, 137, 250)" size="5vh" />
            </div>
            <div @click="suspendPlayback" class="display-choice">
                <van-icon v-if="!suspend" name="pause-circle-o" color="rgb(25, 137, 250)" size="7vh" />
                <van-icon v-if="suspend" name="play-circle-o" color="rgb(25, 137, 250)" size="7vh" />
            </div>
            <div @click="replayPlayback" class="display-choice">
                <van-icon name="replay" color="rgb(25, 137, 250)" size="5vh" />
            </div>
        </div>
        <div class="args-container last-element">
            <div class="args-content">
                <div class="args-div args-colomn">
                    <p>数据频率: {{ fps }} HZ</p>
                    <p>幅值: {{ amplitude }}</p>
                    <p>心跳: {{ heart_beats }} 次</p>
                    <p>心率: {{ heart_rate }} 次/分</p>
                    <p>心电压: {{ heart_voltage }} V</p>
                </div>
            </div>
        </div>
    </div>
    <nav-bottom></nav-bottom>
</template>

<script>
import NavBottom from '@/components/NavBottom'
import { Dialog } from 'vant'
import { mapState } from 'vuex'

export default {
    name: 'index',
    components: { NavBottom },
    data() {
        return {
            sheetNo: -1,
            sheetShow: false,
            sheetActions: [
                { name: '回放' },
                { name: '删除', color: '#ee0a24' },
                { name: '' },
                { name: '' },
            ],
            settings: {},
            isPlayback: false,
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
            ConnectStatus: true,
            running: null,
            fps: 0,
            suspend: false,
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
        this.url = this.settings.Host + ':' + this.settings.Port

        if (this.settings.choice.eigenvalueOpen) {
            this.options.series[0].markPoint = {
                data: this.peaks,
                symbol: 'circle',
                symbolSize: 10,
                itemStyle: { color: 'rgba(255,0,0,0.4)' },
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
        this.fillInData(this.$store.state.recording[0].record)
    },
    methods: {
        display(wave) {
            let width = parseInt(this.settings.Width)
            let number = parseInt(this.settings.Number)
            let flash = parseInt(this.settings.Flash)
            let duration = (wave.endTime - wave.startTime) / 1000
            let fps = wave.record.length / duration
            let rate = (1 / fps)
            this.fps = fps.toFixed(0)
            let i = 0
            const handler = (eachData) => {
                const firstCheck = () => {
                    if (i === 0) {
                        // 首次连接成功拿到第一个数据，将该数据填充到图表中
                        this.init(width, 0) // 数据初始化
                    }
                }
                const eachOneData = () => {
                    this.DATA.shift()
                    this.DATA.push(eachData)
                    this.VALUE.shift()
                    this.VALUE.push(new Date(wave.startTime + rate * i * 1000).toLocaleTimeString())
                }
                const peakCheck = () => {
                    if (this.settings.choice.eigenvalueOpen) {
                        this.peaks = this.heartPeaks(this.DATA)
                    }
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
                if (!this.suspend) {
                    firstCheck()
                    eachOneData()
                    peakCheck()
                    debounce()
                }
            }
            this.running = setInterval(() => {
                if (i < (wave.record.length - number - 1)) {
                    handler(wave.record[i])
                    i++
                } else {
                    this.$toast.success('回放结束')
                    clearInterval(this.running)
                }
            }, rate * 1000)
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

        fillInData(dataList) {
            let i = 1
            let Width = parseInt(this.settings.Width)
            this.DATA = []
            this.VALUE = []
            // 初始化，Num决定图表长度
            while (true) {
                this.DATA.push(0)
                this.VALUE.push('00:00:00')
                if (i >= Width) {
                    i = null
                    break
                }
                i++
            }
            i = 0
            // 填充初始数据
            while (true) {
                this.DATA.shift()
                this.DATA.push(dataList[i])
                this.VALUE.shift()
                this.VALUE.push('00:00:00')
                if (i >= Width - 1 || !dataList[i + 1]) {
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
            const windowWidth = parseInt(
                this.settings.Width / this.countHeartBeats(heartSignal)
            ) // 窗口宽度 = 图表宽度 / 心跳数量
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

        startPlayback() {
            this.isPlayback = true
        },

        stopPlayback() {
            this.isPlayback = false
            clearInterval(this.running)
        },

        suspendPlayback() {
            this.suspend = !this.suspend
        },

        replayPlayback() {
            clearInterval(this.running)
            this.display(this.$store.state.recording[this.sheetNo])
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

        sheetSelect(item) {
            this.sheetShow = false
            if (item.name === '回放') {
                this.startPlayback()
                this.display(this.$store.state.recording[this.sheetNo])
            }
            if (item.name === '删除') {
                Dialog.confirm({
                    title: '注意',
                    message:
                        '删除将失去此条记录所有数据',
                })
                .then(() => {
                    // on confirm
                    this.$store.commit('recording_delete', this.sheetNo)
                })
                .catch(() => {
                    // on cancel
                    console.log('cancel')
                })
            }
        },

    },
}
</script>

<style scoped>
.args-container {
    height: 30vh;
}

.history-container {
    height: 35vh;
    overflow: auto;
}

.display-options {
    width: 60vw;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

.display-choice:active {
    background: rgb(223, 228, 233);
    border-radius: 3.5vh;
}
</style>
