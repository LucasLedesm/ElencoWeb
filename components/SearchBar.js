'use client';

// components/SearchBar.js
//
// Buscador grande, pensado para usarse con una sola mano en la calle.
// Sin dependencias externas de UI, solo Tailwind.

export default function SearchBar({ value, onChange, onSubmit, loading }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="codigo" className="sr-only">
        Buscar código de equipo
      </label>
      <input
        id="codigo"
        name="codigo"
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="characters"
        placeholder="Buscar código de equipo"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={50}
        className="w-full text-2xl px-5 py-5 rounded-2xl border-4 border-slate-300 focus:border-blue-600 focus:outline-none text-center font-semibold tracking-wide shadow-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full text-2xl font-bold py-5 rounded-2xl bg-blue-600 active:bg-blue-800 disabled:bg-slate-400 text-white shadow-md transition-colors"
      >
        {loading ? 'BUSCANDO...' : 'BUSCAR'}
      </button>
    </form>
  );
}
