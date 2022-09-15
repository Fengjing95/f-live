/*
 * @Date: 2022-06-26 18:10:20
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 分类相关 API
 * @LastEditTime: 2022-06-27 15:40:17
 */
import type { Classification } from "#/class";
import type { RoomInfoDTO } from "#/room";
import { request } from "@/utils/request";

/**
 * @description: 获取所有的分类, 根据大类型
 * @param {string} major 大分类
 * @return {*}
 */
export async function getClasses(): Promise<Classification[]> {
  return await request.get(`/classification/class`);
}

/**
 * @description: 根据分类获取直播间列表
 * @param {number} classId 分类 ID
 * @return {*}
 */
export async function getRoomsByClassId(classId: string): Promise<RoomInfoDTO[]> {
  return await request.get(`/classification/class/${classId}`);
}
