<!-- RLR · Ricardo López Reyero · EYE · 181218 -->
# Edificio de Gobierno · Proyecto ejecutivo

**Versión 2 · 8 de noviembre de 2026 · Para quien lo va a construir**

Un cuadrado de **333 m por lado y 33 pisos**, un anillo de oficinas de **33.3 m** de fondo alrededor de un parque de **7.1 hectáreas**, y al centro del parque la **Casa de Decisiones**. Debajo, **11 sótanos** que terminan en **La Bóveda**. Alrededor, **un bosque de 333 m** de ancho por cada lado, con veredas en malla de 111 m, una estación de Metro y tren, un helipuerto, dos banderas, dos teatros, un salón de eventos y el Cuartel de las fuerzas de seguridad. Todo sobre una sola retícula de **11.1 m**, repetida a tres escalas.

Para **30,000 personas** que trabajan, deciden y ejecutan, y para los ciudadanos que vienen a ser escuchados.

---

## Cómo leer este documento

Está escrito para ejecutarse. Cada capítulo sigue el mismo orden: **qué es, por qué, cuánto mide, cómo se hace**, y cierra con un recuadro **Para ejecutar** con los entregables y el criterio de aceptación de esa parte. Las reglas van en tablas; las razones, en un párrafo. Lo que no está aquí, está en los números del modelo.

| Quién | Qué le toca leer primero |
|---|---|
| Dirección del proyecto | Resumen, §1 lineamientos, §16 construcción, §17 decisiones pendientes |
| Arquitecto | §4 terreno, §5 edificio, §6 interiores, §7 Casa, §8 recintos, §13 materiales |
| Estructurista y geotecnia | §3 sitio, §5 estructura, §9 sótanos, §16 método |
| Paisajista | §4 bosque y veredas, §14 plan de siembra y agua |
| Ingenierías (MEP) | §9 planta, §10 movilidad, §15 confort, §12 sistemas |
| Seguridad | §11 completo, §7 Casa, §9 Bóveda y continuidad |
| Tecnología | §12 sistemas, §9 La Bóveda, §8 cabinas |
| Mobiliario e interiores | §6 completo |

**La fuente de los números** es `modelo/parametros.json` (esquema explicado en `modelo/README.md`). Lo que se puede calcular (patio, planta tipo, alturas, cajones, elevadores, mobiliario) lo calcula el modelo; este documento cita esos resultados. Si un número de aquí y uno del modelo difieren, manda el modelo. El 3D en **edificio.capitaltorreon.com** muestra cada pieza con su ficha, el corte por pisos, el interior amueblado y seis recorridos.

**Convenciones.** Medidas en metros salvo que se diga otra cosa. Ejes: x al oriente, z al sur, y la altura; origen en el centro del edificio a nivel de calle. Pisos: PB = 0; S1…S11 bajo tierra. Módulo: 11.1 m. Lados por su orientación: Norte, Sur, Oriente, Poniente.

---

## Resumen ejecutivo

| Dato | Valor |
|---|---|
| Personas | 30,000 empleados · ~3,000 de operación de la casa · hasta 10,000 visitantes al día · ~1,800 en el Cuartel |
| Terreno | 999 × 999 m (99.8 ha): tablero de 3 × 3 celdas de 333 m |
| Edificio | Cuadrado de 333 × 333 m, anillo de 33.3 m, patio de 266.4 m; 33 pisos (techo a 159.5 m, torres a 170.5 m) |
| Superficie | 39,920 m² por planta · 1,317,000 m² sobre el suelo · 110,889 m² por sótano |
| Arquitectura | Basamento de tezontle (PB + 3 pisos), 4 zaguanes, 4 torres de esquina, la greca (256 bahías), remate con cornisa |
| Centro | Casa de Decisiones 99 × 99 m: planta baja 11 m + planta alta 7 m, suite 3 × 3, linterna del Presidente a 22 m, portales sobre el agua |
| Sótanos | 11 niveles (~50 m): llegada, estacionamiento, planta, continuidad, La Bóveda (9 m, 4 cuadrantes, 50 → 250 MW) |
| Movilidad | 176 elevadores (lobbies en 11, 22 y 33), estación de Metro y tren con Rampa Norte, 6 plataformas de helicóptero, bandas donde el flujo es masivo |
| Estacionamiento | ~39,000 cajones (30 % de margen): 29,600 bajo el bosque con 36 patios de luz, 7,400 bajo el edificio, 2,000 bajo la plaza Sur |
| Interiores | 8 piezas de mobiliario acomodadas por regla: 30,940 mesas, 68,636 sillas, 6,744 separadores de vidrio con persiana, 5,636 bancas; ~600 bloques de baños |
| Recintos | Teatro 333 y Teatro 999 con foyer, restaurante, cabina y bodega; Salón de Eventos de 2,904 m²; Cuartel de 9 pisos con C4 por fuerza, C5 y Cuarto de Guerra; polvorín |
| Bosque | ~78 ha, 15,000–20,000 árboles nativos sembrados por plan de zona; veredas cada 111 m; jardineras, manchas de flor, macetas |
| Vida útil de diseño | 200 años |
| Obra | ~7 años; el bosque y el Teatro 999 abren en el año 3; primer lado ocupado en el año 5 |
| Orden de magnitud | US$ 16,000 a 26,000 millones (§16); operación anual US$ 400 a 600 millones |

---

## 1. La idea y los lineamientos

### 1.1 El cuadrado

Un círculo no tiene principio ni fin: es la forma de la creatividad y por eso le queda a Apple. Un cuadrado tiene cuatro lados iguales, cuatro esquinas, un centro exacto y una orientación: es la forma de la **estructura**. Por eso el edificio del gobierno de México es un cuadrado, y por eso todo en el proyecto es cuadrado: el terreno, el edificio, el patio, la Casa, la oficina del Presidente, la retícula y hasta las celdas del estacionamiento.

### 1.2 Un tablero a tres escalas

| Escala | Celda | Total | Al centro |
|---|---|---|---|
| El terreno | 333 m | 999 × 999 m | El edificio |
| El edificio | 11.1 m (retícula) | 333 × 333 m | El parque y la Casa de Decisiones |
| La suite de decisión | 11.1 m (una sala) | 33.3 × 33.3 m | La oficina del Presidente |

Quien entra por el bosque, cruza el anillo, camina la calzada y llega a la sala del Presidente recorre tres veces el mismo tablero. Eso significa «hecho por una inteligencia artificial»: una sola regla ordena todo.

### 1.3 El centro, no la cima

El Presidente no está en el piso 33: está al centro, a nivel del suelo, en medio de un parque, equidistante de los cuatro lados del gobierno. Los pisos altos son para quienes coordinan; el centro es para quien decide.

### 1.4 La geometría es el organigrama

- **Cada lado del cuadrado es un sector**: Norte Personas, Oriente Orden, Sur Economía, Poniente Territorio.
- **Cada esquina es donde dos sectores se tocan**: las oficinas de esquina, en las torres, son de los superdirectores que coordinan dos sectores.
- **La altura es el rango**: abajo más gente y operación; arriba menos gente y decisión.
- **El centro es la decisión**: cuatro calzadas llevan en menos de 5 minutos de cualquier lado a la Casa.

### 1.5 Los 12 lineamientos

1. **Una regla, tres escalas.** Retícula de 11.1 m; lo que no cabe en la retícula no se construye.
2. **La geometría es el organigrama.** Lado = sector, esquina = coordinación, altura = rango, centro = decisión.
3. **Nadie a más de 5 minutos de una decisión.** De cualquier escritorio a la Casa: un elevador, una calzada.
4. **Todo cuarto es una sala de juntas.** Cámara, pantalla y micrófono en cada espacio cerrado; la junta empieza al entrar.
5. **Luz natural en todo escritorio**, y de lado: ningún puesto a más de 15 m de una ventana, ninguno de frente a ella.
6. **Baño a menos de 40 m, café a menos de 60 m, lugar libre a menos de 30 m, parque a menos de un elevador.**
7. **La puerta no se abre, pero alguien te acompaña.** Seguridad por zonas, invisible para quien tiene permiso.
8. **Doscientos años.** Cada material por su durabilidad; cada instalación reemplazable sin demoler.
9. **Mexicano en la piel.** Piedra volcánica, maderas certificadas, talavera, barro, textiles; especies de aquí.
10. **El bosque es de la ciudad.** Las 78 ha, el Teatro 999 y el Salón son públicos; el perímetro empieza en las plazas.
11. **El edificio aprende.** Cada queja, cada junta y cada puerta son datos que llegan a La Fábrica, a una escalera de quienes deciden.
12. **La construcción es parte del diseño.** Prefabricado, cuatro frentes en paralelo, un solo modelo digital; el bosque se planta el primer día.

### 1.6 Correcciones al brief original

El proyecto nació de un dictado (ORIGEN.md). Estas son las cosas que se cambiaron y por qué; el resto está construido sobre ellas.

| Se dijo | Se hizo | Por qué |
|---|---|---|
| 33 pisos subterráneos de oficinas | 11 sótanos (~50 m) sin oficinas de personas | Sin precedente a 120 m; sin luz; evacuación inviable. El 33 vive arriba: 333 m, 33 m, 33 pisos |
| Texcoco | Campo Militar No. 1 recomendado; Texcoco como alternativa | Zona de lago, hundimiento, área natural protegida |
| Estacionamiento para los 30,000 | ~39,000 cajones bajo el bosque y el edificio | Caben en 2 niveles bajo las esquinas; invisibles y convertibles |
| Paneles que alimenten el edificio | Paneles con su tamaño real (~5 MW, menos del 5 %) | La energía entra por subestación y contratos limpios |
| Presupuesto irrelevante | Irrelevante para elegir; visible para saber (US$ 16–26 mil millones) | Cambia la conversación pública y el calendario |
| «Departamento de monetización» | Valor y Estudios | Misma función, nombre que un ciudadano entiende |
| Aeropuerto propio | Helipuerto de 6 plataformas; los aeropuertos de la ciudad a 12–20 min de vuelo | Como se concluyó en el dictado |

> **Para ejecutar.** Entregable: este capítulo firmado como *programa arquitectónico y lineamientos* del concurso. Aceptación: ninguna decisión de diseño posterior contradice un lineamiento sin una nota que lo explique y la firma de la dirección del proyecto.

---

## 2. El sitio

### 2.1 Criterios

