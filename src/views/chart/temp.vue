<template>
    <div class="wrapper">
        <div class="btn start-wrapper" @click="handleStartConnect">
            <button type="primary">开始连接</button>
        </div>
        <div class="btn start-wrapper" @click="handleProps">
            <button type="primary">接收数据</button>
        </div>
        <div class="btn btn-save">

            <button type="primary">保存数据</button>
        </div>

        <div class="qiun-charts">
            <canvas
                    id="canvasLineA"
                    class="charts"
                    @touchstart="touchLineA"
                    @touchmove="moveLineA"
                    @touchend="touchEndLineA"
            ></canvas>
        </div>
        、<div class="input-container">
        <div class="input-div">
            <div class="label-div">
                <text class="label">心率 </text>
            </div>
            <input class="input" type="text" placeholder="心率" name="nameValue" v-model="heartValue" />
        </div>
        <div class="input-div">
            <div class="label-div">
                <text class="label">脉率</text>
            </div>
            <input class="input" type="text" placeholder="脉率" name="passwordValue" v-model="pulseValue" />
        </div>
    </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                heartValue:"",
                pulseValue:"",
                cWidth: "",
                cHeight: "",
                pixelRatio: 1,
            };
        },
        //  刚进入页面的函数。一进入页面就开始触发
        onLoad() {
            _self = this;
            this.cWidth = uni.upx2px(750);
            this.cHeight = uni.upx2px(500);
            // 获取数据。这里使用的假数据
            this.getServerData();
        },
        methods: {
            // 获取数据，渲染图表
            getServerData() {
                let LineA = { categories: [], series: [] };
                //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
                // LineA.categories=DataJson.data.LineA.categories;
                let arr = JSON.parse(JSON.stringify(DataJson.data.LineA.series[0]['data']))
                LineA.series =JSON.parse(JSON.stringify(DataJson.data.LineA.series)) ;

                LineA.series[0]["data"]= arr
                    .map(item => {
                        return ((item / 4096) * 3.3).toFixed(4);
                    }).slice(0,10000)
                //这里是调用渲染的方法
                _self.showLineA("canvasLineA", LineA);
            },
            // 此数用来渲染图表
            showLineA(canvasId, chartData) {
                canvaLineA = new Charts({
                    // 这里是图表的一些基本配置
                    $this: _self,
                    canvasId: canvasId,
                    type: "line", // 图表类型为折线
                    fontSize: 11, // 字体大小
                    pixelRatio: _self.pixelRatio,
                    series: chartData.series,
                    // enableScroll: true,
                    dataLabel: false,
                    dataPointShape: false,
                    legend: false,
                    // 这里是用来配置图表x轴的配置
                    xAxis: {
                        // scrollShow: true,
                        disabled: true,
                        disableGrid: true,
                        splitNumber: 10000,
                        // itemCount: 1000
                    },
                    // 用来配置y轴
                    yAxis: {
                        //   gridType: "dash",

                        // min: 1.2,
                        // max: 1.5,
                        // splitNumber: 5,
                        //对y轴进行保留四位小数
                        format: val => {
                            return val.toFixed(4);
                        }
                    },
                    //图表的宽高
                    width: _self.cWidth * _self.pixelRatio,
                    height: _self.cHeight * _self.pixelRatio,
                    // 折线的配置
                    extra: {
                        line: {
                            type: "curve"
                        }
                    }
                });
            },
            touchLineA(e) {
                canvaLineA.scrollStart(e);
            },
            moveLineA(e) {
                canvaLineA.scroll(e);
            },
            touchEndLineA(e) {
                canvaLineA.scrollEnd(e);
                //下面是toolTip事件，如果滚动后不需要显示，可不填写
                canvaLineA.showToolTip(e, {
                    format: function(item, category) {
                        return category + " " + item.name + ":" + item.data;
                    }
                });
            },

            // 这里是利用webscoket(底层利用tcp/ip协议）进行和模块通讯  （由于目前连接成功，但是不能推送数据）
            // 利用webscoket开始建立连接
            handleStartConnect() {
                console.log("开始连接")
                var socketTask = uni.connectSocket({
                    url: "ws://192.168.4.1:8000",   // 连接串口esip86模块的ip地址
                    complete: () => {
                        console.log("999");
                    },
                    // 连接成功的回调函数
                    success(data) {
                        console.log("websocket连接成功");
                    },
                });
                // 打开连接，向模块发送数据（只是用于测试，模块暂不支持接受数据的功能）
                socketTask.onOpen(function() {
                    console.log("11111");
                    socketTask.send({
                        data: "111111111"
                    });
                });
                // 用来监听模块向手机端发送数据的函数
                socketTask.onMessage(function(data) {
                    // 此处本应该是拿到数据，渲染图表
                    console.log(data);
                });
                // 用来捕获发送数据失败，进行相应的操作
                socketTask.onError(function() {
                    console.log(arguments);
                });
            },
            handleProps(){
                console.log("发送数据")

            }
        }
    };
</script>
<style>
    /*样式的width和height一定要与定义的cWidth和cHeight相对应*/
    .wrapper {
        display: block;
    }
    .btn-save {
        margin: 10px 0;
    }
    .start-wrapper {
        margin-top: 10px;
    }
    .qiun-charts {
        width: 750px;
        height: 500px;
        background-color: #ffffff;
    }

    .charts {
        width: 750px;
        height: 500px;
        background-color: #ffffff;
    }
    .input-container{
        display: flex;
    }
    .input-div{
        width:50%
    }
    .input{
        border: 1px solid #007aff;
    }

</style>
