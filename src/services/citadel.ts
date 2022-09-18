/*
 * @Date: 2022-09-10 22:30:25
 * @Author: 枫
 * @LastEditors: 枫
 * @description:  根据地接口
 * @LastEditTime: 2022-09-18 20:38:41
 */

import type { CitadelInfoDTO, DynamicDTO, FollowDTO } from "#/citadel";
import type { PostDetailDTO, PostCreateDTO } from "#/post";
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
  citadelId: number,
  page?: number,
  size?: number
): Promise<PaginationResponseData<DynamicDTO>> {
  return await request.get(`/citadel/${citadelId}?page=${page}&size=${size}`);
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

/**
 * 发布文章
 * @param citadelId 根据地 ID
 * @param post 文章实体
 * @returns
 */
export async function publishPost(
  citadelId: number,
  post: PostCreateDTO
): Promise<boolean> {
  return await request.post(`/citadel/${citadelId}/post`, post);
}

/**
 * 删除文章
 * @param citadelId 根据地 ID
 * @param postId 文章 ID
 * @returns
 */
export async function delPostInCitadel(
  citadelId: number,
  postId: number
): Promise<boolean> {
  return await request.delete(`/citadel/${citadelId}/post/${postId}`);
}

/**
 * 获取文章详情
 * @param citadelId 根据地 ID
 * @param postId 文章 ID
 * @returns
 */
export async function getPostDetail(
  citadelId: number,
  postId: number
): Promise<PostDetailDTO> {
  return await request.get(`/citadel/${citadelId}/post/${postId}`);
}
