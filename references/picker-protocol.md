# Picker 循环协议

picker 是 design-extract 的核心交互：把视觉决策从"对话里描述"变成"浏览器里点选"。本文档定义文件结构、数据格式、回读通道和收敛规则。

## 两种轮次

| 轮次 | 候选形态 | 差异级别 | 选择方式 |
|------|---------|---------|---------|
| **方向板轮**（第 1 轮） | 3-4 个完整方向板，每个候选**自带模板**（`html` + `css`） | 骨级：构图骨架、明度结构、留白密度都不同 | 整板单选 |
| **细节轮**（第 2 轮起） | 逐区块候选，共享定稿方向的模板，候选间只差变量值 | 方向级：色相/色温、字体类别、质感方向 | 逐区块点选 + 微调 |

没有方向板轮就没有版式差异——共享模板下候选只能换皮，16 个原型会塌缩成"1 个版式 × N 套涂装"。

## 文件结构

在用户工作目录建临时目录：

```
design-extract-picker/
├── picker.html      # 复制自 assets/picker/picker-shell.html，不要改
├── picker-data.js   # 每轮重写：window.PICKER_DATA = {...}
├── choices.json     # 用户提交后由服务器写出（出现 = 用户点了提交）
└── assets/          # 候选需要的图片素材（可选）
```

## 启动与等待

```bash
# 1. 起服务器（必须 run_in_background，它会一直阻塞）
node <skill目录>/assets/picker/server.mjs --dir design-extract-picker --port 4399

# 2. 打开浏览器
open http://localhost:4399

# 3. 后台等提交（until-loop 轮询文件出现）
until [ -f design-extract-picker/choices.json ]; do sleep 2; done; echo SUBMITTED
```

第 3 步也放后台跑，结束时收到通知再读 `choices.json`。**每轮开始前删掉上一轮的 choices.json**，否则等待会立即假完成。

## picker-data.js 格式

```js
window.PICKER_DATA = {
  title: "第 2 轮 · 还剩 2 个区块",
  round: 2,
  // 实时预览模板：一段 HTML，全部用 var(--xxx) 引用变量，
  // 用户每点一个候选，对应变量集就合并注入预览容器。
  // 根节点会被渲染进固定 480×360 的舞台（缩略图自动缩放），按此尺寸设计
  preview: {
    html: `<div class="pv-cover">…迷你封面/迷你幻灯片实景…</div>`,
    css: `.pv-cover { width:100%; height:100%; background: var(--paper); color: var(--ink); … }`,
    baseVars: { "--paper": "#FAF7F0", "--ink": "#333" }  // 兜底默认值
  },
  sections: [
    {
      id: "palette",
      title: "色板",
      desc: "底色 + 文字 + 结构 + 点缀的整体关系",
      locked: false,          // true = 已锁定，只展示定稿不可改
      lockedPick: null,       // 锁定时显示的定稿名（如 "暖纸蓝图 + 底色更亮"）
      lockedVars: null,       // 锁定时的最终变量值（pick.vars + adjustments 合并），
                              // 仍参与全局预览合成，让用户看到完整组合
      allowNone: true,        // 显示"✗ 都不是我想要的"
      candidates: [
        {
          id: "palette-a",
          label: "暖纸蓝图",
          note: "麻纸底 + 普鲁士蓝结构 + 标注红点缀",
          vars: {
            "--paper": "#F6F0E2", "--ink": "#35465E",
            "--accent": "#C14B33", "--structure": "#1E3A5F"
          }
        }
        // … 2-4 个候选
      ],
      // 微调控件：消化"接近但差一口气"。每个 adjuster 改一个变量，
      // options 是离散档位（不做自由滑杆，保证提交值精确可控）
      adjusters: [
        {
          id: "paper-lightness", label: "底色明度", var: "--paper",
          options: [
            { label: "更亮", value: "#FBF7ED" },
            { label: "默认", value: "#F6F0E2", default: true },
            { label: "更暗", value: "#EDE5D1" }
          ]
        }
      ]
    }
    // … 其他区块
  ]
};
```

候选缩略图由 shell 自动渲染：把每个候选的 `vars` 应用到 preview 模板的缩小副本上，天然是"实景小样"。**细节轮纪律：preview 模板必须把所有会变的视觉属性写成 var() 引用**，候选之间只差变量值。