| Criterio | Por qué |
|---|---|
| ~100 ha continuas | El tablero de 999 × 999 m completo |
| Suelo firme (zona I del Reglamento de Construcciones de la CDMX) | 11 sótanos y una torre de 160 m sin pelear con el lago |
| Propiedad federal | Sin expropiar familias |
| A 30 min del centro histórico y de los dos aeropuertos | Palacio Nacional, Congreso y Suprema Corte siguen donde están |
| Transporte masivo a menos de 1 km | La mitad de la gente llega sin coche |
| Acuífero por debajo | Para recargar lo que llueve |

### 2.2 Opción A (recomendada): Campo Militar No. 1, Naucalpan / Miguel Hidalgo

Suelo firme de lomas (tobas y arenas); terreno federal de cientos de hectáreas (**confirmar polígono disponible**); lo que «se quita» son instalaciones militares que se reubican, no colonias. Periférico y Metro Cuatro Caminos al lado; Tren Suburbano cerca. Vecino de Chapultepec: el bosque del complejo se une al corredor verde del poniente.

### 2.3 Opción B: ex terrenos del aeropuerto de Texcoco

A favor: enorme, federal, plano, simbólico. En contra, y pesa más: arcillas de lago, hundimiento regional de decenas de centímetros al año, nivel freático a 2–3 m; los sótanos se reducirían a 2 o 3 niveles sobre cimentación compensada con pilotes de más de 60 m; y desde 2022 es área natural protegida. Si se elige, el proyecto pierde los 11 sótanos y La Bóveda profunda.

### 2.4 Orientación y clima

Lados a los puntos cardinales. Latitud 19.4° N: sol de mediodía casi vertical en verano, al sur en invierno. Fachada Sur con alero profundo; Oriente y Poniente con lamas más cerradas; Norte, la más abierta. Altitud 2,240 m; lluvia 800 mm, de junio a septiembre; heladas ocasionales.

> **Para ejecutar.** Entregables: estudio de mecánica de suelos a 80 m con 33 sondeos en malla de 111 m; levantamiento topográfico y de servicios; estudio hidrológico (acuífero, recarga, escurrimientos); dictamen de uso de suelo y ambiental. Aceptación: capacidad de carga y módulo de deformación compatibles con 11 sótanos y 170 m; nivel freático por debajo de −55 m o plan de control de agua aprobado.

---

## 3. El terreno: el tablero de 999 × 999 m

Nueve celdas de 333 × 333 m. El edificio ocupa la central. Las otras ocho son bosque con usos escondidos debajo o entre los árboles.

```
+-----------+-----------+-----------+
|  NP       |    N      |  NE       |
|  bosque   |  Puerta   |  bosque   |
|  + estac. |  Norte    |  + estac. |
+-----------+-----------+-----------+
|   P       | EDIFICIO  |    O      |
|  Puerta   |  333×333  |  Puerta   |
|  Poniente |  + parque |  Oriente  |
+-----------+-----------+-----------+
|  SP       |    S      |  SE       |
|  bosque   |  Puerta   |  bosque   |
|  + estac. |  Sur      |  + estac. |
+-----------+-----------+-----------+
```

### 3.1 Las celdas

| Celda | Qué tiene |
|---|---|
| **Centro** | El edificio, el parque interior, la Casa de Decisiones, el Teatro 333 bajo una loma |
| **Puerta Norte** (la de la ciudad y del cielo) | Plaza de 99 × 99 m, **Gran Estación** de Metro y Tren con la **Rampa Norte**, las **dos banderas** de 111 m, el **Helipuerto** de 6 plataformas con pabellón de llegada, Casa del Ciudadano Norte, jacarandas |
| **Puerta Sur** (abierta a la ciudad) | Plaza, **Teatro 999** bajo su colina con foyer y restaurante, **Salón de Eventos** unido por la galería, bodegas y máquinas del Sur, 2,000 cajones de visitantes bajo la plaza |
| **Puerta Oriente** (el Orden) | Plaza de prensa y visitas oficiales, **El Cuartel** (110 × 44 m, 9 pisos) con helipuerto en su techo, el **polvorín** bajo su montículo, la **subestación** de 400 kV y la planta de enfriamiento de La Bóveda en lomas con bosque |
| **Puerta Poniente** | Plaza, **canchas** (8 pádel, 6 tenis, 2 fútbol rápido, 4 básquet), pista de 5 km, rampa de logística al S1, vivero de obra |
| **Cuatro esquinas** | Bosque denso sobre **2 niveles de estacionamiento** (221,778 m², ~7,400 cajones por esquina) con 9 patios de luz cada una; sendero cubierto con bandas de 333 m al edificio |

**Emplazamientos exactos** (centro en metros desde el centro del edificio; x oriente, z sur): estación (0, −430) 240 × 60; Rampa Norte (0, −332) 22 × 135; banderas (±66, −300); helipuerto (255, −405) 200 × 130; Teatro 999 (0, 400) colina 224 × 164; foyer 999 (0, 324); restaurante 999 (0, 312); Salón (103, 314) 66 × 44; galería (57.5, 322); bodegas Sur (124, 362) 40 × 24; canchas (−400, −20); Cuartel (395, −70) 110 × 44; polvorín (460, −150); energía (430, 110); Teatro 333 (60, 105) loma 76 × 54; foyer 333 (60, 70); bodega 333 (110, 112); milpa (−80, −90) 33 × 33. Todos en `emplazamientos` del modelo.

### 3.2 Las plazas y los zaguanes

Cuatro plazas de **99 × 99 m de tezontle** pegadas al centro de cada lado. De cada plaza, el **zaguán** (paso de 11.1 × 11 m con portal de 20 m) atraviesa el anillo: desde la plaza se ve el parque y la linterna del Presidente. Jacarandas en los bordes, cuatro jardineras circulares de agaves y dalias, macetas de barro con palma cada 6 m, cuatro bancas por lado.

### 3.3 Las veredas: juntas caminando

Muchas juntas se hacen caminando. Para que sea eficiente, las veredas tienen formato:

| Regla | Medida |
|---|---|
| Malla | La misma de 111 m de los patios de luz, sobre las ocho celdas, en los dos sentidos; interrumpida solo donde hay una pieza |
| Vereda | 2.2 m de tepetate compactado, drenada, luz de 3 m hacia abajo |
| Cruces | Poste de bronce con nombre (lado y número, «N2·O3») y minutos a cada puerta; dos bancas de frente |
| Orilla | Tejocote y capulín cada 11.1 m; una banca cada 55 m |
| Tiempos | Cuadra 111 m = 1.4 min · junta de 11 min = dos cuadras de ida y dos de vuelta · circuito de 11 = una manzana de 2 × 2 · de 22 = 2 × 4 · de 33 = la vuelta a una celda |
| Lo rápido | Los senderos de las esquinas (con bandas) y la Rampa Norte; la malla es la lenta, la de pensar |

### 3.4 El anillo vial y los accesos

La vialidad existente rodea las nueve celdas (24 m). Entra al terreno solo por cuatro rampas helicoidales dobles a los estacionamientos de esquina, la rampa de logística del Poniente al S1, la entrada del Cuartel por el Oriente y la de la estación. Dentro del terreno no circulan coches: solo personas, bicicletas, bandas y carritos eléctricos.

> **Para ejecutar.** Entregables: plano de conjunto 1:2000 con las nueve celdas, cotas de los emplazamientos y rasantes; plano de veredas con numeración de cruces; proyecto vial de rampas y accesos. Aceptación: ninguna pieza fuera de su celda ni a menos de 6 m de una vereda; cada cruce de la malla nombrado y señalizado; aproximación del helipuerto libre de obstáculos desde el norte.

---

## 4. El edificio

### 4.1 Geometría

| Elemento | Medida |
|---|---|
| Lado exterior | 333.0 m |
| Fondo del anillo | 33.3 m (3 módulos) |
| Patio interior | 266.4 × 266.4 m = 70,969 m² |
| Planta tipo | 39,920 m² |
| Retícula | 11.1 × 11.1 m; 30 módulos por lado, 3 de fondo |
| Pisos | 33 sobre el suelo + 11 sótanos |
| Planta baja | 11.0 m |
| Piso tipo | 4.5 m de piso a piso, 3.6 m libres |
| Pisos técnicos | 11 y 22, con entrepiso de instalaciones de 2.2 m |
| Techo | 159.5 m; torres a 170.5 m |
| Pisos de refugio | 8, 17 y 25 |
| Sobre el suelo | 1,317,000 m²; sótanos 1,220,000 m²; estacionamientos de esquina 887,000 m² |

Referencia: el Pentágono tiene ~604,000 m² para ~23,000 personas. Aquí hay el doble para 30,000, porque además de oficinas hay mercados, gimnasios, teatros, parques de cielo, guarderías y pisos de 3.6 m libres. La holgura es a propósito: cabe crecer a 40,000 sin construir nada.

### 4.2 Estructura

- **Cimentación**: muro Milán de 1.2 m de espesor a ~60 m de profundidad; losa de fondo de 3 m; construcción **top-down** (se construye la losa de planta baja y se excava hacia abajo mientras se sube).
- **Superestructura**: columnas compuestas de acero y concreto C70 en retícula de 11.1 m; **8 núcleos** de muros de concreto (4 en las torres de esquina, 4 al borde de cada parque de cielo) con vigas de acople y amortiguadores viscosos; losas postensadas de 28 cm.
- **Sismo**: núcleos duales con amortiguadores; juntas sísmicas a mitad de cada lado (el anillo se comporta como ocho edificios ligados por los parques de cielo y las esquinas); **aislamiento de base** completo para la Casa de Decisiones y los racks de La Bóveda. Meta: operación continua tras un sismo como el de 1985 o 2017, no solo «no colapsar».
- **Parques de cielo**: las columnas atraviesan el vacío; no hay megaestructura. Solo faltan las losas de los pisos 16, 17 y 18 en 99 m de cada lado.
- **Torres de esquina**: tres módulos por lado, salen 5.5 m de las dos fachadas y suben 11 m sobre el techo; el núcleo de esquina va dentro.

### 4.3 Fachada y arquitectura

Basamento, cuerpo y remate, como los palacios de la ciudad; cada pieza sale de la retícula y de la organización.

