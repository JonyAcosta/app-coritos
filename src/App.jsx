import React, { useState } from 'react';
import CoritosList from './components/CoritosList';
import CoritoViewer from './components/CoritoViewer';
import { CORITOS } from './data/coritos';

export default function App() {
  const [coritoSeleccionado, setCoritoSeleccionado] = useState(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', padding: '10px' }}>
      {coritoSeleccionado ? (
        <div>
          {/* Botón para volver al menú principal */}
          <button
            onClick={() => setCoritoSeleccionado(null)}
            style={{
              backgroundColor: '#2a2a2a',
              color: '#fff',
              border: '1px solid #444',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '15px',
              fontWeight: 'bold'
            }}
          >
            ⬅ Volver al índice
          </button>

          <CoritoViewer
            titulo={coritoSeleccionado.titulo}
            letra={coritoSeleccionado.letra}
          />
        </div>
      ) : (
        <CoritosList
          coritos={CORITOS}
          onSelectCorito={(corito) => setCoritoSeleccionado(corito)}
        />
      )}
    </div>
  );
}