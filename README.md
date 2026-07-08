# Consulta Equipos MT

Aplicación de **solo lectura** para consultar equipos de media tensión desde
el celular. Sin login, sin usuarios, sin escritura de datos.

## Estructura del proyecto

```
/app
  /page.js              -> pantalla principal (buscador + resultados)
  /layout.js
  /globals.css
  /api/equipos/route.js -> único endpoint, GET de solo lectura
/components
  SearchBar.js           -> input + botón buscar
  ResultCard.js           -> tarjeta visual de resultado
/lib
  database.js             -> única capa que toca equipos.db
/data
  equipos.db              -> tu base de datos (reemplazar por la real)
/public
```

## 1. Requisitos

- Node.js 18 o superior
- Tu archivo `equipos.db` con la tabla `equipos`

## 2. Instalar dependencias

```bash
npm install
```

## 3. Ubicar tu base de datos real

Reemplazá el archivo de ejemplo por tu base real, respetando exactamente
esta ruta y nombre:

```
/data/equipos.db
```

La app siempre busca la base en `process.cwd()/data/equipos.db`, tanto en
desarrollo como en producción en Vercel.

## 4. Probar en local

```bash
npm run dev
```

Abrí `http://localhost:3000` y probá buscar, por ejemplo, `18001`.

## 5. Configurar .gitignore

Ya viene configurado en el proyecto. Un detalle importante:
**`data/equipos.db` NO debe estar en `.gitignore`.** Tiene que subirse al
repositorio para que Vercel pueda leerlo en producción (la app solo lee,
nunca escribe, así que no hay riesgo de corrupción por subirla).

## 6. Subir a GitHub

```bash
git init
git add .
git commit -m "Consulta Equipos MT - versión inicial"
git branch -M main
git remote add origin <URL_DE_TU_REPO>
git push -u origin main
```

## 7. Conectar con Vercel

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión.
2. Click en **Add New → Project**.
3. Seleccioná el repositorio que acabás de subir.
4. Framework Preset: Vercel detecta automáticamente **Next.js**. No hace
   falta tocar nada más.
5. Click en **Deploy**.

## 8. Notas sobre SQLite en Vercel (importante)

- Vercel ejecuta la app en funciones serverless con **filesystem de solo
  lectura** (excepto `/tmp`, que es temporal).
- Esto es exactamente lo que necesitás: tu app **solo lee** la base, nunca
  escribe. Por eso `equipos.db`, al estar incluido en el deploy, se puede
  leer sin problemas desde `lib/database.js`.
- La conexión se abre explícitamente en modo `readonly: true`, así que
  aunque alguien intentara forzar una escritura, la base la rechazaría.
- Si en el futuro necesitás actualizar los datos, la forma correcta es
  reemplazar el archivo `equipos.db` y volver a hacer deploy (no escribir
  en caliente sobre la base en producción).

## 9. Seguridad ya incluida

- Sin login, sin panel admin, sin escritura — tal como se pidió.
- Consultas SQL siempre parametrizadas (`?`), nunca concatenadas.
- Validación de entrada: longitud máxima (50 caracteres) y solo
  caracteres alfanuméricos, espacios y guiones.
- Escape de comodines de `LIKE` (`%` y `_`) para que la búsqueda del
  usuario se trate siempre como texto literal.
- Conexión SQLite abierta en modo `readonly`.
- Manejo de errores sin exponer stack traces ni detalles internos.
- Headers de seguridad HTTP configurados en `next.config.js` (CSP,
  X-Frame-Options, X-Content-Type-Options, Referrer-Policy, etc.).
- El archivo `.db` nunca se sirve como estático ni queda accesible por URL:
  vive en `/data`, fuera de `/public`, y solo `lib/database.js` lo abre.

## 10. Uso desde el celular

La app está pensada mobile-first: input grande, botón grande, tarjeta de
resultado con letras grandes y alto contraste. Funciona bien en Chrome
Android, tablets y PC sin cambios adicionales.
