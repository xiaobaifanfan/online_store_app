<template>
	<view>
		<view class="title" style="margin-top: 10%;">留言列表</view>
		<view class="genaral-area">
			<view class="flex-box tc thead">
				<view class="item-2">日期</view>
				<view class="item-2">主题</view>
				<view class="item-2">内容</view>
				<view class="item-2">操作</view>
			</view>
			<view class="flex-box table tc" v-for="item in messageList">
				<view class="item-2">
					{{item.add_time.split(' ')[0]}}
				</view>
				<view class="item-2">
					{{item.subject}}
				</view>
				<view class="item-2">
					{{item.message}}
				</view>
				<view class="item-2">
					<view class="b-btn" @click="drop(item.id)">
						<text class="cell-tit">删除</text>
					</view>
				</view>
			</view>
		</view>
		
		
		<view style="margin-top: 20%;">创建留言	</view>
		
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">留言类型</text>
				 <view class="uni-list-cell-db">
					<picker @change="bindPickerChange" :value="index" :range="array">
						<view class="cell-tip">{{array[index]}}</view>
					</picker>
				</view>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-￥35</text>
			</view> -->
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">免运费</text>
			</view> -->
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">主题</text>
				<input class="desc" type="text" v-model="form.subject" placeholder="请填写主题信息" placeholder-class="placeholder" />
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">内容</text>
				<input class="desc" type="text" v-model="form.message" placeholder="请填写内容信息" placeholder-class="placeholder" />
			</view>
			<view class="yt-list-cell desc-cell" @click="openFile">
				<text class="cell-tit clamp">上传文件</text>
				<input class="desc" type="text" v-model="form.file" placeholder-class="placeholder" disabled="true"/>
			</view>
		</view>
		<view class="list-cell log-out-btn" style="background-color: #C0C4CC;border-radius: 20px;width: 70%;margin-left: 15%;"  @click="submit">
			<text class="cell-tit">提 交</text>
		</view>
	 
	</view>
</template>

