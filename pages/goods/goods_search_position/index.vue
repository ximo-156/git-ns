<template>
	<view :style="colorStyle">
		<view class='searchGood'>
			<view class='search acea-row row-between-wrapper'>
				<view class='bnt' @tap='searchBut'>{{position}}</view>
				<view class='input acea-row row-between-wrapper'>
					<text class='iconfont icon-sousuo'></text>
					<input type='text' v-model='searchValue' @confirm="inputConfirm" focus :placeholder='$t(`找城市/区县`)'
						placeholder-class='placeholder' @input="setValue"></input>
				</view>
			</view>
			<template v-if="history.length>0">
				<view class='title acea-row row-between-wrapper'>
					<view>{{$t(`搜索历史`)}}</view>
					<view class="iconfont icon-shanchu" @click="clear"></view>
				</view>
				<view class='list acea-row'>
					<block v-for="(item,index) in history" :key="index">
						<view class='item history-item line1' @tap='setHotSearchValue(item.keyword)'
							v-if="item.keyword">{{item.keyword}}</view>
					</block>
				</view>
			</template>
		</view>
		<view class='list acea-row '>
			<!--  -->
		</view>
		<view class="uni-indexed">
			<missthee-indexlist :data="list" @select-item='bindClick'></missthee-indexlist>
			<!-- <uni-indexed-list :options="list" :show-select="false" @click="bindClick" /> -->
		</view>
	</view>
</template>

