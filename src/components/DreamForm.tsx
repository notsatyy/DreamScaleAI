import { useState } from 'react';
import { Sparkles, Smile, Frown, Ghost, HelpCircle, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const moods = [
  { value: 'joy', label: 'Joy', icon: Smile, color: 'text-yellow-400' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-400' },
  { value: 'creepy', label: 'Creepy', icon: Ghost, color: 'text-red-400' },
  { value: 'mysterious', label: 'Mysterious', icon: HelpCircle, color: 'text-purple-400' },
  { value: 'overwhelming', label: 'Overwhelming', icon: Zap, color: 'text-orange-400' },
];

type DreamFormProps = {
  onDreamSaved: () => void;
};

export const DreamForm = ({ onDreamSaved }: DreamFormProps) => {
  const [dreamContent, setDreamContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const analyzeDream = (content: string, mood: string): string => {
    const analyses: Record<string, string[]> = {
      joy: [
        'Dreams of joy often reflect feelings of accomplishment and contentment in your waking life. Your subconscious is processing positive experiences and emotional fulfillment.',
        'This joyful dream suggests you are experiencing a period of harmony and balance. Your mind is celebrating recent successes or meaningful connections.',
        'Joy in dreams can indicate self-acceptance and inner peace. Your psyche is acknowledging personal growth and positive life changes.',
      ],
      sad: [
        'Sadness in dreams often represents unprocessed grief or disappointment. Your subconscious is creating a safe space to work through these emotions.',
        'This dream may reflect feelings of loss or longing in your waking life. Your mind is helping you process and come to terms with difficult emotions.',
        'Dreams of sadness can signal a need for self-care and emotional support. Your psyche is asking you to acknowledge and address these feelings.',
      ],
      creepy: [
        'Creepy dreams often symbolize anxiety or fear about unknown situations in your life. Your subconscious is processing feelings of vulnerability or unease.',
        'This unsettling dream may represent repressed fears or concerns that need attention. Your mind is bringing these issues to the surface for resolution.',
        'Eerie dreams can indicate you are facing situations that challenge your sense of safety or control. Your psyche is working through feelings of uncertainty.',
      ],
      mysterious: [
        'Mysterious dreams suggest you are exploring unknown aspects of yourself or your life. Your subconscious is encouraging curiosity and self-discovery.',
        'This enigmatic dream may reflect a situation in your waking life that lacks clarity. Your mind is processing ambiguity and seeking understanding.',
        'Dreams filled with mystery often indicate transformation and personal growth. Your psyche is navigating transitions and new possibilities.',
      ],
      overwhelming: [
        'Overwhelming dreams typically reflect stress or feeling burdened in your waking life. Your subconscious is processing feelings of being stretched too thin.',
        'This intense dream suggests you may be taking on too much responsibility. Your mind is signaling a need to set boundaries and prioritize self-care.',
        'Dreams of overwhelm can indicate major life changes or challenges. Your psyche is working to integrate and make sense of complex situations.',
      ],
    };

    const moodAnalyses = analyses[mood] || analyses['mysterious'];
    const randomIndex = Math.floor(Math.random() * moodAnalyses.length);

    const commonThemes = [
      '\n\nCommon symbols in your dream may represent: hidden emotions, unmet needs, or aspects of your personality seeking expression.',
      '\n\nConsider how the emotions in this dream relate to your current life circumstances. Dreams often provide insights into our subconscious processing.',
      '\n\nReflect on any recurring patterns or themes. Your dreams are a window into your inner world and emotional landscape.',
    ];

    return moodAnalyses[randomIndex] + commonThemes[Math.floor(Math.random() * commonThemes.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || !dreamContent.trim()) {
      setError('Please enter your dream and select a mood');
      return;
    }

    setAnalyzing(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const analysis = analyzeDream(dreamContent, selectedMood);

    const { error: dbError } = await supabase.from('dreams').insert({
      user_id: user?.id,
      dream_content: dreamContent,
      mood: selectedMood,
      analysis: analysis,
    });

    setAnalyzing(false);

    if (dbError) {
      setError('Failed to save dream. Please try again.');
    } else {
      setDreamContent('');
      setSelectedMood('');
      onDreamSaved();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center mb-6">
        <Sparkles className="w-6 h-6 text-purple-400 mr-3" />
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
          Record Your Dream
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-purple-200 mb-2 font-medium">What did you dream about?</label>
          <textarea
            value={dreamContent}
            onChange={(e) => setDreamContent(e.target.value)}
            placeholder="Describe your dream in detail..."
            rows={6}
            className="w-full px-4 py-3 bg-purple-950/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400 transition-colors resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-purple-200 mb-3 font-medium">Dominant Feeling</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    selectedMood === mood.value
                      ? 'border-purple-400 bg-purple-600/30'
                      : 'border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/30'
                  }`}
                >
                  <Icon className={`w-8 h-8 ${mood.color} mb-2`} />
                  <span className="text-purple-200 text-sm font-medium">{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="text-pink-300 text-sm text-center bg-pink-900/20 py-2 rounded-lg border border-pink-500/30">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={analyzing}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
        >
          {analyzing ? (
            <span className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Analyzing Dream...
            </span>
          ) : (
            'Analyze & Save Dream'
          )}
        </button>
      </div>
    </form>
  );
};
