/*
 * @Date: 2022-10-26 22:11:59
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 通用工具
 * @LastEditTime: 2022-10-27 10:18:40
 */

/**
 * 深克隆(JSON 方案)
 * @param obj 要克隆的对象
 * @returns
 */
export function deepCloneByJSON<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
