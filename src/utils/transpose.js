const SCALE_SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCALE_FLATS  = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

// Regex para identificar un acorde musical válido (ej: Em, C, F#m7, Bsus4, G/B)
const CHORD_TOKEN_REGEX = /^[A-G][b#]?(m|maj|min|dim|aug|sus[24]?|[0-9])?(\/[A-G][b#]?)?$/;

export function transposeChord(chord, semitones) {
  if (!chord) return chord;

  // Manejo de acordes con bajo invertido (ej: D/F#)
  if (chord.includes("/")) {
    const [base, bass] = chord.split("/");
    return `${transposeChord(base, semitones)}/${transposeChord(bass, semitones)}`;
  }

  const match = chord.match(/^([A-G][b#]?)(.*)/);
  if (!match) return chord;

  const root = match[1];
  const suffix = match[2] || "";

  let index = SCALE_SHARPS.indexOf(root);
  let useFlats = false;

  if (index === -1) {
    index = SCALE_FLATS.indexOf(root);
    useFlats = true;
  }
  if (index === -1) return chord;

  let newIndex = (index + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  const newRoot = useFlats ? SCALE_FLATS[newIndex] : SCALE_SHARPS[newIndex];
  return `${newRoot}${suffix}`;
}

export function isChordLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;

  // Si tiene corchetes, contiene acordes inline
  if (/\[[A-G][b#]?.*\]/.test(trimmed)) return true;

  // Si no, separa por espacios y evalúa si todas las palabras son acordes musicales
  const tokens = trimmed.split(/\s+/);
  return tokens.length > 0 && tokens.every((token) => CHORD_TOKEN_REGEX.test(token));
}

export function transposeLine(line, semitones) {
  if (semitones === 0) return line;

  // Caso 1: Acordes inline entre corchetes tipo [Em]
  if (/\[[A-G][b#]?.*\]/.test(line)) {
    return line.replace(/\[([A-G][b#]?[^\]]*)\]/g, (_, chord) => {
      return `[${transposeChord(chord, semitones)}]`;
    });
  }

  // Caso 2: Línea compuesta exclusivamente de acordes (como tu caso actual: "Em C")
  if (isChordLine(line)) {
    return line.replace(/\S+/g, (chord) => {
      return CHORD_TOKEN_REGEX.test(chord) ? transposeChord(chord, semitones) : chord;
    });
  }

  return line;
}

export function transposeText(text, semitones) {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => transposeLine(line, semitones))
    .join("\n");
}