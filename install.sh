#!/usr/bin/env bash
set -euo pipefail
# design-extract 安装脚本 —— 软链接方式，仓库更新即全局生效
#
# 用法:
#   ./install.sh                    # 全局安装 → ~/.claude/skills/design-extract
#   ./install.sh /path/to/project   # 项目级安装 → 项目/.claude/skills/design-extract
#   ./install.sh --uninstall [path] # 卸载（只删软链接，不动仓库）

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "${1:-}" = "--uninstall" ]; then
  LINK="${2:-$HOME}/.claude/skills/design-extract"
  if [ -L "$LINK" ]; then rm "$LINK" && echo "✓ 已卸载: $LINK"
  else echo "未找到软链接: $LINK" >&2; exit 1; fi
  exit 0
fi

if [ -n "${1:-}" ]; then
  [ -d "$1" ] || { echo "✗ 目标项目不存在: $1" >&2; exit 1; }
  SKILLS_DIR="$(cd "$1" && pwd)/.claude/skills"
else
  SKILLS_DIR="$HOME/.claude/skills"
fi

LINK="$SKILLS_DIR/design-extract"
mkdir -p "$SKILLS_DIR"

if [ -e "$LINK" ] || [ -L "$LINK" ]; then
  echo "✗ 已存在: $LINK" >&2
  echo "  如需重装: rm \"$LINK\" 后重新执行" >&2
  exit 1
fi

ln -s "$REPO_DIR" "$LINK"
echo "✓ 已安装: $LINK"
echo "         -> $REPO_DIR"

# 依赖体检：picker 服务器需要 Node ≥ 18
if command -v node >/dev/null 2>&1; then
  MAJOR="$(node -v | sed 's/^v//' | cut -d. -f1)"
  [ "$MAJOR" -ge 18 ] && echo "✓ Node.js $(node -v)" \
    || echo "⚠ Node.js $(node -v) 过低，picker 服务器需要 ≥ 18"
else
  echo "⚠ 未检测到 Node.js（picker 服务器需要 ≥ 18）"
fi

echo
echo "验证: 在 Claude Code 里说「帮我提取品牌设计」或输入 /design-extract"
