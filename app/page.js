'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ResultCard from '@/components/ResultCard';

export default function Home() {
  const [codigo, setCodigo] = useState('');
  const [equipos, setEquipos] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  async function buscar() {
    const codigoLimpio = codigo.trim();

    if (codigoLimpio.length === 0) {
      setMensaje('Ingresá un código para buscar.');
      setEquipos(null);
      return;
    }

    setLoading(true);
    setMensaje('');
    setEquipos(null);

    try {
      const res = await fetch(`/api/equipos?codigo=${encodeURIComponent(codigoLimpio)}`);
      const data = await res.json();

      if (!data.ok) {
        setMensaje(data.mensaje || 'No se pudo completar la búsqueda.');
        return;
      }

      if (data.equipos.length === 0) {
        setMensaje('No se encontró ningún equipo con ese código');
        return;
      }

      setEquipos(data.equipos);
    } catch (err) {
      setMensaje('No se pudo conectar. Verificá tu conexión e intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-6">
        ⚡ Consulta Equipos MT
      </h1>

      <SearchBar
        value={codigo}
        onChange={setCodigo}
        onSubmit={buscar}
        loading={loading}
      />

      {mensaje && (
        <p className="mt-6 text-lg text-center text-slate-600 font-medium bg-slate-100 rounded-xl px-4 py-3 w-full">
          {mensaje}
        </p>
      )}

      {equipos && equipos.length > 1 && (
        <p className="mt-6 text-sm text-slate-500 text-center w-full">
          Se encontraron {equipos.length} coincidencias
        </p>
      )}

      {equipos && equipos.map((equipo) => (
        <ResultCard key={equipo.id} equipo={equipo} />
      ))}
    </main>
  );
}
