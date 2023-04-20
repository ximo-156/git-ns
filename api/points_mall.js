 

import request from "@/utils/request.js";

/**
 * 积分商城
 */
export function getStoreIntegral(data) {
	return request.get("store_integral/index", data);
}
