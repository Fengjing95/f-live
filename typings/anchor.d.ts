/*
 * @Date: 2022-10-07 22:46:14
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 主播相关的 DTO
 * @LastEditTime: 2022-10-22 19:56:17
 */

export interface SecretDTO {
  url: string;
  key: string;
  secret: string;
}

export interface PublishDTO {
  streamurl: string;
  sdp: string;
  api: string;
  secret: string;
}

export interface WebLiveSecretDTO {
  streamurl: string;
  api: string;
  secret: string;
  streamKey: string;
}
