import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)


// import createPersistedState from "vuex-persistedstate"
 

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		token:null,
		username:'未知',
		createOrderEData:[]
	},
	mutations: {
		login(state,user) {
			console.log(1111)
			console.log(user)

			state.hasLogin = true;
			state.token = user.token
			state.username = user.username
			// state.userInfo = provider;
			// uni.setStorage({//缓存用户登陆状态
			//     key: 'userInfo',  
			//     data: provider  
			// }) 
			console.log(state.userInfo);
			uni.setStorage({
			    key: 'vuex-state',
			    data: JSON.stringify(state),
			});
		},
		logout(state) {
			console.log(2222)
			state.hasLogin = false;
			state.userInfo = {};
			state.token = null
			state.username = '未知'
			uni.setStorage({
			    key: 'vuex-state',
			    data: JSON.stringify(state),
			});
		},
		insertCreateOrderEdata(state,data)
		{
			state.createOrderEData = data
			uni.setStorage({
			    key: 'vuex-state',
			    data: JSON.stringify(state),
			});
		},
		initVuex(state,json)
		{
			let estate = JSON.parse(json)
			state.hasLogin= estate.hasLogin
			state.userInfo= estate.userInfo
			state.token= estate.token
			state.username= estate.username
			state.createOrderEData= estate.createOrderEData
		}
	},
	actions: {
	
	},
	// plugins: [createPersistedState()]
})

export default store
