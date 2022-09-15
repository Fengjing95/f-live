/*
 * @Date: 2022-09-10 22:30:25
 * @Author: 枫
 * @LastEditors: 枫
 * @description:  根据地接口
 * @LastEditTime: 2022-09-14 21:35:41
 */

import type { CitadelInfoDTO, DynamicDTO, FollowDTO } from "#/citadel";
import type { PaginationResponseData } from "#/util";
import { request } from "@/utils/request";

/**
 * 获取根据地首页动态
 * @returns
 */
export async function getHomeDynamic(): Promise<
  PaginationResponseData<Required<DynamicDTO>>
> {
  return await request.get("/citadel/list");
}

/**
 * 获取关注的根据地列表
 * @returns
 */
export async function getFollowCitadel(): Promise<FollowDTO[]> {
  return await request.get("/citadel/follow/list");
}

/**
 * 获取根据地内的帖子
 * @param citadelId 根据地 ID
 * @returns
 */
export async function getDynamicInCitadel(
  citadelId: number
): Promise<PaginationResponseData<DynamicDTO>> {
  return await request.get(`/citadel/${citadelId}`);
}

/**
 * 获取根据地信息
 * @param citadelId 根据地 ID
 * @returns
 */
export async function getCitadelInfo(
  citadelId: number
): Promise<CitadelInfoDTO> {
  return await request.get(`/citadel/${citadelId}/info`);
}

/**
 * 点赞
 * @param postId 文章 ID
 * @returns
 */
export async function thumb(postId: number): Promise<boolean> {
  return await request.post(`/citadel/post/${postId}/thumb`);
}

/**
 * 取消点赞
 * @param postId 文章 ID
 * @returns
 */
export async function cancelThumb(postId: number): Promise<boolean> {
  return await request.delete(`/citadel/post/${postId}/thumb`);
}
