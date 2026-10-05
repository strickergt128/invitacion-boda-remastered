import { Heart } from "lucide-react";

/** Línea – corazón – línea, usado bajo los títulos. */
export default function Ornamento({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px w-16 bg-wedding-accent/30" />
      <Heart className="w-5 h-5 text-wedding-accent" />
      <div className="h-px w-16 bg-wedding-accent/30" />
    </div>
  );
}
