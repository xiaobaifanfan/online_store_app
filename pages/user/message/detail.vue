<template>
	<view>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">主题</view>
				<input placeholder="两字短标题" name="input" v-model="item.subject" disabled="true"></input>
			</view>
			<view class="cu-form-group" style="margin-top: 30px;">
				<view class="title">内容</view>
				<textarea placeholder="三字标题" v-model="item.message"></textarea>
			</view>
			<view class="cu-form-group" style="margin-top: 30px;">
				<view class="title">文件</view>
				<input placeholder="统一标题的宽度" name="input" v-model="item.file"></input>
			</view>
			<button class="btn bg-blue" style="width: 40%;margin-left: 30%;margin-top: 20px;" @click="downFile(item.file)">下载文件</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				item:{}
			}
		},
		onLoad(e) {
			this.item = JSON.parse(e.item)
		},
		methods: {
			downFile(url){
				uni.showLoading({
					
				})
				uni.downloadFile({
				    url: url, //仅为示例，并非真实的资源
				    success: (res) => {
				        if (res.statusCode === 200) {
				            uni.showToast({
				            	title:'下载成功',
								icon:'success'
				            })
				        }else{
							uni.showToast({
								title:'下载失败',
								icon:'none'
							})
						}
				    },
					complete() {
						uni.hideLoading()
					}
				});
			}
			
			
		}
	}
</script>

<style>

</style>