<script>
	export default {
		onShow() {
			this.loadData()
		},
		data() {
			return {
				messageList:[],	
				array: ['留言','投诉','询问','售后','求购'],
				index: 0,
				form:{
					message_type:1,
					subject:'',
					message:'',
					file :''
				},
				file:'',
				
			}
		},	
		methods: {
			bindPickerChange: function(e) {
				this.index = e.target.value 
				this.form.message_type = e.target.value + 1
			},
			loadData(){
				var that = this
				this.$request('messages','GET',{},this,function(res){
					that.messageList = res
					
				})
			},
			drop(id){
				var that = this
				this.$request('messages/'+id+'/','DELETE',{},this,function(res){
					uni.showToast({
						title:'删除成功',
						icon:'success'
					})
					setTimeout(that.loadData,2000)
					
				})
			},
			openPopup() {
				this.$refs.popup.open()
			},
			closePopup() {
				this.$refs.popup.close()
			},
			resultPath(e) {
				console.log('asdasdasd')
				console.log(e)
				this.file = 'file://' + e
				this.form.file = e
			},
			openFile() {
				// #ifdef APP-PLUS
				if (plus.os.name.toLowerCase() != "android") {
					uni.showModal({
						title: '提示',
						content: '仅支持Android平台',
						success: function(res) {}
					});
					return false
				}
				let that = this
				// java 代码来自 http://www.cnblogs.com/panhouye/archive/2017/04/23/6751710.html
				let main = plus.android.runtimeMainActivity();
				let Intent = plus.android.importClass("android.content.Intent");
			
				// 
				let fileIntent = new Intent(Intent.ACTION_GET_CONTENT)
				//fileIntent.setType(“image/*”);//选择图片
				//fileIntent.setType(“audio/*”); //选择音频
				//fileIntent.setType(“video/*”); //选择视频 （mp4 3gp 是android支持的视频格式）
				//fileIntent.setType(“video/*;image/*”);//同时选择视频和图片
				fileIntent.setType("*/*"); //无类型限制
				fileIntent.addCategory(Intent.CATEGORY_OPENABLE);
				main.startActivityForResult(fileIntent, 1);
				// 获取回调
				main.onActivityResult = function(requestCode, resultCode, data) {
					let Activity = plus.android.importClass("android.app.Activity");
					let ContentUris = plus.android.importClass("android.content.ContentUris");
					let Cursor = plus.android.importClass("android.database.Cursor");
					let Uri = plus.android.importClass("android.net.Uri");
					let Build = plus.android.importClass("android.os.Build");
					let Environment = plus.android.importClass("android.os.Environment");
					let DocumentsContract = plus.android.importClass("android.provider.DocumentsContract");
					let MediaStore = plus.android.importClass("android.provider.MediaStore");
					// 给系统导入 contentResolver
					let contentResolver = main.getContentResolver()
					plus.android.importClass(contentResolver);
					// 返回路径
					let path = '';
					if (resultCode == Activity.RESULT_OK) {
						let uri = data.getData()
						if ("file" == uri.getScheme().toLowerCase()) { //使用第三方应用打开
							path = uri.getPath();
							return;
						}
						if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT) { //4.4以后
							path = getPath(this, uri);
						} else { //4.4以下下系统调用方法
							path = getRealPathFromURI(uri)
						}
						// 回调
						that.resultPath(path)
						// that.$emit('result', path)
					}
					// 4.4 以上 从Uri 获取文件绝对路径
					function getPath(context, uri) {
						let isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;
						let scheme = uri.getScheme().toLowerCase()
						if (isKitKat && DocumentsContract.isDocumentUri(context, uri)) {
							// ExternalStorageProvider
							if (isExternalStorageDocument(uri)) {
								let docId = DocumentsContract.getDocumentId(uri);
								let split = docId.split(":");
								let type = split[0];
								// 如果是手机内部存储
								if ("primary" == type.toLowerCase()) {
									return Environment.getExternalStorageDirectory() + "/" + split[1];
								} else {
									return '/storage/' + type + "/" + split[1];
								}
							}
							// DownloadsProvider
							else if (isDownloadsDocument(uri)) {
								let id = DocumentsContract.getDocumentId(uri);
								let split = id.split(":");
								return split[1]
								// console.log(id)
								// let contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), id);
								// return getDataColumn(context, contentUri, null, null);
							}
							// MediaProvider
							else if (isMediaDocument(uri)) {
								let docId = DocumentsContract.getDocumentId(uri);
								let split = docId.split(":");
								let type = split[0];
								let contentUri = null;
								if ("image" == type.toLowerCase()) {
									contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
								} else if ("video" == type.toLowerCase()) {
									contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
								} else if ("audio" == type.toLowerCase()) {
									contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
								}
								let selection = "_id=?";
								let selectionArgs = [split[1]];
								return getDataColumn(context, contentUri, selection, selectionArgs);
							}
						}
						// MediaStore (and general)
						else if ("content" == scheme) {
							return getDataColumn(context, uri, null, null);
						}
						// File
						else if ("file" == scheme) {
							return uri.getPath();
						}
					}
					// 4.4 以下 获取 绝对路径
					function getRealPathFromURI(uri) {
						let res = null
						let proj = [MediaStore.Images.Media.DATA]
						let cursor = contentResolver.query(uri, proj, null, null, null);
						if (null != cursor && cursor.moveToFirst()) {;
							let column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
							res = cursor.getString(column_index);
							cursor.close();
						}
						return res;
					}
					// 通过uri 查找出绝对路径
					function getDataColumn(context, uri, selection, selectionArgs) {
						let cursor = null;
						let column = "_data";
						let projection = [column];
						// let contentResolver = context.getContentResolver()
						// plus.android.importClass(contentResolver);
						cursor = contentResolver.query(uri, projection, selection, selectionArgs, null);
						if (cursor != null && cursor.moveToFirst()) {
							let column_index = cursor.getColumnIndexOrThrow(column);
							return cursor.getString(column_index);
						}
					}
			
					function isExternalStorageDocument(uri) {
						return "com.android.externalstorage.documents" == uri.getAuthority() ? true : false
					}
			
					function isDownloadsDocument(uri) {
						return "com.android.providers.downloads.documents" == uri.getAuthority() ? true : false
					}
			
					function isMediaDocument(uri) {
						return "com.android.providers.media.documents" == uri.getAuthority() ? true : false
					}
				}
				// #endif
				// #ifndef APP-PLUS
				uni.showModal({
					title: '提示',
					content: '仅支持Android平台',
					success: function(res) {
			
					}
				});
				// #endif
			},
			
			submit(){
				var that = this;
				var storageToken = this.$store.state.token;
				if(this.file == '')
				{
					uni.showToast({
						title:'请选择文件',
						icon:'none'
					})
					return
				}
				uni.showLoading({
					
				})
				console.log(this.file)
				uni.uploadFile({
					url: 'http://101.133.224.55:8001/messages/', //仅为示例，非真实的接口地址
					filePath: that.file,
					name: 'file',
					header: {
						'Authorization' : 'JWT ' + storageToken,
					},
					formData: {
						message_type: that.form.message_type,
						subject: that.form.subject,
						message: that.form.message,
					},
					success: (uploadFileRes) => {
						console.log(uploadFileRes)
						if(uploadFileRes.statusCode == 401)
						{
							that.$store.commit("logout")
							uni.clearStorageSync();
							uni.showToast({
								title: '登录已失效,即将跳转登录',
								icon:'none',
								duration: 2000
							});
							setTimeout(function(){
								uni.navigateTo({
									url: '/pages/public/login'
								});
								rediToLoginType = false;
							},2000)
							
						}else if(uploadFileRes.statusCode == 201)
						{
							uni.showToast({
								title:'提交成功',
								icon:'success'
							})
							that.file = ''
							that.form = {
								message_type:1,
								subject:'',
								message:'',
								file :''
							}
							that.index = 0
							setTimeout(that.loadData,2000)
						}else{
							uni.showToast({
								title:'提交失败',
								icon:'none'
							})
						}
					},
					fail:()=>{
						uni.showToast({
							title:'提交失败',
							icon:'none'
						})
					},
					complete:()=>{
						uni.hideLoading()
					}
				});
			}			
		}
	}
