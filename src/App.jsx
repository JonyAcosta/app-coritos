import React, { useState, useEffect } from "react";
import CoritoViewer from "./components/CoritoViewer";
import PresentationView from "./components/Presentations/PresentationView";

const INITIAL_COROS = [
  {
    id: 1,
    titulo: "Cristo te necesito",
    categoria: "Reuniones",
    tono: "G",
    favorito: true,
    letra: "[G]Cristo te [C]necesito\n[D]cada día [G]más\n\n[Em]Sin tu presencia no [C]puedo andar\n[D]lléname de tu [G]paz",
  },
  {
    id: 2,
    titulo: "Renuévame",
    categoria: "Reuniones",
    tono: "D",
    favorito: false,
    letra: "[D]Renuévame Señor Je[G]sús\n[A]ya no quiero ser i[D]gual\n\n[D]Pon en mí tu [G]corazón\n[A]porque todo lo que hay dentro de [D]mí",
  },
  {
    id: 3,
    titulo: "Cuán grande es Él",
    categoria: "Jóvenes",
    tono: "A",
    favorito: true,
    letra: "[A]Señor mi Dios, al contem[D]plar los cielos\n[A]el firmamento y las es[E]trellas mil\n\n[A]Mi corazón entona la can[D]ción\n¡Cuán grande es [A]Él! ¡Cuán [E]grande es [A]Él!",
  },
  {
    id: 4,
    titulo: "Medley de Alabanza",
    categoria: "Escuelita",
    tono: "C",
    favorito: false,
    letra: "[C]Alabaré, [Am]alabaré\n[F]alabaré a mi Se[G]ñor\n\n[C]Juan vio el número de los redi[Am]midos\n[F]y todos alaba[G]ban al Se[C]ñor",
  },
];

