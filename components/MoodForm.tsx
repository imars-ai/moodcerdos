'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Smile, Laugh, Meh, Frown, Angry, Heart, Check, Sparkles, Loader2 } from 'lucide-react';
import { MoodEntry, MoodType, EnergyLevel } from '@/types';
import { Toast } from './Toast';
import { generateMoodInsight } from '@/lib/ai';

interface MoodFormProps {
  selectedDate: string;
  existingEntry?: MoodEntry;
  onSave: (entry: MoodEntry) => void;
}

const MOOD_OPTIONS: { type: MoodType; label: string; icon: any; colorClass: string; hoverClass: string }[] = [
  { type: 'incredible', label: 'Increíble', icon: Heart, colorClass: 'text-mood-incredible', hoverClass: 'hover:bg-mood-incredible/10' },
  { type: 'very-good', label: 'Muy Bien', icon: Laugh, colorClass: 'text-mood-very-good', hoverClass: 'hover:bg-mood-very-good/10' },
  { type: 'good', label: 'Bien', icon: Smile, colorClass: 'text-mood-good', hoverClass: 'hover:bg-mood-good/10' },
  { type: 'normal', label: 'Normal', icon: Meh, colorClass: 'text-mood-normal', hoverClass: 'hover:bg-mood-normal/10' },
  { type: 'bad', label: 'Mal', icon: Frown, colorClass: 'text-mood-bad', hoverClass: 'hover:bg-mood-bad/10' },
  { type: 'horrible', label: 'Horrible', icon: Angry, colorClass: 'text-mood-horrible', hoverClass: 'hover:bg-mood-horrible/10' },
];

