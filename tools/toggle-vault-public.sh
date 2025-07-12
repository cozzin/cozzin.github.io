#!/bin/bash

# 옵시디언 볼트 공개/비공개 전환 스크립트
# 사용법: ./tools/toggle-vault-public.sh [public|private]

CONFIG_FILE="_config.yml"
VAULT_SECTION="vault:"

if [ $# -eq 0 ]; then
    echo "사용법: $0 [public|private]"
    echo "  public  - 옵시디언 볼트를 공개로 설정"
    echo "  private - 옵시디언 볼트를 비공개로 설정"
    exit 1
fi

ACTION=$1

if [ "$ACTION" = "public" ]; then
    echo "옵시디언 볼트를 공개로 설정합니다..."
    sed -i '' 's/output: false  # 기본적으로 비공개/output: true   # 공개됨/' $CONFIG_FILE
    echo "✅ 옵시디언 볼트가 공개되었습니다."
    echo "🌐 URL: https://cozzin.github.io/vault/"
    echo ""
    echo "📝 참고:"
    echo "- 모든 노트가 공개됩니다"
    echo "- 특정 노트만 비공개하려면 tags에 [private] 추가"
    echo "- 블로그 포스트용은 tags에 [blog] 추가"
elif [ "$ACTION" = "private" ]; then
    echo "옵시디언 볼트를 비공개로 설정합니다..."
    sed -i '' 's/output: true   # 공개됨/output: false  # 기본적으로 비공개/' $CONFIG_FILE
    echo "✅ 옵시디언 볼트가 비공개되었습니다."
else
    echo "❌ 잘못된 옵션입니다. 'public' 또는 'private'를 사용하세요."
    exit 1
fi

echo ""
echo "변경사항을 적용하려면 Jekyll을 다시 빌드하세요:"
echo "bundle exec jekyll serve" 