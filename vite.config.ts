/*
 * @Date: 2022-05-09 19:57:46
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-05-24 14:25:19
 */
import { fileURLToPath, URL } from "url";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vitePluginForArco from "@arco-plugins/vite-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vitePluginForArco({
      theme: "@arco-themes/vue-orange",
    }),
    Components({
      resolvers: [ArcoResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#": fileURLToPath(new URL("./typings", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 自定义 less 全局变量
          "@primary-custom": "#FF7D00",
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:7001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/v1/api"),
      },
    },
  },
});
