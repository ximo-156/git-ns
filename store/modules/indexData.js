 

export default {
	namespaced: true,
	state: {
		// 搜索关键字
		indexDatas: {},
		cartNum: 0
	},
	getters: {},
	mutations: {
		setIndexData(state, data) {
			state.indexDatas = data;
		},
		setCartNum(state, data) {
			state.cartNum = data;
		}
	}
}
