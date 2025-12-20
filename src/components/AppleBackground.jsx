// Apple-style background with blurred orbs
export const AppleBackground = ({ children }) => (
  <div className="min-h-screen bg-[#F5F5F7] relative overflow-hidden font-sans selection:bg-blue-500/30">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
    <div className="relative z-10 w-full h-full">{children}</div>
  </div>
);
