# 옵시디언 노트

## 사용법
1. 옵시디언에서 `_notes` 폴더를 볼트로 설정
2. 노트 작성 시 태그로 공개 여부 결정
3. 공개하려면: `./tools/toggle-notes-public.sh public`

## 태그
- `#public` - 공개용 노트
- `#private` - 비공개 노트 (기본값)

## 공개 전환
```bash
# 전체 공개
./tools/toggle-notes-public.sh public

# 비공개
./tools/toggle-notes-public.sh private
```

## URL
- 공개 시: `https://cozzin.github.io/notes/파일명/` 