| Pieza | Medida | Qué cuenta |
|---|---|---|
| **Basamento** | PB y pisos 1–3 (hasta 24.5 m) en tezontle rojo con marcos de cantera; el vidrio empieza en el piso 4 | Abajo está lo público: la piedra dice «esto es de todos» |
| **Zaguanes** | 4; paso de 11.1 × 11 m; portal de tezontle de 20 m por fuera y por dentro | Desde la plaza se ve la Casa: la decisión se ve desde la calle |
| **Cuerpo** | Piel ventilada de recinto negro y cantera gris de 60 mm sobre paneles UHPC; triple vidrio de 3.6 m, electrocrómico en S, E y O; lamas verticales de bronce; pilares de cantera cada 11.1 m, dobles cada 33.3 | Luz en todo escritorio; el 33 se ve en la fachada |
| **Torres de esquina** | 4; 38.8 × 38.8 m con el vuelo; hasta 170.5 m; linterna de vidrio de 6 m | Los superdirectores hechos volumen; un cuadrado que se reconoce desde lejos |
| **La greca** | Pisos 24–31: una de cada tres oficinas sale 2.2 m, en diagonal (regla: módulo + piso múltiplo de 3); 256 bahías con marco de bronce | Textura que nace del rango; sombra propia |
| **Remate** | Pisos 32–33 salen 2.2 m con cornisa de bronce de 4 m de vuelo | Cierra la composición; el gabinete se marca desde fuera |
| **Marcos** | Bronce de 1.4 m alrededor de cada parque de cielo | La ventana más grande del país, una por lado |

Lo que **no** se hace: curvas o formas paramétricas, salientes al azar, escalonar como pirámide, lados distintos, voladizos de más de un módulo, ornamento aplicado, muro ciego arriba.

### 4.4 Los pisos

| Pisos | Uso | Personas por piso | Cómo es |
|---|---|---|---|
| PB | Casas del Ciudadano (banda exterior), comedores (banda interior), vestíbulos, compuertas, zaguanes | — | 11 m de altura |
| 1–3 | Público y servicios: comedores, guarderías, clínica, banco, lavandería, biblioteca de servicios | — | Dentro del basamento de piedra |
| 4–13 | Operación | 1,500 | Islas de 4, barrios de 8, manzanas de 33 |
| 11 y 22 | Pisos técnicos | — | Con entrepiso de instalaciones |
| 14–23 | Mandos medios y proyectos | 1,000 | Una isla y la mesa del jefe de barrio |
| 16–18 | Parques de cielo (al centro de cada lado) · piso 17 cintura: sky lobby, Mercados, gimnasios, refugio | — | Vacío de 99 × 33.3 × 13.5 m |
| 24–29 | Direcciones generales, subsecretarías | 500 | Tres oficinas por módulo con separadores de vidrio |
| 30–31 | La Fábrica (ingeniería central) | 1,000 | Dos islas por módulo, más salas; escaleras abiertas al gabinete |
| 32–33 | Gabinete y coordinadores de sector | 250 | Una oficina por módulo; esquinas del 33 para los cuatro coordinadores |
| Torres | Oficinas de esquina (superdirectores) | 4 por piso | Mesa, sala de 8, banca, terraza |
| Azotea | Pista de 1.2 km, paneles, jardines, Mirador 33, helipuerto de emergencia | — | — |

Suma: 10 × 1,500 + 10 × 1,000 + 10 × 500 = 30,000.

### 4.5 Los 8 núcleos y los tres lobbies

El edificio se divide en tres zonas de 11 pisos con lobby de cambio en el **11, el 22 y el 33** (y parada en el 17).

| Tipo | Por núcleo | Total |
|---|---|---|
| Lanzaderas de doble cabina (paran solo en PB, 11, 17, 22, 33) | 6 | 48 (96 cabinas) |
| Locales (sirven su zona de 11 pisos; máximo 5 pisos de viaje) | 4 × 3 zonas | 96 |
| Servicio | 2 | 16 |
| Bomberos y evacuación (presurizados) | 2 | 16 |
| **Total** | 22 | **176 elevadores · 224 cabinas** |

Despacho por destino; cualquier piso desde la planta baja en menos de 90 s; los 30,000 suben en 26 minutos. Cada núcleo: 2 escaleras presurizadas, 2 bloques de baños, cuarto de limpieza, ducto de basura en 4 fracciones, cuarto de red. Entre cada tres pisos, por lado, una escalera abierta con luz natural. Los núcleos de medio lado dan al parque de cielo en el 17; los de esquina están dentro de las torres.

### 4.6 Los parques de cielo

Al centro exacto de cada fachada, los pisos 16, 17 y 18 desaparecen en 99 m: un vacío de **99 × 33.3 × 13.5 m** abierto al bosque y al parque, con las columnas atravesándolo como troncos de piedra. 1.2 m de tierra sobre losa impermeable; encinos bajos, fresnos, tejocotes, magnolias; cortaviento de vidrio de 2.4 m; bancas, mesas de piedra, tomas de luz, red y agua para juntas al aire libre; un café; en el Poniente, el muro de escalada de 13.5 m.

### 4.7 La azotea

Pista de correr de **1,200 m** por el perímetro; paneles solares bifaciales sobre pérgolas caminables en ~24,000 m² (~5 MWp); jardines de sedum, echeveria y agave; bancas cada 55 m junto a la pista; el restaurante **Mirador 33** en la linterna de la torre Nororiente; helipuerto de emergencia en el techo del lado Sur; calistenia al aire libre en la esquina Surponiente.

> **Para ejecutar.** Entregables: proyecto arquitectónico completo (plantas tipo por uso, cortes, fachadas, detalles del basamento, zaguanes, torres, greca y remate); proyecto estructural con memoria sísmica y pruebas de los amortiguadores; proyecto de fachada con prototipo a escala real de dos módulos por tres pisos probado a agua, viento y sismo. Aceptación: planta tipo de 39,920 m² ± 0.5 %; 3.6 m libres medidos bajo plafón; prototipo de fachada aprobado antes de fabricar; análisis de tráfico vertical que cumpla 90 s a cualquier piso y 26 min para 30,000.

---

## 5. Interiores: mobiliario, baños, salas y servicios

### 5.1 Las tres bandas

El anillo de 33.3 m se parte en tres bandas de 11.1 m. La **exterior** (ventana al bosque) y la **interior** (ventana al parque) llevan las mesas. La **media** lleva cubículos, salas, estancias, baños y núcleos, en un patrón de cuatro módulos (la manzana) que se repite a lo largo de cada lado.

### 5.2 Ocho piezas para todo

Poca variedad y acomodo total: la misma mesa, la misma silla, el mismo cubículo y la misma banca en todo el edificio y en el bosque. Lo que cambia es la regla.

| Pieza | Medida | Qué es |
|---|---|---|
| **Mesa de trabajo** | 1.8 × 0.9 m | Tablero de encino de 40 mm sobre dos paneles de acero; sube y baja (72–118 cm) con memoria; brazo de monitor; un cajón; energía y red en la mesa. Dos juntas son la mesa del comedor |
| **La silla** | 0.5 × 0.5 × 0.9 m | Malla y lana de Oaxaca sobre acero, reclina, regulable; una sola silla para trabajo, juntas y comedor |
| **Cubículo de llamada** | 2.0 × 2.0 × 2.4 m | Vidrio acústico y encino, ventana al parque, ventilador silencioso; 1 o 2 personas |
| **Mesa de junta** | 2.4 × 1.2 (4) · 4.2 × 1.4 (8) · 6.6 × 1.6 (12) | Una sola pieza de parota con orilla viva; tres tamaños del mismo tablero |
| **Mesa redonda** | Ø 1.6 m | Piedra de una pieza, dos sillas iguales: Casa del Ciudadano, cafés y estancias |
| **La butaca** | 0.65 m, paso 1.10 | Piel vegetal, tzalam, ventilación individual, micrófono, USB-C |
| **La banca** | 2.2 × 0.45 × 0.45 m | Encino de 60 mm sobre dos patas de recinto; la misma afuera y adentro |
| **Separador de vidrio con persiana** | 2.4 m de alto | Vidrio acústico de piso a 2.4 m sin tocar el plafón, persiana de lamas de encino integrada |

### 5.3 La regla de acomodo (ergonomía)

Máxima comodidad para poder pedir el máximo rendimiento: luz de lado, silencio, verde a la vista y un lugar libre a menos de 30 m.

| Regla | Medida |
|---|---|
| Luz de lado | Las mesas van **perpendiculares a la ventana**, en islas de cuatro: nadie tiene la ventana de frente (deslumbra) ni de espalda (refleja) |
| Isla de 4 | 1.8 × 3.6 m; dos pares espalda con espalda; sillas hacia afuera; una maceta al final |
| Pasillos | 1.8 m entre islas; 2.2 m detrás de la fila, con la banca del barrio |
| Separadores | Uno en cada borde de módulo (entre barrio y barrio) en las dos bandas, y entre oficina y oficina; la persiana la mueve cada barrio |
| Estancia | Una por manzana (cada 4 módulos) en la banda media: 2 bancas de frente, 1 mesa redonda, 2 macetas, sin pantallas |
| Unidades | isla 4 · barrio 8 (un módulo) · manzana 33 (cuatro barrios con su jefe, su estancia y sus separadores) |
| Ambiente | 3.6 m libres, 500 lux en la mesa, 35 dB, 40 m³/h de aire por persona, ventana que abre |
| Orden | Todo alineado a la retícula de 11.1 m: lo que se ve ordenado, se siente natural |

| Pisos | Bandas de ventana (por módulo) | Banda media (manzana de 4 módulos) |
|---|---|---|
| PB | Afuera: 4 mesas redondas con dos sillas (99 por puerta) · Adentro: 2 mesas dobles de comedor con 8 sillas | Vestíbulos, compuertas, cafés |
| 1–3 | 2 mesas dobles de comedor por banda | Guarderías, clínica, servicios |
| 4–13 | **Dos islas de 4** (8), maceta por isla, banca por barrio | Cubículos (4) · sala de equipo (8) · estancia · sala de charla (4) + 2 cubículos |
| 14–23 | **Una isla de 4** y la mesa del jefe de barrio con su maceta | Sala de equipo · cubículos · estancia · sala de equipo |
| 24–29 | **3 oficinas** de 41 m² separadas por vidrio con persiana: mesa perpendicular a la ventana, dos sillas de visita, maceta | Sala de consejo (12) · cubículos · estancia · sala de charla |
| 30–31 | Dos islas de 4 | Sala de equipo · estancia · cubículos · sala de equipo |
| 32–33 | **1 oficina** de Secretario por módulo: mesa, sala de 8, maceta | Sala de consejo · estancia · sala de consejo · cubículos |
| Torres | Una mesa, una sala de 8, una banca, la terraza | — |

**Contado por el modelo:** 30,940 mesas · 68,636 sillas · 3,360 cubículos · 1,756 mesas de junta · 924 redondas · 1,332 butacas · 5,636 bancas · 6,744 separadores. Una mesa por persona; nadie busca silla.

