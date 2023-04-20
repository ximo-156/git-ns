 

import $store from "@/store";
import { VUE_APP_WS_URL } from "@/utils/index.js";
/*
 *1. `wss(url)`的实现未知，可能会导致`WebSocket`连接失败。
 *2. 如果`onOpen`、`onError`等回调函数未定义或未正确绑定，则会导致代码出错。
 *3. 在多个`Socket`实例中使用相同的回调函数可能会导致冲突。
 *4. 代码中没有处理`WebSocket`连接关闭的情况，例如重连或清理资源。
 */
const Socket = function () {
  let url = VUE_APP_WS_URL;
  this.ws = new WebSocket(wss(url));
  this.ws.onopen = this.onOpen.bind(this);
  this.ws.onerror = this.onError.bind(this);
  this.ws.onmessage = this.onMessage.bind(this);
  this.ws.onclose = this.onClose.bind(this);
};
/*
 *这段代码可能存在的问题是，
 *它假定当前页面使用的协议与 WebSocket 的协议相同，
 *如果不同，则会导致错误。此外，
 *该函数似乎只是将 "ws:" 或 "wss:" 替换为相反的协议，
 *而没有进行其他验证或处理。因此，
 *如果传入的参数不是有效的 WebSocket 地址，则可能会出现其他错误。
 */
function wss(wsSocketUrl) {
  let ishttps = document.location.protocol == "https:";
  if (ishttps) {
    return wsSocketUrl.replace("ws:", "wss:");
  } else {
    return wsSocketUrl.replace("wss:", "ws:");
  }
}

Socket.prototype = {
  vm(vm) {
    this.vm = vm;
  },
  close() {
    clearInterval(this.timer);
    this.ws.close();
  },
  onOpen() {
    this.init();
    this.send({
      type: "login",
      data: $store.state.app.token,
    });
    this.vm.$emit("socket_open");
  },
  init() {
    var that = this;
    this.timer = setInterval(() => {
      that.send({
        type: "ping",
      });
    }, 10000);
  },
  send(data) {
    return this.ws.send(JSON.stringify(data));
  },
  onMessage(res) {
    const { type, data = {} } = JSON.parse(res.data);
    this.vm.$emit(type, data);
  },
  onClose: function () {
    clearInterval(this.timer);
  },
  onError: function (e) {
    this.vm.$emit("socket_error", e);
  },
};

Socket.prototype.constructor = Socket;

export default Socket;
