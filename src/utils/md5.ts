/*
 * @Date: 2022-09-21 11:19:19
 * @Author: 枫
 * @LastEditors: 枫
 * @description:  对字符串进行 MD5 hash
 * @LastEditTime: 2022-09-21 11:27:11
 */
import { Md5 } from "ts-md5";

/**
 * 字符转取 hash
 * @param str 要取 hash 的字符串
 * @returns string
 */
export function getHashWithString(str: string): string {
  return Md5.hashStr(str);
}
