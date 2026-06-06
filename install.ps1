# design-extract 安装脚本（Windows 原生 PowerShell）—— junction 方式，无需管理员权限，仓库更新即全局生效
# macOS / Linux / Git Bash 请用 install.sh
#
# 用法:
#   .\install.ps1                          # Claude Code 全局安装 → ~\.claude\skills\
#   .\install.ps1 -Agent codex             # Codex    → ~\.codex\skills\
#   .\install.ps1 -Agent opencode          # opencode → ~\.config\opencode\skills\
#   .\install.ps1 -Agent pi                # pi       → ~\.pi\agent\skills\
#   .\install.ps1 -Agent agents            # 跨 agent 通用目录 → ~\.agents\skills\
#   .\install.ps1 -Dir C:\path\to\skills   # 任意 agent 的 skills 目录
#   .\install.ps1 -Project C:\path\to\proj # 项目级安装（目录按 -Agent 决定）
#   .\install.ps1 -Uninstall [同上定位参数]  # 卸载（只删链接，不动仓库）

param(
  [string]$Agent = "claude",
  [string]$Dir = "",
  [string]$Project = "",
  [switch]$Uninstall
)
$ErrorActionPreference = "Stop"
$RepoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Name = "design-extract"

function Get-GlobalSkillsDir([string]$a) {
  switch ($a) {
    "claude"   { return (Join-Path $HOME ".claude\skills") }
    "codex"    { return (Join-Path $HOME ".codex\skills") }
    "opencode" { return (Join-Path $HOME ".config\opencode\skills") }
    "pi"       { return (Join-Path $HOME ".pi\agent\skills") }
    "agents"   { return (Join-Path $HOME ".agents\skills") }
    default    { throw "未知 agent: $a（支持 claude / codex / opencode / pi / agents，其他用 -Dir）" }
  }
}

function Get-ProjectSkillsSubdir([string]$a) {
  switch ($a) {
    "claude"   { return ".claude\skills" }
    "codex"    { return ".agents\skills" }
    "agents"   { return ".agents\skills" }
    "opencode" { return ".opencode\skills" }
    "pi"       { return ".pi\skills" }
    default    { throw "未知 agent: $a（支持 claude / codex / opencode / pi / agents，其他用 -Dir）" }
  }
}

if ($Dir) {
  $SkillsDir = $Dir
} elseif ($Project) {
  if (-not (Test-Path $Project -PathType Container)) { throw "目标项目不存在: $Project" }
  $SkillsDir = Join-Path (Resolve-Path $Project).Path (Get-ProjectSkillsSubdir $Agent)
} else {
  $SkillsDir = Get-GlobalSkillsDir $Agent
}
$Link = Join-Path $SkillsDir $Name

# —— 卸载 ——
if ($Uninstall) {
  $item = Get-Item $Link -ErrorAction SilentlyContinue
  if ($item -and $item.LinkType) {
    $item.Delete()   # 只删链接点，不碰仓库内容
    Write-Host "✓ 已卸载: $Link"
  } else {
    Write-Error "未找到链接: $Link"
  }
  exit 0
}

# —— 安装 ——
New-Item -ItemType Directory -Force -Path $SkillsDir | Out-Null
if (Test-Path $Link) {
  Write-Error "已存在: $Link`n如需重装: 先 .\install.ps1 -Uninstall（带相同定位参数）"
}
New-Item -ItemType Junction -Path $Link -Target $RepoDir | Out-Null
Write-Host "✓ 已安装: $Link"
Write-Host "         -> $RepoDir"

# —— 依赖体检：picker 服务器需要 Node ≥ 18 ——
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
  $major = [int]((node -v).TrimStart("v").Split(".")[0])
  if ($major -ge 18) { Write-Host "✓ Node.js $(node -v)" }
  else { Write-Host ("⚠ Node.js $(node -v) 过低，picker 服务器需要 >= 18") }
} else {
  Write-Host ("⚠ 未检测到 Node.js（picker 服务器需要 >= 18）")
}

Write-Host ""
Write-Host "验证: 在你的 agent（Claude Code / Codex / opencode / pi …）里说「帮我提取品牌设计」"
