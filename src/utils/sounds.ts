// src/utils/sounds.ts
// Полная, API-совместимая версия без аудио-артефактов

export interface AmbientTrack {
  id: string;
  name: string;
  icon: 'fire' | 'wind' | 'rain' | 'space';
}

const BASE_PATH = '/sounds';

export const AMBIENT_TRACKS: AmbientTrack[] = [
  { id: 'fire', name: 'Огонь', icon: 'fire' },
  { id: 'rain', name: 'Дождь', icon: 'rain' },
  { id: 'wind', name: 'Ветер', icon: 'wind' },
  { id: 'space', name: 'Космос', icon: 'space' },
];

const SFX_PATHS: Record<string, string> = {
  inhale: `${BASE_PATH}/inhale.mp3`,
  hold: `${BASE_PATH}/hold.mp3`,
  exhale: `${BASE_PATH}/exhale.mp3`,
  finish: `${BASE_PATH}/finish.mp3`,
};

class SoundManager {
  /* ================= CORE ================= */

  private ctx: AudioContext | null = null;
  private buffers: Record<string, AudioBuffer> = {};

  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;

  private readonly MIN_GAIN = 0.0001;
  private readonly SMOOTH = 0.08;
  private hasPreloaded = false;

  /* ================= STATE ================= */

  public isMusicEnabled = true;
  public isSfxEnabled = true;

  public musicVolume = 0.5;
  public sfxVolume = 0.7;

  private isSessionActive = false;
  private currentTrackId = 'fire';

  constructor() {
    this.initCtx();
  }

  /* ================= INIT ================= */

  private initCtx() {
    if (this.ctx || typeof window === 'undefined') return;

    const Ctx =
      window.AudioContext ||
      (window as any).webkitAudioContext;

    if (Ctx) this.ctx = new Ctx();
  }

  /** Обязательный вызов по user-gesture (Telegram / iOS) */
  unlock() {
    this.initCtx();
    void this.ensurePreloaded();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // iOS WebView audio unlock
    const osc = this.ctx.createOscillator();
    osc.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.001);
  }

  /* ================= LOADING ================= */

  private async ensurePreloaded() {
    if (this.hasPreloaded) return;
    this.hasPreloaded = true;
    await this.preload();
  }

  private async preload() {
    await this.loadTrack(this.currentTrackId);
    await this.loadSfx();
  }

  private async loadBuffer(key: string, url: string) {
    if (!this.ctx || this.buffers[key]) return;

    try {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      this.buffers[key] = await this.ctx.decodeAudioData(buf);
    } catch (e) {
      console.warn('Sound load failed:', url);
    }
  }

  private async loadTrack(id: string) {
    await this.loadBuffer(id, `${BASE_PATH}/${id}.mp3`);
  }

  private async loadSfx() {
    for (const [key, url] of Object.entries(SFX_PATHS)) {
      await this.loadBuffer(key, url);
    }
  }

  /* ================= HELPERS ================= */

  private uiToGain(x: number) {
    return Math.max(this.MIN_GAIN, Math.pow(x, 2.2));
  }

  private smoothGain(gain: GainNode, value: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(value, now, this.SMOOTH);
  }

  /* ================= MUSIC ================= */

  getCurrentTrackId() {
    return this.currentTrackId;
  }

  async setTrack(id: string) {
    if (id === this.currentTrackId) return;

    this.currentTrackId = id;
    void this.ensurePreloaded();
    await this.loadTrack(id);

    if (this.isSessionActive && this.isMusicEnabled) {
      this.stopAmbient();
      setTimeout(() => this.playAmbient(), 150);
    }
  }

  setMusicVolume(vol: number) {
    this.musicVolume = vol;
    if (this.ambientGain) {
      this.smoothGain(
        this.ambientGain,
        this.uiToGain(vol)
      );
    }
  }

  setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (enabled && this.isSessionActive) this.playAmbient();
    else this.stopAmbient();
  }

  startSession() {
    this.isSessionActive = true;
    const boot = async () => {
      await this.ensurePreloaded();
      if (this.isSessionActive && this.isMusicEnabled) {
        this.playAmbient();
      }
    };
    void boot();
  }

  stopSession() {
    this.isSessionActive = false;
    this.stopAmbient();
  }

  private playAmbient() {
    if (!this.ctx) return;

    const buffer = this.buffers[this.currentTrackId];
    if (!buffer) {
      // Buffer may still be loading on first session start
      void this.loadTrack(this.currentTrackId).then(() => {
        if (this.isSessionActive && this.isMusicEnabled) {
          this.playAmbient();
        }
      });
      return;
    }

    if (this.ambientSource) {
      try { this.ambientSource.stop(); } catch {}
    }

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();

    source.buffer = buffer;
    source.loop = true;

    gain.gain.value = this.MIN_GAIN;

    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();

    this.smoothGain(gain, this.uiToGain(this.musicVolume));

    this.ambientSource = source;
    this.ambientGain = gain;
  }

  private stopAmbient() {
    if (!this.ctx || !this.ambientSource || !this.ambientGain) return;

    const now = this.ctx.currentTime;

    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.setTargetAtTime(
      this.MIN_GAIN,
      now,
      0.12
    );

    const src = this.ambientSource;
    setTimeout(() => {
      try { src.stop(); } catch {}
    }, 300);

    this.ambientSource = null;
    this.ambientGain = null;
  }

  /* ================= SFX ================= */

  setSfxVolume(vol: number) {
    this.sfxVolume = vol;
  }

  setSfxEnabled(enabled: boolean) {
    this.isSfxEnabled = enabled;
  }

  private playSfx(key: string) {
    void this.ensurePreloaded();
    if (!this.ctx || !this.buffers[key] || !this.isSfxEnabled) return;

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();

    source.buffer = this.buffers[key];
    gain.gain.value = this.uiToGain(this.sfxVolume);

    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }

  playInhale() { this.playSfx('inhale'); }
  playHold() { this.playSfx('hold'); }
  playExhale() { this.playSfx('exhale'); }
  playFinish() {
    this.stopSession();
    this.playSfx('finish');
  }

  /* ================= API COMPAT ================= */

  /** 🔥 КРИТИЧНО: используется в useBreathingSession */
  stopAll() {
    this.isSessionActive = false;
    this.stopAmbient();
  }
}

export const soundManager = new SoundManager();
