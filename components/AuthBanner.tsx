import { Info, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface AuthBannerProps {
  syncStatus: 'local' | 'cloud' | 'syncing' | 'error';
}

export function AuthBanner({ syncStatus }: AuthBannerProps) {
  const { user, loginWithGoogle, isFirebaseConfigured } = useAuth();

  if (user) {
    return (
      <div className="mb-10 p-4 bg-surface rounded-card flex items-center justify-between border border-neutral/20">
        <div className="flex items-center gap-3">
          {syncStatus === 'cloud' && <Cloud className="w-5 h-5 text-primary" />}
          {syncStatus === 'syncing' && <Loader2 className="w-5 h-5 text-secondary animate-spin" />}
          {syncStatus === 'error' && <CloudOff className="w-5 h-5 text-error" />}
          {(syncStatus === 'local') && <CloudOff className="w-5 h-5 text-neutral" />}
          
          <p className="text-neutral font-body text-sm text-white/80">
            {syncStatus === 'cloud' && "Datos guardados en la nube."}
            {syncStatus === 'syncing' && "Sincronizando..."}
            {syncStatus === 'error' && "Error de conexión. Trabajando en local."}
            {syncStatus === 'local' && "Trabajando en local."}
          </p>
        </div>
      </div>
    );
  }

  // Si no está configurado Firebase
  if (!isFirebaseConfigured) {
    return (
      <div className="mb-10 p-4 bg-surface rounded-card flex items-center justify-between border border-neutral/20">
        <div className="flex items-center gap-3">
          <CloudOff className="w-5 h-5 text-neutral" />
          <p className="text-neutral font-body text-sm text-white/80">
            Modo offline. Tus datos se guardarán en este dispositivo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10 p-4 bg-surface rounded-card flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-neutral/20">
      <div className="flex items-center gap-3">
        <Info className="w-5 h-5 text-secondary" />
        <p className="text-neutral font-body text-sm text-white/80">
          Inicia sesión para guardar tu historial permanentemente en la nube
        </p>
      </div>
      <button 
        onClick={loginWithGoogle}
        className="text-primary font-body font-bold text-xs uppercase tracking-widest hover:underline whitespace-nowrap">
        Acceder ahora
      </button>
    </div>
  );
}
