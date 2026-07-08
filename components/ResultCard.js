// components/ResultCard.js
//
// Tarjeta visual de resultado. Alto contraste, letras grandes,
// pensada para leerse rápido al aire libre.

export default function ResultCard({ equipo }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6 mt-6">
      <Row icono="⚡" etiqueta="Código" valor={equipo.codigo_equipo} destacado />
      <Row icono="🏢" etiqueta="Tipo" valor={equipo.tipo_equipo} />
      <Row icono="📍" etiqueta="Dirección" valor={equipo.direccion} />
      <Row icono="🏙" etiqueta="Localidad" valor={equipo.localidad} />
      <Row icono="🔌" etiqueta="Alimentador" valor={equipo.alimentador} />
      <Row icono="📌" etiqueta="Distrito" valor={equipo.distrito} last />
    </div>
  );
}

function Row({ icono, etiqueta, valor, destacado, last }) {
  return (
    <div className={`flex items-start gap-3 py-3 ${last ? '' : 'border-b border-slate-100'}`}>
      <span className="text-2xl leading-none">{icono}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{etiqueta}</p>
        <p className={`${destacado ? 'text-3xl' : 'text-xl'} font-bold text-slate-900 break-words`}>
          {valor || '—'}
        </p>
      </div>
    </div>
  );
}
