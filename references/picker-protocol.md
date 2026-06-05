# Picker 循环协议

picker 是 design-extract 的核心交互：把判断从"对话里描述"变成"浏览器里看着选"。**一切判断都贴着可见物下**——从气质定向到命名确认，全程浏览器；对话只负责模式判定、素材接收和异常兜底。本文档定义文件结构、数据格式、回读通道和收敛规则。

## 轮次总览

| 轮次 | 候选形态 | 判断方式 |
|------|---------|---------|
| **速筛轮**（第 0 轮，探索模式必出） | 16 张原型卡，每卡自带模板渲染成实景小样 | 三态投票（心动/无感/不要）+ 事实题文本框 |
| **方向板轮**（第 1 轮） | 3-4 个完整方向板，候选**自带模板**（`html` + `css`），结构级差异 | 整板单选 |
| **细节轮**（第 2 轮起） | 逐区块候选，共享定稿方向的模板，候选间只差变量值，方向级差异 | 逐区块点选 + 微调 |
| **收尾轮**（最后一轮） | 暗色变体 / 调性卡 / 命名 wordmark 卡 / 红线勾选 | 点选 + 勾选确认 |

没有方向板轮就没有版式差异——共享模板下候选只剩样式层差异，16 个原型会塌缩成"1 个版式 × N 套涂装"。

## 区块类型

shell 支持四种 `section.type`，同一轮可混用：

| type | 用途 | 关键字段 | 提交载荷 |
|------|------|---------|---------|
| `"pick"`（默认，可省略） | 单选候选 + 微调 + 反馈 + 锁定 | `candidates` / `adjusters` / `allowNone` / `noneLabel`（自定义"都不是"文案）/ `noneNeedsReason: false`（允许不写原因，如"用不到暗色"） | `{type:"pick", pick, none, adjustments, feedback}` |
| `"vote"` | 三态投票（心动/无感/不要），候选各自带模板 | `candidates`（含 `html`/`css`）/ `requireVote: false` 关闭"至少投一票"校验 / `fbHint` 反馈框提示语 | `{type:"vote", votes:{candId:"love"\|"neutral"\|"veto"}, feedback}` |
| `"text"` | 开放文本题（仅事实题用，品味判断禁用） | `placeholder` / `required: false` 关闭必填 | `{type:"text", answer}` |
| `"checklist"` | 逐条勾选确认（Do/Don't 用） | `items: [{id, label, note, checked}]`（默认全勾）/ `fbHint` | `{type:"checklist", checked:[], unchecked:[], feedback}` |

只有 `pick` 区块参与全局预览合成与锁定；其余类型是一次性问答。整页无全局组合可言时（如速筛轮），设 `preview.hidden: true` 隐藏右侧预览栏。

