#!/usr/bin/env bash
set -euo pipefail
# design-extract 安装脚本 —— 链接方式，仓库更新即全局生效
# 平台：macOS / Linux 用软链接；Windows（Git Bash）用 junction，无需管理员权限
# Windows 原生 PowerShell 请用 install.ps1
#
# 用法:
#   ./install.sh                        # Claude Code 全局安装 → ~/.claude/skills/
#   ./install.sh --agent codex          # Codex    → ~/.codex/skills/
#   ./install.sh --agent opencode       # opencode → ~/.config/opencode/skills/
#   ./install.sh --agent pi             # pi       → ~/.pi/agent/skills/
#   ./install.sh --agent agents        # 跨 agent 通用目录 → ~/.agents/skills/
#   ./install.sh --dir /path/to/skills  # 任意 agent 的 skills 目录
#   ./install.sh /path/to/project       # 项目级安装（目录按 --agent 决定，默认 .claude/skills/）
#   ./install.sh --uninstall [同上定位参数]   # 卸载（只删链接，不动仓库）
#
# 注：opencode 也直接读取 ~/.claude/skills（Claude 兼容目录），默认安装即对其生效。

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAME="design-extract"

AGENT="claude"
CUSTOM_DIR=""
PROJECT=""
UNINSTALL=0

while [ $# -gt 0 ]; do
  case "$1" in
    --uninstall) UNINSTALL=1 ;;
    --agent) AGENT="${2:?--agent 需要参数}"; shift ;;
    --dir) CUSTOM_DIR="${2:?--dir 需要参数}"; shift ;;
    -h|--help) sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*) echo "✗ 未知选项: $1（-h 查看用法）" >&2; exit 1 ;;
    *) PROJECT="$1" ;;
  esac
  shift
done

is_windows() { case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) return 0 ;; *) return 1 ;; esac; }

global_dir() {
  case "$1" in
    claude)   echo "$HOME/.claude/skills" ;;
    codex)    echo "$HOME/.codex/skills" ;;
    opencode) echo "$HOME/.config/opencode/skills" ;;
    pi)       echo "$HOME/.pi/agent/skills" ;;
    agents)   echo "$HOME/.agents/skills" ;;
    *) echo "✗ 未知 agent: $1（支持 claude / codex / opencode / pi / agents，其他用 --dir）" >&2; exit 1 ;;
  esac
}

project_subdir() {
  case "$1" in
    claude)       echo ".claude/skills" ;;
    codex|agents) echo ".agents/skills" ;;
    opencode)     echo ".opencode/skills" ;;
    pi)           echo ".pi/skills" ;;
    *) echo "✗ 未知 agent: $1（支持 claude / codex / opencode / pi / agents，其他用 --dir）" >&2; exit 1 ;;
  esac
}

if [ -n "$CUSTOM_DIR" ]; then
  SKILLS_DIR="$CUSTOM_DIR"
elif [ -n "$PROJECT" ]; then
  [ -d "$PROJECT" ] || { echo "✗ 目标项目不存在: $PROJECT" >&2; exit 1; }
  SKILLS_DIR="$(cd "$PROJECT" && pwd)/$(project_subdir "$AGENT")"
else
  SKILLS_DIR="$(global_dir "$AGENT")"
fi
LINK="$SKILLS_DIR/$NAME"

# —— 卸载 ——
if [ "$UNINSTALL" = 1 ]; then
  if [ -L "$LINK" ]; then
    rm "$LINK" && echo "✓ 已卸载: $LINK"
  elif is_windows && [ -d "$LINK" ]; then
    # Windows junction：必须用 rmdir 删除（只删链接点，不碰仓库内容）
    cmd //c rmdir "$(cygpath -w "$LINK")" && echo "✓ 已卸载: $LINK"
  else
    echo "✗ 未找到链接: $LINK" >&2; exit 1
  fi
  exit 0
fi

# —— 安装 ——
mkdir -p "$SKILLS_DIR"
if [ -e "$LINK" ] || [ -L "$LINK" ]; then
  echo "✗ 已存在: $LINK" >&2
  echo "  如需重装: 先 ./install.sh --uninstall（带相同定位参数）" >&2
  exit 1
fi

if is_windows; then
  cmd //c mklink /J "$(cygpath -w "$LINK")" "$(cygpath -w "$REPO_DIR")" >/dev/null
else
  ln -s "$REPO_DIR" "$LINK"
fi
echo "✓ 已安装: $LINK"
echo "         -> $REPO_DIR"

# —— 依赖体检：picker 服务器需要 Node ≥ 18 ——
if command -v node >/dev/null 2>&1; then
  MAJOR="$(node -v | sed 's/^v//' | cut -d. -f1)"
  [ "$MAJOR" -ge 18 ] && echo "✓ Node.js $(node -v)" \
    || echo "⚠ Node.js $(node -v) 过低，picker 服务器需要 ≥ 18"
else
  echo "⚠ 未检测到 Node.js（picker 服务器需要 ≥ 18）"
fi

echo
echo "验证: 在你的 agent（Claude Code / Codex / opencode / pi …）里说「帮我提取品牌设计」"