字体候选的特殊处理：字体没法用一个 CSS 变量切换 `@import`，把所有候选字体都在 `preview.css` 里 `@import` 进来，候选 `vars` 切 `--font-title` / `--font-body` / `--font-mono` 的值。

## 方向板轮：候选自带模板

方向板轮只有一个 section（如 `id: "direction"`），候选对象在 `vars` 之外多带 `html` / `css`：

```js
{
  id: "dir-a",
  label: "杂志式大留白",
  note: "标题占上 1/3，单焦点，密度低",
  html: `<div class="pv-dir-a">…该方向自己的构图骨架（迷你封面实景）…</div>`,
  css: `.pv-dir-a { width:100%; height:100%; background: var(--paper); … }`,
  vars: { "--paper": "#XXXXXX", "--ink": "#XXXXXX" }  // 初始皮，细节轮继续打磨
}
```

shell 行为：候选带 `html` 时，缩略图渲染它自己的模板（不再用共享 `preview.html`）；选中后右侧主预览整体切换到该模板。`preview.html` 在方向板轮里只是未选中时的占位。

纪律：

- 每个方向板的 `css` 必须用**唯一根类名**做命名空间（`.pv-dir-a` / `.pv-dir-b`），所有候选的 css 会同时注入页面，不隔离就互相污染
- 板与板之间必须是骨级差异（构图/明度结构/密度），换色换字不算一个新方向板
- 视觉属性照样写成 var() 引用——定稿后这块模板要原样成为细节轮的共享模板

方向板锁定后：把定稿板的 `html`/`css` 写进下一轮 picker-data.js 的 `preview.html`/`preview.css`，定稿板的 `vars` 并入 `baseVars`，细节轮回到"共享模板 + 候选只差变量"。

## choices.json 格式（服务器写出）

```json
{
  "round": 2,
  "sections": {
    "palette": {
      "pick": "palette-a",
      "none": false,
      "adjustments": { "--paper": "#FBF7ED" },
      "feedback": "底色对了，点缀色想要更复古的红"
    },
    "typography": {
      "pick": null,
      "none": true,
      "feedback": "都太互联网了，想要纸质印刷感"
    }
  }
}
```

## 收敛规则（每轮处理逻辑）

对每个未锁定区块：

| 用户行为 | 处理 |
|---------|------|
| 选了候选，无 feedback | **锁定**：记录 pick + adjustments 的最终变量值，下轮 `locked: true` |
| 选了候选 + feedback | 以该候选为基（含微调值），按 feedback 改出 1-2 个变体，下轮重出该区块 |
| `none: true` + 理由 | 换方向出 2-3 个新候选；**理由追加进红线池**（最终喂 Do/Don't） |

下一轮的 picker-data.js 里：已锁定区块标 `locked: true` 并展示定稿（用户能看到全局但改不了）；只有未锁定区块有可点候选。全部锁定 → 循环结束，进收尾对话。

红线池格式（循环过程中自己维护在记事里即可）：

```
- 第1轮 palette none："太亮太互联网" → 候选红线：高饱和互联网蓝、纯白底
- 第2轮 typography feedback："不要圆体" → 候选红线：圆体/可爱系字体
```

红线纪律——**记原话，不泛化**。红线池记用户的原话和它具体所指：用户否决"赛博霓虹深色"≠ 否决"一切深色底"（暖黑+烛光金不在其列），否决"大红大黄营销风"≠ 否决"暖色系"。从否定推导候选范围时只许收窄、不许扩大；觉得需要泛化（"用户大概讨厌一切暗色底？"）必须回到对话用 AskUserQuestion 确认，确认前不得写进红线、不得用它过滤候选。访谈反向题的答案同样适用本条。

## 防呆

- 候选数量每区块 2-4 个，多了选择瘫痪；例外是色板与字体配对（6-10 个，按画像匹配度排序）——组合空间大、缩略图一眼可比
- 每轮只出未锁定区块，绝不重复展示已满意内容
- "都不是"必填理由（shell 已强制），沉默的否定毫无价值
- 三轮后仍未收敛的区块，停下来用 AskUserQuestion 直接对话挖需求，别无脑再出候选

## 清理

结束时：杀服务器进程；choices.json 历史可留在临时目录供溯源；问用户是否保留 `design-extract-picker/`（最后一轮 picker.html 就是定稿预览）。
