#!/bin/bash

# 옵시디언 섹션 공개/비공개 전환 스크립트
# 사용법: ./tools/toggle-obsidian-public.sh [public|private]

CONFIG_FILE="_config.yml"
OBSIDIAN_SECTION="obsidian:"

if [ $# -eq 0 ]; then
    echo "사용법: $0 [public|private]"
    echo "  public  - 옵시디언 섹션을 공개로 설정"
    echo "  private - 옵시디언 섹션을 비공개로 설정"
    exit 1
fi

ACTION=$1

if [ "$ACTION" = "public" ]; then
    echo "옵시디언 섹션을 공개로 설정합니다..."
    sed -i '' 's/output: false  # 기본적으로 비공개/output: true   # 공개됨/' $CONFIG_FILE
    echo "✅ 옵시디언 섹션이 공개되었습니다."
    echo "🌐 URL: https://cozzin.github.io/obsidian/"
elif [ "$ACTION" = "private" ]; then
    echo "옵시디언 섹션을 비공개로 설정합니다..."
    sed -i '' 's/output: true   # 공개됨/output: false  # 기본적으로 비공개/' $CONFIG_FILE
    echo "✅ 옵시디언 섹션이 비공개되었습니다."
else
    echo "❌ 잘못된 옵션입니다. 'public' 또는 'private'를 사용하세요."
    exit 1
fi

echo ""
echo "변경사항을 적용하려면 Jekyll을 다시 빌드하세요:"
echo "bundle exec jekyll serve" 