export default function App() {
  const [coros, setCoros] = useState(() => {
    const saved = localStorage.getItem("coritos_data");
    return saved ? JSON.parse(saved) : INITIAL_COROS;
  });

  const [playlist, setPlaylist] = useState(() => {
    const saved = localStorage.getItem("coritos_playlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const [coroSeleccionado, setCoroSeleccionado] = useState(null);
  const [coroPresentacion, setCoroPresentacion] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [coroEditando, setCoroEditando] = useState(null);
  const [form, setForm] = useState({ titulo: "", categoria: "Reuniones", letra: "", tono: "G" });

  useEffect(() => {
    localStorage.setItem("coritos_data", JSON.stringify(coros));
  }, [coros]);

  useEffect(() => {
    localStorage.setItem("coritos_playlist", JSON.stringify(playlist));
  }, [playlist]);

  const categorias = ["Todos", "Reuniones", "Escuelita", "Jóvenes"];

  const corosFiltrados = coros.filter((c) => {
    const coincideTexto =
      c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.letra && c.letra.toLowerCase().includes(busqueda.toLowerCase())) ||
      (c.tono && c.tono.toLowerCase().includes(busqueda.toLowerCase()));
    const coincideCat = categoriaActiva === "Todos" || c.categoria === categoriaActiva;
    const coincideFav = !soloFavoritos || c.favorito;
    return coincideTexto && coincideCat && coincideFav;
  });

  const toggleFavorito = (e, id) => {
    e.stopPropagation();
    setCoros(coros.map((c) => (c.id === id ? { ...c, favorito: !c.favorito } : c)));
  };

  const togglePlaylist = (e, coro) => {
    e.stopPropagation();
    if (playlist.some((p) => p.id === coro.id)) {
      setPlaylist(playlist.filter((p) => p.id !== coro.id));
    } else {
      setPlaylist([...playlist, coro]);
    }
  };

  const abrirModalNuevo = () => {
    setCoroEditando(null);
    setForm({ titulo: "", categoria: "Reuniones", letra: "", tono: "G" });
    setModalAbierto(true);
  };

  const abrirModalEditar = (e, coro) => {
    e.stopPropagation();
    setCoroEditando(coro);
    setForm({ titulo: coro.titulo, categoria: coro.categoria, letra: coro.letra || "", tono: coro.tono || "G" });
    setModalAbierto(true);
  };

  const guardarCoro = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;

    if (coroEditando) {
      const actualizado = coros.map((c) => (c.id === coroEditando.id ? { ...c, ...form } : c));
      setCoros(actualizado);
      if (coroSeleccionado?.id === coroEditando.id) {
        setCoroSeleccionado({ ...coroSeleccionado, ...form });
      }
    } else {
      const nuevo = { id: Date.now(), ...form, favorito: false };
      setCoros([nuevo, ...coros]);
    }
    setModalAbierto(false);
  };

  const eliminarCoro = (e, id) => {
    e.stopPropagation();
    if (confirm("¿Eliminar este corito?")) {
      setCoros(coros.filter((c) => c.id !== id));
      setPlaylist(playlist.filter((p) => p.id !== id));
      if (coroSeleccionado?.id === id) setCoroSeleccionado(null);
    }
  };

  if (coroPresentacion) {
    return <PresentationView coro={coroPresentacion} onClose={() => setCoroPresentacion(null)} />;
  }

  if (coroSeleccionado) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <CoritoViewer
            coro={coroSeleccionado}
            onBack={() => setCoroSeleccionado(null)}
            onOpenPresentation={(c) => setCoroPresentacion(c)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans flex flex-col">
      {/* Header Superior Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-xl">
              🎵
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Coritos Worship
              </h1>
              <p className="text-xs text-slate-400 font-medium">Gestión & Proyección Litúrgica</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoloFavoritos(!soloFavoritos)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                soloFavoritos
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              ★ {soloFavoritos ? "Viendo Favoritos" : "Favoritos"}
            </button>
            <button
              onClick={abrirModalNuevo}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              + Agregar Coro
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor Principal en 2 Columnas (Dashboard) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Columna Izquierda: Directorio de Coros */}
        <main className="lg:col-span-8 flex flex-col gap-6">
          {/* Buscador y Pestañas */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            {/* Input Search con icono */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Buscar por título, letra, acordes o tono (ej: 'Reuniones', 'G')..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Categorías Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
                    categoriaActiva === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Contador de coritos */}
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400 px-1">
            <span>DISPONIBLES ({corosFiltrados.length})</span>
            <span>Clic en una tarjeta para abrir acordes o proyectar</span>
          </div>

          {/* Grilla de Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {corosFiltrados.length === 0 ? (
              <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-2xl">
                <span className="text-3xl mb-2 block">📖</span>
                <p className="text-slate-400 text-sm">No se encontraron coritos con ese criterio.</p>
              </div>
            ) : (
              corosFiltrados.map((coro) => {
                const enSetlist = playlist.some((p) => p.id === coro.id);
                return (
                  <div
                    key={coro.id}
                    onClick={() => setCoroSeleccionado(coro)}
                    className="group relative bg-slate-900/70 hover:bg-slate-800/60 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {coro.tono || "Tono C"}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => toggleFavorito(e, coro.id)}
                            className={`p-1.5 rounded-lg text-sm transition-colors ${
                              coro.favorito ? "text-amber-400" : "text-slate-500 hover:text-slate-300"
                            }`}
                            title="Favorito"
                          >
                            ★
                          </button>
                          <button
                            onClick={(e) => togglePlaylist(e, coro)}
                            className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              enSetlist
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                            }`}
                            title={enSetlist ? "Quitar del culto" : "Agregar al culto de hoy"}
                          >
                            {enSetlist ? "✓ Culto" : "+ Culto"}
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                        {coro.titulo}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {coro.letra ? coro.letra.replace(/\[[^\]]*\]/g, "") : "Sin letra cargada."}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/70 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-800/80">
                        {coro.categoria}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => abrirModalEditar(e, coro)}
                          className="text-slate-400 hover:text-slate-200 p-1"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => eliminarCoro(e, coro.id)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* Columna Derecha: Orden del Culto (Playlist en vivo) */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-base">📋</span>
                <h2 className="text-sm font-bold text-slate-200">Orden de Alabanzas</h2>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400">
                {playlist.length} seleccionados
              </span>
            </div>

            {playlist.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Apretá <strong>"+ Culto"</strong> en las tarjetas para ordenar los cantos del servicio de hoy.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {playlist.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-mono font-bold text-indigo-400">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-200 line-clamp-1">{item.titulo}</p>
                        <span className="text-[10px] text-slate-400 font-mono">Tono: {item.tono || "N/A"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCoroPresentacion(item)}
                        className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs rounded-lg font-semibold border border-indigo-500/30"
                        title="Proyectar directo"
                      >
                        Proyectar
                      </button>
                      <button
                        onClick={() => setPlaylist(playlist.filter((p) => p.id !== item.id))}
                        className="text-slate-400 hover:text-rose-400 text-xs px-1"
                        title="Quitar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setPlaylist([])}
                  className="mt-3 w-full py-2 text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition-colors border border-transparent hover:border-rose-900/30 rounded-lg"
                >
                  Limpiar lista del día
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Modal Crear / Editar Corito */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">
              {coroEditando ? "Editar Corito" : "Nuevo Corito"}
            </h2>
            <form onSubmit={guardarCoro} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Título del corito</label>
                <input
                  type="text"
                  placeholder="Ej: Hay momentos que las palabras no alcanzan..."
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Reuniones">Reuniones</option>
                    <option value="Escuelita">Escuelita</option>
                    <option value="Jóvenes">Jóvenes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tono Principal</label>
                  <select
                    value={form.tono}
                    onChange={(e) => setForm({ ...form, tono: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B", "Am", "Em", "Dm"].map(
                      (nota) => (
                        <option key={nota} value={nota}>
                          {nota}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Letra con acordes (colocá los acordes entre corchetes: <code>[G]Cristo [C]te amo</code>)
                </label>
                <textarea
                  placeholder="[G]Cristo te necesito..."
                  rows="6"
                  value={form.letra}
                  onChange={(e) => setForm({ ...form, letra: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}