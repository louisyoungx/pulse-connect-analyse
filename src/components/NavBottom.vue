<template>
    <van-tabbar route z-index="10000" class="index-nav-buttom">
        <van-tabbar-item replace to="/home" name="home" icon="home-o">主页</van-tabbar-item>
        <van-tabbar-item replace to="/chart" name="apps" icon="chart-trending-o">图表</van-tabbar-item>
        <van-tabbar-item replace to="/settings" name="setting" icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
</template>

<script>
    export default {
        name: "NavBottom"
    }
</script>

<style scoped>
    .index-nav-buttom{
        display: flex;
    }
    @media only screen and (max-width: 991px){
        .index-nav-buttom{
            display: flex;
        }
    }
</style>
