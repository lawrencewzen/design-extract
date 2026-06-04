#!/usr/bin/env node
/**
 * design-extract picker 服务器
 * 用法: node server.mjs --dir <picker目录> [--port 4399]
 *
 * 职责只有两个：
 *  1. 静态托管 <picker目录>（/ 默认指向 picker.html）
 *  2. 接收页面 POST /submit 的选择结果 → 写出 <picker目录>/choices.json
 *     （choices.json 的出现就是"用户已提交"的信号，Claude 侧轮询此文件）
 */
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const dir = resolve(arg("dir", process.cwd()));
const port = Number(arg("port", "4399"));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/submit") {
      let body = "";
      for await (const chunk of req) body += chunk;
      JSON.parse(body); // 非法 JSON 直接抛 500，不落盘
      await writeFile(join(dir, "choices.json"), body, "utf8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end('{"ok":true}');
      console.log("[picker] choices.json 已写出");
      return;
    }

    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const file = resolve(join(dir, urlPath === "/" ? "picker.html" : normalize(urlPath)));
    if (!file.startsWith(dir)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  } catch (err) {
    res.writeHead(err && err.code === "ENOENT" ? 404 : 500);
    res.end();
  }
});

server.listen(port, () => {
  console.log(`[picker] http://localhost:${port}  (dir: ${dir})`);
});
