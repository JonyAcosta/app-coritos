import React, { useState } from "react";
import ChordLine from "./ChordLine";
import { transposeText } from "../utils/transpose";

export default function CoritoViewer({ coro, onBack, onOpenPresentation }) {
  const [semitones, setSemitones] = useState(0);
  const [fontSize, setFontSize] = useState(18); // Control de tamaño de letra para atril

  if (!coro) return null;

  // Separa las estrofas/secciones por doble salto de línea
  const sections = (coro.letra || "")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-2xl shadow-xl">
      {/* Barra superior de control */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Volver
        </button>

        {/* Título y tono */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">{coro.titulo}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            Tono original: {coro.tono || "N/A"}
          </span>
        </div>

        {/* Controles: Transposición, Zoom y Proyección */}
        <div className="flex items-center gap-2">
          {/* Transpositor de semitonos */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setSemitones((s) => s - 1)}
              className="w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-300 hover:bg-slate-700 rounded transition-colors"
              title="Bajar 1 semitono"
            >
              -
            </button>
            <span className="px-2 text-xs font-mono font-bold text-amber-400 min-w-8 text-center">
              {semitones > 0 ? `+${semitones}` : semitones}
            </span>
            <button
              onClick={() => setSemitones((s) => s + 1)}
              className="w-7 h-7 flex items-center justify-center text-sm font-bold text-slate-300 hover:bg-slate-700 rounded transition-colors"
              title="Subir 1 semitono"
            >
              +
            </button>
          </div>

          {/* Ajuste de tamaño de fuente para el atril */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setFontSize((f) => Math.max(f - 2, 14))}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-slate-700 rounded"
              title="Disminuir letra"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize((f) => Math.min(f + 2, 32))}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-slate-700 rounded"
              title="Aumentar letra"
            >
              A+
            </button>
          </div>

          {/* Botón Proyectar (abre PresentationView) */}
          <button
            onClick={() => onOpenPresentation(coro)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-md"
          >
            🖥️ Proyectar
          </button>
        </div>
      </div>

      {/* Contenido con letra y acordes */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {sections.map((section, idx) => {
          // Transpone la sección completa antes de renderizar
          const transposedSection = transposeText(section, semitones);
          const lines = transposedSection.split("\n");

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2"
              style={{ fontSize: `${fontSize}px` }}
            >
              {lines.map((line, lineIdx) => (
                <ChordLine key={lineIdx} text={line} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}