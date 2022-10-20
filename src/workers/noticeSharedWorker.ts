/*
 * @Date: 2022-09-25 22:54:48
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 消息通知 sharedWorker 用于多个页面之间的消息互通
 * @LastEditTime: 2022-09-28 21:23:41
 */

/**
 * 每个页面有自己的 noticeStore
 * 不同页面通过 sharedWorker 通讯: 内部有 socket-client, 可以接受最新的消息
 * 通过 inject/provide 将 worker 注入全局
 * 已读消息事通过 worker 告知其他页面
 * 其他页面接收到消息时做出同步的处理
 * 消息写入 indexedDB
 */
import { io, Socket } from "socket.io-client";

interface SharedWorkerGlobalScope {
  onconnect: (event: MessageEvent) => void;
}

/* 存下与 shared worker 连接了的所有端口 */
const portPool: MessagePort[] = [];
let socket: Socket | undefined;
const _self: SharedWorkerGlobalScope = self as any;

/* 连接事件触发 */
_self.onconnect = function (e: MessageEvent) {
  // 初始化 socketIO 实例

  const port = e.ports[0];
  // 将 port 添加到 portPool 中
  portPool.push(port);

  port.postMessage({ event: "connected" });

  port.onmessage = (e: MessageEvent<{ event: string; payload: unknown }>) => {
    switch (e.data.event) {
      case "init":
        if (!socket) {
          socket = io(import.meta.env.VITE_SOCKET_NOTICE, {
            query: { token: e.data.payload },
          });

          socket.on("clientNotice", (data) => {
            // console.log("[ data ] >", data);
            broadcast({ event: "newNotice", payload: data });
          });
        } else {
          console.log("已存在 socket 实例");
        }
        break;
      case "close": {
        const index = portPool.findIndex((p) => p === port);
        // 关闭连接，移除对应 port
        portPool.splice(index, 1);
        port.close();
        break;
      }
      default:
        broadcast(e.data);
    }
  };
};

/* 向当前所有连接了的 port 广播消息 */
function broadcast(message: { event: string; payload: unknown }) {
  portPool.forEach((port) => {
    port.postMessage(message);
  });
}