### 5.4 Salas de juntas

Una sala por cada 11 personas (~2,700), todas con cámara, pantalla, micrófono y reserva desde la puerta: cabina (2), charla (4), equipo (8), consejo (12), mesa (16), aula (24), sala 33, auditorio de piso (99, uno cada tres pisos por lado), salas al aire libre en parques de cielo y azotea, sala de situación de sector (piso 33, una por lado), y las de la Casa.

### 5.5 Baños

Regla única: **nadie hace fila y nadie camina más de 40 m.**

| Bloque tipo (66 m²) | Cuántas |
|---|---|
| Cabinas completas (inodoro con asiento lavador, lavabo de piedra, repisa, gancho, puerta de piso a techo, ventilación propia; sin género) | 8 |
| Sala de mingitorios | 4 + 2 lavabos |
| Cabina accesible grande (grúa de techo en los bloques de medio lado) | 1 |
| Familiar y cambiador | 1 |
| Lactarios (en los bloques de medio lado) | 2 por piso |

| Lugar | Bloques |
|---|---|
| Cada piso de oficinas | 16 (dos por núcleo) + 4 intermedios en los pisos de 1,500 |
| Planta baja y Casas del Ciudadano | 4 bloques triples, públicos |
| Parques de cielo y Mercados | 2 bloques dobles por parque |
| Azotea | 4 |
| Teatros | 1 mueble por cada 15 butacas, dos de mujeres por cada uno de hombres |
| Salón de Eventos | 2 bloques dobles + 1 por cada tercio |
| Casa de Decisiones | Baños de Estado: uno por sala; bloques en planta alta y salas de espera |
| Estación, helipuerto, Cuartel | 2 bloques dobles cada uno |
| Estacionamientos | 1 bloque por patio de luz (36) |

Suma: **~600 bloques y ~8,000 muebles**; 1 por cada 7 personas (el reglamento pide 1 por cada 25–40). Semáforo de cabinas libres en la entrada y en el teléfono; pasillo técnico a la espalda (se reparan por atrás); limpieza cada 2 horas con registro; 15 renovaciones de aire por hora; inodoros de 3 litros con agua tratada; piso de recinto, muros de talavera (una paleta por lado), lavabo de mármol, bronce. Los ~600 bloques se fabrican completos en planta.

### 5.6 Comer

| Lugar | Dónde | Capacidad |
|---|---|---|
| 4 Mercados de los 32 estados | Piso 17, uno por parque de cielo | 1,200 asientos cada uno, 3 turnos; 8 puestos por mercado, uno por estado, más el 33 de la casa |
| 4 Comedores de planta baja | Banda interior de PB, con terraza al patio | 1,000 asientos cada uno |
| 33 cafés de piso | Uno por piso junto al núcleo de medio lado | 40 asientos; barista, fruta, agua, pan |
| 4 restaurantes del bosque | PB en las esquinas | 120 asientos |
| Restaurantes de los teatros | Bajo cada foyer | 120 (333) y 300 (999), abiertos todo el día |
| 4 cafeterías de la estación | Esquinas del vestíbulo | 120 cada una; pedido desde el tren |
| Cafetería del helipuerto | Pabellón de llegada | 60 |
| Mirador 33 | Linterna de la torre NE | 150 |
| Comedor de Estado | Casa de Decisiones | 99 |
| Cocina central | S1 | 40,000 comidas al día |

Capacidad en hora de comida: 26,400 en mercados y comedores; todos comen bien sin salir.

### 5.7 Los 12 gimnasios

1 alberca de 33.3 m (PB Sur, calentada con el calor de La Bóveda) · 2 fuerza (17 Norte) · 3 cardio con cielo (17 Sur) · 4 funcional (17 Oriente) · 5 yoga y movilidad (17 Poniente) · 6 box y artes marciales (PB Oriente) · 7 muro de escalada de 13.5 m (parque de cielo Poniente) · 8 ciclismo indoor y vestidores de ciclistas (S1) · 9 baile (PB Norte) · 10 recuperación en 4 nodos (piso 17) · 11 pista de 1.2 km y calistenia (azotea) · 12 canchas al aire libre (Puerta Poniente).

### 5.8 Servicios

4 guarderías de 333 niños (PB, una por lado, con jardín al bosque) · clínica con urgencias 24 h, dental, salud mental y farmacia, más enfermerías en 8, 17, 25 y 33 · banco y correo · lavandería, sastre, zapatero, barbería · biblioteca de 2,000 m² (17 Norte) · biciestacionamiento de 10,000 (S1) · 11 camas de siesta por piso · 2 lactarios por piso · capillas de silencio · ventanilla del empleado en cada Casa del Ciudadano.

### 5.9 La Casa del Ciudadano

Una por lado, en la banda exterior de la planta baja: **99 mesas redondas** de piedra con dos sillas iguales, sin mostrador. Cita desde el teléfono o en los tótems de la plaza, sin fila; tiempos publicados. Cada caso entra al Tablero y llega al mismo tiempo a tres lados: el área responsable (con dueño y fecha), Sistemas (los ingenieros de piso) y Valor y Estudios. Ocho salas de audiencia de 33 por Casa para grupos; el funcionario baja, nunca sube el ciudadano.

> **Para ejecutar.** Entregables: planta amueblada de cada tipo de piso (PB, público, operación, mandos, dirección, Fábrica, gabinete) a 1:200; fichas técnicas de las ocho piezas con prototipo aprobado; proyecto de baños con el bloque tipo prefabricado y su pasillo técnico; proyecto de cocinas. Aceptación: ninguna mesa de frente a una ventana; separador en cada borde de módulo; ningún escritorio a más de 40 m de un baño ni a más de 30 m de una estancia; conteo del modelo ± 2 %.

---

## 6. La Casa de Decisiones

Al centro exacto del parque. **99 × 99 m**, planta baja de **11 m**, planta alta de **7 m**, un sótano; techo verde que continúa el parque; **portales**: columnata de 11 m y 3.3 m de fondo alrededor, cuyas columnas pisan el agua. Al centro, **la linterna**: la oficina del Presidente sube a **22 m**, vidrio, bronce y obsidiana, abierta al cielo por el patio de la magnolia. Es la única marca vertical del centro y se ve desde los cuatro zaguanes.

### 6.1 Llegar

Cuatro **calzadas** cubiertas de 11.1 m de ancho y 84 m, del centro de cada lado del anillo hasta el agua, con colorines, jardineras y bancas; cruzan el **espejo de agua** (anillo de 16.5 m, 132 × 132 m por fuera, 30 cm de profundidad, ahuehuetes en la orilla) como puentes. Al final de cada calzada, a la orilla del agua, una **sala de espera de Estado** (60 m², café servido, vista a la linterna) con la esclusa de dos puertas. Túnel de Estado desde el S1 al sótano de la Casa.

### 6.2 La suite de decisión (33.3 × 33.3 m, 11 m de altura)

```
+----------+----------+----------+
|  VICE-   |  SALA    |  SALA    |
|  PRESI-  |  NORTE   |  NE      |
|  DENCIA  |  (33)    |  (16)    |
+----------+----------+----------+
|  SALA    |  OFICINA |  SALA    |
|  PONIENTE|  DEL     |  ORIENTE |
|  (24)    |  PRESI-  |  (24)    |
|          |  DENTE   |          |
+----------+----------+----------+
|  SALA    |  SALA    |  SECRE-  |
|  SP      |  SUR     |  TARÍA   |
|  (16)    |  (33)    |          |
+----------+----------+----------+
```

- **Oficina del Presidente**: la celda central, 11.1 × 11.1 m y 22 m de altura, patio de luz de 5 × 5 m con una magnolia mexicana; cuatro puertas corredizas de parota hacia las salas Norte, Sur, Oriente y Poniente; muro de decisión de 11 m con el Tablero vivo; escalera privada a la planta alta; acceso a la terraza del techo.
- **Seis salas** conectadas en anillo (Norte y Sur 33, Oriente y Poniente 24, NE y SP 16): pantalla de 4 m y dos laterales, cámaras, micrófonos de techo, traducción, votación y registro en el Tablero, mesa de parota, 25 dB, tragaluz.
- **Vicepresidencia** (NO) y **Secretaría** (SE) en las esquinas opuestas, cada una con dos salas vecinas y su puerta al exterior.
- **El carrusel**: pasillo de preparación de 3.3 m alrededor, con **antesala** de 20 m² por sala (el siguiente equipo ya conectó su presentación) y **cuarto de resultado** de 10 m² (el equipo que sale registra la decisión). Flujo de un solo sentido: entrada y salida nunca se cruzan. Turnos de 11 minutos: meta de 33 decisiones registradas por jornada.
- **Baño de Estado** por sala (8 m², mármol, bronce).

### 6.3 Lo demás

| Nivel | Qué hay |
|---|---|
| Planta baja (11 m) | La suite; Sala del Gabinete (15 × 15 m, mesa cuadrada de 33, sin cabecera); Sala de Situación 24/7; Sala de Enlace (40 m², Faraday, audio sellado, para llamadas con jefes de Estado); Sala de Prensa (200 asientos, 60 posiciones de cámara, estudio de TV, acceso desde la calzada Oriente sin cruzar zonas restringidas); salón de recepciones de 600 m²; capilla de silencio |
| Planta alta (7 m) | 300 personas de Presidencia; Sala de Datos (30 analistas con línea a La Bóveda); biblioteca; Comedor de Estado (99) con cocina de Estado; la casa privada del Presidente: recámara, baño, gimnasio, comedor de 8, consultorio 24 h |
| Techo | Verde; la terraza del Presidente de 33 × 33 m alrededor de la linterna, barandal de bronce, acceso solo desde su oficina |
| Sótano | Túnel a los cuatro núcleos de medio lado y al S1; refugio; cocina; bodega de 300 m² (ceremonias, banderas, protocolo); red propia; aislamiento sísmico de base |

El **Teatro 333** está a 60 m, bajo una loma, con salida directa a la Sala de Prensa por túnel.

> **Para ejecutar.** Entregables: proyecto arquitectónico de la Casa 1:100 con la suite 1:50; proyecto de aislamiento sísmico; proyecto audiovisual y de seguridad de la suite; maqueta 1:20 de una sala y la antesala. Aceptación: 11 m libres en salas, 22 m en la linterna; recorrido de un equipo (antesala → sala → cuarto de resultado) sin cruzarse con el siguiente, probado con personas; 25 dB medidos con las puertas cerradas.

