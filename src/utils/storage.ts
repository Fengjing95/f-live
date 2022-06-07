/*
 * @Date: 2022-06-07 11:29:20
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 缓存工具
 * @LastEditTime: 2022-06-07 19:44:12
 */

import type { UserInfoDTO } from "#/user";

/**
 * @description: 读取缓存操作
 * @param {string} name 缓存名称
 * @return {*}
 */
function getStorage(name: string) {
  return JSON.parse(localStorage.getItem(name) || "{}");
}

/**
 * @description: 设置缓存
 * @param {string} name 缓存名称
 * @param {string} value 缓存值
 * @return {*}
 */
function setStorage(name: string, value: string | object) {
  localStorage.setItem(name, JSON.stringify(value));
}

/**
 * @description: 读取缓存的用户信息
 * @return {*}
 */
export function getUserFromStorage(): UserInfoDTO {
  return getStorage("user");
}

/**
 * @description: 设置用户信息缓存
 * @param {UserInfoDTO} user
 * @return {*}
 */
export function setUserInStorage(user: UserInfoDTO) {
  setStorage("user", user);
}
