# ML 학습 노트 시스템 🎧

> 음성 변환 기능이 포함된 ML 학습 노트 시스템

## 🎯 주요 기능

- **마크다운 기반 노트 작성**
- **음성 변환(TTS) 기능**
- **학습 자료와 개인 정리 구분**
- **웹 공개 가능한 노트**

## 📋 노트 목록

- `ML_기초_개념.md` - 컴공 전공자를 위한 ML 기초 개념
- `ML_학습_방법론.md` - 효율적인 학습 방법과 자료 정리법
- `사용법_가이드.md` - 시스템 사용법 완전 가이드
- `tts_script.py` - 음성 변환 스크립트

## 🔧 초기 설정

```bash
# 필요한 라이브러리 설치
pip install -r requirements.txt

# 스크립트 실행 권한 부여 (Linux/Mac)
chmod +x tts_script.py
```

## 🎧 음성 변환 사용법

```bash
# 기본 사용법
python tts_script.py ML_기초_개념.md

# 요약만 듣기
python tts_script.py --summary ML_기초_개념.md

# 오디오 파일로 저장
python tts_script.py --save ML_기초_개념.md
```

## 🗂️ 옵시디언 연동

1. 옵시디언에서 `_notes` 폴더를 볼트로 설정
2. 노트 작성 시 태그로 공개 여부 결정
3. 공개하려면: `./tools/toggle-notes-public.sh public`

## 🏷️ 태그 시스템

- `#public` - 공개용 노트
- `#private` - 비공개 노트 (기본값)
- `#ml` - 머신러닝 관련
- `#학습노트` - 개인 학습 정리
- `#음성` - 음성 변환 최적화

## 🌐 웹 공개

```bash
# 전체 공개
./tools/toggle-notes-public.sh public

# 비공개
./tools/toggle-notes-public.sh private
```

## 🔗 URL
- 공개 시: `https://cozzin.github.io/notes/파일명/` 