import React from 'react';
import { AudioUploader } from './components/AudioUploader';
import { AudioPlayer } from './components/AudioPlayer';
import { TranscriptViewer } from './components/TranscriptViewer';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { IssuesList } from './components/IssuesList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">QA-BOT Analyzer</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
              <AudioUploader />
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              <PerformanceMetrics />
            </section>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <section className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Audio Analysis</h2>
                  <AudioPlayer />
                </section>

                <section className="bg-white rounded-lg shadow p-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Transcript</h2>
                  <TranscriptViewer />
                </section>
              </div>

              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Issues</h2>
                <IssuesList />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;