<script>
	import citylist from "@/citylist.js"
	import {
		getSearchKeyword,
		getProductslist,
		getProductHot
	} from '@/api/store.js';
	import {
		searchList,
		clearSearch
	} from '@/api/api.js';
	import goodList from '@/components/goodList';
	import recommend from '@/components/recommend';
	import colors from "@/mixins/color";
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	export default {
		components: {
			goodList,
			recommend
		},
		mixins: [colors],
		data() {
			return {
				chooseLocationquery: {},
				position: '南昌',
				imgHost: HTTP_REQUEST_URL,
				hostProduct: [],
				searchValue: '',
				focus: true,
				bastList: [],
				hotSearchList: [],
				first: 0,
				limit: 8,
				page: 1,
				loading: false,
				loadend: false,
				loadTitle: this.$t(`加载更多`),
				hotPage: 1,
				isScroll: true,
				history: [],
				list: citylist.cityarr[0]
			};
		},
		onLoad() {
			this.position = uni.getStorageSync('position') || "南昌"
		},
		onShow: function() {
			// this.getRoutineHotSearch();
			// this.chooseAddress()
			this.searchList();
			try {
				this.hotSearchList = uni.getStorageSync('hotList');
			} catch (err) {}
		},
		onReachBottom: function() {
			if (this.bastList.length > 0) {
				this.getProductList();
			} else {
				this.getHostProduct();
			}

		},
		methods: {
			// 获取附近地址列表
			// chooseAddress() {
			// 	wx.choosePoi({}).then(res => {
			// 		console.log(res)
			// 	})
			// },
			bindClick(e) {
				// uni.setStorageSync({
				// 	key: 'position',
				// 	data: e.name,
				// 	success: () => {
				// 		uni.redirectTo({
				// 			url: "/pages/index/index"
				// 		})
				// 	}
				// });
				try {
					uni.setStorageSync(
						'position',
						e.name,
					)
					// uni.navigateTo({
					// 	url: "/pages/index/index"
					// })
					uni.navigateBack(-1)
					// uni.reLaunch({
					// 	url: "/pages/index/index"
					// })

				} catch (err) {
					console.log(err)
				}
				// then(res) {
				// 	console.log(e)
				// 	uni.redirectTo({
				// 		url: "/pages/index/index"
				// 	})
				// }
				// uni.setStorageSync("position", e.name)
				// // uni.navigateBack(-1)
				// uni.redirectTo({
				// 	url: "/pages/index/index"
				// })
			},
			searchList() {
				searchList({
					page: 1,
					limit: 10
				}).then(res => {
					this.history = res.data;
				});
			},
			clear() {
				let that = this;
				clearSearch().then(res => {
					uni.showToast({
						title: res.msg,
						success() {
							that.history = [];
						}
					});
				});
			},
			inputConfirm: function(event) {
				if (event.detail.value) {
					uni.hideKeyboard();
					this.setHotSearchValue(event.detail.value);
				}
			},
			getRoutineHotSearch: function() {
				let that = this;
				getSearchKeyword().then(res => {
					that.$set(that, 'hotSearchList', res.data);
				});
			},
			getProductList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = '';
				getProductslist({
					keyword: that.searchValue.trim(),
					page: that.page,
					limit: that.limit
				}).then(res => {
					let list = res.data,
						loadend = list.length < that.limit;
					that.bastList = that.$util.SplitArray(list, that.bastList);
					that.$set(that, 'bastList', that.bastList);
					that.loading = false;
					that.loadend = loadend;
					that.loadTitle = loadend ? that.$t(`没有更多内容啦~`) : that.$t(`加载更多`);
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false,
						that.loadTitle = that.$t(`加载更多`)
				});
			},
			getHostProduct: function() {
				let that = this;
				if (!this.isScroll) return
				getProductHot(that.hotPage, that.limit).then(res => {
					that.isScroll = res.data.length >= that.limit
					that.hostProduct = that.hostProduct.concat(res.data)
					that.hotPage += 1;
				});
			},
			setHotSearchValue: function(event) {
				this.$set(this, 'searchValue', event);
				this.page = 1;
				this.loadend = false;
				this.$set(this, 'bastList', []);
				this.getProductList();
			},
			setValue: function(event) {
				this.$set(this, 'searchValue', event.detail.value);
			},
			searchButs() {
				if (!that.searchValue.trim()) return this.$util.Tips({
					title: that.$t(`请输入要搜索的商品`)
				});
				that.focus = false;
				// if (that.searchValue.length > 0) {
				that.page = 1;
				that.loadend = false;
				that.$set(that, 'bastList', []);
				uni.showLoading({
					title: that.$t(`正在搜索中`)
				});
				that.getProductList();
				uni.hideLoading();
				// } else {
				// 	return this.$util.Tips({
				// 		title: '请输入要搜索的商品',
				// 		icon: 'none',
				// 		duration: 1000,
				// 		mask: true,
				// 	});
				// }
			},
			//获取位置
			searchBut: function() {
				let that = this;
				uni.chooseLocation({
					success: function(res) {
						that.chooseLocationquery = res;
						that.position = res.name;
						uni.setStorageSync("position", that.position)
						uni.setStorageSync("address_add", JSON.stringify(res))
						uni.reLaunch({
							url: "/pages/index/index"
						})
					}
				});

			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}

	.noCommodity {
		border-top-width: 0;
	}

	.uni-indexed {
		height: calc(100vh - 200rpx);
	}

	.searchGood {
		position: sticky;
		top: -1;
		z-index: 9999999;
		background: #FFF;
		padding: 5rpx 0;
	}

	.searchGood .search {
		padding-left: 30rpx;
	}


	.searchGood .search .input {
		max-width: 598rpx;
		width: 510rpx;
		background-color: #f7f7f7;
		border-radius: 33rpx;
		padding: 0 35rpx;
		box-sizing: border-box;
		height: 66rpx;
	}

	.searchGood .search .input input {
		font-size: 28rpx;
	}

	.searchGood .search .input .placeholder {
		color: #999;
	}

	.searchGood .search .input .iconfont {
		color: #555;
		font-size: 35rpx;
	}

	.searchGood .search .bnt {
		width: 200rpx;
		height: 66rpx;
		white-space: nowrap;
		text-align: center;
		line-height: 66rpx;
		font-size: 30rpx;
		color: #282828;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
	}

	.searchGood .title {
		font-size: 28rpx;
		color: #999;
		margin: 50rpx 30rpx 25rpx 30rpx;
	}

	.searchGood .title .iconfont {
		font-size: 28rpx;
	}

	.searchGood .list {
		padding-left: 10rpx;
	}

	.searchGood .list .item {
		font-size: 26rpx;
		color: #454545;
		padding: 0 21rpx;
		height: 60rpx;
		border-radius: 3rpx;
		line-height: 60rpx;
		border: 1rpx solid #aaa;
		margin: 0 0 20rpx 20rpx;
	}

	.searchGood .list .item.history-item {
		height: 50rpx;
		border: none;
		border-radius: 25rpx;
		background-color: #F7F7F7;
		line-height: 50rpx;
	}

	.searchGood .line {
		border-bottom: 1rpx solid #eee;
		margin: 20rpx 30rpx 0 30rpx;
	}
</style>