/*
 * @Date: 2022-10-09 19:18:21
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 文件相关工具
 * @LastEditTime: 2022-10-09 19:20:10
 */
/**
 * base64 转 blob
 * @param urlData base64字符串
 * @returns
 */
export function convertBase64UrlToBlob(urlData: string, type: string) {
  const bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type });
}
