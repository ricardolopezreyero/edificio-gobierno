# El modelo: cómo está organizado el JSON y cómo se cambia

<!-- RLR · Ricardo López Reyero · EYE · 181218 -->

`parametros.json` es la **única fuente de verdad** del edificio. El 3D (`sitio/tres.js`), el plano y los números de la página (`sitio/app.js`) y el validador leen de ahí. Si un número cambia aquí, cambia en todos lados.

## Los tres archivos

| Archivo | Qué guarda | Quién lo lee |
|---|---|---|
| `parametros.json` | Todo lo que define el edificio: medidas primarias, organización, piezas colocadas en el terreno, textos de las fichas, colores y cámaras de la presentación | tres.js, app.js, validar.mjs |
| `recorridos.json` | Los recorridos del 3D (cámara, persona, subtítulos, cortes por paso) | tres.js, validar.mjs |
| `../sitio/derivados.js` | **Lo que se calcula** a partir de los primarios: patio, planta tipo, altura de cada piso, techo, torres, cajones, elevadores, bahías de la greca… | tres.js, app.js, validar.mjs |

## Las reglas del esquema

1. **Solo valores primarios.** El patio no se guarda: es `lado − 2 × anillo`. La planta tipo no se guarda: es `lado² − patio²`. Así nunca hay dos números que se contradigan. Lo derivado vive en `derivados.js` y se ve con `node modelo/validar.mjs`.
2. **Dominios, no un saco.** `meta · modulo_m · terreno · edificio · patio · casa_de_decisiones · sotanos · estacionamiento · movilidad · recintos · servicios · seguridad · vegetacion · agua · energia · materiales · metas · obra · decisiones_pendientes · presentacion · emplazamientos`. Cada cosa tiene un solo lugar.
3. **Unidades en el nombre.** `lado_m`, `sala_m2`, `tiempo_min`, `subestacion_kv`, `costo_usd_m`. Sin sufijo = metros.
4. **Ejes fijos.** x = oriente, z = sur, y = altura; origen en el centro del edificio a nivel de calle. Posiciones siempre como `pos_xz: [x, z]`, medidas como `medida_xz: [ancho, fondo]`.
5. **ids en snake_case sin acentos**, nombres con acentos. Las listas son arreglos de objetos con `id`, no objetos con llaves (así se puede agregar, ordenar y referir por id).
6. **Colores como `#rrggbb`** en texto. Pisos: PB = 0, S1…S11 bajo tierra.
7. **Los textos viven junto a su pieza.** La ficha que sale al tocar el Salón está en el emplazamiento del Salón; los subtítulos de un recorrido, en su paso.
8. **Validar antes de publicar.** `./publicar.sh` corre el validador; si algo no cuadra, no publica.

## Cómo se agrega una pieza al terreno

Una entrada en `emplazamientos` basta para que aparezca en el 3D, en el plano, con su ficha, con su etiqueta y con el bosque despejado alrededor:

```json
{
  "id": "vivero", "grupo": "sitio", "pos_xz": [-420, 120], "medida_xz": [60, 40],
  "etiqueta": { "texto": "Vivero", "y": 18, "ancho": 50 },
  "ficha": { "t": "Vivero", "c": "Donde nace el bosque: 20,000 árboles de 3 a 5 m el primer año de obra.", "d": [["Superficie", "2,400 m²"]] },
  "partes": [
    { "tipo": "caja", "medida_xz": [60, 40], "alto": 6, "y": 0, "material": "vidrio" },
    { "tipo": "caja", "medida_xz": [62, 42], "alto": 0.6, "y": 6, "material": "cantera" }
  ]
}
```

- `grupo`: `sitio` (fuera del edificio) o `patio` (dentro del anillo).
- `partes`: relativas a `pos_xz` (`dxz` desplaza una parte). Tipos: `caja`, `loma` (colina elíptica), `disco`, `anillo`, `columnas` (una hilera entre `desde` y `hasta`), `malla` (repite una caja `n_xz` veces cada `paso_xz`).
- `material`: `vidrio`, `piedra_pb`, `piedra_torre`, `cantera`, `recinto`, `tezontle`, `bronce`, `pv`, `asfalto`, `cancha`, `pista`, `pradera`, `bosque_suelo`, `milpa`, `blanco`.
- Una parte puede llevar `"ficha": "cabina"` para usar una ficha propia definida en `fichas` del mismo emplazamiento.
- Sin `etiqueta`, no hay letrero flotante. Sin `ficha`, no responde al clic.

## Cómo se cambia lo demás

| Quiero… | Toco… |
|---|---|
| Otro número de pisos, otro módulo, otra altura | `edificio.geometria`; todo lo demás se recalcula |
| Mover el 999 o el Salón | `pos_xz` de su emplazamiento |
| Cambiar qué pisos son de qué uso (y su color en el corte) | `edificio.usos` (deben cubrir PB…33 sin huecos; el validador lo revisa) |
| Otro esquema de elevadores | `edificio.nucleos.por_nucleo` y `lobbies` |
| Más árboles o otra mezcla de especies | `terreno.bosque.malla_siembra_m`, `vegetacion.mezcla_bosque`, `vegetacion.especies_3d` |
| Un recorrido nuevo | Un objeto más en `recorridos.json`; la `y` puede ser `"piso(25)+1.2"` |
| Otro ambiente, mes o cámara inicial | `presentacion` |
| Un sector, una secretaría | `edificio.sectores`; las esquinas se refieren a ellos por `id` |

## Comandos

```bash
node modelo/validar.mjs
```

```bash
./publicar.sh
```

Al cambiar `tres.js` o `app.js`, subir `VER` en `app.js` (el navegador cachea).
