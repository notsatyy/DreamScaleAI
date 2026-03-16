import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Trash2, Smile, Frown, Ghost, HelpCircle, Zap } from 'lucide-react';
import { supabase, Dream } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const moodIcons: Record<string, any> = {
  joy: Smile,
  sad: Frown,
  creepy: Ghost,
  mysterious: HelpCircle,
  overwhelming: Zap,
};

const moodColors: Record<string, string> = {
  joy: 'text-yellow-400',
  sad: 'text-blue-400',
  creepy: 'text-red-400',
  mysterious: 'text-purple-400',
  overwhelming: 'text-orange-400',
};

type DreamJournalProps = {
  refresh: number;
};

export const DreamJournal = ({ refresh }: DreamJournalProps) => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadDreams();
  }, [refresh]);

  const loadDreams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDreams(data);
    }
    setLoading(false);
  };

  const deleteDream = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dream entry?')) return;

    const { error } = await supabase.from('dreams').delete().eq('id', id);

    if (!error) {
      setDreams(dreams.filter((d) => d.id !== id));
      if (selectedDream?.id === id) {
        setSelectedDream(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
        <div className="text-center text-purple-300">Loading your dreams...</div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center mb-6">
        <BookOpen className="w-6 h-6 text-purple-400 mr-3" />
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
          Your Dream Journal
        </h2>
      </div>

      {dreams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-purple-300 mb-2">No dreams recorded yet</p>
          <p className="text-purple-400/60 text-sm">Start by recording your first dream above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dreams.map((dream) => {
            const MoodIcon = moodIcons[dream.mood] || HelpCircle;
            const moodColor = moodColors[dream.mood] || 'text-purple-400';

            return (
              <div
                key={dream.id}
                className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4 hover:bg-purple-900/30 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <MoodIcon className={`w-5 h-5 ${moodColor}`} />
                    <div className="flex items-center gap-2 text-purple-300 text-sm">
                      <Calendar className="w-4 h-4" />
                      {formatDate(dream.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDream(dream.id);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div
                  onClick={() =>
                    setSelectedDream(selectedDream?.id === dream.id ? null : dream)
                  }
                >
                  <p className="text-purple-100 mb-3 line-clamp-2">{dream.dream_content}</p>

                  {selectedDream?.id === dream.id && (
                    <div className="mt-4 pt-4 border-t border-purple-500/20">
                      <h4 className="text-purple-300 font-semibold mb-2">Psychological Analysis</h4>
                      <p className="text-purple-200/80 text-sm leading-relaxed whitespace-pre-line">
                        {dream.analysis}
                      </p>
                    </div>
                  )}

                  <button className="text-purple-400 text-sm mt-2 hover:text-purple-300 transition-colors">
                    {selectedDream?.id === dream.id ? 'Show less' : 'Read analysis'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
