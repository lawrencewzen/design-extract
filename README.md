# design-extract

一个 [Claude Code](https://claude.com/claude-code) skill：把零散的视觉偏好提炼成**个人品牌设计系统**。

产出两个可执行文件：

- **design.md** — 人读的品牌 SSOT（命名调性 / 配色 token / 字体配对 / 视觉语言 / Do & Don't）
- **theme.css** — 机器执行的翻译（`:root` 变量 + 品牌元件样式），可直接被幻灯片、封面、视频等下游工具消费

## 它怎么工作

```
① 模式判定 → ② 开场访谈(对话) → ③ 生成候选 → ④ picker 循环(浏览器点选)
                                       ↑               │ 不满意区块重生成
                                       └───────────────┘ 满意区块锁定
→ ⑤ 收尾(命名 + Do/Don't 确认) → ⑥ design.md + theme.css
```

**三种输入模式**，按你手上有什么自动选择：

| 模式 | 你有什么 | 候选从哪来 |
|------|---------|-----------|
| 素材提取 | 自己的旧封面 / 作品截图 / 旧 CSS | 提纯你已有的风格 |
| 参考借鉴 | 喜欢的账号 / 网站 / 海报 | 转译气质和手法（不抄画面） |
| 零素材探索 | 什么都没有 | 结构化访谈 + 内置 7 个风格原型库 |

**核心机制是 picker**：候选方案不是色块表，而是渲染成实景小样的 HTML 页面——你在浏览器里点选、微调（明度/字重/密度档位）、写反馈，提交后 Claude 读取结果，重做不满意的区块、锁定满意的，循环直到收敛。视觉判断走眼睛，语言判断走对话。

## 安装

```bash
git clone https://github.com/<you>/design-extract.git

# 项目级安装（软链接进目标项目）
ln -s /path/to/design-extract /your-project/.claude/skills/design-extract

# 或全局安装
ln -s /path/to/design-extract ~/.claude/skills/design-extract
```

依赖：Node.js ≥ 18（picker 本地服务器），无 npm 依赖。

## 使用

在 Claude Code 里直接说：

- "帮我提取我的品牌设计，素材在 ./covers/ 下"
- "我想定义自己的视觉风格，但我没有素材"
- "从这几个我喜欢的网站提取一套设计语言：…"

## 仓库结构

```
SKILL.md                          # 主指令：三模式 + 流程编排
references/
  design-md-template.md           # design.md 五段式模板 + theme.css 翻译规则
  style-archetypes.md             # 7 个风格原型（零素材冷启动）
  picker-protocol.md              # picker 循环协议 + choices.json schema
assets/picker/
  server.mjs                      # 本地服务器：静态托管 + POST /submit → choices.json
  picker-shell.html               # 数据驱动的选择器骨架（每轮只换 picker-data.js）
```
