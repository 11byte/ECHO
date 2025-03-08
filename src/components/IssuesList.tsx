import React from 'react';
import { useAudioStore } from '../store/audioStore';
import { AlertTriangle, AlertCircle, Clock, FileText } from 'lucide-react';

const ISSUE_ICONS = {
  compliance: FileText,
  sentiment: AlertTriangle,
  response_time: Clock,
  script: AlertCircle,
};

const SEVERITY_STYLES = {
  low: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  medium: 'bg-orange-50 text-orange-800 border-orange-200',
  high: 'bg-red-50 text-red-800 border-red-200',
};

export function IssuesList() {
  const { analysis } = useAudioStore();

  if (!analysis?.issues.length) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        No issues detected
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {analysis.issues.map((issue) => {
        const Icon = ISSUE_ICONS[issue.type];
        const severityStyle = SEVERITY_STYLES[issue.severity];

        return (
          <div
            key={issue.id}
            className={`p-4 rounded-lg border ${severityStyle}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium capitalize">
                    {issue.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm px-2 py-0.5 rounded-full bg-white/50 capitalize">
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm">{issue.description}</p>
                <p className="text-sm mt-1 text-gray-700">
                  Time: {formatTime(issue.timestamp)}
                </p>
              </div>
            </div>
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