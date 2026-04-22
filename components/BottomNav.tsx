import { Book, BarChart2, Calendar, User } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-background/80 backdrop-blur-2xl z-50 rounded-t-[3rem] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <a href="#" className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-max px-6 py-2 shadow-[inset_0_0_10px_rgba(0,248,255,0.1)]">
        <Book className="w-6 h-6" />
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.05em] mt-1">Diario</span>
      </a>
      <a href="#" className="flex flex-col items-center justify-center text-neutral px-6 py-2 hover:text-primary transition-all">
        <BarChart2 className="w-6 h-6" />
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.05em] mt-1">Stats</span>
      </a>
      <a href="#" className="flex flex-col items-center justify-center text-neutral px-6 py-2 hover:text-primary transition-all">
        <Calendar className="w-6 h-6" />
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.05em] mt-1">Mes</span>
      </a>
      <a href="#" className="flex flex-col items-center justify-center text-neutral px-6 py-2 hover:text-primary transition-all">
        <User className="w-6 h-6" />
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.05em] mt-1">Perfil</span>
      </a>
    </nav>
  );
}
