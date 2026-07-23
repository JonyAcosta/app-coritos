import React, { useState, useEffect, useRef } from 'react';
import { transposeChordPro } from '../utils/transpose';
import ChordLine from './ChordLine';

export default function CoritoViewer({ titulo, letra }) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [semitones, setSemitones] = useState(0);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    if (isScrolling) {
      const intervalTime = 70 / speed;

      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy({
          top: 1,
          behavior: 'smooth'
        });

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          setIsScrolling(false);
        }
      }, intervalTime);
    } else {
      clearInterval(scrollIntervalRef.current);
    }

    return () => clearInterval(scrollIntervalRef.current);
  }, [isScrolling, speed]);

  // Transponer el texto completo
  const letraTranspuesta = transposeChordPro(letra, semitones);

  // Separar el texto en líneas para renderizarlas una por una
  const lineas = letraTranspuesta.split('\n');

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '140px' }}>
      <h1 style={{ marginBottom: '10px', color: '#4CAF50', textAlign: 'center' }}>{titulo}</h1>

      {/* Control de Tono */}
      <div style={{
        display: 'flex',
        justify: 'center',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        backgroundColor: '#1e1e1e',
        padding: '10px',
        borderRadius: '12px',
        border: '1px solid #333'
      }}>
        <span style={{ fontSize: '14px', color: '#aaa', fontWeight: 'bold' }}>TONO:</span>
        <button
          onClick={() => setSemitones(semitones - 1)}
          style={{
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          -1
        </button>

        <span style={{ 
          fontSize: '16px', 
          fontWeight: 'bold', 
          minWidth: '40px', 
          textAlign: 'center',
          color: semitones !== 0 ? '#ffb74d' : '#fff'
        }}>
          {semitones > 0 ? `+${semitones}` : semitones}
        </span>

        <button
          onClick={() => setSemitones(semitones + 1)}
          style={{
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          +1
        </button>

        {semitones !== 0 && (
          <button
            onClick={() => setSemitones(0)}
            style={{
              backgroundColor: 'transparent',
              color: '#888',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline',
              marginLeft: '8px'
            }}
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Visualizador con acordes flotantes arriba */}
      <div style={{ 
        backgroundColor: '#1e1e1e',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #2a2a2a'
      }}>
        {lineas.map((linea, index) => (
          <ChordLine key={index} line={linea} />
        ))}
      </div>

      {/* Control flotante para el Autoscroll */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#2a2a2a',
        padding: '12px 24px',
        borderRadius: '30px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
        border: '1px solid #333'
      }}>
        <button 
          onClick={() => setIsScrolling(!isScrolling)}
          style={{
            padding: '10px 20px',
            backgroundColor: isScrolling ? '#e53935' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          {isScrolling ? '⏸ Pausar' : '▶ Autoscroll'}
        </button>

        <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Velocidad:
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}