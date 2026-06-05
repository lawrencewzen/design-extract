// 预制标准速筛卡 —— 速筛轮（第 0 轮）的 16 张原型卡，随 skill 分发。
// 心理测验的题目必须每人相同：标题文案统一（"观察手记 · 第 12 期"），卡间只差风格，
// 现场生成导致的渲染差异不会污染票果。值与 references/style-archetypes.md 同步——改原型先改库，再改本文件。
// 用法：生成第 0 轮 picker-data.js 时把本文件内容原样拼在最前，随后
// PICKER_DATA 引用 window.ARCHETYPE_CARDS（vote 候选）与 window.ARCHETYPE_FONTS_CSS（preview.css，@import 须居首）。
// 每卡按 480×360 舞台设计，css 用唯一根类名（.ac-*）命名空间。

window.ARCHETYPE_FONTS_CSS =
  "@import url('https://fonts.googleapis.com/css2?family=Bitter:wght@400;900&family=Lora:wght@400;600&family=Archivo:wght@400;700&family=Archivo+Black&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;700&family=IBM+Plex+Mono:wght@400;600&family=Ma+Shan+Zheng&family=Quicksand:wght@400;600&family=Cormorant+Garamond:wght@500;600&family=VT323&family=Press+Start+2P&family=DotGothic16&family=Alfa+Slab+One&family=ZCOOL+QingKe+HuangYou&family=Noto+Serif+SC:wght@400;700;900&family=Noto+Sans+SC:wght@300;400;700;900&display=swap');";

