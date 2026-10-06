// Web Audio API Sound Effects Synthesizer for Typing Practice & Quizzes
// Safe, cross-browser, zero-dependency, and instantly responsive.

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private keyAudioBufferIndex = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ekskul_sound_enabled');
      this.soundEnabled = saved !== 'false';
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ekskul_sound_enabled', enabled ? 'true' : 'false');
    }
  }

  public toggle(): boolean {
    const nextState = !this.soundEnabled;
    this.setEnabled(nextState);
    if (nextState) {
      this.playKeypress();
    }
    return nextState;
  }

  /**
   * Crisp, soft mechanical keyboard switch sound effect on keypress.
   * Pitch slightly varies per stroke to give realistic typing feel.
   */
  public playKeypress(key?: string): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.keyAudioBufferIndex = (this.keyAudioBufferIndex + 1) % 5;

      // Special sound for Enter or Space
      const isSpace = key === ' ';
      const isEnter = key === 'Enter';
      const isBackspace = key === 'Backspace';

      // 1. Subtle mechanical click (Filtered Noise or micro-oscillator)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isEnter ? 1200 : isSpace ? 800 : 1800, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Pitch variation based on key or random cycle
      const baseFreq = isEnter ? 220 : isSpace ? 180 : isBackspace ? 280 : 360 + (this.keyAudioBufferIndex * 25);
      osc.type = isSpace ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.04);

      // Fast tactile click envelope
      const vol = isEnter ? 0.08 : isSpace ? 0.06 : 0.05;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.start(now);
      osc.stop(now + 0.05);

      // Second layer: slight plastic thud
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = 'triangle';
      thud.frequency.setValueAtTime(110 + (this.keyAudioBufferIndex * 10), now);
      thud.frequency.exponentialRampToValueAtTime(45, now + 0.035);
      thudGain.gain.setValueAtTime(0.04, now);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      thud.connect(thudGain);
      thudGain.connect(ctx.destination);
      thud.start(now);
      thud.stop(now + 0.04);
    } catch {
      // Audio playback failed silently
    }
  }

  /**
   * Cheerful, bright ascending arpeggio when a quiz answer is CORRECT!
   */
  public playQuizCorrect(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High-pitched pleasant chime notes (C6, E6, G6, C7)
      const notes = [1046.5, 1318.51, 1567.98, 2093.0];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.07 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Soft, gentle "oops" downward tone when a quiz answer is INCORRECT.
   * Educational, not harsh or jarring.
   */
  public playQuizIncorrect(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Two gentle downward tones (F#4 -> D4)
      const notes = [370.0, 293.66];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.28);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Fanfare sound when whole quiz or typing task is successfully completed!
   */
  public playSuccessFanfare(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C Major
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // ignore
    }
  }
}

export const soundEffects = new SoundEffectsManager();
