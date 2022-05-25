/*
 * @Date: 2022-05-25 16:10:16
 * @Author: 枫
 * @LastEditors: 枫
 * @description: WebRTC 相关 API
 * @LastEditTime: 2022-05-25 16:31:14
 */

import { request, rtcRequest } from "@/utils/request";
import type { RTCPublishDTO, ServerSdpDTO } from "#/webrtc";

/**
 * @description: 获取串流秘钥
 * @param {*}
 * @return {*}
 */
export async function getStreamKey(): Promise<string> {
  return await request.get("/anchor/getStreamKey");
}

/**
 * @description: 获取服务端 sdp
 * @param {RTCPublishDTO} rtcData 本地 SDP 描述等组合的数据包
 * @return {*}
 */
export async function getSDPFromSRS(
  rtcData: RTCPublishDTO
): Promise<ServerSdpDTO> {
  return rtcRequest.post("/publish", rtcData);
}