export function MoodForm({ selectedDate, existingEntry, onSave }: MoodFormProps) {
  const [mood, setMood] = useState<MoodType | null>(existingEntry?.mood || null);
  const [score, setScore] = useState<number>(existingEntry?.score || 5);
  const [energy, setEnergy] = useState<EnergyLevel | null>(existingEntry?.energy || null);
  const [word, setWord] = useState(existingEntry?.word || '');
  const [note, setNote] = useState(existingEntry?.note || '');
  const [aiInsight, setAiInsight] = useState(existingEntry?.aiInsight || '');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error', isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });
  const [isSaving, setIsSaving] = useState(false);



  const handleSave = async () => {
    if (!mood || !energy) {
      setToast({
        message: 'Por favor, selecciona tu mood y nivel de energía.',
        type: 'error',
        isVisible: true
      });
      return;
    }

    setIsSaving(true);
    try {
      const entry: MoodEntry = {
        id: existingEntry?.id || crypto.randomUUID(),
        date: selectedDate,
        mood,
        score,
        energy,
        word,
        note,
        aiInsight,
        createdAt: existingEntry?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      await onSave(entry);
      setToast({
        message: '¡Registro guardado con éxito!',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      setToast({
        message: 'Error al guardar el registro.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="p-10 rounded-card bg-surface shadow-2xl border border-neutral/20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <h2 className="font-display text-3xl mb-8 flex items-center gap-4">
        Registro Diario
        <span className="text-sm font-body text-neutral font-normal">
          {formatDate(selectedDate)}
        </span>
      </h2>

      {/* Mood Selector */}
      <div className="mb-10">
        <label className="block font-body font-bold text-[10px] uppercase tracking-widest text-neutral mb-6">
          ¿Cómo te sientes en este momento?
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {MOOD_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = mood === option.type;
            return (
              <button
                key={option.type}
                onClick={() => setMood(option.type)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 group ${isSelected
                    ? 'bg-surface-high border border-neutral/30 shadow-inner'
                    : `${option.hoverClass} border border-transparent`
                  }`}
              >
                <Icon
                  className={`w-10 h-10 transition-transform group-hover:scale-110 ${isSelected ? option.colorClass : 'text-neutral'
                    }`}
                />
                <span className={`font-body font-bold text-[10px] uppercase ${isSelected ? 'text-white' : 'text-neutral'}`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Score Slider */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <label className="block font-body font-bold text-[10px] uppercase tracking-widest text-neutral">
            Puntuación del día
          </label>
          <span className="text-xl font-display font-bold text-primary">{score}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={score}
          onChange={(e) => setScore(parseInt(e.target.value))}
          className="w-full h-2 bg-surface-high rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Journal Text */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <label className="block font-body font-bold text-[10px] uppercase tracking-widest text-neutral">
            ¿Qué ha pasado hoy?
          </label>
          <span className="text-[10px] font-body text-neutral">{note.length}/150</span>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 150))}
          className="w-full h-40 bg-background border-0 rounded-xl p-6 font-body text-white focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-neutral/40 resize-none"
          placeholder="Escribe libremente tus pensamientos..."
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Energy Level */}
        <div>
          <label className="block font-body font-bold text-[10px] uppercase tracking-widest text-neutral mb-6">
            Nivel de Energía
          </label>
          <div className="flex bg-background p-1.5 rounded-max">
            {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => {
              const labels = { low: 'Baja', medium: 'Media', high: 'Alta' };
              const isSelected = energy === level;
              return (
                <button
                  key={level}
                  onClick={() => setEnergy(level)}
                  className={`flex-1 py-2 text-xs font-bold rounded-max transition-all ${isSelected
                      ? 'bg-surface-high text-white shadow-sm'
                      : 'text-neutral hover:text-white'
                    }`}
                >
                  {labels[level]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Word of the day */}
        <div>
          <label className="block font-body font-bold text-[10px] uppercase tracking-widest text-neutral mb-6">
            Una palabra para hoy
          </label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value.slice(0, 30))}
            className="w-full bg-background border-0 rounded-max px-6 py-3 font-body text-sm focus:ring-2 focus:ring-primary/30 transition-all text-white placeholder:text-neutral/40"
            placeholder="Ej: Gratitud"
          />
        </div>
      </div>

      {/* AI Insight Section */}
      {(aiInsight || (mood && energy && note)) && (
        <div className="mb-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 relative group">
          <div className="absolute top-4 right-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-display text-sm font-bold text-primary mb-3 uppercase tracking-widest flex items-center gap-2">
            Reflexión de la IA
          </h3>
          {aiInsight ? (
            <p className="font-body text-sm italic text-white/90 leading-relaxed">
              &quot;{aiInsight}&quot;
            </p>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-neutral text-xs font-body">¿Quieres una reflexión personalizada sobre tu día?</p>
              <button
                onClick={async () => {
                  if (!mood || !energy) {
                    setToast({ message: 'Primero completa tu estado de ánimo.', type: 'error', isVisible: true });
                    return;
                  }
                  setIsGeneratingInsight(true);
                  const insight = await generateMoodInsight({
                    id: '', date: selectedDate, mood, score, energy, word, note, createdAt: 0, updatedAt: 0
                  });
                  setAiInsight(insight);
                  setIsGeneratingInsight(false);
                }}
                disabled={isGeneratingInsight}
                className="bg-primary/20 hover:bg-primary/30 text-primary px-6 py-2 rounded-max text-xs font-bold transition-all flex items-center gap-2"
              >
                {isGeneratingInsight ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGeneratingInsight ? 'Generando...' : 'Generar Reflexión'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Action */}
      <div className="flex justify-end pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className={`font-display font-bold text-lg px-12 py-5 flex items-center justify-center gap-2 rounded-max transition-all duration-300 w-full sm:w-auto ${
            isSaving
              ? 'bg-neutral text-white opacity-70 cursor-not-allowed'
              : 'bg-primary text-background hover:shadow-[0_0_30px_rgba(0,248,255,0.3)]'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" /> Guardando...
            </>
          ) : (
            'Guardar Registro'
          )}
        </motion.button>
      </div>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
}
