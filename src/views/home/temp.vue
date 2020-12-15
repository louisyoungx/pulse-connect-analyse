<template>
    <div class="center">
        <div class="logo" @click="goLogin" :hover-class="!login ? 'logo-hover' : ''">
            <img class="logo-img" :src="login ? uerInfo.avatarUrl :avatarUrl" alt="">
            <div class="logo-title">
                <p class="uer-name">Hi，{{login ? uerInfo.name : '您未登录'}}</p>
                <p class="go-login navigat-arrow" v-if="!login">&#xe65e;</p>
            </div>
        </div>



        <div class="center-list">
            <div class="center-list-item border-bottom" @click="goAbout">
                <p class="list-icon">&#xe603;</p>
                <p class="list-p">关于</p>
                <p class="navigat-arrow">&#xe65e;</p>
            </div>
            <div class="center-list-item">
                <p class="list-icon">&#xe609;</p>
                <p class="list-p">账号管理</p>
                <p class="navigat-arrow">&#xe65e;</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        data() {
            return {
                avatarUrl: '/static/logo.png',
                uerInfo: {
                    avatarUrl:'/static/missing-face.png',
                    name:'小红'
                }
            }
        },
        computed: {
            ...mapState([ 'login'])
        },
        methods: {
            goLogin() {
                if (!this.login) {
                    window.location.href("/login")
                }
            },
            goAbout() {

            }
        }
    }
</script>

<style>
</style>
