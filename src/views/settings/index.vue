<template>
    <div class="setting-main">
        <van-nav-bar
            title="设置"
            right-text="高级"
            @click-right="More()"
            :fixed="true"
        />
        <h2 class="setting-title">配置</h2>
        <van-cell-group class="setting-card">
            <van-form>
                <van-field
                    v-model="settings.Width"
                    name="数据显示宽度"
                    label="数据显示宽度"
                    placeholder="图表中显示数据的个数"
                    :rules="[{ required: true, message: '请填写数据显示宽度' }]"
                />
                <van-field
                    v-model="settings.Number"
                    @input="updateFPS()"
                    name="单次更新个数"
                    label="单次更新个数"
                    placeholder="每次往图表中更新的个数"
                    :rules="[{ required: true, message: '请填写单次更新个数' }]"
                />
                <van-field
                    v-model="settings.Flash"
                    @input="updateFPS()"
                    name="更新间隔时间"
                    label="更新间隔时间"
                    placeholder="每（ms）更新"
                    :rules="[{ required: true, message: '请填写更新间隔时间' }]"
                />
                <van-field
                    v-model="settings.FPS"
                    name="当前FPS"
                    label="当前FPS"
                    disabled
                />
            </van-form>
        </van-cell-group>
        <h2 class="setting-title">图表设置</h2>
        <van-cell-group class="setting-card">
            <van-cell title="显示特征值" label="显示脉搏特征点">
                <template #right-icon>
                    <van-switch
                        v-model="settings.choice.eigenvalueOpen"
                        @click="eigenvalueOpen()"
                        size="24"
                    />
                </template>
            </van-cell>
            <van-cell title="启动动画" label="可能会造成卡顿">
                <template #right-icon>
                    <van-switch
                        v-model="settings.choice.animationOpen"
                        @click="animationOpen()"
                        size="24"
                    />
                </template>
            </van-cell>
        </van-cell-group>
        <h2 class="setting-title">服务器设置</h2>
        <van-cell-group class="setting-card">
            <van-form>
                <van-field
                    v-model="settings.Host"
                    name="域名/IP"
                    label="域名/IP"
                    placeholder="填写域名/IP"
                    :rules="[{ required: true, message: '请填写域名/IP' }]"
                />
                <van-field
                    v-model="settings.Port"
                    name="端口"
                    label="端口"
                    placeholder="填写端口"
                    :rules="[{ required: true, message: '请填写端口' }]"
                />
            </van-form>
        </van-cell-group>
        <h2 class="setting-title">保存</h2>
        <van-cell-group class="setting-card">
            <van-form @submit="saveSettings()">
                <div style="margin: 16px;">
                    <van-button
                        @click="saveSettings()"
                        round
                        block
                        type="info"
                        native-type="submit"
                        >保存</van-button
                    >
                </div>
            </van-form>
        </van-cell-group>
        <br />
        <br />
        <nav-buttom></nav-buttom>
    </div>
</template>

<script>
import NavButtom from '@/components/NavButtom'
import { Slider } from 'vant'
import { Toast } from 'vant'
import { mapState } from 'vuex'
export default {
    name: 'index',
    components: { NavButtom },
    data() {
        return {
            settings: {},
        }
    },
    methods: {
        More() {
            this.$toast.fail('没有访问权限')
        },
        updateFPS() {
            const speed = parseInt(this.settings.Number)
            const flash = parseInt(this.settings.Flash)
            const FPS = (speed / flash) * 1000
            this.settings.FPS = FPS.toString() + ' (HZ)'
        },
        saveSettings() {
            // console.log(this.settings)
            this.$store.commit('setting_saveSettings', this.settings)
            this.$toast.success('保存成功')
        },
        eigenvalueOpen() {
            this.$store.commit('setting_eigenvalueOpen')
            // this.settings.choice.eigenvalueOpen = this.$store.state.settings.choice.eigenvalueOpen
        },
        animationOpen() {
            this.$store.commit('setting_animationOpen')
        },
    },
    computed: {
        ...mapState(['settings']),
    },
    created() {
        this.settings = this.$store.state.settings
    },
    mounted() {
        console.log(this.settings)
        this.updateFPS()
    },
}
</script>

<style scoped>
.setting-main {
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
