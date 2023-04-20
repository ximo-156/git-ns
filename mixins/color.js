 

export default {
	data() {
		return {
			colorStyle: '',
			colorStatus: ''
		};
	},
	created() {
		this.colorStyle = uni.getStorageSync('viewColor')
		uni.$on('ok', (data, status) => {
			this.colorStyle = data
			this.colorStatus = status
		})
	},
	methods: {}
};
