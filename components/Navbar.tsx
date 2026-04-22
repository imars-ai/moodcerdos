import { UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

export function Navbar() {
  const { user, loginWithGoogle, logout, isFirebaseConfigured, loading } = useAuth();
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-8 h-20">
      <div className="text-2xl font-display font-bold text-primary tracking-tighter">
        MoodCerdos
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <a className="text-primary font-bold font-body text-[10px] uppercase tracking-[0.05em]" href="#">
          Diario
        </a>
        <a className="text-neutral hover:text-primary transition-colors font-body text-[10px] uppercase tracking-[0.05em]" href="#">
          Estadísticas
        </a>
        <a className="text-neutral hover:text-primary transition-colors font-body text-[10px] uppercase tracking-[0.05em]" href="#">
          Calendario
        </a>
      </div>
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        ) : user ? (
          <div className="flex items-center gap-4">
             <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-white">{user.displayName}</p>
             </div>
             {user.photoURL ? (
                <Image src={user.photoURL} alt="User Avatar" width={32} height={32} className="rounded-full" />
             ) : (
                <UserCircle className="w-8 h-8 text-neutral" />
             )}
             <button onClick={logout} className="text-neutral hover:text-error transition-colors p-2" title="Cerrar sesión">
                <LogOut className="w-5 h-5"/>
             </button>
          </div>
        ) : (
          isFirebaseConfigured && (
            <button 
              onClick={loginWithGoogle}
              className="bg-surface-high hover:bg-surface-high/80 hover:scale-105 transition-all duration-300 px-6 py-2 rounded-max text-sm font-bold active:scale-95 text-primary">
              Iniciar Sesión
            </button>
          )
        )}
      </div>
    </nav>
  );
}
