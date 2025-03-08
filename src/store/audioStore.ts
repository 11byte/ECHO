import { create } from 'zustand';
import type { AudioFile, Analysis } from '../types';

interface AudioStore {
  currentAudio: AudioFile | null;
  analysis: Analysis | null;
  isPlaying: boolean;
  currentTime: number;
  setCurrentAudio: (audio: AudioFile | null) => void;
  setAnalysis: (analysis: Analysis | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  currentAudio: null,
  analysis: null,
  isPlaying: false,
  currentTime: 0,
  setCurrentAudio: (audio) => set({ currentAudio: audio }),
  setAnalysis: (analysis) => set({ analysis }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (time) => set({ currentTime: time }),
}));