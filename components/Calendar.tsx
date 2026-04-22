'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useMoods } from '@/hooks/use-moods';
import { MOOD_COLORS } from '@/types';
import { motion } from 'motion/react';

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const { moods } = useMoods();
  
  // For simplicity in this prototype, we'll just use the current month
  // and hardcode the days, but ideally this uses date-fns or similar.
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthName = currentMonth.toLocaleString('es-ES', { month: 'long' });
  const year = currentMonth.getFullYear();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startOffset }, (_, i) => i);

  return (
    <div className="p-8 rounded-card bg-surface-low border border-neutral/10 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-xl capitalize">{monthName} {year}</h2>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="text-neutral hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={handleNextMonth} className="text-neutral hover:text-white transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 text-center mb-4">
        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((day) => (
          <span key={day} className="text-[10px] font-body font-bold text-neutral uppercase tracking-tighter">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3">
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="aspect-square"></div>
        ))}
        
        {days.map((day) => {
          // Format: YYYY-MM-DD
          const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = moods[dateStr];
          const isSelected = dateStr === selectedDate;
          
          let dayClass = "relative aspect-square rounded-md flex items-center justify-center text-sm transition-all cursor-pointer ";
          
          if (entry) {
            dayClass += MOOD_COLORS[entry.mood] + " font-bold shadow-lg ";
          } else {
            dayClass += "bg-surface-high text-neutral hover:bg-surface hover:text-white ";
          }

          if (isSelected) {
            dayClass += "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 z-10 ";
          }

          return (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={dayClass}
            >
              {day}
              {entry && (
                <Check className="w-4 h-4 absolute -bottom-1 -right-1 text-white opacity-80 drop-shadow-md" strokeWidth={3} />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-neutral/20">
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-mood-incredible"></div><span className="text-[10px] text-neutral">Increíble</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-mood-very-good"></div><span className="text-[10px] text-neutral">Muy Bien</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-mood-good"></div><span className="text-[10px] text-neutral">Bien</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-mood-normal"></div><span className="text-[10px] text-neutral">Normal</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-mood-bad"></div><span className="text-[10px] text-neutral">Mal</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-mood-horrible"></div><span className="text-[10px] text-neutral">Horrible</span></div>
        </div>
      </div>
    </div>
  );
}
