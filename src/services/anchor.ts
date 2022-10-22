/*
 * @Date: 2022-10-07 21:36:16
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 主播相关接口
 * @LastEditTime: 2022-10-22 19:56:09
 */

import type { PublishDTO, SecretDTO, WebLiveSecretDTO } from "#/anchor";
import { request, rtcRequest } from "@/utils/request";

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

/**
 * 获取 webrtc 推流地址
 */
export async function fetchWebLiveAddress(): Promise<WebLiveSecretDTO> {
  return await request.post("/anchor/webrtcStreamKey");
}

/**
 * 交换 offer
 * @param data 数据体
 * @returns
 */
export async function getRemoteOffer(data: PublishDTO) {
  return await rtcRequest.post(`/publish/?secret=${data.secret}`, {
    sdp: data.sdp,
    api: data.api,
    streamurl: data.streamurl,
  });
}
