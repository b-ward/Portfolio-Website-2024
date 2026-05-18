export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-accent/25 rounded-xl w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-white/10">
          <h3 className="text-accent text-lg font-semibold m-0">{title}</h3>
          <button
            className="text-slate-400 hover:text-white text-2xl leading-none bg-transparent border-none cursor-pointer p-0"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto text-white/80 leading-relaxed [&_a]:text-accent [&_a]:underline [&_p]:mb-3 [&_p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
