import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useAudioStore } from '../store/audioStore';

export function AudioUploader() {
  const { setCurrentAudio, setAnalysis } = useAudioStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create object URL for the audio file
    const url = URL.createObjectURL(file);

    // Simulate audio processing and analysis
    // In a real application, this would be handled by the backend
    const mockAnalysis = generateMockAnalysis();

    // Update store with audio file and analysis
    setCurrentAudio({
      id: 'mock-audio-1',
      name: file.name,
      duration: 300, // Mock duration
      url,
      createdAt: new Date(),
    });

    setAnalysis(mockAnalysis);
  }, [setCurrentAudio, setAnalysis]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-lg font-medium text-gray-700">
        {isDragActive ? 'Drop the audio file here' : 'Drag & drop an audio file here'}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        or click to select a file (MP3 or WAV)
      </p>
    </div>
  );
}

function generateMockAnalysis() {
  return {
    id: 'mock-analysis-1',
    audioFileId: 'mock-audio-1',
    transcript: [
      {
        id: '1',
        speaker: 'agent' as const,
        text: 'Hello, thank you for calling. How may I assist you today?',
        startTime: 0,
        endTime: 4,
        sentiment: 0.8,
      },
      {
        id: '2',
        speaker: 'customer' as const,
        text: 'Hi, I\'m having trouble with my account login.',
        startTime: 5,
        endTime: 8,
        sentiment: -0.2,
      },
      // Add more mock transcript segments as needed
    ],
    sentiment: {
      overall: 0.3,
      segments: Array.from({ length: 10 }, (_, i) => ({
        time: i * 30,
        score: Math.sin(i) * 0.5,
      })),
    },
    metrics: {
      responseTime: 2.5,
      silenceDuration: 15.3,
      complianceScore: 0.85,
      overallScore: 0.78,
    },
    issues: [
      {
        id: '1',
        type: 'compliance' as const,
        severity: 'medium' as const,
        description: 'Missing required disclosure statement',
        timestamp: 45,
      },
      {
        id: '2',
        type: 'sentiment' as const,
        severity: 'high' as const,
        description: 'Customer frustration detected',
        timestamp: 120,
      },
      {
        id: '3',
        type: 'response_time' as const,
        severity: 'low' as const,
        description: 'Delayed response to customer query',
        timestamp: 180,
      },
    ],
    createdAt: new Date(),
  };
}