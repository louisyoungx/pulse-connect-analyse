<template>
    <div class="setting-main">
        <van-nav-bar
                title="设置"
                right-text="更多"
                @click-right="More()"
        />
        <h2 class="setting-title">后台设置</h2>
        <van-cell-group class="setting-card">
            <van-cell title="后台管理">
                <template #right-icon>
                    <van-switch v-model="choice.backend" size="24" />
                </template>
            </van-cell>
            <van-cell title="数据库" label="启动本地数据库（N）启用云数据库（默认）">
                <template #right-icon>
                    <van-switch v-model="choice.database" size="24" />
                </template>
            </van-cell>
        </van-cell-group>
        <h2 class="setting-title">爬虫设置</h2>
        <van-cell-group class="setting-card">
            <van-cell title="青年大学习爬虫">
                <template #right-icon>
                    <van-switch v-model="choice.dxxSpider" size="24" />
                </template>
            </van-cell>
            <van-cell title="Boss直聘爬虫">
                <template #right-icon>
                    <van-switch v-model="choice.bossSpider" size="24" />
                </template>
            </van-cell>
        </van-cell-group>
        <h2 class="setting-title">公众号设置</h2>
        <van-cell-group class="setting-card">
            <van-cell title="公众号自动回复">
                <template #right-icon>
                    <van-switch v-model="choice.gzhReply" size="24" />
                </template>
            </van-cell>
            <van-cell title="人工智能接口">
                <template #right-icon>
                    <van-switch v-model="choice.gzhAI" size="24" />
                </template>
            </van-cell>
            <van-cell title="聊天记录备份到数据库">
                <template #right-icon>
                    <van-switch v-model="choice.gzhCopy" size="24" />
                </template>
            </van-cell>
        </van-cell-group>
        <h2 class="setting-title">云服务器设置</h2>
        <van-cell-group class="setting-card">
            <van-cell title="MySQL">
                <template #right-icon>
                    <van-switch v-model="choice.MySQL" size="24" />
                </template>
            </van-cell>
            <van-cell title="Redis">
                <template #right-icon>
                    <van-switch v-model="choice.Redis" size="24" />
                </template>
            </van-cell>
            <van-cell title="MongoDB">
                <template #right-icon>
                    <van-switch v-model="choice.MongoDB" size="24" />
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
                    backend: true,
                    database: false,
                    dxxSpider: true,
                    bossSpider: false,
                    gzhReply: true,
                    gzhAI: true,
                    gzhCopy: false,
                    MySQL: true,
                    Redis: false,
                    MongoDB: false,
                },
            };
        },
        methods:{
            More(){
                this.$toast.fail('没有访问权限');
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
