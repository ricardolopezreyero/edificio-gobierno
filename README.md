# Edificio de Gobierno

**Modelo 3D: siguiente etapa** (esta versión es el razonamiento y la redacción del proyecto).

<!-- RLR · Ricardo López Reyero · EYE · 181218 -->

El edificio de gobierno perfecto para México: un **cuadrado de 333 m por lado y 33 pisos**, un anillo de oficinas de 33 m de fondo alrededor de un **parque de 7 hectáreas** con la **Casa de Decisiones** (la oficina del Presidente y sus seis salas conectadas) al centro, **11 sótanos** que terminan en **La Bóveda** de servidores, y **un bosque de 333 m** de ancho por cada lado. Para **30,000 personas**. Diseñado por inteligencia artificial para una sola cosa: que la comunicación fluya y las decisiones se tomen y se cumplan.

Proyecto de **Ricardo López Reyero**.

## Documentos

| Archivo | Qué es |
|---|---|
| [PROMPT.md](PROMPT.md) | El brief destilado: lo que se pidió, limpio, con la nota de lo que se cambió del dictado |
| [PROYECTO.md](PROYECTO.md) | El proyecto maestro: idea, correcciones honestas, 12 lineamientos, sitio, tablero del terreno, edificio, organización, Casa de Decisiones, programa con medidas, sótanos, llegada, seguridad, comunicación, materiales, vegetación, confort, 33 detalles, construcción, decisiones pendientes y plan del 3D |
| [modelo/parametros.json](modelo/parametros.json) | Todos los números del proyecto para construir el modelo 3D |

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

## Siguiente etapa

Modelo 3D (Three.js) construido desde `modelo/parametros.json`: terreno, edificio, parque, Casa de Decisiones con el carrusel en movimiento, corte vertical con La Bóveda y recorridos cronometrados.
