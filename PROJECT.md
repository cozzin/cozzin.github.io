# cozzin.github.io 프로젝트

## 프로젝트 개요

이 프로젝트는 **cozzin**의 개인 기술 블로그입니다. Jekyll 기반의 정적 사이트로 구축되어 있으며, GitHub Pages를 통해 호스팅됩니다.

- **사이트 URL**: https://cozzin.github.io
- **테마**: jekyll-theme-chirpy
- **주요 기술**: Swift, iOS, RxSwift, Combine, RIBs, Spring Boot, AWS 등

## 프로젝트 구조

```
cozzin.github.io/
├── _config.yml              # Jekyll 설정 파일
├── _posts/                  # 블로그 포스트 (Markdown)
├── _drafts/                 # 초안 포스트
├── _tabs/                   # 페이지 탭 (about, archives, categories, tags)
├── _data/                   # 데이터 파일들
│   ├── locales/            # 다국어 지원
│   ├── contact.yml         # 연락처 정보
│   └── share.yml           # 공유 설정
├── assets/                  # 정적 자산
│   ├── images/             # 이미지 파일들
│   └── 2021/               # 연도별 이미지
├── tools/                   # 배포 스크립트
│   └── deploy.sh           # GitHub Actions 배포 스크립트
├── Gemfile                  # Ruby 의존성 관리
└── README.md               # 프로젝트 README
```

## 주요 기능

### 1. 다국어 지원
- 한국어, 영어, 인도네시아어, 미얀마어, 러시아어, 우크라이나어, 중국어 지원
- `_data/locales/` 디렉토리에 언어별 설정 파일

### 2. 댓글 시스템
- Giscus를 통한 GitHub 기반 댓글 시스템
- 포스트별 댓글 활성화/비활성화 가능

### 3. 검색 기능
- Algolia를 통한 사이트 내 검색
- 관리자 API 키를 통한 인덱싱

### 4. 분석 도구
- Google Analytics 연동
- 페이지뷰 추적

### 5. SEO 최적화
- jekyll-seo-tag 플러그인 사용
- 메타 태그 자동 생성

## 포스트 카테고리

주요 기술 카테고리:
- **Swift/iOS**: Swift 언어, iOS 개발, 메모리 관리
- **RxSwift/Combine**: 반응형 프로그래밍
- **RIBs**: Uber의 아키텍처 패턴
- **Spring Boot**: 백엔드 개발
- **AWS**: 클라우드 인프라
- **Testing**: 테스트 관련 내용
- **Refactoring**: 리팩토링 스터디

## 배포 프로세스

1. **GitHub Actions**를 통한 자동 배포
2. `tools/deploy.sh` 스크립트 사용
3. `gh-pages` 브랜치에 배포
4. HTML 검증 및 테스트 자동화

## 개발 환경

- **Ruby**: Jekyll 실행을 위한 Ruby 환경
- **Bundler**: 의존성 관리
- **Jekyll**: 정적 사이트 생성기
- **HTML Proofer**: HTML 검증 도구

## 관련 링크

- **블로그**: https://cozzin.github.io
- **GitHub**: https://github.com/cozzin
- **Twitter**: https://twitter.com/_cozzin
- **LinkedIn**: https://www.linkedin.com/in/cozzin
- **기존 블로그**: 
  - https://medium.com/@hongseongho
  - https://cozzin.tistory.com/

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 