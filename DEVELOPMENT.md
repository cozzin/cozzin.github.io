# 개발 가이드

## 개발 환경 설정

### 필수 요구사항

1. **Ruby** (2.6.0 이상)
   ```bash
   # macOS (Homebrew 사용)
   brew install ruby
   
   # 또는 rbenv 사용
   rbenv install 3.0.0
   rbenv global 3.0.0
   ```

2. **Bundler**
   ```bash
   gem install bundler
   ```

### 의존성 설치

```bash
# 프로젝트 루트 디렉토리에서
bundle install
```

## 로컬 개발 서버 실행

### 기본 실행
```bash
bundle exec jekyll serve
```

### 실시간 리로드와 함께 실행
```bash
bundle exec jekyll serve --livereload
```

### 특정 포트로 실행
```bash
bundle exec jekyll serve --port 4001
```

### 프로덕션 모드로 실행
```bash
JEKYLL_ENV=production bundle exec jekyll serve
```

서버가 실행되면 `http://127.0.0.1:4000`에서 사이트를 확인할 수 있습니다.

## 새 포스트 작성

### 포스트 생성
새 포스트는 `_posts/` 디렉토리에 생성합니다.

파일명 형식: `YYYY-MM-DD-제목.md`

예시:
```bash
# 2024-01-15-my-new-post.md
```

### 포스트 프론트매터
```yaml
---
title: 포스트 제목
date: 2024-01-15 12:00:00 +0900
categories: [카테고리]
tags: [태그1, 태그2]
comments: true
toc: true
---
```

### 포스트 옵션
- `comments: true/false` - 댓글 활성화/비활성화
- `toc: true/false` - 목차 표시/숨김
- `categories: [카테고리]` - 포스트 카테고리
- `tags: [태그1, 태그2]` - 포스트 태그

## 초안 작성

초안은 `_drafts/` 디렉토리에 저장할 수 있습니다.

```bash
# 초안으로 서버 실행
bundle exec jekyll serve --drafts
```

## 빌드 및 테스트

### 사이트 빌드
```bash
bundle exec jekyll build
```

### HTML 검증
```bash
bundle exec htmlproofer _site --disable-external --check-html --allow_hash_href
```

### 전체 빌드 및 테스트
```bash
# 빌드
JEKYLL_ENV=production bundle exec jekyll build

# 테스트
bundle exec htmlproofer _site --disable-external --check-html --allow_hash_href
```

## 검색 인덱스 업데이트

Algolia 검색을 위한 인덱스 업데이트:

```bash
# 환경 변수 설정
export ALGOLIA_API_KEY=your_admin_api_key

# 인덱스 업데이트
bundle exec jekyll algolia
```

## 배포

### 수동 배포 (테스트용)
```bash
# 빌드 및 테스트만 실행 (배포하지 않음)
bash ./tools/deploy.sh --dry-run
```

### 자동 배포
- GitHub에 push하면 GitHub Actions가 자동으로 배포
- `gh-pages` 브랜치에 배포됨

## 문제 해결

### 일반적인 문제들

1. **Ruby 버전 문제**
   ```bash
   # Ruby 버전 확인
   ruby --version
   
   # rbenv 사용 시
   rbenv local 3.0.0
   ```

2. **Bundler 문제**
   ```bash
   # Gemfile.lock 삭제 후 재설치
   rm Gemfile.lock
   bundle install
   ```

3. **Jekyll 캐시 문제**
   ```bash
   # 캐시 삭제
   bundle exec jekyll clean
   ```

4. **포트 충돌**
   ```bash
   # 다른 포트 사용
   bundle exec jekyll serve --port 4001
   ```

### 디버깅

Jekyll 디버그 모드 실행:
```bash
bundle exec jekyll serve --verbose
```

## 개발 팁

1. **실시간 미리보기**: `--livereload` 옵션 사용
2. **초안 작성**: `_drafts/` 디렉토리 활용
3. **카테고리 관리**: 일관된 카테고리명 사용
4. **이미지 관리**: `assets/images/` 디렉토리 활용
5. **태그 관리**: 의미있는 태그 사용

## 유용한 명령어

```bash
# 의존성 업데이트
bundle update

# Jekyll 버전 확인
bundle exec jekyll --version

# 사이트 정보 확인
bundle exec jekyll doctor

# 사이트 정리
bundle exec jekyll clean
``` 