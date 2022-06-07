/*
 * @Date: 2022-06-07 19:43:11
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 时间处理工具
 * @LastEditTime: 2022-06-07 19:49:04
 */
import moment from "moment";

/**
 * @description: UTC 时间转为当地时间
 * @param {string} utcTime utc 时间
 * @return {*} 当地时间
 */
export function utcToLocal(utcTime: string): string {
  return moment.utc(utcTime).local().format("YYYY-MM-DD HH:mm:ss");
}
