#!/bin/bash

# 옵시디언 노트 공개/비공개 전환
# 사용법: ./tools/toggle-notes-public.sh [public|private]

if [ $# -eq 0 ]; then
    echo "사용법: $0 [public|private]"
    exit 1
fi

ACTION=$1

if [ "$ACTION" = "public" ]; then
    sed -i '' 's/output: false  # 기본 비공개/output: true   # 공개됨/' _config.yml
    echo "✅ 노트가 공개되었습니다: https://cozzin.github.io/notes/"
elif [ "$ACTION" = "private" ]; then
    sed -i '' 's/output: true   # 공개됨/output: false  # 기본 비공개/' _config.yml
    echo "✅ 노트가 비공개되었습니다"
else
    echo "❌ 'public' 또는 'private'를 사용하세요"
    exit 1
fi

echo "변경사항 적용: bundle exec jekyll serve" 