</script>

<style lang="scss">
	$color:#e0e0e0;
	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #fbf9fe;
	}
	
	.flex-box {
		display: flex;
		flex-wrap: wrap;
	}
	
	
	.flex-box>.item-2 {
		flex: 0 0 25%;
	}
	
	.flex-box>.item-3 {
		flex: 0 0 33.3333%;
	}
	
	.title{
		margin: 20upx 0;
		// color: red;
	}
	
	//普通表格
	.genaral-area {
		.item-2 {
			font-size: 26upx;
			border: 1upx solid $color;
			border-width: 1upx 1upx 0 0;
			padding: 16upx 0;
			box-sizing: border-box;
			text-align: center;
	
			&:first-child {
				border-left-width: 1upx;
			}
	
			&:last-child {
				border-right-width: 1upx;
			}
		}
	
		.thead {
			.item-2 {
				font-weight: bold;
	
				box-sizing: border-box;
			}
		}
	
		.table {
			&:last-child {
				border-bottom: 1upx solid $color;
			}
	
			.item-2 {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
		}
	}
	
	
	// 多行合并表格
	.advance-area {
		.item-3 {
			font-size: 26upx;
			border: 1upx solid $color;
			border-width: 1upx 1upx 0 0;
			box-sizing: border-box;
			text-align: center;
	
			&:first-child {
				border-left-width: 1upx;
			}
	
			&:last-child {
				border-right-width: 1upx;
			}
		}
	
		.thead {
			.item-3 {
				font-weight: bold;
				padding: 16upx 0;
				box-sizing: border-box;
			}
		}
	
		.table {
			&:last-child {
				border-bottom: 1upx solid $color;
			}
	
			.item-3 {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
		}
	
		.table-flex {
			flex: 1;
	
			.item {
				border-bottom: 1upx solid $color;
				padding: 10upx 0;
				box-sizing: border-box;
	
				&:last-child {
					border-width: 0;
				}
			}
		}
	}
	
	.radio{
		margin-left: 20px;
	}


	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 140upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
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
