import React from 'react';
import { useAudioStore } from '../store/audioStore';
import { MessageSquare, AlertTriangle } from 'lucide-react';

export function TranscriptViewer() {
  const { analysis, currentTime } = useAudioStore();

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No transcript available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {analysis.transcript.map((segment) => {
        const isActive = currentTime >= segment.startTime && currentTime <= segment.endTime;
        const sentimentColor = segment.sentiment > 0.5 
          ? 'bg-green-100 border-green-200' 
          : segment.sentiment < -0.5 
            ? 'bg-red-100 border-red-200' 
            : 'bg-gray-50 border-gray-200';

        return (
          <div
            key={segment.id}
            className={`p-4 rounded-lg border transition-all ${sentimentColor} ${
              isActive ? 'shadow-md scale-[1.02]' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                segment.speaker === 'agent' ? 'bg-indigo-100' : 'bg-purple-100'
              }`}>
                <MessageSquare className={`w-5 h-5 ${
                  segment.speaker === 'agent' ? 'text-indigo-600' : 'text-purple-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium capitalize text-gray-700">
                    {segment.speaker}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTime(segment.startTime)}
                  </span>
                </div>
                <p className="text-gray-800">{segment.text}</p>
              </div>
            </div>
            {segment.sentiment < -0.5 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Potential negative interaction detected</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}