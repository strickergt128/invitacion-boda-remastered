import { Volume2, VolumeX } from "lucide-react";

type Props = { silenciado: boolean; onAlternar: () => void };

export default function BotonMusica({ silenciado, onAlternar }: Props) {
  return (
    <button
      onClick={onAlternar}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full border border-muted-foreground/30 bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all duration-300"
      aria-label={silenciado ? "Activar música" : "Silenciar música"}
    >
      {silenciado ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