**来源标注纪律**：任何候选/条目的 `note` 必须写明来源——原型候选标"源：某某原型"，混搭候选标"源：A 色板 × B 元件"，红线条目标"源：第 N 轮你的原话'……'"。用户有权知道每个选项从哪来。

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
      lockedPick: null,       // 锁定时显示的定稿名（如 "羊皮暖底 + 底色更亮"）
      lockedVars: null,       // 锁定时的最终变量值（pick.vars + adjustments 合并），
                              // 仍参与全局预览合成，让用户看到完整组合；
                              // shell 会把其中的色值/字体渲染成定稿样片芯片，必须给真实值
      lockedSample: null,     // 可选 {html, css}：质感/元件/形状这类非色值定稿的小样
                              // （纹理瓷砖/真元件/样例卡）。css 须命名空间；
                              // html 内可用 var()——shell 会把全局合成变量注入样片容器
      allowNone: true,        // 显示"✗ 都不是我想要的"
      candidates: [
        {
          id: "palette-a",
          label: "羊皮暖底",
          note: "源：学院羊皮 · 羊皮纸底 + 墨绿文字 + 烫金点缀",
          vars: {
            "--paper": "#F3EDE0", "--ink": "#2C3A2F",
            "--accent": "#8C6F3E", "--structure": "#6E4F3A"
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
            { label: "更亮", value: "#F9F4EA" },
            { label: "默认", value: "#F3EDE0", default: true },
            { label: "更暗", value: "#E9E1CE" }
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

## 方向板轮：候选自带模板，多场景实例化

方向板轮只有一个 section（如 `id: "direction"`），候选对象在 `vars` 之外多带 `html` / `css`。**每个方向板不是一张封面，而是同一套版式语法在 2-3 个场景上的实例化**——迷你封面 + 迷你幻灯内页 + 迷你金句卡并排。用户选的是"穿越场景仍然成立的语法"：只在封面成立、到第二个场景就失效的结构会直接暴露。

```js
{
  id: "dir-a",
  label: "杂志式大留白",
  note: "源：杂志编辑原型 · 单焦点、留白即层级、密度低",
  html: `<div class="pv-dir-a">
    <div class="da-cover">…迷你封面…</div>
    <div class="da-side">
      <div class="da-slide">…迷你幻灯内页…</div>
      <div class="da-quote">…迷你金句卡…</div>
    </div>
  </div>`,
  css: `.pv-dir-a { width:100%; height:100%; display:flex; … } /* 板内排布自定（如左大封面+右列两小样），三场景必须共享同一变量集与同一套语法 */`,
  vars: { "--paper": "#XXXXXX", "--ink": "#XXXXXX" }  // 初始样式层，细节轮继续打磨
}
```

shell 行为：候选带 `html` 时，缩略图渲染它自己的模板（不再用共享 `preview.html`）；选中后右侧主预览整体切换到该模板。`preview.html` 在方向板轮里只是未选中时的占位。

纪律：

- 每个方向板的 `css` 必须用**唯一根类名**做命名空间（`.pv-dir-a` / `.pv-dir-b`），所有候选的 css 会同时注入页面，不隔离就互相污染
- 板与板之间必须是结构级差异（构图语法/明度结构/密度），换色换字不算一个新方向板
- **禁止速筛复读**：任何方向板不得与单一原型同构同样式——心动原型必须经过结构碰撞（与其他心动原型组合）或定向变体（按事实题画像改造）才能上板，板型配比见 SKILL.md ③《生成纪律》
- 排除票原型的结构与标志元件不得上板
- 板内三场景共享同一套语法：对齐纪律、明度结构、密度气质、签名手法在三个场景上必须一致——场景间排版可以不同，语法不许变
- 迷你幻灯内页/金句卡是**语法验证载体**（验证结构穿越场景），不是内容页排版样板——不得据其推导信息承载页的量化密度（密度分层纪律见 SKILL.md ⑥）
- 视觉属性照样写成 var() 引用——定稿后这块模板要原样成为细节轮的共享模板
- **语法锚定**：方向板只是语法的可视化载体。锁定后写进 design.md 版式语法段的是**跨场景不变量**（对齐纪律/明度结构/密度档/签名手法）+ 按画幅的应用指引（见 `design-md-template.md`），**禁止写具体坐标**——"信息入口从左上进"是语法，"标题在左上角 x,y"是排版，排版是消费方引擎（slides 生成等）的事

方向板锁定后：把定稿板的 `html`/`css`（含全部场景）写进下一轮 picker-data.js 的 `preview.html`/`preview.css`，定稿板的 `vars` 并入 `baseVars`——细节轮回到"共享模板 + 候选只差变量"，且色板/字体候选的差异在三个场景上同时可见。

## 速筛轮（第 0 轮，替代文字访谈）

零素材探索模式必出；素材提取/参考借鉴模式跳过投票区块（素材本身就是气质信号），事实题并入方向板轮页顶。结构：

```js
window.PICKER_DATA = {
  title: "第 0 轮 · 气质速筛",
  round: 0,
  preview: { html: "", css: "", baseVars: {}, hidden: true },
  sections: [
    { id: "facts", type: "text", title: "先说两句事实",
      desc: "你的内容主要讲什么、讲给谁看？也可以类比（像一本什么杂志/一家什么店）",
      placeholder: "一两句话即可" },
    { id: "vibe", type: "vote", title: "凭直觉投票",
      desc: "每张卡是一种完整气质的实景小样。不用想理由：心动就 ♥，反感就 ✗，说不上来就跳过",
      candidates: [ /* 16 张原型卡，每卡自带 html/css（渲染该原型的版式签名 + 色板），
                       label = 原型名，note = "源：XX 原型 · 一句气质注解" */ ] }
  ]
};
```

纪律：

- **全量呈现，不预筛**：16 个原型全部出卡——速筛的意义就是把"模型猜你喜欢什么"换成"你自己看见了再说"。原型库《映射建议》只决定卡片排序（领域匹配的排前面），不决定谁被隐藏
- 卡片渲染用原型自带的版式签名做构图、色板字体做样式——卡与卡结构级不同，一眼可辨
- **读票规则**：按 SKILL.md《偏好画像》做维度级解读——心动票交集建立初始画像并圈定组合原料（仅作原料，禁止原样复读——见《方向板轮》纪律）；排除票交集记反向信号入红线池（同族多卡被排除 → 整族降权）；全无感 + 反馈空 → shell 已强制至少投一票，不会发生
- 票果只缩小先验（16 → 3-4 个原型），不替代循环——组合与试探由方向板轮的板型配比承担（SKILL.md ③《生成纪律》）

## 收尾轮（最后一轮，替代收尾对话）

全部区块锁定后加开一轮，四件事全部贴着定稿可见物确认。`preview.html` = 定稿模板，`baseVars` = 全部已锁变量——右侧始终显示定稿组合：

```js
sections: [
  // 1. 暗色变体（定稿是亮色时；定稿是暗色则反向出亮色变体）
  { id: "dark", title: "暗色场景变体", desc: "夜间模式/视频暗场用得到吗？",
    candidates: [ /* 2-3 个按推导纪律暗化的候选，note 标"源：定稿色板同色相压暗" */ ],
    noneLabel: "✗ 我用不到暗色场景", noneNeedsReason: false },
  // 2. 调性回放：从循环行为读出的 2-3 版调性，渲染成文字卡贴着定稿预览验证
  { id: "tone", title: "调性回放", desc: "从你的点选和否决里读出来的，看着右边的定稿挑哪版说得最准",
    candidates: [ /* 每卡自带 html：用定稿字体/底色排版"气质公式 + 画面感一段"，
                     note 标"源：第 2 轮你否决了X · 反馈里反复出现Y" */ ] },
  // 3. 命名：体系名渲染成 wordmark 卡——定稿字体排在定稿底色上，看着选不是读着选
  { id: "name", title: "体系命名",
    candidates: [ /* 2-3 张 wordmark 卡，html 用 var(--font-title)/var(--paper) 渲染名字本身 */ ] },
  // 4. Do/Don't：红线池逐条勾选，来源必须标注
  { id: "redlines", type: "checklist", title: "Do/Don't 红线确认",
    desc: "这些是循环里攒下的红线，勾选的会写进 design.md",
    items: [ /* {id, label: "忌纯白底", note: "源：第 1 轮你的原话'太亮太互联网'"} */ ] }
]
```

调性/命名选定后如有口头修正（feedback），按修正改写再产出，不再加轮。

注意：调性卡与 wordmark 卡的候选 **`vars` 必须留空**——它们自带 html 用 var() 引用定稿变量即可；若带 vars，点选时会被并进全局合成，污染右侧定稿预览。

## choices.json 格式（服务器写出）

```json
{
  "round": 2,
  "sections": {
    "palette": {
      "type": "pick",
      "pick": "palette-a",
      "none": false,
      "adjustments": { "--paper": "#F9F4EA" },
      "feedback": "底色对了，点缀色想要更复古的红"
    },
    "typography": {
      "type": "pick",
      "pick": null,
      "none": true,
      "feedback": "都太互联网了，想要纸质印刷感"
    }
  }
}
```

速筛轮的载荷形如：

```json
{
  "round": 0,
  "sections": {
    "facts": { "type": "text", "answer": "讲独立开发实战，给想做副业的程序员" },
    "vibe": {
      "type": "vote",
      "votes": { "arch-1": "love", "arch-2": "neutral", "arch-13": "veto" },
      "feedback": "暗色系都太冷了"
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
| `none: true` + 理由 | 换方向出 2-3 个新候选；**理由追加进红线池**（最终作为 Do/Don't 的输入） |

每轮提交后按 SKILL.md《偏好画像》更新画像——锁定、否决、feedback 原话都是维度证据；下一轮候选的组合与排序依据更新后的画像。

下一轮的 picker-data.js 里：已锁定区块标 `locked: true` 并展示定稿（用户能看到全局但改不了）；只有未锁定区块有可点候选。全部锁定 → 循环结束，进收尾轮。

红线池格式（循环过程中自己维护在记事里即可）：

```
- 第1轮 palette none："太亮太互联网" → 候选红线：高饱和互联网蓝、纯白底
- 第2轮 typography feedback："不要圆体" → 候选红线：圆体/可爱系字体
```

红线纪律——**记原话，不泛化**。红线池记用户的原话和它具体所指：用户否决"赛博霓虹深色"≠ 否决"一切深色底"（暖黑+烛光金不在其列），否决"大红大黄营销风"≠ 否决"暖色系"。从否定推导候选范围时只许收窄、不许扩大；觉得需要泛化（"用户大概讨厌一切暗色底？"）必须回到对话用 AskUserQuestion 确认，确认前不得写进红线、不得用它过滤候选。速筛轮的排除票同样适用本条。

## 防呆

- 候选数量每区块 2-4 个，多了选择瘫痪；两个例外：色板与字体配对（6-10 个，按画像匹配度排序——组合空间大、缩略图一眼可比）、速筛轮 vote 区块（16 张全量——投票单卡成本低，不致瘫痪）
- 每轮只出未锁定区块，绝不重复展示已满意内容
- "都不是"必填理由（shell 已强制），沉默的否定毫无价值
- 三轮后仍未收敛的区块，停下来用 AskUserQuestion 直接对话挖需求，别无脑再出候选

## 清理

结束时：杀服务器进程；choices.json 历史可留在临时目录供溯源；问用户是否保留 `design-extract-picker/`（最后一轮 picker.html 就是定稿预览）。
