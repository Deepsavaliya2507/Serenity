import React, { useState, useEffect } from 'react';
import { MoodEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Smile, Meh, Frown, ThumbsUp, Cloud, Sun, Zap } from 'lucide-react';

interface MoodTrackerProps {
  entries: MoodEntry[];
  onAddEntry: (entry: MoodEntry) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ entries, onAddEntry }) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Process data for chart
    const data = entries
      .slice()
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-7) // Last 7 entries
      .map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
        score: entry.score,
      }));
    setChartData(data);
  }, [entries]);

  const handleSubmit = () => {
    if (selectedScore === null) return;
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      score: selectedScore,
      note,
      tags: []
    };
    
    onAddEntry(newEntry);
    setSelectedScore(null);
    setNote('');
  };

  const getMoodIcon = (score: number, size: number = 24) => {
    switch(score) {
      case 1: return <Frown size={size} className="text-rose-400" />;
      case 2: return <Cloud size={size} className="text-orange-400" />;
      case 3: return <Meh size={size} className="text-yellow-400" />;
      case 4: return <Sun size={size} className="text-lime-500" />;
      case 5: return <Smile size={size} className="text-green-500" />;
      default: return <Meh size={size} />;
    }
  };

  const getAverageMood = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, curr) => acc + curr.score, 0);
    return (sum / entries.length).toFixed(1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in p-4 pb-24 md:pb-4">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Mood Tracker</h2>
        <p className="text-gray-500 text-sm">Track your emotional well-being over time.</p>
      </header>

      {/* Input Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-serenity-100">
        <h3 className="text-lg font-medium text-gray-700 mb-4">How are you feeling right now?</h3>
        
        <div className="flex justify-between items-center mb-8 px-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => setSelectedScore(score)}
              className={`flex flex-col items-center space-y-2 transition-all duration-300 ${
                selectedScore === score ? 'transform scale-125' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className={`p-3 rounded-full ${selectedScore === score ? 'bg-serenity-50 shadow-inner' : ''}`}>
                {getMoodIcon(score, 32)}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a brief note (optional)..."
            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-serenity-200 resize-none text-sm text-gray-700"
            rows={2}
          />
          <button
            onClick={handleSubmit}
            disabled={selectedScore === null}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              selectedScore !== null 
                ? 'bg-serenity-500 hover:bg-serenity-600 text-white shadow-md hover:shadow-lg' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            Log Mood
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 uppercase font-semibold">Weekly Average</span>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-3xl font-bold text-gray-800">{getAverageMood()}</span>
            <span className="text-sm text-gray-500 mb-1">/ 5</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-400 uppercase font-semibold">Total Entries</span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-800">{entries.length}</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {entries.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-serenity-100 h-80">
          <h3 className="text-lg font-medium text-gray-700 mb-6">Your Week</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                hide 
                domain={[0, 6]} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#bae6fd', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;