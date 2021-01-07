<template>
    <div class="setting-main">
        <van-nav-bar
                title="设置"
                right-text="更多"
                @click-right="More()"
        />
        <h2 class="setting-title">连接设置</h2>
        <van-cell-group class="setting-card">
            <van-cell title="服务器连接" label="通过服务器连接（默认）">
                <template #right-icon>
                    <van-switch v-model="choice.connectServer" @click="ConnectChoiceServer()" size="24" />
                </template>
            </van-cell>
            <van-cell title="本地连接" label="启用本地连接">
                <template #right-icon>
                    <van-switch v-model="choice.connectLocal" @click="ConnectChoiceLocal()" size="24" />
                </template>
            </van-cell>
        </van-cell-group>
        <h2 class="setting-title">保存设置</h2>
        <van-cell-group class="setting-card">
            <van-cell title="自动保存" label="自动保存一段60s的记录">
                <template #right-icon>
                    <van-switch v-model="choice.saveAuto" size="24" />
                </template>
            </van-cell>
            <van-cell title="保存到本地" label="将记录保存在本地（默认）">
                <template #right-icon>
                    <van-switch v-model="choice.saveLocal" size="24" />
                </template>
            </van-cell>
        </van-cell-group>
        <nav-buttom></nav-buttom>
    </div>
</template>

<script>
    import NavButtom from "../../components/NavButtom";
    export default {
        name: "index",
        components: {NavButtom},
        data() {
            return {
                choice:{
                    connectServer: true,
                    connectLocal: false,
                    saveAuto: false,
                    saveLocal: true,
                },
            };
        },
        methods:{
            More() {
                this.$toast.fail('没有访问权限');
            },
            ConnectChoiceServer() {
                this.choice.connectLocal = !this.choice.connectLocal
            },
            ConnectChoiceLocal() {
                this.choice.connectServer = !this.choice.connectServer
            },
        },
        mounted() {
        }
    }
</script>

<style scoped>
    .setting-main{
        height: 100vh;
        background-color: #f7f8fa;
    }
    .setting-title {
        margin: 0;
        padding: 15px 16px 5px;
        color: rgba(69, 90, 100, 0.6);
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
    }
    .setting-card {
        margin: 12px 12px 0;
        overflow: hidden;
        border-radius: 8px;
    }
</style>
