import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import { DreamForm } from './components/DreamForm';
import { DreamJournal } from './components/DreamJournal';
import { LogOut, Moon } from 'lucide-react';

function App() {
  const { user, loading, signOut } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDreamSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-purple-300 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      <div className="absolute top-8 right-8 w-32 h-32 opacity-10">
        <Moon className="w-full h-full text-purple-300" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <Moon className="w-10 h-10 text-purple-300 mr-3" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              DreamScale AI
            </h1>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-lg transition-all border border-purple-500/30"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="space-y-8">
          <DreamForm onDreamSaved={handleDreamSaved} />
          <DreamJournal refresh={refreshKey} />
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
