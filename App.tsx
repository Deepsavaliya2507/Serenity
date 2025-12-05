import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import MoodTracker from "./components/MoodTracker";
import Journal from "./components/Journal";
import ChatCompanion from "./components/ChatCompanion";
import BreathingExercise from "./components/BreathingExercise";
import { View, MoodEntry, JournalEntry } from "./types";
import { Activity, ShieldCheck } from "lucide-react";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);

  // Persisted Data State
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem("moodEntries");
    return saved ? JSON.parse(saved) : [];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("journalEntries");
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem("moodEntries", JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Handlers
  const handleAddMood = (entry: MoodEntry) => {
    setMoodEntries([...moodEntries, entry]);
  };

  const handleAddJournal = (entry: JournalEntry) => {
    setJournalEntries([...journalEntries, entry]);
  };

  // Render Content Based on View
  const renderContent = () => {
    switch (currentView) {
      case View.HOME:
        return (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in p-4 pb-24 md:pb-4">
            <header className="py-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Good Morning.
              </h1>
              <p className="text-gray-500 mt-2">
                Take a moment for yourself today.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setCurrentView(View.CHAT)}
                className="bg-serenity-500 text-white p-6 rounded-3xl shadow-lg shadow-serenity-200/50 cursor-pointer hover:bg-serenity-600 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">Talk to Serenity</h3>
                  <div className="bg-white/20 p-2 rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                </div>
                <p className="mt-4 text-serenity-100 text-sm">
                  Feeling overwhelmed? Let's chat about it in a safe space.
                </p>
              </div>

              <div
                onClick={() => setCurrentView(View.MOOD)}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm cursor-pointer hover:border-serenity-200 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Check In
                  </h3>
                  <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
                    <Activity size={24} />
                  </div>
                </div>
                <p className="mt-4 text-gray-500 text-sm">
                  {moodEntries.length > 0
                    ? "Keep your streak going. Log your mood today."
                    : "Start tracking your emotional journey."}
                </p>
              </div>
            </div>

            <div className="bg-calm-100 rounded-3xl p-6 border border-calm-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                Quote of the Moment
              </h3>
              <p className="text-gray-600 italic font-serif text-lg">
                "Peace comes from within. Do not seek it without."
              </p>
              <p className="text-gray-400 text-xs mt-2 uppercase tracking-wide">
                — Buddha
              </p>
            </div>

            <div className="pt-8 text-center">
              <p className="text-xs text-gray-300">
                This application uses AI to support your wellness journey but is
                not a replacement for professional medical advice.
              </p>
            </div>
          </div>
        );
      case View.CHAT:
        return <ChatCompanion />;
      case View.MOOD:
        return <MoodTracker entries={moodEntries} onAddEntry={handleAddMood} />;
      case View.JOURNAL:
        return (
          <Journal entries={journalEntries} onAddEntry={handleAddJournal} />
        );
      case View.BREATHE:
        return <BreathingExercise />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdfbf7]">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 overflow-y-auto h-screen relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
