import React, { useState, useEffect } from "react";
import { transposeText } from "../../utils/transpose";

export default function PresentationView({ coro, onClose }) {
  const [semitones, setSemitones] = useState(0);
  const [showChords, setShowChords] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);

  // Divide el texto en secciones usando doble salto de línea
  const sections = (coro.letra || "")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        setSectionIndex((prev) => Math.min(prev + 1, sections.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setSectionIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sections.length, onClose]);

  const rawSection = sections[sectionIndex] || "";
  const transposedSection = transposeText(rawSection, semitones);
  const finalDisplay = showChords
    ? transposedSection
    : transposedSection.replace(/\[[^\]]*\]/g, "");

  return (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col justify-between p-8 select-none">
      {/* Barra superior de controles */}
      <div className="flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-300">{coro.titulo}</h2>
          <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-indigo-300">
            {sectionIndex + 1} / {sections.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Transposición rápida */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setSemitones((s) => s - 1)}
              className="px-2 py-1 text-sm hover:bg-slate-700 rounded"
              title="Bajar semitono"
            >
              -1
            </button>
            <span className="px-3 text-xs font-mono font-bold text-amber-400">
              {semitones > 0 ? `+${semitones}` : semitones}
            </span>
            <button
              onClick={() => setSemitones((s) => s + 1)}
              className="px-2 py-1 text-sm hover:bg-slate-700 rounded"
              title="Subir semitono"
            >
              +1
            </button>
          </div>

          <button
            onClick={() => setShowChords(!showChords)}
            className={`px-3 py-1 text-sm rounded-lg border ${
              showChords
                ? "bg-indigo-600 border-indigo-500"
                : "border-slate-600 text-slate-400"
            }`}
          >
            {showChords ? "Ocultar acordes" : "Ver acordes"}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1 text-sm bg-rose-700 hover:bg-rose-600 rounded-lg font-bold"
          >
            Salir (Esc)
          </button>
        </div>
      </div>

      {/* Contenido proyectado */}
      <div className="flex-1 flex items-center justify-center text-center px-12">
        <p className="text-4xl md:text-6xl font-semibold leading-relaxed tracking-wide whitespace-pre-line font-sans text-slate-100 max-w-5xl">
          {finalDisplay}
        </p>
      </div>

      {/* Indicadores inferiores */}
      <div className="flex justify-center gap-2">
        {sections.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSectionIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              sectionIndex === idx ? "w-8 bg-indigo-500" : "w-2 bg-slate-700"
            }`}
            aria-label={`Ir a sección ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}