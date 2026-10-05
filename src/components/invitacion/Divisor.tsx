import { useState } from "react";
import { media } from "../../lib/media";
import { useAparecer } from "./useAparecer";

export default function Divisor() {
  const [falla, setFalla] = useState(false);
  const cerca = useAparecer<HTMLDivElement>(0, "600px");

  return (
    <div ref={cerca.ref} className="bg-wedding-cream flex items-center justify-center py-2 md:py-4 min-h-[60px]">
      {falla ? (
        <div className="flex items-center justify-center gap-4 py-6">
          <span className="h-px w-16 md:w-24 bg-wedding-accent/40" />
          <span className="text-wedding-accent text-xl">✦</span>
          <span className="h-px w-16 md:w-24 bg-wedding-accent/40" />
        </div>
      ) : (
        cerca.visible && (
          <img
            src={media.divisor}
            alt=""
            className="max-w-[280px] md:max-w-[400px] w-full h-auto"
            onError={() => setFalla(true)}
          />
        )
      )}
    </div>
  );
}
