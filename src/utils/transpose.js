// Escala cromática estándar
const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Mapeo equivalente para bemoles (Bb -> A#, Eb -> D#, etc.)
const FLAT_TO_SHARP = {
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
};

/**
 * Cambia la nota base un número dado de semitonos (pasos)
 */
function transposeNote(note, semitones) {
  // Convertir bemoles a sostenidos para trabajar en la misma escala
  const cleanNote = FLAT_TO_SHARP[note] || note;
  const index = CHROMATIC_SCALE.indexOf(cleanNote);

  if (index === -1) return note; // Si no encuentra la nota, la devuelve igual

  // Calcular el nuevo índice usando módulo para dar la vuelta al círculo armónico
  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  return CHROMATIC_SCALE[newIndex];
}

/**
 * Transpone todos los acordes encerrados entre corchetes [Acorde] dentro del texto
 */
export function transposeChordPro(text, semitones) {
  if (semitones === 0) return text;

  // Regex para capturar lo que hay entre corchetes [ ... ]
  return text.replace(/\[([A-G][b#]?[^\]]*)\]/g, (match, chord) => {
    // Separa la nota base (ej: "C#", "F", "Bb") del resto del acorde (ej: "m7", "sus4", "add9")
    const noteMatch = chord.match(/^([A-G][b#]?)(.*)/);
    if (!noteMatch) return `[${chord}]`;

    const [, baseNote, chordType] = noteMatch;
    const newBaseNote = transposeNote(baseNote, semitones);

    return `[${newBaseNote}${chordType}]`;
  });
}