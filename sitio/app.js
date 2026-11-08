// RLR · Edificio de Gobierno · pestañas, plano, números y documentos — Ricardo López Reyero
const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218; // firma
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const n = (v, d = 0) => Number(v).toLocaleString("es-MX", { maximumFractionDigits: d, minimumFractionDigits: d });

window.EDIFICIO = { P: null, tres: null };
const P = await (await fetch("/parametros.json?v=" + _rev)).json();
window.EDIFICIO.P = P;

let cargando3D = null;
/* ---------- pestañas ---------- */
const VISTAS = ["3d", "plano", "numeros", "proyecto", "origen"];
function mostrar(v) {
  if (!VISTAS.includes(v)) v = "3d";
  const doc = v === "origen" ? "ORIGEN.md" : null; if (doc) v = "proyecto";
  $$(".pestanas [role=tab]").forEach(b => b.setAttribute("aria-selected", b.dataset.v === v));
  $$(".vista").forEach(s => s.classList.toggle("activa", s.id === "v-" + v));
  if (v === "3d") cargar3D();
  if (v === "proyecto" && (doc || !$("#articulo").dataset.listo)) cargarDoc(doc || "PROYECTO.md");
  window.EDIFICIO.tres?.visible?.(v === "3d");
}
$$(".pestanas [role=tab]").forEach(b => b.addEventListener("click", () => { location.hash = b.dataset.v; }));
addEventListener("hashchange", () => { const h = location.hash.slice(1); if (VISTAS.includes(h)) mostrar(h); });
mostrar(location.hash.slice(1) || "3d");

/* ---------- 3D (se carga una vez) ---------- */
function cargar3D() {
  if (cargando3D) return cargando3D;
  cargando3D = import("/tres.js?v=7").then(m => { window.EDIFICIO.tres = m; }).catch(e => {
    $("#cargando").innerHTML = `<p>No se pudo cargar el 3D.<br><small>${e.message}</small></p>`;
    console.error(e);
  });
  return cargando3D;
}