---

## 7. Los recintos: teatros, Salón de Eventos, Cuartel

### 7.1 Teatro 333 y Teatro 999

| | Teatro 333 | Teatro 999 |
|---|---|---|
| Dónde | Bajo una loma del parque, a 60 m de la Casa | Puerta Sur, semienterrado bajo una colina de bosque, abierto a la ciudad |
| Sala | ~900 m², **9 filas de 37 butacas**, ninguna a más de 18 m | ~2,200 m², **27 filas de 37**, platea y balcón, ninguna a más de 30 m |
| Rake | 12 cm por fila | 13 cm por fila |
| Escenario y pantalla | 16 × 10 m; LED de 14 × 6 m | 24 × 14 m con foso para 60 músicos; LED de 24 × 10 m |
| Foyer | 40 × 12 m, 8 m de altura, 480 m², vidrio contra la loma | 90 × 22 m, 12 m de doble altura, 1,980 m², cantera y vidrio a la plaza |
| Restaurante debajo | 120 asientos, terraza hacia el agua de la Casa | 300 asientos, 5 m de altura, terraza de 110 × 16 m al bosque; cocina compartida con el foyer y, por pasillo de servicio, con el Salón |
| Cabina de producción | 40 m² al fondo de la sala, 6 cámaras robóticas, señal directa a la Sala de Prensa | 60 m² al fondo de la platea con ventana, 8 cámaras robóticas + 2 de mano, mezcla 4K, salida a TV, streaming y pantallas del edificio |
| Bodega | 400 m² bajo la loma, acceso desde el túnel del S1 | 1,200 m² detrás del escenario, en el bloque de servicio del Sur |
| Sonido | Line array calibrado por butaca, 25 dB de fondo | Igual, con refuerzo en balcón |
| Camuflaje | El techo es parque; solo se ve el pórtico en la ladera | El techo es bosque; el foyer se asoma entre los árboles |

**La butaca**: paso de 1.10 m, 0.65 m de ancho, respaldo reclinable 15°, espuma de curado en frío, piel de curtido vegetal, apoyabrazos de tzalam, ventilación individual bajo el asiento, micrófono, botón de voto, USB-C, luz guía, número en bronce.

### 7.2 El Salón de Eventos

Pegado al Teatro 999 y unido a su foyer por **la galería** (25 m de vidrio, doble altura: registro, café, primeros stands). Un salón **vacío, sin columnas, de 66 × 44 m (2,904 m²) y 11 m libres**, piso plano con cajas cada 5.55 m (energía trifásica, red, agua), rigging en todo el techo, blackout, muros móviles acústicos que lo parten en tres de 22 × 44, clima por zona, terraza al bosque. Capacidad: 2,000 de pie, 1,200 en banquete, 100 stands de 3 × 3. Cocina propia unida a la del teatro por pasillo de servicio. Cabina de ambiente de 30 m² en el mezanine (luces, sonido, pantallas, clima; 4 cámaras). Bodega de 800 m² contigua con andén para 4 camiones. Los proveedores exponen aquí y presentan en el teatro, a 25 m. Su mobiliario vive en la bodega y se monta por evento: desayunos, comidas, cenas, Navidad, Año Nuevo, expos, firmas.

### 7.3 Bodegas y cuartos de máquinas

| Recinto | Bodega | Máquinas |
|---|---|---|
| Teatro 999 y Salón | 1,200 + 800 m² en el bloque de servicio del Sur, con andén | Clima, eléctrico, UPS, bombas contra incendio en el mismo bloque |
| Teatro 333 | 400 m² bajo la loma | Propias, con respaldo desde el S6 por túnel |
| Casa de Decisiones | 300 m² en el sótano | Propias y aisladas sísmicamente |
| Edificio | — | S5–S6 (chillers, bombas, cisternas, tratamiento, baterías, generadores, subestación interior); pisos técnicos 11 y 22; cuartos de elevadores en la azotea |
| Terreno | — | Subestación y enfriamiento de La Bóveda en la Puerta Oriente; cuartos propios en estación, helipuerto, Cuartel y en cada esquina de estacionamiento |

### 7.4 El Cuartel: edificio militar y de seguridad

Las fuerzas acatan las órdenes del edificio pero no viven en él: oficinas de enlace adentro (lado Oriente) y su propio edificio afuera, a un túnel de distancia.

| | |
|---|---|
| Dónde | Puerta Oriente, a 60 m del anillo; túnel al S1 y al Centro de Continuidad (S7) |
| Forma | Rectangular, **110 × 44 m, 9 pisos (45 m)**, cantera con rendijas verticales sobre basamento de tezontle; patio de armas de tezontle al frente; helipuerto y C5 en el techo. Más bajo que el cuadrado y a su lado: obedece, no compite |
| Pisos 1–3 | Guardia Nacional y su **C4** (muro de pantallas, 24 h) |
| Pisos 4–5 | Fuerzas Armadas (enlace de Defensa y Marina) y su C4 |
| Pisos 6–7 | Policía federal y policía estatal, cada una con su C4 |
| Piso 8 | **C5**: los cuatro C4 en una misma pantalla; de aquí sale la respuesta coordinada |
| Piso 9 | Mando y enlace con la Presidencia; sala de 33 con línea a la Sala de Situación de la Casa |
| Sótano 1 | **Cuarto de Guerra**: 33 × 22 m, búnker con aislamiento sísmico, aire propio, pantallas en tres muros, el Tablero de seguridad; los cuatro mandos en una mesa |
| Sótano 2 | Arsenal controlado (registro por pieza), cuarto de máquinas, generadores 72 h, telecomunicaciones redundantes |
| Personas | ~1,800 |

**El polvorín**: aparte, a 100 m del Cuartel y 300 del edificio, bajo su propio montículo con bosque encima; 1,200 m² bajo tierra; acceso solo por túnel blindado con dos esclusas; doble puerta, control de temperatura y humedad, detección de incendio por aspiración, inventario en el Tablero; nunca una línea de visión directa a la calle. Todas las fuerzas sacan de ahí; ninguna guarda por su cuenta.

> **Para ejecutar.** Entregables: proyecto arquitectónico, acústico y escenotécnico de los dos teatros (líneas de visión por butaca, tiempo de reverberación 1.2 s, aislamiento 60 dB); proyecto del Salón con las tres configuraciones (expo, banquete, baile) y su rigging a 1,000 kg por punto; proyecto del Cuartel y del polvorín con la norma militar aplicable y el dictamen de distancias de seguridad. Aceptación: ninguna butaca sin ver el escenario completo; piso del Salón a ± 5 mm en 10 m; polvorín aprobado por la autoridad militar antes de cimentar.

---

## 8. Los 11 sótanos y La Bóveda

Bajo todo el cuadrado de 333 × 333 m (110,889 m² por nivel), incluido el patio. Nada de oficinas de personas. Profundidad ~50 m.

| Nivel | Altura | Uso |
|---|---|---|
| S1 | 6.0 m | Llegada: bahías de las 33 rutas de autobús eléctrico, túnel vehicular de Estado, 10,000 bicis con vestidores, andenes de carga (rampa Poniente), cocina central, correo, taller, residuos en 4 fracciones |
| S2–S3 | 3.3 m | Estacionamiento de visitantes (2,000), directivos, accesibilidad, flotilla; ~7,400 cajones; 100 % precableado |
| S4 | 4.5 m | Archivo activo, bodegas, talleres de carpintería y piedra |
| S5–S6 | 5.0 m | Planta: cisternas de 100,000 m³, tratamiento de agua, chillers, bombas, baterías de 200 MWh, generadores para 72 h, subestación interior |
| S7 | 4.5 m | Centro de Continuidad de Gobierno: sala de crisis, dormitorios para 333, cocina, clínica, aire filtrado, 33 días de autonomía |
| S8 | 4.5 m | Centro de operaciones: seguridad, bomberos, telecomunicaciones (dos acometidas por lados opuestos) |
| S9 | 4.5 m | Soporte de La Bóveda: distribución eléctrica, UPS, bombas de enfriamiento, talleres |
| S10–S11 | 9.0 m | **La Bóveda** |

**La Bóveda**: una sola sala de 9 m y 110,889 m² en **cuatro cuadrantes independientes** (energía, enfriamiento y red propios). 50 MW de cómputo al abrir, ampliable a 250 MW con enfriamiento líquido directo; el calor sube a la planta de la Puerta Oriente y calienta la alberca, las regaderas y los comedores. Acceso por dos esclusas desde S9, zona Z6, racks con aislamiento sísmico, detección por aspiración, extinción por gas inerte, muros de 1 m, sin conexión a estacionamientos. **Dos gemelas** en otros estados (propuesta: Querétaro y Mérida) con copia en vivo: la soberanía de datos se logra con tres sitios, no con uno muy profundo.

**Agua**: 800 mm de lluvia sobre 99.8 ha son ~800,000 m³ al año contra ~450,000 de consumo; captación en techos, plazas y bosque, cisternas, tratamiento propio, reúso en riego e inodoros, pozos de recarga al acuífero en el bosque. Agua de la red solo como respaldo.

**Energía, con la verdad**: paneles de azotea ~8 GWh/año; edificio ~200 GWh/año; La Bóveda de 400 a 2,000 GWh/año. Subestación propia de 400 kV con dos acometidas de regiones distintas; contratos de energía limpia para el 100 %; baterías y generadores para continuidad.

> **Para ejecutar.** Entregables: proyecto geotécnico y de muro Milán; proyecto de control de agua; proyecto de La Bóveda con un diseño Tier IV certificable por cuadrante; proyecto de la planta de agua y energía. Aceptación: sótanos secos a 50 m (infiltración < 0.1 l/m² al día); cada cuadrante de La Bóveda apagable sin afectar a los otros tres, probado; 72 h de autonomía eléctrica demostradas.

---

## 9. Movilidad: llegar, subir, moverse

### 9.1 Dónde van bandas y dónde van elevadores

Banda donde el flujo es masivo, en línea recta y mayor de 100 m; escalera eléctrica o elevador donde se cambia de nivel; carrito para quien no camina. Dentro de los pisos no hay bandas.

