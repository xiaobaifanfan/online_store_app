<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">REGISTER</view>
			<view class="welcome">
				欢迎注册
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">用户名</text>
					<input placeholder="请输入用户名" maxlength="11" v-model="username"/>
				</view>
				<view class="input-item">
					<text class="tit">手机号</text>
					<input placeholder="请输入手机号" type="number" maxlength="11" v-model="mobile"/>
				</view>
				
				<view class="c-list" style="width: 100%;background: #f8f6fc; margin-bottom: 30px;">
					<view class="c-row b-b">
						<!-- <text class="tit">购买类型</text> -->
						<view class="con">
							<view class="input-item">
								<text class="tit">验证码</text>
								<input placeholder="请输入验证码" type="number" maxlength="6" v-model="code"/>
							</view>
						</view>
						<button class="confirm-btn" @click="sendCode" :disabled="codeInt != '发送验证码'" style="width:120px;">{{codeInt}}</button>
					</view>
				</view>
				
				
				<view class="input-item">
					<text class="tit">密码</text>
					<input placeholder-class="input-empty" maxlength="20" password v-model="password" />
				</view>
			</view>
			<button class="confirm-btn" @click="submit" :disabled="logining">注册</button>

		</view>
	</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	
	export default{
		data(){
			return {
				username: '',
				password: '',
				logining: false,
				mobile:'',
				code:'',
				codeInt:'发送验证码',
				codeInterval:null
			}
		},
		onLoad(){

		},
		methods: {
			navBack(){
				uni.navigateBack();
			},
			sendCode()
			{
				if(!this.checkPhone(this.mobile))
				{
					uni.showToast({
						title:'请输入正确手机号',
						icon:'none'
					})
					return
				}
				this.logining = true;
				var that = this
				this.$request('code/','POST',{mobile:that.mobile},this,function(res){
					uni.showToast({
						title:'发送成功',
						icon:'success'
					})
					that.codeInterval = setInterval(function(){
						if(that.codeInt == '发送验证码')
						{
							that.codeInt = 60;
						}else if(that.codeInt == 0)
						{
							that.codeInt = '发送验证码'
							clearInterval(that.codeInterval)
						}else{
							that.codeInt --;
						}
					},1000)
				
				},function(){
					uni.showToast({
						title:'发送失败',
						icon:'none'
					})
				},function(){
					that.logining = false
				})
			},
			checkPhone(phone){ 
			    if(!(/^1[3456789]\d{9}$/.test(phone))){ 
			        return false; 
			    } 
				return true;
			},
			submit()
			{
				if(!this.checkPhone(this.mobile))
				{
					uni.showToast({
						title:'请输入正确手机号',
						icon:'none'
					})
					return
				}
				if(!this.username)
				{
					uni.showToast({
						title:'请输入用户名',
						icon:'none'
					})
					return
				}
				if(!this.code)
				{
					uni.showToast({
						title:'请输入验证码',
						icon:'none'
					})
					return
				}
				if(!this.password)
				{
					uni.showToast({
						title:'请输入密码',
						icon:'none'
					})
					return
				}
				this.logining = true;
				var that = this
				this.$request('users/','POST',{mobile:that.mobile,username:that.username,password:that.password,code:that.code},this,function(res){
					uni.showToast({
						title:'注册成功',
						icon:'success'
					})
					setTimeout(function(){
						uni.navigateBack({
							
						})
					},2000)
				
				},function(){
					uni.showToast({
						title:'注册失败',
						icon:'none'
					})
				},function(){
					that.logining = false
				})
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
	.c-list{
		
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
</style>