/* ---------- plano: tres escalas en SVG ---------- */
// RLR · cada plano se dibuja en metros y el viewBox hace la escala
function svg(w, h, cuerpo) { return `<svg viewBox="${-w / 2 - 20} ${-h / 2 - 20} ${w + 40} ${h + 40}" xmlns="http://www.w3.org/2000/svg" role="img">${cuerpo}</svg>`; }
const rect = (x, y, w, h, f, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${extra}/>`;
const txt = (x, y, s, size, f = "#e6e8ec", extra = "") => `<text x="${x}" y="${y}" font-size="${size}" fill="${f}" text-anchor="middle" dominant-baseline="middle" ${extra}>${s}</text>`;

function planoTerreno() {
  const T = P.terreno.lado, C = P.terreno.celda;
  let s = rect(-T / 2, -T / 2, T, T, "#17301f", 'stroke="#23262e" stroke-width="2"');
  // esquinas: estacionamiento bajo bosque
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => { s += rect(i * C - C / 2, j * C - C / 2, C, C, "#1b3a26", 'stroke="#2b4a36"'); s += txt(i * C, j * C - 14, "Bosque", 20, "#9fc7a9"); s += txt(i * C, j * C + 14, "estacionamiento debajo", 14, "#7c8490"); });
  const puertas = { norte: [0, -1, "Puerta Norte", "estación · Casa del Ciudadano"], sur: [0, 1, "Puerta Sur", "Teatro 999"], oriente: [1, 0, "Puerta Oriente", "prensa · energía"], poniente: [-1, 0, "Puerta Poniente", "canchas · logística"] };
  Object.values(puertas).forEach(([i, j, a, b]) => { s += rect(i * C - C / 2, j * C - C / 2, C, C, "#1b3a26", 'stroke="#2b4a36"'); s += txt(i * C, j * C - 14, a, 20, "#9fc7a9"); s += txt(i * C, j * C + 14, b, 14, "#7c8490"); });
  // plazas
  [[0, -C / 2 - 49.5], [0, C / 2 + 49.5], [C / 2 + 49.5, 0], [-C / 2 - 49.5, 0]].forEach(([x, y]) => s += rect(x - 49.5, y - 49.5, 99, 99, "#5a2c22"));
  // teatro 999 y estación
  s += `<ellipse cx="0" cy="400" rx="110" ry="80" fill="#2d5a3a"/>` + txt(0, 400, "999", 22, "#e6e8ec");
  s += rect(-120, -440, 240, 40, "#2a3a4a") + txt(0, -420, "Estación de Metro y Tren", 12);
  // edificio
  const L = P.edificio.lado, F = P.edificio.fondo_anillo;
  s += rect(-L / 2, -L / 2, L, L, "#8d8a82") + rect(-L / 2 + F, -L / 2 + F, L - 2 * F, L - 2 * F, "#245a3a");
  s += rect(-49.5, -49.5, 99, 99, "#b08d57") + txt(0, 0, "Casa", 18, "#111");
  return svg(T, T, s);
}

function planoEdificio() {
  const L = P.edificio.lado, F = P.edificio.fondo_anillo, LI = P.edificio.patio, V = P.edificio.parques_de_cielo.ancho, CASA = P.casa_de_decisiones.lado;
  let s = rect(-L / 2, -L / 2, L, L, "#8d8a82", 'stroke="#c9ced6" stroke-width="1.5"');
  s += rect(-LI / 2, -LI / 2, LI, LI, "#245a3a");
  // retícula
  const M = P.modulo; let g = "";
  for (let i = 0; i <= 30; i++) { const p = -L / 2 + i * M; g += `M${p} ${-L / 2}V${L / 2}M${-L / 2} ${p}H${L / 2}`; }
  s += `<path d="${g}" stroke="#ffffff" stroke-opacity=".08" stroke-width=".6" fill="none"/>`;
  // parques de cielo (vanos)
  [[0, -L / 2 + F / 2], [0, L / 2 - F / 2], [L / 2 - F / 2, 0], [-L / 2 + F / 2, 0]].forEach(([x, y], k) => {
    const h = k < 2; s += rect(x - (h ? V / 2 : F / 2), y - (h ? F / 2 : V / 2), h ? V : F, h ? F : V, "#3fb27f", 'fill-opacity=".85"');
  });
  // núcleos
  const c = L / 2 - M, n2 = 22.2;
  [[-c, -c], [c, -c], [-c, c], [c, c]].forEach(([x, y]) => s += rect(x - n2 / 2, y - n2 / 2, n2, n2, "#3a3a3c"));
  [[49.5, -L / 2 + F / 2], [49.5, L / 2 - F / 2], [L / 2 - F / 2, 49.5], [-L / 2 + F / 2, 49.5]].forEach(([x, y], k) => s += rect(x - (k < 2 ? n2 / 2 : F / 2), y - (k < 2 ? F / 2 : n2 / 2), k < 2 ? n2 : F, k < 2 ? F : n2, "#3a3a3c"));
  // torres de esquina (3 módulos, salen 5.5 m)
  { const TW = 3 * M + 5.5, cc = L / 2 - 1.5 * M + 2.75; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => s += rect(i * cc - TW / 2, j * cc - TW / 2, TW, TW, "#6f6b62", 'stroke="#c9ced6" stroke-width=".8"')); }
  // agua, casa, calzadas, teatro, milpa
  s += rect(-66, -66, 132, 132, "#2f6f9f") + rect(-CASA / 2, -CASA / 2, CASA, CASA, "#b08d57") + rect(-16.65, -16.65, 33.3, 33.3, "#8d6a3a") + rect(-5.55, -5.55, 11.1, 11.1, "#dfe6ee") + rect(-2.5, -2.5, 5, 5, "#3fb27f");
  [[0, -1], [0, 1], [1, 0], [-1, 0]].forEach(([i, j]) => { const w = i ? 83.7 : M, h = j ? 83.7 : M; const x = i ? i * (CASA / 2 + 83.7 / 2) : 0, y = j ? j * (CASA / 2 + 83.7 / 2) : 0; s += rect(x - w / 2, y - h / 2, w, h, "#a0442f"); });
  s += `<ellipse cx="60" cy="105" rx="36" ry="26" fill="#2d6a3f"/>` + txt(60, 105, "333", 12);
  s += rect(-96.5, -106.5, 33, 33, "#7a8a3a") + txt(-80, -90, "milpa", 9, "#111");
  s += txt(0, -L / 2 - 10, "Norte · Personas", 12, "#9aa1ad") + txt(0, L / 2 + 12, "Sur · Economía", 12, "#9aa1ad") + txt(L / 2 + 10, 0, "Oriente · Orden", 12, "#9aa1ad", 'transform="rotate(90 ' + (L / 2 + 10) + ' 0)"') + txt(-L / 2 - 10, 0, "Poniente · Territorio", 12, "#9aa1ad", 'transform="rotate(-90 ' + (-L / 2 - 10) + ' 0)"');
  return svg(L, L, s);
}

function planoSuite() {
  const S = P.casa_de_decisiones.suite, c = S.celda, T = S.tablero;
  let s = rect(-S.lado / 2 - S.pasillo_preparacion, -S.lado / 2 - S.pasillo_preparacion, S.lado + 2 * S.pasillo_preparacion, S.lado + 2 * S.pasillo_preparacion, "#2a2420", 'stroke="#b08d57" stroke-width=".6"');
  T.forEach((fila, j) => fila.forEach((nombre, i) => {
    const x = (i - 1) * c, y = (j - 1) * c, centro = i === 1 && j === 1, oficina = /Vice|Secre/.test(nombre);
    s += rect(x - c / 2 + .3, y - c / 2 + .3, c - .6, c - .6, centro ? "#b08d57" : oficina ? "#3a3a3c" : "#245a3a", 'rx=".4"');
    const partes = nombre.replace(" del ", " del\n").split(/\s(?=\()/);
    s += txt(x, y - (partes[1] ? 1 : 0), partes[0].replace("Oficina del Presidente", "Presidente"), 2.2, centro ? "#111" : "#e6e8ec", 'font-weight="600"');
    if (partes[1]) s += txt(x, y + 2.2, partes[1], 1.8, "#cfe8d8");
    if (centro) s += rect(-2.5, -2.5, 5, 5, "#3fb27f") + txt(0, 4.3, "patio · magnolia", 1.3, "#111");
  }));
  // puertas: del centro a N S E O
  [[0, -c / 2], [0, c / 2], [c / 2, 0], [-c / 2, 0]].forEach(([x, y]) => s += rect(x - (y ? 2 : .5), y - (x ? 2 : .5), y ? 4 : 1, x ? 4 : 1, "#f0e6d2"));
  s += txt(0, S.lado / 2 + S.pasillo_preparacion / 2, "pasillo de preparación · antesalas · el carrusel", 1.6, "#9aa1ad");
  return svg(S.lado + 2 * S.pasillo_preparacion, S.lado + 2 * S.pasillo_preparacion, s);
}

$("#planos").innerHTML = `
  <div class="plano"><h2>El terreno · 999 × 999 m</h2><p>Nueve celdas de 333 m. El edificio al centro, cuatro puertas, cuatro esquinas de bosque con el estacionamiento debajo.</p>${planoTerreno()}</div>
  <div class="plano"><h2>El edificio · 333 × 333 m</h2><p>Anillo de 33.3 m, retícula de 11.1 m, 8 núcleos, 4 torres de esquina, 4 parques de cielo (verde), 4 zaguanes, el agua, la Casa con su linterna y las cuatro calzadas.</p>${planoEdificio()}</div>
  <div class="plano"><h2>La suite de decisión · 33.3 × 33.3 m</h2><p>Nueve celdas de 11.1 m: el Presidente al centro con cuatro puertas, seis salas conectadas, Vicepresidencia y Secretaría en las esquinas opuestas.</p>${planoSuite()}</div>`;

/* ---------- números ---------- */
function tabla(titulo, filas, extra = "") {
  return `<div class="tabla"><h2>${titulo}</h2>${extra}<table>${filas.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table></div>`;
}
const E = P.edificio, S = P.sotanos, Es = P.estacionamiento;
const usos = [["público", 4, "var(--publico)"], ["operación", 10, "var(--operacion)"], ["mandos medios", 10, "var(--mandos)"], ["direcciones", 6, "var(--direcciones)"], ["La Fábrica", 2, "var(--fabrica)"], ["gabinete", 2, "var(--gabinete)"]];
const barra = `<div class="barra-piso">${usos.map(([, k, c]) => `<i style="flex:${k};background:${c}"></i>`).join("")}</div><p class="mut" style="font-size:12px;margin:0 0 6px">${usos.map(([u, k]) => `${u} ${k}`).join(" · ")} pisos</p>`;
$("#tablas").innerHTML = [
  tabla("El edificio", [["Lado", `${E.lado} m`], ["Fondo del anillo", `${E.fondo_anillo} m`], ["Patio", `${E.patio} m`], ["Planta tipo", `${n(E.planta_tipo_m2)} m²`], ["Pisos", E.pisos], ["Altura", `~${E.altura_total_aprox} m`], ["Piso a piso", `${E.altura_piso_tipo} m (${E.altura_libre_tipo} libres)`], ["Sobre el suelo", `${n(E.superficie_sobre_suelo_m2 / 1e6, 2)} M m²`], ["Personas", n(E.total_personas)]]),
  tabla("Quién va en qué piso", E.personas_por_piso.map(f => [`Pisos ${f.pisos[0]}–${f.pisos[1]} · ${f.uso}`, f.personas ? `${n(f.personas)} / piso` : "—"]), barra),
  tabla("Los 11 sótanos", S.niveles.map(l => [`${l.n} · ${l.h} m`, l.uso]).concat([["Profundidad", `~${S.profundidad_total_aprox} m`]])),
  tabla("Llegar", [["Bajo el bosque (4 esquinas, 2 niveles)", n(Es.esquinas.cajones)], ["Bajo el edificio (S2–S3)", n(Es.bajo_edificio.cajones)], ["Teatro 999", n(Es.teatro_999.cajones)], ["Motos", n(Es.motos)], ["Bicis", n(Es.bicis)], ["Total coches", n(Es.total_coches)], ["Del coche al escritorio", `${Es.del_coche_al_escritorio_min} min`]]),
  tabla("Comer", [["Mercados de los 32 estados", `${P.comer.mercados.cantidad} × ${n(P.comer.mercados.asientos)} asientos`], ["Comedores de planta baja", `${P.comer.comedores_pb.cantidad} × ${n(P.comer.comedores_pb.asientos)}`], ["Cafés de piso", P.comer.cafes_de_piso], ["Restaurantes del bosque", P.comer.restaurantes_bosque], ["Mirador 33", P.comer.mirador_33], ["Cocina central", `${n(P.comer.comidas_dia_cocina_central)} comidas/día`]]),
  tabla("Los 12 gimnasios", P.gimnasios.map(g => [g.nombre, g.donde])),
  tabla("Teatros", [["Teatro 333", `${P.teatros.t333.sala_m2} m², nadie a más de ${P.teatros.t333.distancia_max} m`], ["Teatro 999", `${n(P.teatros.t999.sala_m2)} m², nadie a más de ${P.teatros.t999.distancia_max} m`], ["Paso entre filas", `${P.teatros.butaca.paso_filas} m`], ["Ancho de butaca", `${P.teatros.butaca.ancho} m`]]),
  tabla("Agua y energía", [["Lluvia captable", `${n(P.agua.captacion_m3_anio)} m³/año`], ["Consumo", `${n(P.agua.consumo_m3_anio)} m³/año`], ["Cisternas", `${n(P.agua.cisternas_m3)} m³`], ["Paneles de azotea", `${P.energia.paneles_gwh} GWh/año`], ["Edificio", `${P.energia.edificio_gwh} GWh/año`], ["La Bóveda", `${P.energia.boveda_gwh[0]}–${n(P.energia.boveda_gwh[1])} GWh/año`], ["Baterías", `${P.energia.baterias_mwh} MWh`]]),
  tabla("Metas", Object.entries(P.metas).map(([k, v]) => [k.replace(/_/g, " ").replace(/\bmin\b/, "(min)").replace(/\bh\b/, "(horas)").replace(/dias/, "(días)"), v])),
  tabla("Obra", [["Años", P.obra.anios], ["Abre el bosque", `año ${P.obra.bosque_abre_anio}`], ["Primer lado ocupado", `año ${P.obra.primer_lado_ocupado_anio}`], ["Orden de magnitud", `US$ ${n(P.obra.costo_usd_millones[0])}–${n(P.obra.costo_usd_millones[1])} M`]]),
].join("");

/* ---------- documentos ---------- */
const slug = s => s.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");
async function cargarDoc(nombre) {
  const art = $("#articulo");
  art.dataset.listo = "1";
  $$("#docs button").forEach(b => b.setAttribute("aria-pressed", b.dataset.d === nombre));
  art.innerHTML = '<p class="mut">Cargando…</p>';
  const md = await (await fetch("/" + nombre + "?v=" + _rev)).text();
  while (!window.marked) await new Promise(r => setTimeout(r, 50));
  art.innerHTML = window.marked.parse(md.replace(/<!--[\s\S]*?-->/g, ""));
  art.querySelectorAll("h1,h2,h3").forEach(h => { h.id = slug(h.textContent); });
  art.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => { e.preventDefault(); document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)))?.scrollIntoView({ behavior: "smooth", block: "start" }); }));
  art.querySelectorAll('a[href$=".json"],a[href$=".md"]').forEach(a => { const h = a.getAttribute("href"); if (h.endsWith("parametros.json")) a.href = "/parametros.json"; else if (/^(PROYECTO|PROMPT|ORIGEN)\.md$/.test(h)) { a.href = "#proyecto"; a.addEventListener("click", e => { e.preventDefault(); cargarDoc(h); scrollTo(0, 0); }); } });
  scrollTo(0, 0);
}
$$("#docs button").forEach(b => b.addEventListener("click", () => cargarDoc(b.dataset.d)));
// RLR · fin