| Tramo | Largo | Qué va | Tiempo |
|---|---|---|---|
| Andén → vestíbulo de la estación | −18 m → 0 | 12 escaleras eléctricas + 6 elevadores | 1 min |
| Estación → plaza Norte (Rampa Norte) | 135 m | 4 bandas de 2 m (dos por sentido) bajo pérgola | 1.2 min |
| Helipuerto → plaza Norte | 240 m | 2 bandas + paso libre bajo pérgola | 2.5 min |
| Patio de luz → bosque | −7 m → 0 | 2 escaleras eléctricas + 2 elevadores por patio (36) | 30 s |
| Patio de luz → edificio (sendero de esquina) | 333 m | 2 bandas de 150 m + paso libre + carril de carritos | 2.5 min |
| S1 → vestíbulos | −6 m → 0 | 16 escaleras eléctricas + los núcleos | 1 min |
| Plaza → zaguán → núcleo | 60–100 m | A pie: se ve el parque y la linterna | 1.5 min |
| PB → cualquier piso | hasta 160 m | Lanzaderas a 11, 22, 33 + locales | < 1.5 min |

Bandas de 2 m, 0.75 m/s, pasamanos calefactado, techo y luz; se detienen solas sin gente.

### 9.2 Tiempos que gobiernan el diseño

| De… a… | Meta |
|---|---|
| Andén del tren → escritorio | 10 min |
| Coche → escritorio | 12 min |
| Helicóptero → escritorio | 9 min |
| Escritorio → Casa de Decisiones | 5 min |
| Cualquier punto → cualquier punto | 9 min |
| Decisión del Presidente → su dueño en el Tablero | 11 min |
| Subir a los 30,000 | 26 min |
| Evacuar el edificio | 33 min |

### 9.3 La Gran Estación de Metro y Tren Suburbano

Andenes bajo tierra (Metro −12 m, tren −18 m); vestíbulo de **240 × 60 m y 22 m de altura** sobre basamento de tezontle, con **doble techo** (bóveda de vidrio adentro, pérgola de paneles solares encima que da sombra y lluvia y deja una cámara de aire). **Cuatro cafeterías** de 120 asientos en las esquinas: se pide desde el tren y se recoge al salir. Terminal de las 33 rutas eléctricas en su sótano, conectada al S1 por túnel; bicis en el vestíbulo. De ahí, la Rampa Norte.

### 9.4 El Helipuerto

Puerta Norte, mitad oriente, en bosque claro; aproximación desde el norte sobre el anillo vial, nunca sobre el patio ni las torres. **Seis plataformas** (radio 11 m, dos hileras: dos aterrizan y despegan a la vez; 30 movimientos por hora), **torre de control** de 18 m, **hangar** de 60 × 30 m para seis helicópteros con taller, combustible y tripulación 24 h, y el **pabellón de llegada**: baños de primera (dos bloques en mármol y bronce), cafetería con barista (60 asientos, pedido desde el helicóptero), guardarropa, terraza. De ahí, la banda de 240 m a la plaza. Al AICM 12 min, al AIFA 15, a Toluca 20. Los helipuertos de la azotea y del Cuartel quedan para emergencias.

### 9.5 Las banderas

Dos astas de **111 m** en claros abiertos (radio de 33 m sin árboles) a los lados de la Rampa Norte, visibles desde la estación, la plaza, el zaguán, las torres y la ciudad. **La del Oriente es siempre la de México** (50 × 28.6 m, proporción 4:7; se iza a las 6 y se arría a las 18 con guardia; iluminada de noche). **La del Poniente queda vacía** y se iza para el país que nos visita, a la misma altura. Plaza circular de tezontle de 32 m al pie de cada una.

### 9.6 El estacionamiento como obra de ingeniería

| Dato | Valor |
|---|---|
| Cajones | **~39,000** para 30,000 personas: 29,600 bajo las esquinas, 7,400 bajo el edificio, 2,000 bajo la plaza Sur. 30 % de margen para que siempre haya lugar y el flujo no se trabe |
| Cajón | 2.7 × 5.5 m; pasillos de 7 m en dos sentidos; 3.3 m libres |
| Entradas | Por esquina, 2 entradas y 2 salidas desde el anillo vial por rampas helicoidales dobles: 6 carriles, 7,200 coches por hora; las cuatro mueven 29,000 por hora |
| Sin barreras | Lectura de placa y credencial en el teléfono |
| Cajón asignado | Antes de llegar, en la esquina del lado donde trabajas y cerca de tu patio de luz; LED verde; sensor por cajón |
| Patios de luz | 9 por esquina en malla de 111 m: tragaluces de 11.1 × 11.1 m con escaleras eléctricas, 2 elevadores, un bloque de baños y dos bancas; nadie a más de 80 m de uno |
| Aire y agua | Ventilación natural por los patios más extracción por zonas; el bosque de encima drena a cisternas |
| Carga | 100 % precableado, 1 de cada 3 con cargador; todos los de visitantes |
| Motos y bicis | 3,000 motos junto a los patios; 10,000 bicis en el S1 y en la estación |
| Convertible | Losas planas y 3.3 m libres: talleres o bodegas cuando sobren coches |

Meta: la mitad de la gente llega sin coche en el año 5 (estación, 33 rutas diseñadas con los domicilios del padrón, ciclovías a los cuatro lados).

> **Para ejecutar.** Entregables: estudio de tráfico vertical y peatonal con simulación de la hora pico (30,000 en 90 min); proyecto de la estación acordado con la autoridad de transporte; proyecto del helipuerto conforme a la norma aeronáutica, con estudio de obstáculos y ruido; proyecto de estacionamientos con simulación de llenado y vaciado. Aceptación: los tiempos de la tabla 9.2 cumplidos en simulación y luego en pruebas con personas; una esquina de 7,400 cajones vaciada en 60 min; helipuerto certificado para operación nocturna.

---

## 10. Seguridad

### 10.1 Siete zonas

| Zona | Qué | Quién | Cómo |
|---|---|---|---|
| Z0 | Bosque, plazas, Teatro 999, Salón, canchas, estación, helipuerto | Todos, 24 h | Abierto; cámaras y presencia amable |
| Z1 | Vestíbulos, Casas del Ciudadano, comedores de PB, clínica | Cualquiera con identificación | Compuertas de vidrio; registro en 10 s |
| Z2 | Pisos del propio sector, mercados, gimnasios, parques de cielo | Empleados | Credencial + rostro + teléfono |
| Z3 | Pisos de otros sectores | Empleados con invitación | La puerta sabe quién está invitado y hasta qué hora |
| Z4 | Pisos 32–33, La Fábrica, operaciones, continuidad, el Cuartel | Personal asignado | Esclusa de una persona |
| Z5 | Casa de Decisiones, calzadas, Teatro 333, C5 y Cuarto de Guerra | Presidencia, gabinete, mandos, invitados del día | Esclusa + dos factores + escolta para invitados |
| Z6 | La Bóveda, arsenal, polvorín | Equipos asignados, de dos en dos | Doble esclusa, biometría doble, nunca una persona sola |

### 10.2 La puerta

Puertas corredizas de vidrio de 3.6 m en marcos de bronce en cada cambio de zona. Con permiso, se abren 3 m antes de llegar (rostro, credencial y teléfono: dos de tres para Z2, los tres de Z4 en adelante); nunca se toca nada. Sin permiso, no se abre: el borde cambia de blanco a ámbar, sin alarma ni voz, y a menos de 20 m una anfitriona o anfitrión acompaña a donde sí se puede. Cada puerta sabe la hora y la ruta del permiso de cada visitante. Reconocimiento procesado en La Bóveda; videos que no salen; registros borrados a los 90 días salvo incidente.

### 10.3 Perímetro y emergencias

Perímetro duro en las cuatro plazas (bolardos retráctiles, control vehicular bajo tierra en las rampas, inspección de autobuses antes del S1); el bosque es libre. Evacuación: 16 escaleras presurizadas, 16 elevadores de evacuación, tres pisos de refugio con aire propio para 4,000 cada uno; meta 33 minutos. Sismo: alertamiento integrado a pantallas, puertas y elevadores; los núcleos y la Casa siguen operando. El Cuartel, el polvorín y el Cuarto de Guerra están en §7.4; el Centro de Continuidad, en §8.

> **Para ejecutar.** Entregables: proyecto de seguridad física y electrónica por zonas; plan de evacuación con simulación; protocolo de visitantes; dictamen de protección civil. Aceptación: simulacro de evacuación total en menos de 33 minutos; cero puertas de zona con apertura manual permanente; auditoría de privacidad del sistema de reconocimiento.

---

## 11. Sistemas: el sistema nervioso

**El Tablero**: un solo sistema donde vive cada decisión, cada tarea y cada caso ciudadano, con identificador, dueño, fecha, estado y evidencia; se ve en cada sala al empezar la junta, en cada mesa de la Casa del Ciudadano, en el muro de cada piso y en el teléfono. Una junta en la Casa termina cuando la decisión está registrada con dueño y fecha; el dueño la ve antes de que el Presidente salga de la sala (meta: 11 minutos). Una queja se vuelve caso con tres destinos en el mismo momento (respuesta humana en 1 hora; solución o fecha en 11 días). La Fábrica (pisos 30–31, ~2,000 ingenieros a una escalera del gabinete) ve el Tablero completo y arregla en el sistema lo que se repite; cada piso de operación tiene un pod de 11 ingenieros entre la gente.

**Las salas**: ~2,700 con la misma tecnología; la sala reconoce a los asistentes y abre la junta agendada; un clic para traer cualquier oficina del país; minuta al Tablero si se autoriza.

**La red**: fibra a cada mesa, Wi-Fi 7 en todo el bosque, dos acometidas por lados opuestos; todo el tráfico de gobierno termina en La Bóveda sin salir del complejo. Teléfono = credencial = llave = cartera del comedor.

> **Para ejecutar.** Entregables: arquitectura del Tablero y de identidad digital; especificación de la sala tipo; proyecto de red y de La Bóveda. Aceptación: una decisión registrada en la Casa visible en el escritorio del dueño en menos de 11 minutos, medido; una queja de la Casa del Ciudadano en tres destinos en menos de 1 segundo.

---

## 12. Materiales para 200 años

Cada material se elige por durabilidad, origen mexicano y belleza con los años, en ese orden. Nada que se vea mejor nuevo que viejo.

