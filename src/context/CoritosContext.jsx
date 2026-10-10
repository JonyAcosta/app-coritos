import React, { createContext, useContext, useState, useEffect } from "react";

const CoritosContext = createContext();

export function CoritosProvider({ children }) {
  const [coritos, setCoritos] = useState(() => {
    return JSON.parse(localStorage.getItem("coritos_list") || "[]");
  });
  const [playlist, setPlaylist] = useState(() => {
    return JSON.parse(localStorage.getItem("coritos_playlist") || "[]");
  });

  useEffect(() => {
    localStorage.setItem("coritos_list", JSON.stringify(coritos));
  }, [coritos]);

  useEffect(() => {
    localStorage.setItem("coritos_playlist", JSON.stringify(playlist));
  }, [playlist]);

  const addCorito = (coro) => setCoritos((prev) => [{ ...coro, id: Date.now() }, ...prev]);
  const updateCorito = (coro) => setCoritos((prev) => prev.map((c) => (c.id === coro.id ? coro : c)));
  const deleteCorito = (id) => setCoritos((prev) => prev.filter((c) => c.id !== id));
  
  const toggleFavorite = (id) => {
    setCoritos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorito: !c.favorito } : c))
    );
  };

  const togglePlaylist = (coro) => {
    setPlaylist((prev) =>
      prev.some((p) => p.id === coro.id)
        ? prev.filter((p) => p.id !== coro.id)
        : [...prev, coro]
    );
  };

  return (
    <CoritosContext.Provider
      value={{
        coritos,
        playlist,
        setPlaylist,
        addCorito,
        updateCorito,
        deleteCorito,
        toggleFavorite,
        togglePlaylist,
      }}
    >
      {children}
    </CoritosContext.Provider>
  );
}

export const useCoritos = () => useContext(CoritosContext);