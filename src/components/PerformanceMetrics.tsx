import React from 'react';
import { useAudioStore } from '../store/audioStore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Clock, MessageCircle, AlertCircle, Award } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function PerformanceMetrics() {
  const { analysis } = useAudioStore();

  if (!analysis) {
    return null;
  }

  const { metrics, sentiment } = analysis;

  const sentimentData = {
    labels: sentiment.segments.map((_, i) => `${i + 1}m`),
    datasets: [
      {
        label: 'Sentiment Score',
        data: sentiment.segments.map(s => s.score),
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        min: -1,
        max: 1,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Clock className="w-6 h-6 text-blue-500" />}
          title="Avg Response Time"
          value={`${metrics.responseTime.toFixed(1)}s`}
          description="Average time to respond"
        />
        <MetricCard
          icon={<MessageCircle className="w-6 h-6 text-green-500" />}
          title="Silence Duration"
          value={`${metrics.silenceDuration.toFixed(1)}s`}
          description="Total silence time"
        />
        <MetricCard
          icon={<AlertCircle className="w-6 h-6 text-yellow-500" />}
          title="Compliance Score"
          value={`${(metrics.complianceScore * 100).toFixed(0)}%`}
          description="Script adherence"
        />
        <MetricCard
          icon={<Award className="w-6 h-6 text-purple-500" />}
          title="Overall Score"
          value={`${(metrics.overallScore * 100).toFixed(0)}%`}
          description="Performance rating"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
        <Line data={sentimentData} options={options} />
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, description }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}