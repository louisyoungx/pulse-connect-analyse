<template>
    <div class="page member">
        <div class="user-poster" >
            <van-row class="user-info">
                <van-col offset="2">
                    <van-image class="user-avatar" round width="4rem" height="4rem" :src="member.avatar" />
                </van-col>
                <van-col span="16" class="user-info-text">
                    <div class="user-nickname">
                        <span>{{member.nickname || member.username}}</span>
                        <van-tag
                                v-if="member.level_id > 0"
                                class="margin-left"
                                type="primary"
                        >{{member.level_name}}</van-tag>
                    </div>
                    <template v-if="isLogin">
                        <div v-if="openShare" class="user-acode">邀请码: {{member.agentcode}}</div>
                        <div class="user-mobile">手机号: {{member.mobile}}</div>
                    </template>
                    <div v-else class="logintip" @click="goLogin">点击登录/注册</div>
                </van-col>
            </van-row>
            <van-icon size="24" class="right-icon" name="setting-o" @click="goSettings" />
        </div>
        <div class="cblock user-links">
            <van-cell icon="records" title="我的记录" value="全部记录" is-link to="/member/order" />
            <van-row>
                <van-col span="6">
                    <van-tag v-if="counts[0] > 0" round type="danger">{{counts[0]}}</van-tag>
                    <router-link to="/member/order?status=0">
                        <van-icon name="pending-payment" />本地数据
                    </router-link>
                </van-col>
                <van-col span="6">
                    <van-tag v-if="counts[1] > 0" round type="danger">{{counts[1]}}</van-tag>
                    <router-link to="/member/order?status=1">
                        <van-icon name="records" />云数据
                    </router-link>
                </van-col>
                <van-col span="6">
                    <van-tag v-if="counts[2] > 0" round type="danger">{{counts[2]}}</van-tag>
                    <router-link to="/member/order?status=2">
                        <van-icon name="tosend" />使用记录
                    </router-link>
                </van-col>
                <van-col span="6">
                    <router-link to="/member/order?status=4">
                        <van-icon name="logistics" />已完成
                    </router-link>
                </van-col>
            </van-row>
        </div>
        <div class="cblock margin-top">
            <van-cell-group>
                <van-cell icon="info-o" to="/about/index" title="关于我们" is-link />
                <van-cell icon="share" @click="quit" title="退出登录" is-link />
            </van-cell-group>
        </div>
        <div class="margin-top"></div>
    </div>
    <nav-bottom></nav-bottom>
</template>
<script>
/*    import store from "../../store";
    import api from "../../api";*/

    import NavBottom from "../../components/NavBottom";
let subscribed=null
    export default {
        components: {NavBottom},
        data() {
            return {
                groupOrder: 0,
                creditOrder:0,
                counts: [],
                credit_counts:[],
                member:{
                    avatar:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1354268575,1268995723&fm=26&gp=0.jpg',
                    nickname:'xiao',
                    username:'xiao',
                    level_id:3,
                    level_name:'svip',
                    agentcode:123456,
                    mobile:123456789,
                    total_reward:666,
                },
                isLogin:true,
                openShare:false,
            };
        },
        methods:{
            goSettings() {
                window.location.href = "/settings";
            }
        }
    };
</script>

<style lang="scss">
    .user {
        &-poster {
            width: 100%;
            height: 220px;
            background: #2c3e50 center top no-repeat;
            background-size: cover;
            text-align: center;
            position: relative;
            .right-icon{
                position: absolute;
                right:20px;
                top:20px;
                color: #fff;
                text-shadow: 1px 1px 5px rgba(0,0,0,.1)
            }
        }
        &-info {
            padding-top: 4rem;
        }
        &-avatar {
            align-items: center;
            margin-right:10px;
        }
        &-info-text {
            text-align: left;
            color: #fff;
            font-size: 14px;
        }
        &-nickname {
            font-size: 16px;
        }

        &-group {
            margin-top: 15px;
        }

        &-links {
            margin-top: 15px;
            text-align: left;
            background-color: #fff;
            a {
                color: #444;
            }
            .van-row {
                padding: 15px 0;
                font-size: 12px;
                text-align: center;
                .van-col{
                    position: relative;
                }
                .van-tag{
                    position: absolute;
                    left:60%;
                    top:-5px;
                }
                .van-icon {
                    display: block;
                    font-size: 24px;
                    color: #af8755;
                }
            }
        }
    }
    .points-box {
        height: 70px;
        margin: 0 10px;
        text-align: center;
        .van-grid {
            border-radius: 5px;
            margin-top: -35px;
            height: 70px;
            overflow: hidden;
            .van-grid-item__content {
                padding: 4px;
            }
            .balance-text {
                margin-top: 0;
                font-size: 10px;
                .balance-name {
                    color: #666;
                }
                .balance-value {
                    font-size: 12px;
                    font-weight: bold;
                    margin-top: 4px;
                    color: #b00;
                }
            }
        }
    }
</style>
