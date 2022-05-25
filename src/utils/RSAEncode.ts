/*
 * @Date: 2022-05-23 15:59:50
 * @Author: 枫
 * @LastEditors: 枫
 * @description: RSA 加密
 * @LastEditTime: 2022-05-23 16:03:25
 */

import JSEncrypt from "jsencrypt";

/**
 * @description: 使用 RSA 公钥加密
 * @param {string} publicKey 公钥
 * @param {string} target 要加密的字符串
 * @return {*}
 */
export function encodeByPublicKey(publicKey: string, target: string): string {
  const sign = new JSEncrypt();
  sign.setPublicKey(publicKey);
  // TODO md5
  const encode = sign.encrypt(target);
  if (!encode) throw new Error("秘钥错误, 请联系管理员");
  return encode;
}
