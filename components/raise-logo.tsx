export const RaiseLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M12 2v20" />
          <path d="m17 5-5-3-5 3" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </div>
      <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text font-bold text-transparent text-xl tracking-tight">
        RaiseAI
      </span>
    </div>
  );
};
