export interface AmbientTrack {
  id: string;
  name: string;
  icon: 'fire' | 'wind' | 'rain' | 'space';
}

// Теперь берем файлы локально из папки public/sounds/
const BASE_PATH = '/sounds';

export const AMBIENT_TRACKS: AmbientTrack[] = [
  { id: 'fire', name: 'Огонь', icon: 'fire' },
  { id: 'rain', name: 'Дождь', icon: 'rain' },
  { id: 'wind', name: 'Ветер', icon: 'wind' },
  { id: 'space', name: 'Космос', icon: 'space' },
];

const SFX_PATHS = {
  inhale: `${BASE_PATH}/inhale.mp3`,
  hold: `${BASE_PATH}/hold.mp3`,
  exhale: `${BASE_PATH}/exhale.mp3`,
  finish: `${BASE_PATH}/finish.mp3`
};

class SoundManager {
  private ctx: AudioContext | null = null;
  private buffers: Record<string, AudioBuffer> = {};
  
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;

  public isMusicEnabled = true;
  public isSfxEnabled = true;
  
  public musicVolume = 0.5;
  public sfxVolume = 0.7;

  private isSessionActive = false;
  private currentTrackId = 'fire';

  constructor() {
    this.initCtx();
    this.loadSfx();
    this.loadTrack(this.currentTrackId);
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContext();
        } catch (e) {}
    }
  }

  private async loadSfx() {
    for (const [key, url] of Object.entries(SFX_PATHS)) {
        await this.loadBuffer(key, url);
    }
  }

  private async loadTrack(id: string) {
      // Формируем путь: /sounds/fire.mp3
      const url = `${BASE_PATH}/${id}.mp3`;
      await this.loadBuffer(id, url);
  }

  private async loadBuffer(key: string, url: string) {
      if (!this.ctx) return;
      try {
          const res = await fetch(url);
          const arrayBuffer = await res.arrayBuffer();
          this.buffers[key] = await this.ctx.decodeAudioData(arrayBuffer);
      } catch(e) {
          console.warn(`Файл не найден: ${url}`, e);
      }
  }

  // --- API ---

  getCurrentTrackId() { return this.currentTrackId; }

  async setTrack(id: string) {
      if (this.currentTrackId === id) return;
      this.currentTrackId = id;
      
      if (!this.buffers[id]) {
          await this.loadTrack(id);
      }

      if (this.isSessionActive && this.isMusicEnabled) {
          this.stopAmbient(); 
          setTimeout(() => this.playAmbient(), 200);
      }
  }

  setMusicVolume(vol: number) {
      this.musicVolume = vol;
      if (this.ambientGain) {
          this.ambientGain.gain.setTargetAtTime(vol, this.ctx!.currentTime, 0.1);
      }
  }

  setSfxVolume(vol: number) {
      this.sfxVolume = vol;
  }

  unlock() {
    this.initCtx();
    if (this.ctx?.state === 'suspended') this.ctx.resume();
    if (this.ctx) {
        const osc = this.ctx.createOscillator();
        osc.connect(this.ctx.destination);
        osc.start(0);
        osc.stop(0.001);
    }
  }

  startSession() {
    this.isSessionActive = true;
    if (this.isMusicEnabled) this.playAmbient();
  }

  stopSession() {
    this.isSessionActive = false;
    this.stopAmbient();
  }

  setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (enabled && this.isSessionActive) this.playAmbient();
    else this.stopAmbient();
  }

  setSfxEnabled(enabled: boolean) {
    this.isSfxEnabled = enabled;
  }

  private playAmbient() {
    if (!this.ctx || !this.buffers[this.currentTrackId]) {
        // Если еще не загрузилось, пробуем загрузить
        this.loadTrack(this.currentTrackId).then(() => {
            if (this.isSessionActive && this.isMusicEnabled) this.playAmbient();
        });
        return;
    }
    
    if (this.ambientSource) try { this.ambientSource.stop(); } catch(e) {}

    const source = this.ctx.createBufferSource();
    source.buffer = this.buffers[this.currentTrackId];
    source.loop = true;

    const gain = this.ctx.createGain();
    gain.gain.value = 0; 
    
    source.connect(gain);
    gain.connect(this.ctx.destination);
    
    source.start(0);
    gain.gain.linearRampToValueAtTime(this.musicVolume, this.ctx.currentTime + 2);

    this.ambientSource = source;
    this.ambientGain = gain;
  }

  private stopAmbient() {
    if (this.ambientSource && this.ambientGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.cancelScheduledValues(now);
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.linearRampToValueAtTime(0, now + 1);
        
        const oldSource = this.ambientSource;
        setTimeout(() => { try { oldSource.stop(); } catch(e) {} }, 1000);
    }
    this.ambientSource = null;
    this.ambientGain = null;
  }

  private playSfx(key: string) {
      if (!this.isSfxEnabled || !this.ctx || !this.buffers[key]) return;
      
      const source = this.ctx.createBufferSource();
      source.buffer = this.buffers[key];
      const gain = this.ctx.createGain();
      gain.gain.value = this.sfxVolume;
      
      source.connect(gain);
      gain.connect(this.ctx.destination);
      source.start(0);
  }

  playInhale() { this.playSfx('inhale'); }
  playHold() { this.playSfx('hold'); }
  playExhale() { this.playSfx('exhale'); }
  playFinish() { this.stopSession(); this.playSfx('finish'); }
  stopAll() { this.stopSession(); }
}

export const soundManager = new SoundManager();
