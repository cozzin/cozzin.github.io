# Obsidian Vault

이 디렉토리는 옵시디언 볼트의 모든 자료를 통합 관리하는 곳입니다.

## 🎯 핵심 개념

### 옵시디언의 연결성 활용
- **폴더 분리 없음**: 모든 노트가 하나의 공간에 있어 연결이 자유로움
- **태그 기반 분류**: `#blog`, `#learning`, `#daily`, `#project` 등으로 분류
- **위키링크 활용**: `[[다른 노트]]`로 노트 간 연결
- **지식 그래프**: 옵시디언의 그래프 뷰로 전체 연결 관계 시각화

## 📁 권장 디렉토리 구조 (옵시디언 내부)

```
_vault/
├── 00-Meta/              # 메타 정보, 템플릿, 설정
│   ├── Templates/        # 템플릿들
│   └── Attachments/      # 첨부 파일들
├── 01-Daily/             # 일일 노트
├── 02-Learning/          # 학습 노트
├── 03-Projects/          # 프로젝트 노트
├── 04-Blog/              # 블로그 포스트 원본
└── 05-Archive/           # 아카이브
```

## 🏷️ 태그 시스템

### 주요 태그
- `#blog` - 블로그 포스트용
- `#learning` - 학습 노트
- `#daily` - 일일 노트
- `#project` - 프로젝트 관련
- `#swift` - Swift 관련
- `#ios` - iOS 개발
- `#spring` - Spring Boot
- `#aws` - AWS 관련
- `#private` - 비공개 노트

### 태그 조합 예시
```markdown
---
tags: [learning, swift, ios, memory-management]
---

# Swift 메모리 관리 학습

## 관련 노트
- [[iOS 개발 기초]]
- [[ARC 이해하기]]
- [[메모리 누수 해결]]

## 참고 자료
- [공식 문서](https://docs.swift.org)
```

## 🔗 위키링크 활용

### 노트 간 연결
```markdown
# Swift 학습 노트

## 관련 개념
- [[메모리 관리]] - ARC와 메모리 관리
- [[프로토콜]] - Swift 프로토콜 이해
- [[클로저]] - 클로저와 메모리

## 프로젝트 적용
- [[MyApp 프로젝트]] - 실제 프로젝트에 적용
```

### 블로그 포스트 연결
```markdown
# 블로그 포스트: Swift 메모리 관리

## 관련 학습 노트
- [[Swift 메모리 관리 학습]]
- [[ARC 실습]]

## 블로그 포스트로 이동
- [[Swift 메모리 관리]] (공개 블로그 포스트)
```

## 📝 노트 타입별 템플릿

### 1. 블로그 포스트 템플릿
```markdown
---
layout: post
title: "{{title}}"
date: {{date}}
categories: [posts]
tags: [blog, {{tags}}]
---

# {{title}}

## 개요
포스트의 개요를 작성하세요.

## 상세 내용

## 결론

## 관련 노트
- [[관련 학습 노트]]
- [[관련 프로젝트]]
```

### 2. 학습 노트 템플릿
```markdown
---
layout: post
title: "{{title}}"
date: {{date}}
categories: [vault]
tags: [learning, {{tags}}]
---

# {{title}}

## 학습 목표

## 핵심 개념

## 실습 내용

## 관련 노트
- [[이전 학습 노트]]
- [[다음 학습 노트]]
```

### 3. 일일 노트 템플릿
```markdown
---
layout: post
title: "{{date:YYYY-MM-DD}} 일일 노트"
date: {{date}}
categories: [vault]
tags: [daily]
---

# {{date:YYYY년 MM월 DD일}} 일일 노트

## 오늘의 목표

## 오늘 한 일

## 내일 할 일

## 메모
```

## 🌐 공개/비공개 관리

### 공개 방법
```bash
# 전체 볼트 공개
./tools/toggle-vault-public.sh public

# 특정 노트만 공개 (태그로 구분)
# tags: [blog, public] - 공개
# tags: [private] - 비공개
```

### URL 구조
- 공개 시: `https://cozzin.github.io/vault/파일명/`
- 예: `https://cozzin.github.io/vault/swift-memory-management/`

## 🚀 옵시디언 설정 권장사항

### 1. 플러그인
- **Templater**: 템플릿 자동화
- **Calendar**: 일일 노트 자동 생성
- **Graph View**: 연결 관계 시각화
- **Tag Wrangler**: 태그 관리
- **Git**: 버전 관리

### 2. 설정
- **Vault**: `_vault` 디렉토리를 옵시디언 볼트로 설정
- **Templates**: `00-Meta/Templates/` 폴더를 템플릿 폴더로 설정
- **Attachments**: `00-Meta/Attachments/` 폴더를 첨부 파일 폴더로 설정

## 📊 지식 그래프 활용

### 1. 연결 관계 파악
- 옵시디언의 그래프 뷰로 전체 지식 구조 시각화
- 연결이 적은 노트는 추가 학습 필요
- 연결이 많은 노트는 핵심 개념

### 2. 학습 경로 계획
- 그래프를 통해 학습 순서 계획
- 선행 지식 → 핵심 개념 → 응용 순서로 학습

### 3. 블로그 포스트 기획
- 연결이 많은 주제는 블로그 포스트 작성 고려
- 독자들에게 유용한 내용 선별 