/*
 * @Date: 2022-06-06 15:54:50
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 关注列表相关 API
 * @LastEditTime: 2022-06-06 16:30:20
 */

import { request } from "@/utils/request";
import type { FavoriteItemDTO } from "#/favorite.d";

/**
 * @description: 获取关注列表
 * @param {*}
 * @return {*}
 */
export async function getFavoriteList(): Promise<FavoriteItemDTO> {
  return request.get("/user/follow");
}
