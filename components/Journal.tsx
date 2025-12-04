import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { analyzeJournalEntry } from '../services/geminiService';
import { PenTool, Sparkles, Calendar, Quote } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, onAddEntry }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    const analysis = await analyzeJournalEntry(content);
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      content,
      sentiment: analysis.sentiment,
      aiReflection: analysis.reflection
    };

    onAddEntry(newEntry);
    setContent('');
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24 md:pb-4 space-y-8 animate-fade-in">
      <header>
        <h2 className="text-2xl font-semibold text-gray-800">Thought Log</h2>
        <p className="text-gray-500 text-sm">Write down your thoughts. Let go of the weight.</p>
      </header>

      {/* Editor */}
      <div className="bg-white rounded-3xl p-1 shadow-sm border border-serenity-100">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full h-40 p-6 rounded-t-3xl bg-white border-none focus:ring-0 text-gray-700 resize-none leading-relaxed"
        />
        <div className="bg-gray-50 p-3 rounded-b-3xl flex justify-between items-center border-t border-gray-100">
          <span className="text-xs text-gray-400 px-3">
             {content.length > 0 ? `${content.split(' ').length} words` : ''}
          </span>
          <button
            onClick={handleSave}
            disabled={!content.trim() || isAnalyzing}
            className="flex items-center space-x-2 px-6 py-2.5 bg-serenity-600 text-white rounded-xl hover:bg-serenity-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isAnalyzing ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                <span>Reflecting...</span>
              </>
            ) : (
              <>
                <PenTool size={16} />
                <span>Save Entry</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-700 pl-2">Recent Entries</h3>
        {entries.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
            <Quote size={32} className="mx-auto mb-3 opacity-20" />
            <p>Your journal is empty. Start writing today.</p>
          </div>
        ) : (
          entries.slice().reverse().map((entry) => (
            <div key={entry.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-transform hover:scale-[1.01]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2 text-gray-400 text-xs font-medium uppercase tracking-wider">
                  <Calendar size={14} />
                  <span>{new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {entry.sentiment && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${entry.sentiment === 'positive' ? 'bg-green-100 text-green-700' : 
                      entry.sentiment === 'negative' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}
                  `}>
                    {entry.sentiment}
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">
                {entry.content}
              </p>

              {entry.aiReflection && (
                <div className="bg-serenity-50 rounded-xl p-4 flex items-start space-x-3">
                  <Sparkles size={18} className="text-serenity-500 mt-1 flex-shrink-0" />
                  <p className="text-serenity-800 text-sm italic">
                    {entry.aiReflection}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;