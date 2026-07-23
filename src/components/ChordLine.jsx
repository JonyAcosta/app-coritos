import React from 'react';

export default function ChordLine({ line }) {
  // Si la línea está vacía o es un separador (ej: "---")
  if (!line.trim()) return <div style={{ height: '1.2em' }} />;
  if (line.startsWith('---')) {
    return <hr style={{ borderColor: '#333', margin: '15px 0' }} />;
  }

  // Regex para separar los pares [Acorde]Texto
  // Ejemplo: "[C] Dios está a[G]quí" -> captura "[C]" y " Dios está a", luego "[G]" y "quí"
  const regex = /\[([^\]]+)\]([^\[]*)/g;
  const blocks = [];
  let match;
  let lastIndex = 0;

  // Si la línea empieza con texto sin acorde previo
  const initialText = line.match(/^([^\[]+)/);
  if (initialText && !line.startsWith('[')) {
    blocks.push({ chord: null, text: initialText[1] });
    lastIndex = initialText[1].length;
  }

  while ((match = regex.exec(line)) !== null) {
    blocks.push({
      chord: match[1],
      text: match[2]
    });
  }

  // Si la línea no tenía ninguno de los patrones anteriores (texto plano sin acordes)
  if (blocks.length === 0) {
    return <div style={{ lineHeight: '1.8', color: '#e0e0e0' }}>{line}</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      marginBottom: '10px',
      lineHeight: '1'
    }}>
      {blocks.map((block, index) => (
        <div 
          key={index} 
          style={{ 
            display: 'inline-flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginRight: block.text.endsWith(' ') ? '0.4em' : '0'
          }}
        >
          {/* El acorde (arriba) */}
          <span style={{
            height: '1.4em',
            fontWeight: 'bold',
            color: '#ffb74d', // Color dorado/naranja para destacar el acorde
            fontSize: '15px',
            fontFamily: 'monospace'
          }}>
            {block.chord || ''}
          </span>

          {/* La letra (abajo) */}
          <span style={{
            fontSize: '18px',
            color: '#ffffff',
            whiteSpace: 'pre'
          }}>
            {block.text || ' '}
          </span>
        </div>
      ))}
    </div>
  );
}