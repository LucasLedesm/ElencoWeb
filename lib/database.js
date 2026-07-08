// lib/database.js
//
// Capa de acceso a datos. Único punto del proyecto que toca el archivo
// SQLite. Todo el resto de la app (rutas API, componentes) pasa siempre
// por las funciones exportadas aquí — nunca abre la base directamente.
//
// Decisiones de seguridad relevantes:
// - Conexión abierta en modo readonly: aunque algún día se escriba mal
//   una query, la propia librería rechazará cualquier intento de escritura.
// - fileMustExist: true evita que better-sqlite3 cree un archivo nuevo
//   vacío si la ruta está mal (fallaría con error claro en vez de servir
//   una base vacía silenciosamente).
// - Conexión reutilizada (singleton) entre invocaciones del mismo
//   contenedor serverless, en vez de abrir/cerrar en cada request.
// - Todas las consultas usan parámetros (?) — nunca concatenación de
//   strings con el input del usuario.

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'equipos.db');

let db = null;

function getDb() {
  if (db) return db;

  db = new Database(DB_PATH, {
    readonly: true,
    fileMustExist: true,
  });

  // Endurecer un poco más la conexión (defensa en profundidad)
  db.pragma('query_only = ON');

  return db;
}

// Escapa los caracteres especiales de LIKE (% y _) para que el texto del
// usuario se trate como texto literal y no como patrón. Sin esto, un
// usuario que buscara "a_1" podría hacer coincidir cosas no relacionadas
// porque "_" es comodín de un solo caracter en SQL LIKE.
function escaparLike(texto) {
  return texto.replace(/[\\%_]/g, (match) => `\\${match}`);
}

const CODIGO_MAX_LENGTH = 50;

/**
 * Busca equipos cuyo codigo_equipo contenga el texto recibido.
 * Búsqueda insensible a mayúsculas/minúsculas y con coincidencia parcial.
 *
 * @param {string} codigoRaw - texto ingresado por el usuario
 * @returns {Array<object>} lista de equipos encontrados (puede ser vacía)
 * @throws {Error} si el input no es válido
 */
export function buscarEquipo(codigoRaw) {
  if (typeof codigoRaw !== 'string') {
    throw new Error('INVALID_INPUT');
  }

  const codigo = codigoRaw.trim();

  if (codigo.length === 0) {
    throw new Error('INVALID_INPUT');
  }

  if (codigo.length > CODIGO_MAX_LENGTH) {
    throw new Error('INVALID_INPUT');
  }

  // Solo se permiten letras, números, espacios y guiones. Cualquier otra
  // cosa (comillas, punto y coma, etc.) se rechaza antes de tocar la DB.
  const patronValido = /^[a-zA-Z0-9\s\-]+$/;
  if (!patronValido.test(codigo)) {
    throw new Error('INVALID_INPUT');
  }

  const database = getDb();

  const patron = `%${escaparLike(codigo)}%`;

  const stmt = database.prepare(`
    SELECT
      id,
      distrito,
      codigo_equipo,
      tipo_equipo,
      direccion,
      localidad,
      alimentador
    FROM equipos
    WHERE codigo_equipo LIKE ? ESCAPE '\\'
    COLLATE NOCASE
    LIMIT 25
  `);

  return stmt.all(patron);
}
