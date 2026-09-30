import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isSpeaking, speakText, stopSpeech } from '../../utils/speechNarrator';

interface VoiceNarratorButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const VoiceNarratorButton: React.FC<VoiceNarratorButtonProps> = ({
  text,
  size = 'sm',
  label = 'Dengarkan Suara',
  className = '',
}) => {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleToggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakText(text, () => {
        setSpeaking(false);
      });
    }
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const btnPaddings = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      title={speaking ? 'Hentikan Suara Narasi' : 'Dengarkan Bacaan Suara Narator'}
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
        speaking
          ? 'bg-amber-500 text-white animate-pulse shadow-md shadow-amber-500/30'
          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800'
      } ${btnPaddings[size]} ${className}`}
    >
      {speaking ? (
        <>
          <VolumeX className={iconSizes[size]} />
          <span>Stop Suara</span>
        </>
      ) : (
        <>
          <Volume2 className={iconSizes[size]} />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
