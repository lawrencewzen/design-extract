# design-extract

一个 [Claude Code](https://claude.com/claude-code) skill：把零散的视觉偏好提炼成**个人品牌设计系统**。

你给它旧封面、喜欢的参考、甚至什么都不给——它通过对话访谈 + 浏览器里的交互式点选循环，最终交付一份人读的品牌规范（`design.md`）和一份机器可执行的 CSS 主题（`theme.css`），让你后续所有内容工具（幻灯片、封面图、视频动画）从同一个视觉源头取值。

## 解决什么问题

内容创作者的视觉风格通常散落在感觉里："我喜欢那种米白的、有点工程感的……"。这种描述既没法复用，也没法交给工具执行。每做一张封面、一页幻灯片都要重新"凭感觉对齐"，产出忽冷忽暖。

design-extract 把这个感觉**钉死成精确的 token**：`#F9F3E5` 而不是"米白"、`Fraunces × Noto Serif SC` 而不是"优雅的衬线"。钉死之后，品牌一致性就从"靠记忆"变成"靠引用"。

## 最终产出

| 文件 | 给谁用 | 内容 |
|------|--------|------|
| **design.md** | 人 + AI 会话 | 品牌 SSOT，五段式：命名调性 / 配色 token 表（hex + 用途）/ 字体配对 / 视觉语言元件 / Do & Don't 红线 |
| **theme.css** | 下游工具 | `:root` 全量变量 + 品牌元件样式。纪律：`:root` 之外零硬编码色值，下游换皮 = 换这一个文件 |

```css
/* theme.css 长这样（节选） */
:root {
  --paper: #F9F3E5;   /* 背景主色 / 暖奶油纸 */
  --ink: #465670;     /* 主文字 */
  --accent: #BD7D36;  /* 点缀 / 徽章 */
  --font-title: "Fraunces", "Noto Serif SC", serif;
}
.stamp { color: var(--accent); border: 3px double var(--accent); }
```

附带产出：picker 临时目录里的最后一轮页面就是定稿组合的可视预览，可选保留。

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

**核心机制是 picker**：候选方案不是色块表——hex 码肉眼读不出感觉——而是渲染成实景小样（迷你封面）的网页。你在浏览器里：

- **点选**候选，右侧实时预览整体组合
- **微调**差一口气的细节（明度 / 字重 / 密度档位）
- **写反馈**："以这个为基础，但点缀色想要更复古的红"
- **否决**："✗ 都不是" + 必填原因（原因会沉淀成 Do/Don't 红线）

提交后 Claude 读取你的选择：满意的区块**锁定**不再出现，不满意的按反馈重做，循环三五轮收敛。视觉判断走眼睛，语言判断（命名、调性、红线）走对话。

## 内置内容

**7 个风格原型**（`references/style-archetypes.md`，零素材冷启动的基底，每个含完整色板 hex / 字体配对 / 质感 / 标志元件 / 红线种子）：

| 原型 | 气质 | 适合 |
|------|------|------|
| 工程蓝图 Engineering Blueprint | 暖纸 + 靛蓝线稿 + 古铜金 | 独立开发者、build in public |
| 复古印刷 Retro Print | 新闻纸 + 油墨黑 + 印刷红 | 评论观点、历史文化 |
| 杂志编辑 Editorial | 大留白 + 单一点缀色 | 深度长文、知识付费 |
| 极简瑞士 Swiss Grid | 网格 + 信号红 | 数据图表、产品测评 |
| 暗黑终端 Terminal | 近黑底 + 荧光等宽（唯一暗色系） | 编程教学、极客向 |
| 手账涂鸦 Notebook | 横线本 + 马克笔 + 手写体 | vlog 分享、学习笔记 |
| 柔和粉彩 Soft Pastel | 低饱和 + 大圆角柔光 | 亲子、心理健康 |

原型只是第一轮候选的起点，循环微调后才是个人化结果；分区块机制天然支持混血（"蓝图的元件 + 粉彩的色板"）。

**结构模板与基础设施**：

- `references/design-md-template.md` — design.md 五段式模板 + theme.css 翻译骨架 + 硬编码自检清单
- `references/picker-protocol.md` — picker 循环协议、choices.json schema、收敛规则
- `assets/picker/picker-shell.html` — 数据驱动的选择器页面（每轮只换数据不换壳）
- `assets/picker/server.mjs` — 零依赖本地服务器（静态托管 + 接收提交落盘 choices.json）

## 安装

```bash
git clone https://github.com/lawrence/design-extract.git
cd design-extract

./install.sh                    # 全局安装（所有项目可用）
./install.sh /path/to/project   # 或：项目级安装
```

安装方式是**软链接**——仓库 `git pull` 更新后所有项目立即生效，无需重装。卸载：`./install.sh --uninstall [项目路径]`。

依赖：Node.js ≥ 18（picker 本地服务器），零 npm 依赖。

## 使用

在 Claude Code 里直接说（无需记命令）：

- "帮我提取我的品牌设计，素材在 `./covers/` 下" → 素材提取模式
- "从这几个我喜欢的网站提取一套设计语言：……" → 参考借鉴模式
- "我想定义自己的视觉风格，但我没有素材" → 零素材探索模式

之后跟着流程走：回答 2-3 个访谈问题 → 浏览器自动打开 picker → 点选/微调/反馈 → 提交 → 重复至收敛 → 确认命名和红线 → 拿到 `design.md` + `theme.css`。

## 仓库结构

```
SKILL.md                          # 主指令：三模式 + 流程编排
install.sh                        # 统一安装/卸载脚本
references/
  design-md-template.md           # 产出模板 + 翻译规则
  style-archetypes.md             # 7 个风格原型库
  picker-protocol.md              # picker 循环协议
assets/picker/
  server.mjs                      # 本地服务器
  picker-shell.html               # 选择器页面骨架
```
