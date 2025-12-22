# cozzin.github.io
기술 블로그
흩어져 있는 자료 한 곳에 모으는 중...

* https://medium.com/@hongseongho
* https://cozzin.tistory.com/

## 📚 프로젝트 문서

- **[PROJECT.md](PROJECT.md)** - 프로젝트 개요 및 구조 설명
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - 개발 환경 설정 및 로컬 빌드 가이드
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - 기여 가이드라인
- **[RULES.md](RULES.md)** - 프로젝트 규칙 및 가이드라인

## 🚀 빠른 시작

### Local Build
```bash
bundle install
bundle exec jekyll serve
```

http://127.0.0.1:4000

### 의존성 업데이트
```bash
bundle update
```

### 옵시디언 섹션 공개/비공개 전환
```bash
# 공개로 설정
./tools/toggle-obsidian-public.sh public

# 비공개로 설정
./tools/toggle-obsidian-public.sh private
```

## 🤖 Claude Code 블로그 글쓰기 도구

[Claude Code](https://claude.ai/claude-code)를 활용하여 블로그 글쓰기를 시작하고 완성할 수 있는 대화형 도구입니다.

### 사용 가능한 명령어

#### `/blog-start` - 아이디어 발굴 및 구체화
막연한 아이디어를 구조화된 아웃라인으로 발전시킵니다.
- 질문을 통한 주제 구체화
- 아웃라인 자동 생성
- 카테고리/태그 추천

#### `/blog-draft` - 마크다운 초안 생성
Jekyll + Chirpy 형식에 맞는 완전한 초안을 작성합니다.
- Front Matter 자동 생성
- 블로그 스타일 학습 및 적용
- 파일명 자동 제안

#### `/blog-publish` - 발행 전 최종 검증
체크리스트 확인 및 Medium 변환을 제공합니다.
- Front Matter 검증
- 파일명 형식 확인
- Medium용 마크다운 변환
- Git 커밋 가이드

### 사용 예시

```bash
# 1. 아이디어 구체화
/blog-start
> 2025년 회고 글을 쓰고 싶어요

# 2. 초안 작성
/blog-draft
> 위 아웃라인으로 초안 작성해줘

# 3. 발행 준비
/blog-publish
> [초안 내용 붙여넣기]
```

### 워크플로우

1. **아이디어 구체화** (5-10분): `/blog-start`로 주제와 아웃라인 정리
2. **초안 작성** (10-15분): `/blog-draft`로 마크다운 초안 생성
3. **반복적 개선** (선택): 초안을 읽고 수정
4. **발행** (5분): `/blog-publish`로 검증 후 Git 커밋

**예상 소요 시간**: 아이디어부터 발행까지 약 35-60분

## 📊 분석 도구

### Google Analytics
https://analytics.google.com/analytics/web/#/report-home/a125862477w184483642p181831336

### Algolia 검색
https://www.algolia.com/apps/Z6EJVL1FYB/api-keys/all

```bash
ALGOLIA_API_KEY=your_admin_api_key bundle exec jekyll algolia
```

## 🛠 기술 스택

- **정적 사이트 생성기**: Jekyll
- **테마**: jekyll-theme-chirpy
- **호스팅**: GitHub Pages
- **댓글 시스템**: Giscus
- **검색**: Algolia
- **분석**: Google Analytics

## 📝 주요 카테고리

### 블로그 포스트 (`_posts/`)
- **Swift/iOS**: Swift 언어, iOS 개발, 메모리 관리
- **RxSwift/Combine**: 반응형 프로그래밍
- **RIBs**: Uber의 아키텍처 패턴
- **Spring Boot**: 백엔드 개발
- **AWS**: 클라우드 인프라
- **Testing**: 테스트 관련 내용
- **Refactoring**: 리팩토링 스터디

### 학습 노트 (`_learning/`)
- 개인 학습 자료 (공개)
- 실습 내용과 예제 코드
- 학습 목표와 결과 정리

### 옵시디언 자료 (`_obsidian/`)
- 원본 옵시디언 노트 (기본 비공개)
- 일일 노트, 프로젝트 노트, 템플릿
- 필요시 공개 전환 가능

### 일반 노트 (`_notes/`)
- 프로젝트 아이디어, 회의 노트
- 참고 자료 정리 (공개)

## 🔗 관련 링크

- **블로그**: https://cozzin.github.io
- **GitHub**: https://github.com/cozzin
- **Twitter**: https://twitter.com/_cozzin
- **LinkedIn**: https://www.linkedin.com/in/cozzin

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
