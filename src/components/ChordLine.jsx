import React from "react";

export default function ChordLine({ text }) {
  // Si la línea no contiene acordes entre corchetes, se muestra como texto regular
  if (!text.includes("[")) {
    return <p className="leading-relaxed text-slate-200">{text}</p>;
  }

  // Divide la línea identificando bloques de acordes y texto
  const parts = text.split(/(\[[^\]]*\])/g);

  let chordLine = "";
  let lyricsLine = "";

  parts.forEach((part) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      const chord = part.slice(1, -1);
      chordLine += chord;
      // Agrega espacios en la letra para mantener alineación si el acorde es largo
      lyricsLine += " ".repeat(Math.max(0, chord.length));
    } else {
      lyricsLine += part;
      // Añade espacios en la línea de acordes según la longitud de la sílaba
      chordLine += " ".repeat(part.length);
    }
  });

  return (
    <div className="font-mono leading-none my-1 select-text">
      <div className="text-amber-400 font-bold whitespace-pre text-sm tracking-wider">
        {chordLine}
      </div>
      <div className="text-slate-100 whitespace-pre">{lyricsLine}</div>
    </div>
  );
}