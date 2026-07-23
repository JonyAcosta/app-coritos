import React, { useState } from 'react';

export default function CoritosList({ coritos, onSelectCorito }) {
  const [search, setSearch] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('Todos');

  const categorias = ['Todos', 'Reuniones', 'Escuelita', 'Jóvenes'];

  const coritosFiltrados = coritos.filter((c) => {
    const coincideBusqueda = c.titulo.toLowerCase().includes(search.toLowerCase());
    const coincideCategoria = categoriaSel === 'Todos' || c.categoria === categoriaSel;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div style={{
      maxWidth: '420px',
      margin: '20px auto',
      backgroundColor: '#1e1e1e',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      color: '#fff',
      border: '1px solid #2a2a2a'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎵</div>
        <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>Bienvenido a</p>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>App coritos</h2>
      </div>

      {/* Buscador */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="🔍 Buscar corito..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #333',
            backgroundColor: '#121212',
            color: '#fff',
            fontSize: '15px',
            outline: 'none'
          }}
        />
      </div>

      {/* Categorías */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '15px'
      }}>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSel(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: categoriaSel === cat ? '#ffffff' : '#2a2a2a',
              color: categoriaSel === cat ? '#000000' : '#aaa',
              fontWeight: categoriaSel === cat ? 'bold' : 'normal',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '13px'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Título de la lista */}
      <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>Índice</h3>

      {/* Lista scrolleable de coritos */}
      <div style={{
        maxHeight: '320px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        paddingRight: '5px'
      }}>
        {coritosFiltrados.map((corito) => (
          <div
            key={corito.id}
            onClick={() => onSelectCorito(corito)}
            style={{
              padding: '14px 12px',
              backgroundColor: '#262626',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background 0.2s',
              borderBottom: '1px solid #1e1e1e'
            }}
          >
            <span>📑</span>
            <span style={{ fontWeight: '500', fontSize: '15px' }}>{corito.titulo}</span>
          </div>
        ))}

        {coritosFiltrados.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px 0' }}>
            No se encontraron coritos.
          </p>
        )}
      </div>
    </div>
  );
}