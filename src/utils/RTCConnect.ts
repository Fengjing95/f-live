/*
 * @Date: 2022-05-25 11:24:25
 * @Author: 枫
 * @LastEditors: 枫
 * @description: WebRTC 连接 SRS服务器工具柜
 * @LastEditTime: 2022-05-25 16:45:35
 */

// SRS 错误错误
export class SRSError extends Error {
  constructor(name: string, message: string) {
    super();
    this.name = name;
    this.message = message;
  }
}

export class SrsRtcPublisher {
  private pc: RTCPeerConnection;
  private stream: MediaStream;

  static constraints: {
    audio: true;
    video: {
      // TODO 修改为自己的视频设备
      width: { ideal: 320; max: 576 };
    };
  };

  constructor() {
    this.pc = new RTCPeerConnection(undefined);
    this.stream = new MediaStream();
  }

  async publish(url: string) {
    const conf = SrsRtcPublisher.prePareUrl(url);
  }

  static prePareUrl(url: string) {
    throw new Error("Method not implemented.");
  }

  static parse(url: string) {
    throw new Error("Method not implemented.");
  }
}
