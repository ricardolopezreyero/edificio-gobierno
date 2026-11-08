# Edificio de Gobierno

**Ver en vivo: [edificio.capitaltorreon.com](https://edificio.capitaltorreon.com)** · modelo 3D, plano a tres escalas, números y el proyecto completo.

<!-- RLR · Ricardo López Reyero · EYE · 181218 -->

El edificio de gobierno perfecto para México: un **cuadrado de 333 m por lado y 33 pisos**, un anillo de oficinas de 33 m de fondo alrededor de un **parque de 7 hectáreas** con la **Casa de Decisiones** (la oficina del Presidente y sus seis salas conectadas) al centro, **11 sótanos** que terminan en **La Bóveda** de servidores, y **un bosque de 333 m** de ancho por cada lado. Para **30,000 personas**. Diseñado por inteligencia artificial para una sola cosa: que la comunicación fluya y las decisiones se tomen y se cumplan.

Proyecto de **Ricardo López Reyero**.

## Documentos

| Archivo | Qué es |
|---|---|
| [ORIGEN.md](ORIGEN.md) | **El origen**: el dictado original de Ricardo López Reyero, tal como se habló el 7 de noviembre de 2026 a las 10:02 pm, del que salió todo lo demás |
| [PROMPT.md](PROMPT.md) | El brief destilado: lo que se pidió, limpio, con la nota de lo que se cambió del dictado |
| [PROYECTO.md](PROYECTO.md) | El proyecto maestro: idea, correcciones honestas, 12 lineamientos, sitio, tablero del terreno, edificio, arquitectura (qué sí y qué no), organización, Casa de Decisiones, programa con medidas, sótanos, llegada, seguridad, comunicación, materiales, vegetación, confort, 33 detalles, construcción, decisiones pendientes y plan del 3D |
| [modelo/parametros.json](modelo/parametros.json) | Todos los números del proyecto; el 3D se construye leyendo este archivo |
| [sitio/](sitio/) | La página: `index.html`, `app.js` (pestañas, plano SVG, números, documentos), `tres.js` (modelo 3D con Three.js), `estilo.css` |

## El edificio en diez líneas

| | |
|---|---|
| Terreno | 999 × 999 m, tablero de 3 × 3 celdas de 333 m |
| Edificio | 333 × 333 m, anillo de 33.3 m, 33 pisos, ~160 m, 39,900 m² por planta |
| Centro | Casa de Decisiones 99 × 99 m: tablero 3 × 3 de salas de 11.1 m con la oficina del Presidente al centro |
| Parques de cielo | 4, al centro de cada fachada, pisos 16–18, 99 m de ancho |
| Sótanos | 11 (~50 m): llegada, estacionamiento, planta, continuidad, La Bóveda (9 m de alto, 110,889 m²) |
| Bosque | ~78 ha, 15,000–20,000 árboles nativos; estacionamiento para todos debajo de las esquinas |
| Comer | 4 Mercados de los 32 estados, 4 comedores, 33 cafés, 6 restaurantes |
| Gimnasios | 12, con alberca de 33.3 m y pista de 1.2 km en la azotea |
| Teatros | 333 bajo el parque · 999 en el bosque, abierto a la ciudad |
| Vida útil | 200 años; obra en 7, el bosque abre en el año 3 |

## Lo que se corrigió del brief original

- **33 sótanos de oficinas → 11 sótanos sin oficinas** (profundidad, luz y evacuación). El 33 vive arriba: 333 m, 33 m, 33 pisos, teatro 333, alberca 33.3.
- **Texcoco → Campo Militar No. 1** como sitio recomendado (suelo firme, federal, Metro); Texcoco queda como alternativa con penalizaciones.
- **Paneles del techo**: se quedan, pero cubren una fracción pequeña del consumo; la energía real entra por subestación propia y energía limpia contratada.
- **Costo**: irrelevante para elegir, visible para saber: orden de US$ 16,000–26,000 millones.

Las seis decisiones abiertas están en [PROYECTO.md §20](PROYECTO.md#20-decisiones-pendientes-de-ricardo).

## El modelo 3D

Three.js, 1 unidad = 1 metro, todo leído de `parametros.json`: si cambia un número, cambia el edificio.

- **Terreno** de 999 × 999 m con ~10,800 árboles instanciados de 9 especies (encino, pino, cedro, fresno, madroño, ahuehuete, jacaranda, colorín), plazas de tezontle, estación, Teatro 999 bajo su colina, canchas, lomas de energía, senderos cubiertos y la ciudad alrededor.
- **Edificio**: basamento de tezontle con los cuatro zaguanes, anillo de vidrio con pilares de piedra cada 11.1 m (dobles cada 33.3), la greca de 256 bahías en los pisos 24–31, el remate con cornisa, las cuatro torres de esquina con linterna, 33 losas interiores coloreadas por uso, 8 núcleos, los 4 parques de cielo con sus columnas y árboles, azotea con pista, paneles, Mirador 33 y helipuerto.
- **Parque interior**: el agua alrededor de la Casa, las cuatro calzadas con pérgola, ahuehuetes, colorines, la loma del Teatro 333 y la milpa.
- **Casa de Decisiones** de 11 + 7 m con portales de columnas sobre el agua y la linterna del Presidente de 22 m; la suite 3 × 3 por dentro (muros, mesas, el patio de la magnolia) se ve cortando la Casa a 9.5 m.
- **Teatros** con foyer de doble altura y restaurante debajo, abiertos todo el día.
- **Ambientes** día / atardecer / noche (ventanas encendidas), **meses** verde / marzo (jacarandas y colorines) / noviembre (cempasúchil), **capas**, **corte** con deslizador (losas por uso, los 11 sótanos, La Bóveda, el estacionamiento bajo el bosque), **fichas** al tocar 90 elementos, pantalla completa y descarga de imagen con nombre y fecha.
- **Cinco recorridos** con subtítulos: Vuelo, Del coche al escritorio (12 min), Del escritorio a la Casa (5 min), El ciudadano y Una decisión (11 min). Cuando la persona entra al edificio, el modelo se abre solo para seguirla.

## Publicar

```bash
./publicar.sh
```

Copia los documentos y los parámetros a `sitio/` y despliega el Worker `edificio-gobierno` (solo archivos estáticos) en edificio.capitaltorreon.com. Vista previa local: `npx wrangler dev --port 8797`. Imagen de la liga: `?og=1` quita la interfaz y fija la cámara (captura con Chrome sin ventana a 1200 × 630).
