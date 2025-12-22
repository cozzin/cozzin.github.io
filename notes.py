#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ML 노트 음성 변환 스크립트
Markdown 파일을 음성으로 변환하여 청취 가능하게 만듭니다.
"""

import os
import re
import argparse
from pathlib import Path

try:
    import pyttsx3
    import markdown
except ImportError:
    print("필요한 라이브러리를 설치해주세요:")
    print("pip install pyttsx3 markdown")
    exit(1)

class MarkdownToSpeech:
    def __init__(self, voice_rate=150, voice_volume=0.8):
        """
        TTS 엔진 초기화
        
        Args:
            voice_rate: 음성 속도 (기본값: 150)
            voice_volume: 음성 볼륨 (기본값: 0.8)
        """
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', voice_rate)
        self.engine.setProperty('volume', voice_volume)
        
        # 한국어 음성 설정 (가능한 경우)
        voices = self.engine.getProperty('voices')
        for voice in voices:
            if 'korean' in voice.name.lower() or 'ko' in voice.id.lower():
                self.engine.setProperty('voice', voice.id)
                break
    
    def clean_markdown_text(self, text):
        """
        마크다운 텍스트를 TTS에 적합하게 정리
        
        Args:
            text: 원본 마크다운 텍스트
            
        Returns:
            정리된 텍스트
        """
        # 마크다운 헤더 제거
        text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
        
        # 마크다운 링크 정리 [텍스트](url) -> 텍스트
        text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
        
        # 마크다운 볼드, 이탤릭 제거
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
        text = re.sub(r'\*([^*]+)\*', r'\1', text)
        
        # 코드 블록 제거
        text = re.sub(r'```[\s\S]*?```', '', text)
        text = re.sub(r'`([^`]+)`', r'\1', text)
        
        # 리스트 마커 제거
        text = re.sub(r'^[\s]*[-*+]\s*', '', text, flags=re.MULTILINE)
        text = re.sub(r'^\s*\d+\.\s*', '', text, flags=re.MULTILINE)
        
        # 체크박스 제거
        text = re.sub(r'- \[ \]', '', text)
        text = re.sub(r'- \[x\]', '완료:', text)
        
        # 이모지 제거 (옵션)
        text = re.sub(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]', '', text)
        
        # 연속된 공백 제거
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
    
    def read_markdown_file(self, file_path):
        """
        마크다운 파일 읽기
        
        Args:
            file_path: 파일 경로
            
        Returns:
            파일 내용
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"파일을 찾을 수 없습니다: {file_path}")
            return None
        except Exception as e:
            print(f"파일 읽기 오류: {e}")
            return None
    
    def speak_file(self, file_path, save_audio=False):
        """
        마크다운 파일을 음성으로 변환
        
        Args:
            file_path: 마크다운 파일 경로
            save_audio: 오디오 파일로 저장 여부
        """
        content = self.read_markdown_file(file_path)
        if not content:
            return
        
        # 마크다운 내용 정리
        clean_text = self.clean_markdown_text(content)
        
        if not clean_text:
            print("변환할 텍스트가 없습니다.")
            return
        
        print(f"파일 변환 중: {file_path}")
        print(f"텍스트 길이: {len(clean_text)} 문자")
        
        if save_audio:
            # 오디오 파일로 저장
            audio_path = Path(file_path).with_suffix('.wav')
            self.engine.save_to_file(clean_text, str(audio_path))
            print(f"오디오 파일 저장됨: {audio_path}")
        
        # 음성 재생
        print("음성 재생 시작... (Ctrl+C로 중단)")
        try:
            self.engine.say(clean_text)
            self.engine.runAndWait()
        except KeyboardInterrupt:
            print("\n음성 재생이 중단되었습니다.")
        except Exception as e:
            print(f"음성 재생 오류: {e}")
    
    def create_audio_summary(self, file_path):
        """
        파일의 주요 섹션만 음성으로 변환
        
        Args:
            file_path: 마크다운 파일 경로
        """
        content = self.read_markdown_file(file_path)
        if not content:
            return
        
        # 주요 섹션 추출 (## 헤더)
        sections = re.findall(r'^##\s+(.+?)$', content, re.MULTILINE)
        
        if not sections:
            print("요약할 섹션을 찾을 수 없습니다.")
            return
        
        summary_text = f"이 노트는 {len(sections)}개의 주요 섹션으로 구성되어 있습니다. "
        summary_text += "섹션 제목들을 읽어드리겠습니다. "
        
        for i, section in enumerate(sections, 1):
            summary_text += f"{i}번째 섹션: {section}. "
        
        print("요약 음성 재생 시작...")
        self.engine.say(summary_text)
        self.engine.runAndWait()

def main():
    parser = argparse.ArgumentParser(description='ML 노트 음성 변환 도구')
    parser.add_argument('file', help='변환할 마크다운 파일 경로')
    parser.add_argument('--save', action='store_true', help='오디오 파일로 저장')
    parser.add_argument('--summary', action='store_true', help='요약만 음성으로 재생')
    parser.add_argument('--rate', type=int, default=150, help='음성 속도 (기본값: 150)')
    parser.add_argument('--volume', type=float, default=0.8, help='음성 볼륨 (기본값: 0.8)')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.file):
        print(f"파일이 존재하지 않습니다: {args.file}")
        return
    
    # TTS 인스턴스 생성
    tts = MarkdownToSpeech(voice_rate=args.rate, voice_volume=args.volume)
    
    if args.summary:
        tts.create_audio_summary(args.file)
    else:
        tts.speak_file(args.file, save_audio=args.save)

if __name__ == "__main__":
    main()