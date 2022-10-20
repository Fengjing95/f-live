/*
 * @Date: 2022-10-07 21:36:16
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 主播相关接口
 * @LastEditTime: 2022-10-07 22:47:47
 */

import type { SecretDTO } from "#/anchor";
import { request } from "@/utils/request";

/**
 * 开始直播
 */
export async function startLiving(): Promise<boolean> {
  return await request.put("/anchor/startLive");
}

/**
 * 关闭直播
 */
export async function stopLiving(): Promise<boolean> {
  return request.put("/anchor/overLive");
}

/**
 * 获取推流秘钥
 */
export async function fetchSecret(): Promise<SecretDTO> {
  return await request.post("/anchor/streamKey");
}
