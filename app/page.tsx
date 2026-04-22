'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { AuthBanner } from '@/components/AuthBanner';
import { Calendar } from '@/components/Calendar';
import { MoodForm } from '@/components/MoodForm';
import { useMoods } from '@/hooks/use-moods';

export default function Home() {
  const { saveEntry, getEntryByDate, isLoaded, syncStatus } = useMoods();
  
  // Default to today
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-primary font-display text-2xl">Cargando...</div>;
  }

  const existingEntry = getEntryByDate(selectedDate);

  return (
    <>
      <Navbar />
      
      <main className="pt-28 px-4 md:px-8 max-w-7xl mx-auto">
        <AuthBanner syncStatus={syncStatus} />
        
        <header className="mb-12">
          <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-none mb-4">
            Tu refugio <span className="text-primary">interior</span>.
          </h1>
          <p className="text-neutral font-body text-lg max-w-2xl">
            Tómate un momento para procesar el día. La claridad mental comienza con la honestidad emocional.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          {/* Left Column: Calendar & Quote */}
          <section className="lg:col-span-1 space-y-6">
            <Calendar 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate} 
            />
            
            <div className="relative overflow-hidden rounded-card h-48 bg-surface-low group">
              <Image 
                src="https://picsum.photos/seed/oceanic/800/600" 
                alt="Reflexión" 
                fill
                className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-background to-transparent">
                <p className="font-display text-lg leading-tight text-white">
                  &quot;La felicidad no es algo hecho. Viene de tus propias acciones.&quot;
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Registration Panel */}
          <section className="lg:col-span-2">
            <MoodForm 
              key={selectedDate}
              selectedDate={selectedDate}
              existingEntry={existingEntry}
              onSave={(entry) => {
                saveEntry(entry);
              }}
            />
          </section>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
