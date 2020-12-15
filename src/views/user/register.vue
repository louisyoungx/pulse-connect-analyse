<template>
	<div class="page page-login">
		<van-nav-bar title="注册" left-text="返回" left-arrow @click-left="onClickLeft" />
		<div class="container">
			<div></div>
			<div class="loggin-box">
				<h2>注册</h2>
				<van-cell-group>
					<van-field v-model="username" placeholder="用户名" left-icon="contact" />
					<van-field type="password" v-model="password" placeholder="密码" left-icon="warn-o" />
					<van-field type="password" v-model="repassword" placeholder="确认密码" left-icon="warn-o" />

					<van-field v-model="mobile" left-icon="phone-o" placeholder="请输入手机号" />
					<van-field
							v-model="verifycode"
							center
							clearable
							left-icon="certificate"
							placeholder="请输入短信验证码"
					>
						<van-button
								slot="button"
								size="small"
								:disabled="iscounting > 0"
								type="primary"
								@click="openSMS"
						>
							发送验证码
							<span v-if="iscounting>0">({{iscounting}})</span>
						</van-button>
					</van-field>
				</van-cell-group>
				<van-row class="btn-box" type="flex" justify="center">
					<van-col span="18">
						<van-button type="primary" :loading="isLoading" size="large" @click="doRegister">注册</van-button>
					</van-col>
				</van-row>
			</div>
			<van-row class="login-links">
				<van-col span="8" class="text-left">
					<router-link to="/login">返回登录</router-link>
				</van-col>
				<van-col span="8"></van-col>
				<van-col span="8" class="text-right"></van-col>
			</van-row>

		</div>
		<van-popup v-model="openSMSPopup" position="bottom">
			<div class="padding-tb-40">
				<van-cell-group>
					<van-field
							class="verify-field"
							v-model="captcha"
							placeholder="验证码"
							type="text"
							clearable
							left-icon="certificate"
					>
						<van-image
								slot="right-icon"
								class="verifycode"
								@click="getVerifyImage"
								:src="verifyimg"
						/>
					</van-field>
				</van-cell-group>
				<div class="submit-btn">
					<van-button type="info" :disabled="iscounting>0" @click="sendSMS">
						发送验证码
						<span v-if="iscounting>0">({{iscounting}})</span>
					</van-button>
				</div>
			</div>
		</van-popup>
	</div>
</template>
<script >
/*	import api from "../../api";
	import config from "../../config";*/

	let interval = 0;
	export default {
		data() {
			return {
				username: "",
				password: "",
				repassword: "",
				verifycode: "",
				verifyimg: "/static/",
				smsCode: "",
				mobile: "",
				captcha: "",
				iscounting: 0,
				isLoading: false,
				needMobile: false,
				openSMSPopup: false
			};
		},
	};
</script>
<style lang="scss">
	.verify-field {
		.van-image {
			display: block;
		}
	}
	.loggin-box {
		margin-top: 20px;
	}
</style>
