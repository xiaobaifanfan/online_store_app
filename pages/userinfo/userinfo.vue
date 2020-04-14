<template>
	<view>
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<text class="bg-upload-btn yticon icon-paizhao"></text>
			<view class="portrait-box">
				<image class="portrait" :src="userInfo.portrait || '/static/missing-face.png'"></image>
				<text style="margin-left: 30px;">{{username}}</text>
			</view>
		</view>
		<view class="uni-form-item uni-column">
			<view class="title" style="height: 40px;">昵称</view>
			<input class="uni-input" focus placeholder="请输入昵称" v-model="form.name" style="height: 40px;"/>
		</view>
		<view class="uni-form-item uni-column">
			<view class="title" style="height: 40px;">邮箱</view>
			<input class="uni-input" focus placeholder="请输入邮箱" v-model="form.email" style="height: 40px;"/>
		</view>
		<view class="uni-padding-wrap">
			<view class="uni-title">性别</view>
			<view>
				<radio-group @change="radioChange">
					<label class="radio"><radio value="female" :checked="form.gender == 'female'" />男</label>
					<label class="radio"><radio value="male" :checked="form.gender != 'female'" />女</label>
				</radio-group>
			</view>
		</view>
		<view class="uni-form-item uni-column">
			<view class="title" style="height: 40px;">手机号</view>
			<input class="uni-input" focus placeholder="请输入手机号" v-model="form.mobile" type="number" maxlength="11" style="height: 40px;"/>
		</view>
		<view class="uni-title uni-common-pl">日期选择器</view>
		<view class="uni-list">
			<view class="uni-list-cell" style="height: 60px;">
				<view class="uni-list-cell-left" style="height: 30px;">
					当前选择
				</view>
				<view class="uni-list-cell-db" style="height: 40px;">
					<picker mode="date" :value="form.birthday" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{form.birthday}}</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="list-cell log-out-btn" style="background-color: #ebf0f9;border-radius: 20px;width: 70%;margin-left: 15%;margin-bottom: 40px;"  @click="submit">
			<text class="cell-tit">保 存</text>
		</view>
	</view>
</template>

<script>
	import {  
	    mapState,  
	    mapMutations  
	} from 'vuex';  
	export default {
		onShow() {
			var that = this
			this.$request('users/1/','GET',{},this,function(res){
				that.form = res
				
				
			})
		},
		data() {
			const currentDate = this.getDate({
			            format: true
			        })
			return {
				date: currentDate,
				form:{
					name: '',
					gender: "female",
					birthday: null,
					email: "",
					mobile: null,
				}
				
			};
		},
		computed:{
			...mapState(['userInfo']),
			...mapState(['username']),
			 startDate() {
			            return this.getDate('start');
			        },
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			radioChange(e){
				this.form.gender = e.detail.value
			},
			bindDateChange: function(e) {
			            this.form.birthday = e.target.value
			        },
			getDate(type) {
					const date = new Date();
					let year = date.getFullYear();
					let month = date.getMonth() + 1;
					let day = date.getDate();

					if (type === 'start') {
						year = year - 60;
					} else if (type === 'end') {
						year = year + 2;
					}
					month = month > 9 ? month : '0' + month;;
					day = day > 9 ? day : '0' + day;
					return `${year}-${month}-${day}`;
				},
			submit(){
				var that = this
				this.$request('users/1/','PUT',that.form,this,function(res){
					uni.showToast({
						title:'保存成功',
						icon:'success'
					})
				})
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
	}
	.user-section{
		display:flex;
		align-items:center;
		justify-content: center;
		height: 460upx;
		padding: 40upx 30upx 0;
		position:relative;
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
		.portrait-box{
			width: 200upx;
			height: 200upx;
			border:6upx solid #fff;
			border-radius: 50%;
			position:relative;
			z-index: 2;
		}
		.portrait{
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
		.yticon{
			position:absolute;
			line-height: 1;
			z-index: 5;
			font-size: 48upx;
			color: #fff;
			padding: 4upx 6upx;
			border-radius: 6upx;
			background: rgba(0,0,0,.4);
		}
		.pt-upload-btn{
			right: 0;
			// bottom: 10upx;
		}
		.bg-upload-btn{
			right: 20upx;
			// bottom: 16upx;
		}
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
	


</style>
