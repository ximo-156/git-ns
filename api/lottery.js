 

import request from "@/utils/request.js";

/**
 * 获取抽奖详情信息
 * 
 */
export function getLotteryData(type) {
	return request.get(`v2/lottery/info/${type}`);
}

/**
 * 参与抽奖
 * 
 */
export function startLottery(data) {
	return request.post(`v2/lottery`, data);
}

/**
 * 领奖
 * 
 */
export function receiveLottery(data) {
	return request.post(`v2/lottery/receive`, data);
}

/**
 * 获取中奖记录
 * 
 */
export function getLotteryList(data) {
	return request.get(`v2/lottery/record`, data);
}
