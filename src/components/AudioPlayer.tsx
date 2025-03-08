import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';
import { useAudioStore } from '../store/audioStore';

export function AudioPlayer() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const { currentAudio, isPlaying, setIsPlaying, setCurrentTime } = useAudioStore();

  useEffect(() => {
    if (waveformRef.current && currentAudio) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#6366F1',
        height: 80,
        normalize: true,
      });

      wavesurfer.current.load(currentAudio.url);

      wavesurfer.current.on('timeupdate', (time) => {
        setCurrentTime(time);
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, [currentAudio, setCurrentTime]);

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  if (!currentAudio) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div ref={waveformRef} className="mb-4" />
      <div className="flex justify-center">
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}