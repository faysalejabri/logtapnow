// Glass Card Component
export const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] ${className}`}
  >
    {children}
  </div>
);
