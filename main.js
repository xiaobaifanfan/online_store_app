import Vue from 'vue'
import store from './store'
import App from './App'

import Json from './Json' //测试用数据
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
var rediToLoginType = false

// #ifdef APP-PLUS || MP-WEIXIN
	var api_root = 'http://101.133.224.55:8001/'; 
// #endif


// #ifdef H5
	var api_root = '/';
// #endif
// 封装请求方法
Vue.prototype.$request = function(api,method = 'GET',data = {},jy_that = this,success = function(){},fail = function(){},complete = function(){})
{
	let allowResponseHttpStatus = [200,201,202,203,204]

	uni.showLoading({
		title:'加载中'
	})
	
	var storageToken = jy_that.$store.state.token;
	
	

	jy_that.jyLoading = true

	uni.request({
		url: api_root + api,
		method:method,
		data: data,
		header: {
			'Authorization' : 'JWT ' + storageToken,
			'custom-header': 'hello' //自定义请求头信息
		},
		success: (res) => {
			console.log(res.data)
			data = res.data
			if(allowResponseHttpStatus.indexOf(res.statusCode) != -1)
			{
				success(data)
			}
			else if(res.statusCode == 401)
			{
				jy_that.$store.commit("logout")
				if(!rediToLoginType)
				{
					rediToLoginType = true;
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
				}
				
			}
			else
			{
				fail(res)
				// console.log('err')
				// jy_that.$refs.c1.msg('请求错误,请检查网络','错误');
				// uni.showToast({
				//     title: res.data.non_field_errors[0] || '请求错误,请检查网络',
				// 	icon:'none',
				//     duration: 2000
				// });
				// this.vusui.msg('请求错误,请检查网络')
			}
			// else{
			// 	fail(data)
			// 	uni.showToast({
			// 	    title: data.msg,
			// 		icon:'none',
			// 	    duration: 2000
			// 	});
			// }
		},
		fail: () => {
			uni.showToast({
			    title: '请求错误,请检查网络',
				icon:'none',
			    duration: 2000
			});
		},
		complete() {
			jy_that.jyLoading = false
			uni.hideLoading()
			complete()
		}
	});
}

import table from './components/p-table/table/table.vue'
Vue.component('m-table',table)

Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, json, prePage};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()