| Elemento | Material |
|---|---|
| Estructura | Concreto C70 de baja permeabilidad, recubrimiento de 50 mm, acero inoxidable dúplex en lo expuesto, protección catódica en cimentación |
| Piel exterior | Recinto negro y cantera gris de Zacatecas en placas de 60 mm sobre UHPC; tezontle rojo en basamento, portales, zaguanes, plazas y calzadas |
| Ventanas | Triple vidrio bajo emisivo de 3.6 m, marcos de bronce, electrocrómico en Sur, Oriente y Poniente |
| Lamas y herrería | Bronce extruido, pátina natural; barandales, grifería y herrajes de bronce macizo |
| Pisos | Mármol Santo Tomás y travertino de Puebla en vestíbulos y calzadas; terrazo in situ sobre piso técnico de 30 cm en oficinas; recinto flameado en baños y cocinas; tepetate en veredas |
| Muros de baños | Talavera de Puebla, una paleta por lado |
| Madera | Tzalam, parota y granadillo certificados del sureste; encino para muebles, bancas, persianas |
| Plafones | Madera acústica en salas; concreto aparente pulido en oficinas |
| Mobiliario | Las ocho piezas de §5.2; lana de Oaxaca, piel de curtido vegetal |
| La linterna | Obsidiana pulida |
| Arte | Barro negro de Oaxaca y Mata Ortiz, textiles de Chiapas y Oaxaca, laca de Olinalá, plata de Taxco en placas; un mural por Casa del Ciudadano |
| Azotea y techos verdes | Membrana de doble capa con detección de fugas, drenaje de arcilla expandida, 1.2 m de sustrato; pérgolas de acero galvanizado |
| Sótanos | Muro Milán con doble barrera, concreto con cristalizante |

Lo que no hay: plásticos a la vista, aluminio anodizado, laminados, tablaroca en áreas públicas, silicones expuestos, lámparas que no se cambien sin escalera especial.

> **Para ejecutar.** Entregables: especificación de materiales con origen, prueba de durabilidad y proveedor alterno; muestrario físico aprobado antes de licitar fachada e interiores. Aceptación: cada material con ensayo de 200 años equivalentes (ciclos de intemperismo, abrasión, UV) o con precedente documentado de más de 100 años.

---

## 13. Paisaje: el bosque, el agua y el verde

La ciudad está a 2,240 m, con lluvias de junio a septiembre y sol fuerte todo el año. Tres reglas para toda planta: nativa del Valle de México o de México, poca agua una vez establecida, y algo que florezca o cambie cada mes.

### 13.1 Nada sin querer: el plan de siembra

| Zona | Especies | Separación | Por qué |
|---|---|---|---|
| Esquinas (bosque denso sobre el estacionamiento) | Encino (*Quercus rugosa, laurina, crassipes*), pino (*Pinus montezumae, patula*), cedro blanco | 8.2 m | Sombra cerrada y silencio; raíces someras sobre 1.5 m de tierra; el pino da la silueta alta |
| Puertas (bosque claro) | Fresno, madroño, aile | 10 m | Copas abiertas para ver la plaza y el edificio; el madroño da color de corteza en invierno |
| Orillas de las veredas | Tejocote y capulín | 11.1 m | Fruta en otoño para quien camina; marcan la vereda sin señal |
| Plazas | Jacarandas en los bordes; agaves y dalias en jardineras | 9 m | Morado en marzo contra el tezontle rojo (la única especie no nativa, por derecho ganado en la ciudad) |
| Calzadas | Colorines; salvias y dalias en jardineras corridas | 11.1 m | Rojo en marzo; flor todo el año a la altura de la mano |
| Orilla del agua | Ahuehuetes (*Taxodium mucronatum*) | 11 m | El árbol nacional pisa el agua |
| Praderas del patio | Pastos nativos (navajita, zacatón) con 33 manchas de flor: salvias, cosmos, cempasúchil | — | Color por mes sin riego; las manchas marcan los claros donde sentarse |
| Parques de cielo | Encino bajo, fresno joven, tejocote, magnolia mexicana, palo dulce | 9 m | Viento y 1.2 m de sustrato: copas compactas, anclaje de raíz |
| Azotea | Sedum, echeveria, agave en franjas | — | Casi sin agua a 160 m |
| Interiores | Palma camedor, monstera, pata de elefante en macetas de barro; muros verdes de 11 × 7 m en cada vestíbulo de núcleo (264) | — | Especies mexicanas que viven bajo techo |
| Cuartel y polvorín | Encino y nopal en el montículo | 8 m | Cubierta densa; el nopal no se trepa |

Se planta el primer año de obra, desde vivero propio en la Puerta Poniente, con ejemplares de 3 a 5 m: cuando el edificio abre, el bosque ya tiene siete años. Total: 15,000 a 20,000 árboles de ~33 especies.

### 13.2 El parque interior

Praderas con senderos de recinto en la retícula de 11.1 m; bosquecillos de encino y madroño; la **milpa** de 33 × 33 m que siembran los niños de las guarderías en mayo y cosechan en octubre; la loma del Teatro 333; el espejo de agua con los ahuehuetes; las calzadas con sus colorines; bancas de frente al agua cada 22 m, entre los colorines y en cada mancha de flor.

### 13.3 Más verde: jardineras, manchas y macetas

Jardineras corridas de cantera de 3 m al pie de las cuatro fachadas, entre cada torre y cada zaguán (salvias, dalias, agaves); cuatro jardineras circulares por plaza; jardineras corridas a los lados de las calzadas; 33 manchas de flor de 6 a 12 m de radio en el patio que cambian con el mes (salvias moradas; dalias y colorines rojos en marzo; cempasúchil en noviembre); macetas de barro con palma camedor cada 6 m en plazas, Rampa Norte, galería y patio de armas, una por isla de trabajo y dos por estancia. Riego por goteo de agua tratada con sensores por jardinera; lo que no florece se cambia.

### 13.4 El agua que las riega

Toda el agua de riego es de lluvia almacenada o tratada. El bosque se riega solo los dos primeros años; después vive de la lluvia. Sensores de humedad por celda; el riego lo decide el sistema.

> **Para ejecutar.** Entregables: proyecto de paisaje con plano de siembra árbol por árbol (especie, tamaño, posición en la malla); proyecto de riego y drenaje; proyecto del vivero; plan de mantenimiento a 10 años. Aceptación: supervivencia de 95 % de los árboles al tercer año; ningún árbol a menos de 2.8 m de una vereda ni a menos de 6 m de una pieza construida; el bosque abierto al público en el año 3.

---

## 14. Luz, aire, sonido y confort

| | Meta |
|---|---|
| Altura | 3.6 m libres en oficinas; 11 m en salas de la Casa y planta baja; 22 m en la linterna |
| Luz natural | Ventana al bosque y ventana al parque en cada piso; ningún puesto a más de 15 m de una ventana ni de frente a ella; vidrio electrocrómico que se oscurece solo |
| Luz artificial | 4,000 K que sigue el día (más cálida al amanecer y al atardecer); 500 lux en la mesa, 300 en circulación |
| Aire | 100 % aire exterior filtrado, 40 m³/h por persona (el doble del estándar); CO₂ visible en cada sala; ventanas que abren (hojas de 30 cm con bloqueo por viento) |
| Temperatura | 21–24 °C en invierno, 23–26 °C en verano; losa radiante en pisos de piedra; sin corrientes |
| Sonido | 35 dB en oficinas abiertas, 25 dB en salas; plafones de madera acústica; separadores acústicos; cubículos cada módulo |
| Olor | Madera, piedra, plantas, café. Nada artificial |
| Vistas | Desde cualquier mesa se ve un árbol: bosque, parque, parque de cielo o muro verde |
| Descanso | Estancia a menos de 30 m; cuartos de concentración sin ventanas ni pantallas, uno por manzana; 11 camas de siesta por piso |

> **Para ejecutar.** Entregables: proyecto de iluminación natural y artificial con simulación anual; proyecto de aire y clima; proyecto acústico. Aceptación: mediciones en obra terminada: lux, dB, CO₂ y temperatura dentro de las metas en el 95 % de los puestos.

---

## 15. Los 33 pequeños detalles

1. El borde de cada puerta corrediza brilla blanco cuando te reconoce y ámbar cuando no; nunca rojo.
2. Los números de piso, grabados en bronce, van a la altura de los ojos y en el piso del elevador.
3. Cada piso huele a una madera distinta por lado (cedro, encino, tzalam, parota) para orientarse con los ojos cerrados.
4. Las mesas de junta son de una sola pieza de parota con orilla viva; la del gabinete es cuadrada, 33 asientos, sin cabecera.
5. En cada café de piso hay agua de frutas del día y fruta cortada, gratis.
6. Cada butaca lleva el nombre de un estado (333) o de un municipio (999) grabado en el apoyabrazos.
7. Los cuatro murales de las Casas del Ciudadano los pintan artistas de los cuatro puntos cardinales del país.
8. En la Casa del Ciudadano no hay mostradores: mesas redondas, dos sillas iguales.
9. Los baños tienen una repisa de piedra para el teléfono y un gancho de bronce, siempre.
10. Las regaderas tienen toallas de algodón de la Comarca Lagunera.
11. Cada parque de cielo tiene un reloj de sol de recinto en el piso.
12. Las cabinas de llamada tienen ventana al parque y un ventilador silencioso que enciende al cerrar.
13. Los pasamanos son de encino, tibios al tacto; las escaleras abiertas tienen luz natural y música baja para que la gente quiera usarlas.
14. En el piso de cada elevador, un mapa del tablero con «estás aquí».
15. La milpa la siembran los niños en mayo y la cosechan en octubre; las tortillas se sirven en los Mercados.
16. Los 32 puestos de los Mercados rotan de cocinero cada año; el 33 lo cocina el personal de la casa.
17. Toda la señalización va en español, inglés, la lengua indígena más hablada del sector y braille.
18. Los carritos del bosque tienen techo de madera y cobijas en invierno.
19. Ningún cable se ve; el piso técnico se abre con una ventosa.
20. Cada locker tiene toma de carga dentro.
21. Los cestos de basura son cuatro y se pesan: cada piso ve cuánto genera.
22. Las bancas del bosque llevan grabado el nombre de su cruce.
23. Las puertas de la Casa son de parota maciza, corredizas, y se mueven con un dedo.
24. Hay un buzón de piedra en cada plaza para quien prefiera escribir a mano; se captura al Tablero cada día.
25. La luz de la azotea se apaga a las 22:00 por las aves migratorias; el bosque solo tiene luz de 3 m hacia abajo.
26. Las cocinas de los Mercados tienen ventana a la gente.
27. Las salas tienen hora de cierre visible: un anillo de luz en la mesa se va apagando.
28. La oficina del Presidente tiene una puerta más: la del patio de la magnolia.
29. Cada Secretario tiene una terraza de 11 m con dos sillas.
30. Los uniformes del personal de la casa llevan el color de su lado.
31. Bebederos de piedra cada 60 m, con agua fría y tibia, también para perros en el bosque.
32. Braseros de piedra volcánica en terrazas y parques de cielo en invierno.
33. En el centro exacto del tablero, bajo la magnolia, una placa de bronce con las medidas del edificio y una frase: *«Aquí se decide y se cumple».*

