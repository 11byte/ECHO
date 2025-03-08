export interface AudioFile {
  id: string;
  name: string;
  duration: number;
  url: string;
  createdAt: Date;
}

export interface Analysis {
  id: string;
  audioFileId: string;
  transcript: TranscriptSegment[];
  sentiment: SentimentAnalysis;
  metrics: PerformanceMetrics;
  issues: Issue[];
  createdAt: Date;
}

export interface TranscriptSegment {
  id: string;
  speaker: 'agent' | 'customer';
  text: string;
  startTime: number;
  endTime: number;
  sentiment: number;
}

export interface SentimentAnalysis {
  overall: number;
  segments: {
    time: number;
    score: number;
  }[];
}

export interface PerformanceMetrics {
  responseTime: number;
  silenceDuration: number;
  complianceScore: number;
  overallScore: number;
}

export interface Issue {
  id: string;
  type: 'compliance' | 'sentiment' | 'response_time' | 'script';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: number;
}