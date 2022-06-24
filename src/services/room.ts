/*
 * @Date: 2022-06-08 11:09:12
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 房间 api
 * @LastEditTime: 2022-06-24 11:19:05
 */
import type { RoomInfoDTO } from "#/room";
import { request } from "@/utils/request";

/**
 * @description: 获取直播间信息
 * @param {number} roomId 直播间号码
 * @return {*}
 */
export async function getRoomInfo(roomId: string): Promise<RoomInfoDTO> {
  return await request.get(`/live/room/${roomId}`);
}

/**
 * @description: 是否关注直播间
 * @param {number} roomId 房间号
 * @return {*}
 */
export async function hasLikeRoom(roomId: string): Promise<boolean> {
  return await request.get(`/live/isLike/room/${roomId}`);
}

/**
 * @description: 关注直播间
 * @param {string} roomId 直播间 ID
 * @return {*}
 */
export async function followRoom(roomId: string): Promise<boolean> {
  return await request.post(`/live/follow/room/${roomId}`);
}

/**
 * @description: 取消关注直播间
 * @param {string} roomId 直播间 ID
 * @return {*}
 */
export async function unFollowRoom(roomId: string): Promise<boolean> {
  return await request.delete(`/live/follow/room/${roomId}`);
}

/**
 * @description: 获取直播间粉丝数
 * @param {string} roomId 直播间ID
 * @return {number} 粉丝数
 */
export async function gerRoomFansNum(roomId: string): Promise<number> {
  return await request.get(`/live/room/fans/${roomId}`);
}
