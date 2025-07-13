/**
 * TTS Player - 블로그 포스트 음성 재생 기능
 */

class TTSPlayer {
    constructor() {
        this.currentAudio = null;
        this.isPlaying = false;
        this.init();
    }

    init() {
        console.log('TTS Player initializing...');
        this.createPlayerUI();
        this.bindEvents();
        this.checkAudioAvailability();
    }

    createPlayerUI() {
        // 더 포괄적인 DOM 요소 찾기
        const possibleContainers = [
            document.querySelector('article'),
            document.querySelector('.content'),
            document.querySelector('main'),
            document.querySelector('.post-content'),
            document.querySelector('#main-content'),
            document.querySelector('.container'),
            document.querySelector('body')
        ];

        const container = possibleContainers.find(el => el !== null);
        if (!container) {
            console.error('TTS Player: No suitable container found');
            return;
        }

        console.log('TTS Player: Using container', container);

        // 더 포괄적인 제목 요소 찾기
        const possibleTitles = [
            container.querySelector('h1'),
            container.querySelector('.post-title'),
            container.querySelector('.title'),
            container.querySelector('h2'),
            document.querySelector('h1'),
            document.querySelector('.post-title'),
            document.querySelector('.title')
        ];

        const title = possibleTitles.find(el => el !== null);
        
        // 음성 플레이어 UI 생성
        const playerHTML = `
            <div id="tts-player" class="tts-player">
                <div class="tts-controls">
                    <button id="tts-play-btn" class="tts-btn tts-play" disabled>
                        <span class="tts-icon">🎧</span>
                        <span class="tts-text">음성 듣기</span>
                    </button>
                    <button id="tts-summary-btn" class="tts-btn tts-summary" disabled>
                        <span class="tts-icon">📋</span>
                        <span class="tts-text">요약 듣기</span>
                    </button>
                    <div class="tts-progress" id="tts-progress" style="display: none;">
                        <div class="tts-progress-bar" id="tts-progress-bar"></div>
                        <span class="tts-time" id="tts-time">00:00 / 00:00</span>
                    </div>
                </div>
                <div class="tts-volume-control" style="display: none;">
                    <label for="tts-volume">볼륨:</label>
                    <input type="range" id="tts-volume" min="0" max="1" step="0.1" value="0.8">
                    <span id="tts-volume-value">80%</span>
                </div>
            </div>
        `;

        // 제목 요소가 있으면 그 다음에, 없으면 컨테이너 시작 부분에 삽입
        if (title) {
            console.log('TTS Player: Inserting after title', title);
            title.insertAdjacentHTML('afterend', playerHTML);
        } else {
            console.log('TTS Player: Inserting at container start');
            container.insertAdjacentHTML('afterbegin', playerHTML);
        }

        // CSS 스타일 추가
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tts-player {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .tts-controls {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
            }

            .tts-btn {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 8px 16px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .tts-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .tts-play {
                background: #007bff;
                color: white;
            }

            .tts-play:hover:not(:disabled) {
                background: #0056b3;
            }

            .tts-play.playing {
                background: #dc3545;
            }

            .tts-summary {
                background: #28a745;
                color: white;
            }

            .tts-summary:hover:not(:disabled) {
                background: #1e7e34;
            }

            .tts-progress {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 10px;
                width: 100%;
            }

            .tts-progress-bar {
                flex: 1;
                height: 4px;
                background: #dee2e6;
                border-radius: 2px;
                overflow: hidden;
                position: relative;
            }

            .tts-progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: #007bff;
                width: var(--progress, 0%);
                transition: width 0.3s ease;
            }

            .tts-time {
                font-size: 12px;
                color: #6c757d;
                min-width: 80px;
            }

            .tts-volume-control {
                margin-top: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .tts-volume-control label {
                font-size: 14px;
                color: #495057;
            }

            .tts-volume-control input[type="range"] {
                width: 100px;
            }

            .tts-icon {
                font-size: 16px;
            }

            @media (max-width: 768px) {
                .tts-controls {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .tts-btn {
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        // 이벤트 바인딩을 지연시켜서 DOM 요소가 생성된 후에 실행
        setTimeout(() => {
            const playBtn = document.getElementById('tts-play-btn');
            const summaryBtn = document.getElementById('tts-summary-btn');
            const volumeControl = document.getElementById('tts-volume');
            const volumeValue = document.getElementById('tts-volume-value');

            console.log('TTS Player: Binding events to', { playBtn, summaryBtn, volumeControl });

            if (playBtn) {
                playBtn.addEventListener('click', () => this.togglePlay());
            }

            if (summaryBtn) {
                summaryBtn.addEventListener('click', () => this.playSummary());
            }

            if (volumeControl) {
                volumeControl.addEventListener('input', (e) => {
                    const volume = parseFloat(e.target.value);
                    if (this.currentAudio) {
                        this.currentAudio.volume = volume;
                    }
                    if (volumeValue) {
                        volumeValue.textContent = Math.round(volume * 100) + '%';
                    }
                });
            }
        }, 100);
    }

    checkAudioAvailability() {
        const pageUrl = window.location.pathname;
        const audioFileName = this.getAudioFileName(pageUrl);
        
        console.log('TTS Player: Checking audio for', pageUrl, 'filename:', audioFileName);
        
        // 전체 음성 파일 확인
        this.checkAudioFile(`/assets/audio/${audioFileName}.mp3`)
            .then(exists => {
                console.log('TTS Player: Full audio exists:', exists);
                const playBtn = document.getElementById('tts-play-btn');
                if (playBtn) {
                    playBtn.disabled = !exists;
                    if (!exists) {
                        playBtn.querySelector('.tts-text').textContent = '음성 없음';
                    }
                }
            });

        // 요약 음성 파일 확인
        this.checkAudioFile(`/assets/audio/${audioFileName}_summary.mp3`)
            .then(exists => {
                console.log('TTS Player: Summary audio exists:', exists);
                const summaryBtn = document.getElementById('tts-summary-btn');
                if (summaryBtn) {
                    summaryBtn.disabled = !exists;
                    if (!exists) {
                        summaryBtn.querySelector('.tts-text').textContent = '요약 없음';
                    }
                }
            });
    }

    getAudioFileName(pageUrl) {
        // URL에서 파일명 추출 - 더 견고한 방법
        console.log('TTS Player: Parsing URL', pageUrl);
        
        // /notes/파일명/ 형태의 URL 매칭
        let match = pageUrl.match(/\/notes\/([^\/]+)\/?$/);
        if (match) {
            const fileName = decodeURIComponent(match[1]);
            console.log('TTS Player: Extracted filename:', fileName);
            return fileName;
        }
        
        // 다른 패턴들도 시도
        match = pageUrl.match(/\/([^\/]+)\/$/);
        if (match) {
            const fileName = decodeURIComponent(match[1]);
            console.log('TTS Player: Alternative filename:', fileName);
            return fileName;
        }
        
        console.log('TTS Player: Could not extract filename from URL');
        return 'unknown';
    }

    async checkAudioFile(audioPath) {
        try {
            console.log('TTS Player: Checking audio file:', audioPath);
            const response = await fetch(audioPath, { method: 'HEAD' });
            const exists = response.ok;
            console.log('TTS Player: Audio file check result:', audioPath, exists);
            return exists;
        } catch (error) {
            console.error('TTS Player: Audio file check error:', error);
            return false;
        }
    }

    togglePlay() {
        const playBtn = document.getElementById('tts-play-btn');
        const progressDiv = document.getElementById('tts-progress');
        
        if (this.isPlaying) {
            this.stop();
        } else {
            const audioFileName = this.getAudioFileName(window.location.pathname);
            this.play(`/assets/audio/${audioFileName}.mp3`);
        }
    }

    playSummary() {
        const audioFileName = this.getAudioFileName(window.location.pathname);
        this.play(`/assets/audio/${audioFileName}_summary.mp3`);
    }

    async play(audioPath) {
        try {
            // 기존 오디오 정지
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio = null;
            }

            this.currentAudio = new Audio(audioPath);
            this.currentAudio.volume = parseFloat(document.getElementById('tts-volume').value);

            // 이벤트 리스너 설정
            this.currentAudio.addEventListener('loadstart', () => {
                this.updatePlayButton(true, '로딩 중...');
            });

            this.currentAudio.addEventListener('canplay', () => {
                this.updatePlayButton(true, '일시정지');
                this.showProgress(true);
            });

            this.currentAudio.addEventListener('timeupdate', () => {
                this.updateProgress();
            });

            this.currentAudio.addEventListener('ended', () => {
                this.stop();
            });

            this.currentAudio.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                this.updatePlayButton(false, '재생 오류');
                this.showProgress(false);
            });

            await this.currentAudio.play();
            this.isPlaying = true;

        } catch (error) {
            console.error('Play error:', error);
            this.updatePlayButton(false, '재생 실패');
        }
    }

    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.isPlaying = false;
        this.updatePlayButton(false, '음성 듣기');
        this.showProgress(false);
    }

    updatePlayButton(isPlaying, text) {
        const playBtn = document.getElementById('tts-play-btn');
        if (playBtn) {
            playBtn.classList.toggle('playing', isPlaying);
            playBtn.querySelector('.tts-text').textContent = text;
            playBtn.querySelector('.tts-icon').textContent = isPlaying ? '⏸️' : '🎧';
        }
    }

    showProgress(show) {
        const progressDiv = document.getElementById('tts-progress');
        const volumeControl = document.querySelector('.tts-volume-control');
        
        if (progressDiv) {
            progressDiv.style.display = show ? 'flex' : 'none';
        }
        if (volumeControl) {
            volumeControl.style.display = show ? 'flex' : 'none';
        }
    }

    updateProgress() {
        if (!this.currentAudio) return;

        const progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
        const progressBar = document.getElementById('tts-progress-bar');
        const timeDisplay = document.getElementById('tts-time');

        if (progressBar) {
            progressBar.style.setProperty('--progress', `${progress}%`);
        }

        if (timeDisplay) {
            const current = this.formatTime(this.currentAudio.currentTime);
            const total = this.formatTime(this.currentAudio.duration);
            timeDisplay.textContent = `${current} / ${total}`;
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// 페이지 로드 시 TTS 플레이어 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('TTS Player: DOM loaded, current path:', window.location.pathname);
    
    // notes 페이지에서만 TTS 플레이어 활성화
    if (window.location.pathname.includes('/notes/')) {
        console.log('TTS Player: Initializing for notes page');
        new TTSPlayer();
    } else {
        console.log('TTS Player: Not a notes page, skipping initialization');
    }
});

// 브라우저 내장 TTS 기능 (폴백)
window.TTSFallback = {
    speak: function(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        } else {
            alert('이 브라우저는 음성 합성을 지원하지 않습니다.');
        }
    },
    
    stop: function() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }
};