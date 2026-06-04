# design.md 模板与写作规则

design.md 是品牌视觉的 single source of truth：人读它来理解品牌，工具读它来翻译 theme.css。**改品牌永远先改 design.md，再同步 theme.css**。

## 核心纪律

1. **每个值可执行**——hex 码、字体名、具体元件名。写"米白色"是散文，写 `#F9F3E5` 才能翻译成 CSS
2. **每个色绑定用途**——孤立色块表没有意义，"`--paper` 背景主色"才有
3. **Do/Don't 来自真实反馈**——循环中用户每次否定都是一条候选红线，不要凭空编
4. **禁用项也要写**——明确不用什么（字体/颜色/手法）和用什么同样重要

## 五段式结构（按此模板填）

```markdown
# <创作者名> · 品牌设计系统 (<体系英文名>)

<一句话：这是什么的视觉 SSOT，约束范围>

来源:<素材/参考/访谈 + picker 循环，注明日期>

---

## 调性 (Personality)

**<体系名>** —— <三个词概括的气质公式>。

<一段话画面感描述：想象品牌是一个具体场景/物件>

关键词:<5 个左右关键词，· 分隔>

---

## 配色 (Palette)

<一句话：底色策略 + 点缀策略>

| Token | Hex | 用途 |
| ----- | --- | ---- |
| `--paper` | `#XXXXXX` | 背景主色 / <质感描述> |
| `--ink` | `#XXXXXX` | 主文字 |
| `--structure` | `#XXXXXX` | 结构线 / 边框 |
| `--accent` | `#XXXXXX` | 点缀 / 徽章 |
| <5-8 个，每个必须有用途列> |

<如有第三方官方色（平台按钮等）单独列表，注明"仅按钮，不入主调">

---

## 字体 (Typography)

<一句话：配对逻辑，比如"衬线×等宽 = 人的创造×机器的执行">

| 角色 | 字体 | 用途 |
| ---- | ---- | ---- |
| 标题 | `XXX` | <具体用在哪> |
| 正文/中文 | `XXX` | <具体用在哪> |
| 等宽 | `XXX` | <具体用在哪> |

- <字重策略，如"标题 900 正文 300，对比拉满">
- <字距/数字等微排版规则>
- **禁用字体**:<明确列出不用的字体>

---

## 视觉语言 (Visual Language)

<体系名>的标志性元素,每个作品应出现 2-5 个:

- **<元件名>** —— <长什么样 + 用在哪>
- <4-6 个元件，每个都具体到能直接实现>

---

## Do / Don't

**Do**
- <3-5 条，来自定稿组合的内在逻辑>

**Don't**
- ❌ <来自循环红线池，用户确认过的>
- ❌ <3-6 条>
```

## theme.css 翻译骨架

design.md 定稿后按此骨架翻译（详细规则见 SKILL.md ⑥）：

```css
/* <体系名> 品牌主题
 * 由 design.md 翻译生成 —— 改品牌先改 design.md，再同步此文件
 */
@import url("https://fonts.googleapis.com/css2?family=...&display=swap");

:root {
  /* —— 配色 token（与 design.md Palette 表一一对应）—— */
  --paper: #F9F3E5;
  --ink: #465670;
  --structure: #2B3358;
  --structure-rgb: 43, 51, 88;   /* 需要透明度的色配 -rgb 伴生变量 */
  --accent: #BD7D36;
  --accent-rgb: 189, 125, 54;

  /* —— 字体 token —— */
  --font-title: "Fraunces", "Noto Serif SC", serif;
  --font-body: "Noto Serif SC", serif;
  --font-mono: "IBM Plex Mono", monospace;
}

/* —— 品牌元件（只写"长相"，布局/动画归消费方引擎）—— */
.stamp { color: var(--accent); border: 3px double var(--accent); /* … */ }
.card  { background: var(--off-white); box-shadow: 4px 4px 0 rgba(var(--structure-rgb), .12); }
```

自检清单：

- [ ] `:root` 之外 `grep -E "#[0-9A-Fa-f]{3,6}|rgba?\([0-9]"` 应为 0 命中
- [ ] 每个 design.md Palette 行都有对应变量
- [ ] 透明度用法全部走 `-rgb` 伴生变量
- [ ] 没有第三方官方色（那是消费方的事）