---

## 16. Construcción: método, fases, calendario, costo

### 16.1 Método

1. **Un solo modelo digital** (BIM) es la fuente de verdad: de él salen planos, prefabricados, compras y después la operación; es el mismo modelo del 3D.
2. **Top-down**: muro Milán perimetral y losa de planta baja primero; se excava hacia abajo al mismo tiempo que se sube. Ahorra 18–24 meses.
3. **Cuatro frentes en paralelo**: cada lado lo construye un consorcio con el mismo modelo y el mismo calendario; las esquinas (compartidas) obligan a coordinarse. Un piso cada 6 días por frente.
4. **Prefabricado todo lo que se pueda**: paneles de fachada UHPC con piedra integrada, módulos de baño completos, escaleras, núcleos de red, cocinas de piso, los separadores y el mobiliario.
5. **Planta de concreto, taller de piedra y vivero dentro del terreno** (Puerta Poniente, donde después quedan las canchas).
6. **El bosque primero**: se planta en el año 1; el Teatro 999, el Salón y la Puerta Sur abren al público en el año 3.
7. **Mudanza por lados**: Norte (año 5), después Oriente, Sur, Poniente; la Casa al final (año 7). El Cuartel abre con el lado Oriente.

### 16.2 Calendario

| Año | Hito |
|---|---|
| 0 | Decisión de sitio; modelo digital; concurso de los cuatro frentes; vivero y planta en el terreno; mecánica de suelos |
| 1 | Muro Milán, losa de PB; plantación del bosque (15,000+ árboles de 3–5 m); estación de transporte en obra |
| 2 | Sótanos S1–S6 y pisos 1–11 en los cuatro lados; estacionamientos de esquina |
| 3 | **Abre al público**: bosque, veredas, Teatro 999, Salón, canchas. Sótanos S7–S11, pisos 12–22 |
| 4 | Pisos 23–33, torres, azotea; La Bóveda en pruebas con sus gemelas; helipuerto y banderas |
| 5 | **Se ocupa el lado Norte**; Casas del Ciudadano Norte y Sur; estación en servicio |
| 6 | Oriente y Sur ocupados; el Cuartel; Casa de Decisiones y parque interior |
| 7 | Poniente ocupado; **inauguración completa** |

### 16.3 Orden de magnitud del costo

Para dimensionar, no para presupuestar.

| Partida | Rango (US$ millones) |
|---|---|
| Edificio (1.32 M m² a US$ 6,000–9,000/m²) | 8,000–12,000 |
| 11 sótanos (1.22 M m² a 1,500–2,500/m²) | 1,800–3,000 |
| La Bóveda (50 MW iniciales) y sus gemelas | 1,500–2,500 |
| Estacionamientos de esquina (0.89 M m²) | 900–1,300 |
| Bosque, parque, calzadas, plazas, veredas, teatros, Salón, Casa, Cuartel, helipuerto, canchas | 1,500–2,400 |
| Estación, subestación, agua, energía, rutas | 1,000–2,000 |
| Diseño, dirección, contingencia (15 %) | 2,000–3,500 |
| **Total** | **~16,700–26,700** |

Referencias: Apple Park ~US$ 5,000 millones (260,000 m²); el aeropuerto cancelado de Texcoco, del orden de US$ 13,000 millones. Operación anual: US$ 400–600 millones.

### 16.4 Entregables por disciplina y criterios de aceptación

| Disciplina | Entregables | Aceptación |
|---|---|---|
| Dirección | Programa, calendario maestro, modelo BIM federado, control de cambios contra este documento | Cada cambio a un número de este documento pasa por el modelo y queda en su bitácora |
| Arquitectura | Proyecto ejecutivo completo por lado, la Casa, los recintos, el Cuartel, la estación, el helipuerto | Revisión contra los 12 lineamientos y los conteos del modelo |
| Estructura y geotecnia | Memorias, planos, pruebas de aisladores y amortiguadores | Operación continua en sismo de diseño, demostrada en modelo no lineal |
| Fachada | Prototipo probado, planos de fabricación | Prototipo aprobado antes de fabricar |
| Interiores | Plantas amuebladas, prototipos de las ocho piezas, bloque de baño | Conteos ± 2 %; ergonomía verificada con personas |
| Paisaje | Plano de siembra árbol por árbol, riego, vivero | 95 % de supervivencia al año 3 |
| Ingenierías | Agua, energía, clima, aire, iluminación, acústica, elevadores | Metas de §9.2 y §14 medidas en obra |
| Seguridad | Zonas, puertas, evacuación, Cuartel, polvorín, continuidad | Simulacro en 33 min; dictámenes de la autoridad |
| Tecnología | Tablero, identidad, red, La Bóveda y gemelas | 11 min decisión → dueño; cuadrantes independientes |

> **Para ejecutar.** La obra se contrata por frentes con el modelo digital como anexo contractual. Ningún frente modifica la retícula, las alturas ni los conteos sin pasar por la dirección y el modelo.

---

## 17. Decisiones pendientes

El proyecto está completo con la opción recomendada en cada caso. Si se elige la otra, se ajusta el modelo y este documento.

| # | Decisión | A (recomendada, en el proyecto) | B |
|---|---|---|---|
| 1 | Sitio | Campo Militar No. 1 | Texcoco (sin sótanos profundos, hundimiento, área protegida) |
| 2 | Sótanos | 11 niveles (~50 m) sin oficinas | 33 literales (~120 m): sin precedente, sin luz, evacuación inviable |
| 3 | Estacionamiento | ~39,000 cajones, convertibles | 15,000 y apostar al transporte desde el día uno |
| 4 | Los cuatro sectores | Personas / Orden / Economía / Territorio | Otra agrupación de secretarías |
| 5 | Vicepresidencia | Se diseña la oficina (hoy la ocuparía la Jefatura de la Oficina de la Presidencia) | — |
| 6 | Nombre | «Edificio de Gobierno» | «El Tablero» o «La Cuadra» |

---

## 18. Anexos

### 18.1 El modelo y cómo verificar

- `modelo/parametros.json`: la fuente de los números, por dominios, con cada pieza del terreno como emplazamiento (posición, medida, partes, ficha). `modelo/recorridos.json`: los recorridos del 3D. `sitio/derivados.js`: lo que se calcula. `modelo/validar.mjs`: revisa invariantes e imprime derivados; `./publicar.sh` lo corre antes de publicar. Guía en `modelo/README.md`.
- El 3D (edificio.capitaltorreon.com): cada pieza con ficha, corte por pisos, capa «Ver adentro» para el interior amueblado y los teatros, plano a tres escalas, números y este documento.
- Para verificar un número: `node modelo/validar.mjs`. Para cambiar una pieza: su entrada en `emplazamientos`. Para cambiar una regla de mobiliario: `mobiliario.por_uso`.

### 18.2 Glosario

**Tablero**: el sistema único de decisiones, tareas y casos. **Calzada**: galería cubierta del anillo a la Casa. **Zaguán**: paso a través del anillo en planta baja. **Parque de cielo**: vacío de tres pisos al centro de cada fachada. **Cintura**: el piso 17. **Lanzadera**: elevador que solo para en los lobbies. **Isla, barrio, manzana**: 4, 8 y 33 personas. **Estancia**: lugar libre de la manzana. **La Fábrica**: ingeniería central, pisos 30–31. **La Bóveda**: el nivel de servidores. **Casa del Ciudadano**: atención en planta baja. **Valor y Estudios**: la unidad que estudia qué necesita la gente y cómo se sostiene cada servicio. **C4 / C5**: centros de mando por fuerza y unificado. **Rampa Norte**: galería con bandas de la estación a la plaza.

### 18.3 Lista de verificación de ejecución (33 puntos)

1. Sitio con suelo zona I confirmado por sondeos.
2. Polígono federal de 999 × 999 m disponible.
3. Retícula de 11.1 m en todos los planos.
4. Planta tipo 39,920 m² ± 0.5 %.
5. 3.6 m libres en oficinas.
6. Basamento de tezontle hasta el piso 3.
7. Cuatro zaguanes alineados con las calzadas.
8. Torres de esquina a 170.5 m con linterna.
9. Greca: 256 bahías según la regla.
10. Remate y cornisa en 32–33.
11. Parques de cielo de 99 × 33.3 × 13.5 m con columnas pasantes.
12. 176 elevadores, lobbies en 11, 22 y 33; 90 s a cualquier piso.
13. Baños: ~600 bloques, ninguno a más de 40 m.
14. Mobiliario: ocho piezas, islas con luz lateral, separadores por módulo, estancias por manzana.
15. Conteos del modelo ± 2 %.
16. Casa: 11 + 7 m, linterna a 22 m, portales sobre el agua, salas de espera.
17. Suite 3 × 3 con flujo de un sentido probado.
18. Teatros: 27 × 37 y 9 × 37, foyer, restaurante, cabina, bodega.
19. Salón vacío de 66 × 44 × 11 m con galería y cocina unida.
20. Cuartel de 9 pisos con C4 por fuerza, C5 y Cuarto de Guerra; polvorín aparte.
21. 11 sótanos secos; La Bóveda en 4 cuadrantes con gemelas.
22. Estación de 22 m con doble techo y 4 cafeterías; Rampa Norte con 4 bandas.
23. Helipuerto de 6 plataformas con pabellón de llegada y banda.
24. Dos astas de 111 m en claros de 33 m.
25. ~39,000 cajones, 36 patios de luz, sin barreras, cajón asignado.
26. Veredas en malla de 111 m con cruces nombrados y bancas.
27. Plan de siembra árbol por árbol; 95 % de supervivencia al año 3.
28. Jardineras, 33 manchas de flor, macetas.
29. Agua: cisternas de 100,000 m³, tratamiento y recarga.
30. Energía: subestación de 400 kV, 72 h de autonomía.
31. Seguridad: siete zonas, puertas que no se abren, evacuación en 33 min.
32. Tablero: 11 min de la decisión a su dueño.
33. El bosque abierto al público en el año 3.

---

*Proyecto de Ricardo López Reyero. Razonamiento, redacción y modelo con inteligencia artificial. Versión 2, 8 de noviembre de 2026. Versión 1 (7 de noviembre) conservada en el historial del repositorio.*

<!-- RLR · fin del documento · EYE · 181218 -->