window.ARCHETYPE_CARDS = [
  {
    id: "arch-retro-print",
    label: "复古印刷",
    note: "源：复古印刷原型 · 新闻纸、油墨、活字，报刊权威感",
    html: [
      '<div class="ac-print">',
      '  <div class="acp-rule"></div>',
      '  <div class="acp-title">观察手记</div>',
      '  <div class="acp-rule2"></div>',
      '  <div class="acp-cols"><span class="acp-drop">城</span>市的细节藏在路牌、橱窗与晨间的报摊之间，本期走访三条老街。</div>',
      '  <div class="acp-issue">第 12 期</div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-print { width:100%;height:100%;background:#F5F1E8;color:#1A1A1A;padding:30px 34px;font-family:"Bitter","Noto Serif SC",serif;position:relative;overflow:hidden; }',
      '.ac-print .acp-rule { border-top:3px solid #1A1A1A;border-bottom:1px solid #1A1A1A;height:6px; }',
      '.ac-print .acp-title { font-size:62px;font-weight:900;letter-spacing:4px;text-align:center;margin:26px 0 20px;font-family:"Noto Serif SC",serif; }',
      '.ac-print .acp-rule2 { border-top:1px solid #1A1A1A;border-bottom:1px solid #1A1A1A;height:5px;margin-bottom:22px; }',
      '.ac-print .acp-cols { font-size:15px;line-height:1.9;column-count:2;column-gap:24px;column-rule:1px solid #C9C2B2;color:#3A362E; }',
      '.ac-print .acp-drop { float:left;font-size:46px;line-height:.9;font-weight:900;margin:4px 8px 0 0;color:#C0392B; }',
      '.ac-print .acp-issue { position:absolute;top:34px;right:34px;background:#C0392B;color:#F5F1E8;font-size:12px;padding:3px 10px;letter-spacing:2px; }'
    ].join('\n')
  },
  {
    id: "arch-editorial",
    label: "杂志编辑",
    note: "源：杂志编辑原型 · 大标题、大留白、一抹点缀，安静高级",
    html: [
      '<div class="ac-edit">',
      '  <div class="ace-cat">FIELD NOTES · 12</div>',
      '  <div class="ace-title">观察手记</div>',
      '  <div class="ace-divider"></div>',
      '  <div class="ace-body">城市的细节藏在路牌、橱窗与晨间的报摊之间。</div>',
      '  <div class="ace-page">012</div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-edit { width:100%;height:100%;background:#FAFAF8;color:#111111;padding:52px 48px;font-family:"Lora","Noto Sans SC",serif;position:relative; }',
      '.ac-edit .ace-cat { font-family:"Noto Sans SC",sans-serif;font-size:11px;letter-spacing:4px;color:#D4380D;margin-bottom:16px; }',
      '.ac-edit .ace-title { font-size:58px;font-weight:600;line-height:1.1;letter-spacing:2px; }',
      '.ac-edit .ace-divider { width:36px;height:1px;background:#111;opacity:.3;margin:30px 0; }',
      '.ac-edit .ace-body { font-family:"Noto Sans SC",sans-serif;font-size:13px;line-height:2;color:#666;max-width:240px; }',
      '.ac-edit .ace-page { position:absolute;bottom:30px;right:48px;font-size:11px;letter-spacing:2px;color:#999; }'
    ].join('\n')
  },
  {
    id: "arch-swiss",
    label: "极简瑞士",
    note: "源：极简瑞士原型 · 网格、左对齐、功能主义，理性现代",
    html: [
      '<div class="ac-swiss">',
      '  <div class="acs-no">12</div>',
      '  <div class="acs-block"></div>',
      '  <div class="acs-title">观察手记</div>',
      '  <div class="acs-meta">CITY / DETAIL / DAILY <span class="acs-arrow">→</span></div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-swiss { width:100%;height:100%;background:#F4F4F4;color:#0A0A0A;padding:40px 44px;font-family:"Archivo","Noto Sans SC",sans-serif;position:relative; }',
      '.ac-swiss .acs-no { font-size:120px;font-weight:700;line-height:.9;letter-spacing:-4px; }',
      '.ac-swiss .acs-block { width:52px;height:52px;background:#E30613;margin:18px 0; }',
      '.ac-swiss .acs-title { font-size:34px;font-weight:700;font-family:"Noto Sans SC",sans-serif; }',
      '.ac-swiss .acs-meta { margin-top:12px;font-size:12px;letter-spacing:1px;color:#555; }',
      '.ac-swiss .acs-arrow { color:#E30613;font-weight:700;font-size:16px; }'
    ].join('\n')
  },
  {
    id: "arch-terminal",
    label: "暗黑终端",
    note: "源：暗黑终端原型 · 近黑底、荧光绿、等宽字，极客夜间",
    html: [
      '<div class="ac-term">',
      '  <div class="act-bar"><span></span><span></span><span></span></div>',
      '  <div class="act-body">',
      '    <div class="act-cmd">$ cat 观察手记.md</div>',
      '    <div class="act-out"># 第 12 期 · 城市与日常</div>',
      '    <div class="act-out">路牌 / 橱窗 / 晨间报摊</div>',
      '    <div class="act-cmd">$ <span class="act-cursor"></span></div>',
      '  </div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-term { width:100%;height:100%;background:#0D1117;color:#C9D1D9;font-family:"JetBrains Mono","IBM Plex Mono","Noto Sans SC",monospace;overflow:hidden; }',
      '.ac-term .act-bar { background:#161B22;padding:10px 14px;border-bottom:1px solid #30363D; }',
      '.ac-term .act-bar span { display:inline-block;width:10px;height:10px;border-radius:50%;background:#30363D;margin-right:6px; }',
      '.ac-term .act-body { padding:30px 32px;font-size:16px;line-height:2.1; }',
      '.ac-term .act-cmd { color:#3FB950; }',
      '.ac-term .act-out { color:#C9D1D9; }',
      '.ac-term .act-cursor { display:inline-block;width:10px;height:18px;background:#3FB950;vertical-align:middle; }'
    ].join('\n')
  },
  {
    id: "arch-notebook",
    label: "手账涂鸦",
    note: "源：手账涂鸦原型 · 横线本、马克笔、胶带贴纸，亲切随性",
    html: [
      '<div class="ac-note">',
      '  <div class="acn-tape"></div>',
      '  <div class="acn-title">观察手记</div>',
      '  <div class="acn-hl">第 12 期 · 城市与日常</div>',
      '  <div class="acn-line">路牌、橱窗、晨间的报摊 ➜</div>',
      '  <div class="acn-sticky">记！</div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-note { width:100%;height:100%;background:#FFFDF5 repeating-linear-gradient(transparent,transparent 31px,#E8E4D8 32px);color:#3D3A35;padding:48px 40px;font-family:"Ma Shan Zheng","Noto Sans SC",cursive;position:relative;overflow:hidden; }',
      '.ac-note .acn-tape { position:absolute;top:14px;left:50%;width:120px;height:26px;background:#F4A261;opacity:.55;transform:translateX(-50%) rotate(-3deg); }',
      '.ac-note .acn-title { font-size:54px;transform:rotate(-1.5deg); }',
      '.ac-note .acn-hl { display:inline-block;font-size:20px;margin-top:14px;background:linear-gradient(transparent 55%, rgba(244,162,97,.45) 55%);padding:0 4px; }',
      '.ac-note .acn-line { font-size:18px;margin-top:16px;color:#2A9D8F; }',
      '.ac-note .acn-sticky { position:absolute;right:36px;bottom:40px;width:72px;height:72px;background:#F7E3AF;transform:rotate(4deg);display:flex;align-items:center;justify-content:center;font-size:26px;color:#E76F51;box-shadow:0 2px 6px rgba(0,0,0,.08); }'
    ].join('\n')
  },
  {
    id: "arch-pastel",
    label: "柔和粉彩",
    note: "源：柔和粉彩原型 · 低饱和、大圆角、柔光，温柔治愈",
    html: [
      '<div class="ac-pastel">',
      '  <div class="acpa-card">',
      '    <div class="acpa-title">观察手记</div>',
      '    <div class="acpa-sub">第 12 期 · 城市与日常</div>',
      '    <div class="acpa-dots"><i></i><i class="d2"></i><i class="d3"></i></div>',
      '  </div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-pastel { width:100%;height:100%;background:#FBF7F4;display:flex;align-items:center;justify-content:center;font-family:"Quicksand","Noto Sans SC",sans-serif; }',
      '.ac-pastel .acpa-card { background:#FFFFFF;border-radius:28px;padding:44px 56px;text-align:center;box-shadow:0 14px 36px rgba(92,84,112,.12); }',
      '.ac-pastel .acpa-title { font-size:36px;color:#5C5470;font-weight:400;letter-spacing:4px; }',
      '.ac-pastel .acpa-sub { font-size:13px;color:#9A93A8;margin-top:12px;font-weight:300;letter-spacing:2px; }',
      '.ac-pastel .acpa-dots { margin-top:20px; }',
      '.ac-pastel .acpa-dots i { display:inline-block;width:12px;height:12px;border-radius:50%;background:#F2BAC9;margin:0 5px; }',
      '.ac-pastel .acpa-dots .d2 { background:#B8D8D8; }',
      '.ac-pastel .acpa-dots .d3 { background:#F7E3AF; }'
    ].join('\n')
  },
  {
    id: "arch-bauhaus",
    label: "包豪斯几何",
    note: "源：包豪斯几何原型 · 三原色、几何模块、海报感，直接现代",
    html: [
      '<div class="ac-bauhaus">',
      '  <div class="acb-circle"></div>',
      '  <div class="acb-tri"></div>',
      '  <div class="acb-bar"></div>',
      '  <div class="acb-title">观察<br/>手记</div>',
      '  <div class="acb-no">№12</div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-bauhaus { width:100%;height:100%;background:#F2EFE9;color:#1B1B1B;position:relative;overflow:hidden;font-family:"Archivo Black","Noto Sans SC",sans-serif;padding:44px; }',
      '.ac-bauhaus .acb-circle { position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:#BE3A34; }',
      '.ac-bauhaus .acb-tri { position:absolute;bottom:-20px;left:-20px;width:0;height:0;border-left:130px solid transparent;border-bottom:130px solid #27539B; }',
      '.ac-bauhaus .acb-bar { position:absolute;bottom:54px;right:44px;width:120px;height:18px;background:#E3A92B; }',
      '.ac-bauhaus .acb-title { font-size:58px;line-height:1.05;font-weight:900;position:relative;z-index:1;font-family:"Noto Sans SC",sans-serif; }',
      '.ac-bauhaus .acb-no { margin-top:16px;font-size:18px;letter-spacing:2px;position:relative;z-index:1; }'
    ].join('\n')
  },
  {
    id: "arch-academia",
    label: "学院羊皮",
    note: "源：学院羊皮原型 · 羊皮纸、墨绿、烫金，老图书馆书卷气",
    html: [
      '<div class="ac-acad">',
      '  <div class="aca-frame">',
      '    <div class="aca-no">— XII —</div>',
      '    <div class="aca-title">观察手记</div>',
      '    <div class="aca-sub">城市与日常 · 三条老街的走访</div>',
      '  </div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-acad { width:100%;height:100%;background:#F3EDE0;padding:26px;font-family:"Cormorant Garamond","Noto Serif SC",serif; }',
      '.ac-acad .aca-frame { width:100%;height:100%;border:1px solid #8C6F3E;outline:3px double #8C6F3E;outline-offset:-8px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#2C3A2F; }',
      '.ac-acad .aca-no { font-size:16px;letter-spacing:6px;color:#8C6F3E;margin-bottom:18px; }',
      '.ac-acad .aca-title { font-size:46px;font-weight:600;letter-spacing:8px;font-family:"Noto Serif SC",serif; }',
      '.ac-acad .aca-sub { font-size:14px;margin-top:16px;letter-spacing:3px;color:#6E4F3A; }'
    ].join('\n')
  },
  {
    id: "arch-film",
    label: "胶片暗房",
    note: "源：胶片暗房原型 · 相纸、颗粒、日期戳，有温度的记录感",
    html: [
      '<div class="ac-film">',
      '  <div class="acf-sprocket"></div>',
      '  <div class="acf-polaroid">',
      '    <div class="acf-photo"><span class="acf-stamp">26 06 12</span></div>',
      '    <div class="acf-caption">观察手记 · 第 12 期</div>',
      '  </div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-film { width:100%;height:100%;background:#FCFBF7;display:flex;align-items:center;justify-content:center;position:relative;font-family:"Archivo","Noto Sans SC",sans-serif; }',
      '.ac-film .acf-sprocket { position:absolute;left:0;top:0;bottom:0;width:26px;background:repeating-linear-gradient(#2A2A2A 0,#2A2A2A 14px,#FCFBF7 14px,#FCFBF7 26px); }',
      '.ac-film .acf-polaroid { background:#FFFFFF;padding:14px 14px 16px;box-shadow:0 8px 24px rgba(0,0,0,.14);transform:rotate(-2deg); }',
      '.ac-film .acf-photo { width:240px;height:180px;background:linear-gradient(135deg,#6E6A63,#9B968C);position:relative; }',
      '.ac-film .acf-stamp { position:absolute;right:10px;bottom:8px;font-family:"VT323",monospace;font-size:20px;color:#E07A3F;text-shadow:0 0 4px rgba(224,122,63,.6); }',
      '.ac-film .acf-caption { text-align:center;font-size:13px;color:#2A2A2A;margin-top:10px;letter-spacing:1px; }'
    ].join('\n')
  },
  {
    id: "arch-brutalism",
    label: "新粗野",
    note: "源：新粗野原型 · 粗黑描边、硬投影、撞色，生猛反精致",
    html: [
      '<div class="ac-brut">',
      '  <div class="acbr-card">',
      '    <div class="acbr-title">观察手记</div>',
      '    <div class="acbr-meta">CITY NOTES VOL.12</div>',
      '  </div>',
      '  <div class="acbr-sticker">NEW!</div>',
      '  <div class="acbr-arrow">↗</div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-brut { width:100%;height:100%;background:#FAF5F0;display:flex;align-items:center;justify-content:center;position:relative;font-family:"Space Grotesk","Noto Sans SC",sans-serif; }',
      '.ac-brut .acbr-card { background:#FFFFFF;border:3px solid #111111;box-shadow:9px 9px 0 #111111;padding:34px 44px; }',
      '.ac-brut .acbr-title { font-size:42px;font-weight:700;color:#111;font-family:"Noto Sans SC",sans-serif; }',
      '.ac-brut .acbr-meta { font-size:13px;font-weight:700;letter-spacing:2px;margin-top:10px;color:#4D9DE0; }',
      '.ac-brut .acbr-sticker { position:absolute;top:52px;right:64px;background:#FF6B35;border:3px solid #111;padding:6px 14px;font-weight:700;font-size:16px;transform:rotate(8deg);box-shadow:4px 4px 0 #111; }',
      '.ac-brut .acbr-arrow { position:absolute;bottom:36px;right:60px;font-size:54px;font-weight:700;color:#111; }'
    ].join('\n')
  },
  {
    id: "arch-inkwash",
    label: "水墨宣纸",
    note: "源：水墨宣纸原型 · 宣纸、墨色浓淡、一方朱印，东方留白",
    html: [
      '<div class="ac-ink">',
      '  <div class="aci-mountain"></div>',
      '  <div class="aci-title">观察手记</div>',
      '  <div class="aci-seal">观</div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-ink { width:100%;height:100%;background:#F7F4EC;position:relative;overflow:hidden;font-family:"Ma Shan Zheng","Noto Serif SC",serif; }',
      '.ac-ink .aci-mountain { position:absolute;left:-40px;bottom:-70px;width:260px;height:160px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(122,139,127,.35),transparent 70%); }',
      '.ac-ink .aci-title { position:absolute;top:44px;right:64px;writing-mode:vertical-rl;font-size:44px;letter-spacing:14px;color:#2B2B28; }',
      '.ac-ink .aci-seal { position:absolute;right:58px;bottom:48px;width:44px;height:44px;background:#A63A2B;color:#F7F4EC;display:flex;align-items:center;justify-content:center;font-size:24px;border-radius:4px; }'
    ].join('\n')
  },
  {
    id: "arch-memphis",
    label: "孟菲斯糖果",
    note: "源：孟菲斯糖果原型 · 撞色几何散点、波浪线，活泼综艺感",
    html: [
      '<div class="ac-memphis">',
      '  <i class="acm-circle"></i><i class="acm-tri"></i><i class="acm-zig">〰〰</i><i class="acm-dots"></i>',
      '  <div class="acm-band"></div>',
      '  <div class="acm-title">观察手记</div>',
      '  <div class="acm-bubble">第12期!</div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-memphis { width:100%;height:100%;background:#FFF8E7;color:#2D2A32;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;font-family:"ZCOOL QingKe HuangYou","Noto Sans SC",sans-serif; }',
      '.ac-memphis .acm-circle { position:absolute;top:34px;left:44px;width:54px;height:54px;border:6px solid #FF6F61;border-radius:50%; }',
      '.ac-memphis .acm-tri { position:absolute;bottom:44px;left:84px;width:0;height:0;border-left:26px solid transparent;border-right:26px solid transparent;border-bottom:44px solid #4ECDC4;transform:rotate(-12deg); }',
      '.ac-memphis .acm-zig { position:absolute;top:60px;right:60px;font-size:34px;color:#FFD166;font-style:normal;transform:rotate(8deg); }',
      '.ac-memphis .acm-dots { position:absolute;bottom:30px;right:40px;width:80px;height:50px;background:radial-gradient(#2D2A32 3px,transparent 3.5px);background-size:16px 16px; }',
      '.ac-memphis .acm-band { position:absolute;top:0;left:-40px;width:140%;height:30px;background:#FF6F61;transform:rotate(-6deg);opacity:.85; }',
      '.ac-memphis .acm-title { font-size:64px;position:relative;z-index:1; }',
      '.ac-memphis .acm-bubble { position:absolute;right:84px;top:120px;background:#FFD166;border:3px solid #2D2A32;border-radius:50%;padding:14px 12px;font-size:18px;transform:rotate(10deg);z-index:1; }'
    ].join('\n')
  },
  {
    id: "arch-midnight",
    label: "夜读烛光",
    note: "源：夜读烛光原型 · 暖黑底、烛光金、衬线，深夜电台陪伴感",
    html: [
      '<div class="ac-night">',
      '  <div class="acng-line top"></div>',
      '  <div class="acng-moon">☾</div>',
      '  <div class="acng-title">观察手记</div>',
      '  <div class="acng-sub">第 12 期 · 给晚睡的人</div>',
      '  <div class="acng-line bottom"></div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-night { width:100%;height:100%;background:#1F1B16;color:#E8DFD0;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;font-family:"Lora","Noto Serif SC",serif; }',
      '.ac-night .acng-line { position:absolute;left:60px;right:60px;height:1px;background:#D89F5B;opacity:.65; }',
      '.ac-night .acng-line.top { top:44px; }',
      '.ac-night .acng-line.bottom { bottom:44px; }',
      '.ac-night .acng-moon { color:#D89F5B;font-size:26px;margin-bottom:14px; }',
      '.ac-night .acng-title { font-size:42px;letter-spacing:10px;font-family:"Noto Serif SC",serif; }',
      '.ac-night .acng-sub { font-size:13px;letter-spacing:4px;color:#D89F5B;margin-top:16px; }'
    ].join('\n')
  },
  {
    id: "arch-pixel",
    label: "像素街机",
    note: "源：像素街机原型 · 像素字、8-bit 配色、游戏 HUD，复古电玩",
    html: [
      '<div class="ac-pixel">',
      '  <div class="acpx-hud"><span class="hp">HP ▮▮▮▮▯</span><span class="coin">© × 12</span></div>',
      '  <div class="acpx-title">OBSERVE</div>',
      '  <div class="acpx-sub">观察手记 · STAGE 12</div>',
      '  <div class="acpx-start">- PRESS START -</div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-pixel { width:100%;height:100%;background:#2B2D42;color:#EDF2F4;border:6px solid #EDF2F4;outline:6px solid #2B2D42;outline-offset:-12px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;font-family:"Press Start 2P","DotGothic16",monospace; }',
      '.ac-pixel .acpx-hud { position:absolute;top:22px;left:28px;right:28px;display:flex;justify-content:space-between;font-size:13px; }',
      '.ac-pixel .acpx-hud .hp { color:#EF476F; }',
      '.ac-pixel .acpx-hud .coin { color:#FFD166; }',
      '.ac-pixel .acpx-title { font-size:34px;letter-spacing:2px;text-shadow:4px 4px 0 #EF476F; }',
      '.ac-pixel .acpx-sub { font-family:"DotGothic16",monospace;font-size:16px;margin-top:18px;color:#06D6A0; }',
      '.ac-pixel .acpx-start { position:absolute;bottom:30px;font-size:12px;color:#FFD166; }'
    ].join('\n')
  },
  {
    id: "arch-travel",
    label: "复古旅贴",
    note: "源：复古旅贴原型 · 晒退色、粗衬线、邮票齿孔，WPA 旅行海报",
    html: [
      '<div class="ac-travel">',
      '  <div class="actr-perf">',
      '    <div class="actr-band">FIELD · CLUB</div>',
      '    <div class="actr-badge"><span>12</span></div>',
      '    <div class="actr-title">观察手记</div>',
      '    <div class="actr-strip">EST. 2026 · 城市与日常</div>',
      '  </div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-travel { width:100%;height:100%;background:#F2E8CF;padding:18px;font-family:"Alfa Slab One","Noto Serif SC",serif; }',
      '.ac-travel .actr-perf { width:100%;height:100%;border:3px dashed #354F52;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#354F52;position:relative; }',
      '.ac-travel .actr-band { background:#354F52;color:#F2E8CF;font-size:13px;letter-spacing:5px;padding:5px 26px;border-radius:0 0 40% 40%/0 0 100% 100%; }',
      '.ac-travel .actr-badge { width:74px;height:84px;background:#E07A5F;clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);display:flex;align-items:center;justify-content:center;margin:18px 0 14px; }',
      '.ac-travel .actr-badge span { color:#F2E8CF;font-size:30px; }',
      '.ac-travel .actr-title { font-size:38px;letter-spacing:8px;font-family:"Noto Serif SC",serif;font-weight:900; }',
      '.ac-travel .actr-strip { margin-top:14px;font-size:11px;letter-spacing:3px;color:#81B29A;font-family:"Noto Serif SC",serif; }'
    ].join('\n')
  },
  {
    id: "arch-cyanotype",
    label: "青图纸",
    note: "源：青图纸原型 · 晒图蓝底、白线稿、图框标题栏，档案精密感",
    html: [
      '<div class="ac-cyano">',
      '  <div class="accy-grid"></div>',
      '  <div class="accy-frame">',
      '    <div class="accy-title">观察手记</div>',
      '    <div class="accy-scale">├──────┤ 1:50</div>',
      '    <div class="accy-block"><span>DRAWING NO.12</span><span>城市与日常</span></div>',
      '  </div>',
      '</div>'
    ].join('\n'),
    css: [
      '.ac-cyano { width:100%;height:100%;background:#16395C;color:#ECF3F9;position:relative;overflow:hidden;font-family:"IBM Plex Mono","Archivo","Noto Sans SC",monospace; }',
      '.ac-cyano .accy-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(236,243,249,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(236,243,249,.1) 1px,transparent 1px);background-size:26px 26px; }',
      '.ac-cyano .accy-frame { position:absolute;inset:16px;border:1px solid #ECF3F9;outline:3px double #ECF3F9;outline-offset:-7px;padding:30px; }',
      '.ac-cyano .accy-title { font-size:40px;letter-spacing:6px;font-family:"Noto Sans SC",sans-serif;font-weight:700; }',
      '.ac-cyano .accy-scale { margin-top:16px;font-size:13px;color:#7FA6C8; }',
      '.ac-cyano .accy-block { position:absolute;right:18px;bottom:16px;border:1px solid #7FA6C8;font-size:10px;display:flex;flex-direction:column;gap:3px;padding:8px 12px;color:#ECF3F9; }'
    ].join('\n')
  }
];
