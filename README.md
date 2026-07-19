# 🍺 ChevecCalc

SPA para calcular el precio por mililitro de cerveza y comparar presentaciones (lata, botella, caguama, barril…) para saber cuál conviene más.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- Sin backend: los datos se guardan en `localStorage`

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # genera dist/
npm run preview # sirve el build localmente
```

## Deploy en Netlify

El repo incluye `netlify.toml` con la configuración lista:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- Redirect SPA (`/* → /index.html`)

Solo conecta el repo en Netlify y listo.

## Funcionalidad

- Alta de cervezas con presentación, envases por paquete, ml por envase y precio (total o por envase)
- Presets de volúmenes comunes (355, 473, 650 ml, etc.)
- Cálculo en vivo de $/ml y $/L
- Tabla comparativa ordenada por precio por litro, con la mejor opción destacada y el % de diferencia contra ella
- Persistencia en el navegador
