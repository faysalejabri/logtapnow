// Apple-style Input
export const AppleInput = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-5 py-4 bg-gray-100/50 hover:bg-white/80 focus:bg-white border border-transparent focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 text-lg shadow-inner"
  />
);
