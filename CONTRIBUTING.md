# 기여 가이드라인

## 기여 방법

이 블로그 프로젝트에 기여하는 방법을 안내합니다.

## 기여 가능한 영역

### 1. 콘텐츠 기여
- **기술 포스트 작성**: Swift, iOS, 백엔드, 클라우드 등 관련 기술 포스트
- **번역**: 다국어 지원을 위한 포스트 번역
- **오타 수정**: 기존 포스트의 오타나 문법 오류 수정
- **내용 개선**: 기존 포스트의 내용 보완 및 개선

### 2. 기술적 기여
- **버그 수정**: 사이트 기능 개선
- **성능 최적화**: 로딩 속도 개선
- **UI/UX 개선**: 사용자 경험 향상
- **SEO 최적화**: 검색 엔진 최적화

## 기여 프로세스

### 1. 이슈 생성
기여하고 싶은 내용에 대해 먼저 이슈를 생성해주세요.

**이슈 템플릿**:
```
## 기여 유형
- [ ] 콘텐츠 기여
- [ ] 기술적 기여
- [ ] 버그 수정
- [ ] 기능 개선

## 설명
기여하고자 하는 내용을 자세히 설명해주세요.

## 관련 이슈
관련된 이슈가 있다면 링크해주세요.
```

### 2. 포크 및 브랜치 생성
```bash
# 저장소 포크
# GitHub에서 Fork 버튼 클릭

# 로컬에 클론
git clone https://github.com/YOUR_USERNAME/cozzin.github.io.git
cd cozzin.github.io

# 새로운 브랜치 생성
git checkout -b feature/your-feature-name
```

### 3. 개발 및 테스트
```bash
# 의존성 설치
bundle install

# 로컬 서버 실행
bundle exec jekyll serve

# 테스트 실행
bundle exec htmlproofer _site --disable-external --checks html --allow-hash-href
```

### 4. 커밋 및 푸시
```bash
# 변경사항 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 브랜치 푸시
git push origin feature/your-feature-name
```

### 5. Pull Request 생성
GitHub에서 Pull Request를 생성해주세요.

**PR 템플릿**:
```
## 변경사항
- 변경된 내용을 간단히 설명

## 테스트
- [ ] 로컬에서 빌드 테스트 완료
- [ ] HTML 검증 통과
- [ ] 브라우저에서 확인 완료

## 관련 이슈
Closes #이슈번호
```

## 코딩 규칙

### 포스트 작성 규칙

#### 1. 파일명 규칙
- 형식: `YYYY-MM-DD-제목.md`
- 영문 소문자와 하이픈 사용
- 예: `2024-01-15-swift-memory-management.md`

#### 2. 프론트매터 규칙
```yaml
---
title: "포스트 제목"
date: 2024-01-15 12:00:00 +0900
categories: [카테고리]
tags: [태그1, 태그2]
comments: true
toc: true
---
```

#### 3. 마크다운 작성 규칙
- 제목은 `#` 부터 시작
- 코드 블록은 언어 지정
- 이미지는 `assets/images/` 디렉토리 사용
- 링크는 상대 경로 사용

#### 4. 카테고리 규칙
주요 카테고리:
- `Swift` - Swift 언어 관련
- `iOS` - iOS 개발 관련
- `RxSwift` - RxSwift 관련
- `Combine` - Combine 프레임워크
- `RIBs` - RIBs 아키텍처
- `Spring Boot` - 백엔드 개발
- `AWS` - 클라우드 인프라
- `Testing` - 테스트 관련
- `Refactoring` - 리팩토링

### 코드 작성 규칙

#### 1. Ruby/Jekyll
- 들여쓰기: 2칸 공백
- 파일명: snake_case
- 변수명: snake_case

#### 2. HTML/CSS
- 들여쓰기: 2칸 공백
- 클래스명: kebab-case
- ID명: camelCase

#### 3. JavaScript
- 들여쓰기: 2칸 공백
- 변수명: camelCase
- 상수명: UPPER_SNAKE_CASE

## 커밋 메시지 규칙

### 커밋 타입
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경

### 커밋 메시지 형식
```
type: 간단한 설명

자세한 설명 (필요시)
```

예시:
```
feat: 새 포스트 "Swift 메모리 관리" 추가

- Swift의 메모리 관리 방식 설명
- ARC와 메모리 누수 방지 방법 추가
- 실제 코드 예제 포함
```

## 리뷰 프로세스

1. **자동 검사**: GitHub Actions를 통한 자동 빌드 및 테스트
2. **코드 리뷰**: 메인테이너의 코드 리뷰
3. **승인**: 리뷰 승인 후 머지

## 기여자 가이드라인

### 1. 존중과 배려
- 모든 기여자에게 존중과 배려를 보여주세요
- 건설적인 피드백을 제공해주세요

### 2. 커뮤니케이션
- 명확하고 간결한 커뮤니케이션
- 한국어로 소통 (국제 기여자는 영어 가능)

### 3. 품질 관리
- 코드 품질 유지
- 테스트 코드 작성 권장
- 문서화 중요

## 라이선스

이 프로젝트에 기여함으로써, 귀하는 귀하의 기여사항이 MIT 라이선스 하에 배포됨에 동의합니다.

## 연락처

기여 관련 문의사항이 있으시면:
- **이메일**: hsh3592@gmail.com
- **GitHub**: https://github.com/cozzin
- **Twitter**: https://twitter.com/_cozzin

## 감사의 말

모든 기여자분들께 감사드립니다! 여러분의 기여가 이 블로그를 더 나은 곳으로 만들어줍니다. 