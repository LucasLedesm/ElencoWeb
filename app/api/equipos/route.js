// app/api/equipos/route.js
//
// Único endpoint de la aplicación. Es de solo lectura (GET) y nunca
// escribe en la base. Toda la lógica de acceso a datos vive en
// lib/database.js — esta ruta solo valida, delega y da forma a la
// respuesta HTTP.

import { NextResponse } from 'next/server';
import { buscarEquipo } from '@/lib/database';

const MAX_QUERY_LENGTH = 50;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get('codigo');

    // Validación de presencia
    if (!codigo || typeof codigo !== 'string') {
      return NextResponse.json(
        { ok: false, mensaje: 'Debe indicar un código de equipo para buscar.' },
        { status: 400 }
      );
    }

    const codigoLimpio = codigo.trim();

    // Límite de longitud (evita payloads absurdos / abuso del endpoint)
    if (codigoLimpio.length === 0 || codigoLimpio.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { ok: false, mensaje: 'El código ingresado no es válido.' },
        { status: 400 }
      );
    }

    const resultados = buscarEquipo(codigoLimpio);

    if (!resultados || resultados.length === 0) {
      return NextResponse.json(
        { ok: true, equipos: [], mensaje: 'No se encontró ningún equipo con ese código' },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true, equipos: resultados }, { status: 200 });
  } catch (error) {
    // Nunca exponer el error real ni stack traces al cliente.
    // Se podría loguear `error` a un sistema interno de logs aquí si hiciera falta.
    return NextResponse.json(
      { ok: false, mensaje: 'Ocurrió un problema al realizar la búsqueda. Intente nuevamente.' },
      { status: 500 }
    );
  }
}

// Bloqueo explícito de cualquier otro método HTTP sobre este recurso.
export async function POST() {
  return NextResponse.json({ ok: false, mensaje: 'Método no permitido.' }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ ok: false, mensaje: 'Método no permitido.' }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ ok: false, mensaje: 'Método no permitido.' }, { status: 405 });
}
