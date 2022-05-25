/*
 * @Date: 2022-05-25 16:15:34
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-05-25 16:19:34
 */
export interface RTCPublishDTO {
  tid: string;
  streamurl: string;
  clientip: string | null;
  sdp: string;
}

export interface ServerSdpDTO {
  code: number;
  sdp: string;
  server: string;
  sessionid: string;
}
