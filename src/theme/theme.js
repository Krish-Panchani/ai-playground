export const APP_THEME = {
  page: "bg-black min-h-screen",
  card: "rounded-2xl border border-orange-500/60 bg-slate-950 p-4 shadow-lg shadow-black/40",
  stripCard: "rounded-2xl border border-cyan-600/40 bg-slate-950/90 p-4",
  heroGradient: "bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent",
  loadingGradient:
    "bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-animate",
  primaryButton:
    "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-50",
  dangerButton:
    "bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-semibold transition-all duration-200 hover:brightness-110",
  secondaryButton:
    "bg-slate-800 border border-slate-600 text-slate-100 rounded-full font-semibold hover:bg-slate-700",
  disabledButton: "bg-slate-700 text-slate-400 cursor-not-allowed rounded-full font-semibold",
  panelText: "text-white",
  subtleText: "text-slate-300",
  accentText: "text-cyan-300",
  warningText: "text-orange-300",
  gamePanel: "rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-950 to-slate-900 p-4",
};

export const levelFromXp = (xp) => Math.floor((Number(xp) || 0) / 100);
