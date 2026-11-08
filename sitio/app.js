// RLR · Edificio de Gobierno · pestañas, plano, números y documentos — Ricardo López Reyero
// Todo sale de parametros.json (+ recorridos.json) y de los derivados compartidos con el 3D.
import { derivar } from "/derivados.js?v=1";
const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218; // firma
const VER = 19; // sube al cambiar tres.js
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const n = (v, d = 0) => Number(v).toLocaleString("es-MX", { maximumFractionDigits: d, minimumFractionDigits: d });

const [P, R] = await Promise.all([fetch("/parametros.json?v=" + VER).then(r => r.json()), fetch("/recorridos.json?v=" + VER).then(r => r.json())]);
const D = derivar(P);
window.EDIFICIO = { P, R, D, tres: null };

/* ---------- pestañas ---------- */
let cargando3D = null;
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

function cargar3D() {
  if (cargando3D) return cargando3D;
  cargando3D = import("/tres.js?v=" + VER).then(m => { window.EDIFICIO.tres = m; }).catch(e => { $("#cargando").innerHTML = `<p>No se pudo cargar el 3D.<br><small>${e.message}</small></p>`; console.error(e); });
  return cargando3D;
}

/* ---------- plano: tres escalas en SVG, dibujadas desde los parámetros ---------- */
function svg(w, h, cuerpo) { return `<svg viewBox="${-w / 2 - 20} ${-h / 2 - 20} ${w + 40} ${h + 40}" xmlns="http://www.w3.org/2000/svg" role="img">${cuerpo}</svg>`; }
const rect = (x, y, w, h, f, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${extra}/>`;
const elipse = (x, y, rx, ry, f) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"/>`;
const txt = (x, y, s, size, f = "#e6e8ec", extra = "") => `<text x="${x}" y="${y}" font-size="${size}" fill="${f}" text-anchor="middle" dominant-baseline="middle" ${extra}>${s}</text>`;
const COLOR_MAT = { vidrio: "#2a3a4a", piedra_pb: "#5a2c22", piedra_torre: "#6f6b62", cantera: "#8d8a82", recinto: "#34343a", tezontle: "#5a2c22", bronce: "#8a6f45", pv: "#0f1f3f", asfalto: "#1e2026", cancha: "#2f6f6f", pista: "#b86a3c", pradera: "#2d5a3a", bosque_suelo: "#1b3a26", milpa: "#7a8a3a", blanco: "#d9d5cc" };
// RLR · dibuja un emplazamiento con su parte principal (la primera) y su nombre
function dibujarEmplazamiento(e, size) {
  const p = e.partes?.[0], [x, z] = e.pos_xz, [w, d] = e.medida_xz, nombre = e.etiqueta?.texto || e.ficha?.t?.split(" · ")[0] || e.id;
  let s = p?.tipo === "loma" ? elipse(x, z, w / 2, d / 2, COLOR_MAT[p.material] || "#2d5a3a") : rect(x - w / 2, z - d / 2, w, d, COLOR_MAT[p?.material] || "#555");
  (e.partes || []).filter(q => q.tipo === "asta").forEach(q => { s += `<circle cx="${x + q.dxz[0]}" cy="${z + q.dxz[1]}" r="6" fill="${q.bandera ? "#ce1126" : "#9aa1ad"}"/>`; });
  (e.partes || []).filter(q => q.tipo === "sendero").forEach(q => { s += `<line x1="${x + q.desde[0]}" y1="${z + q.desde[1]}" x2="${x + q.hasta[0]}" y2="${z + q.hasta[1]}" stroke="#8a6f45" stroke-width="${q.ancho}"/>`; });
  return s + txt(x, z, nombre, size, "#e6e8ec");
}
function planoTerreno() {
  const T = D.T, C = D.C;
  let s = rect(-T / 2, -T / 2, T, T, "#17301f", 'stroke="#23262e" stroke-width="2"');
  P.terreno.celdas.filter(c => c.id !== "centro").forEach(c => { const [i, j] = c.ij; s += rect(i * C - C / 2, j * C - C / 2, C, C, "#1b3a26", 'stroke="#2b4a36"'); if (i && j) { s += txt(i * C, j * C - 14, "Bosque", 20, "#9fc7a9") + txt(i * C, j * C + 14, "estacionamiento debajo", 14, "#7c8490"); } });
  P.terreno.puertas.forEach((pu, k) => { const [x, z] = D.plazas[k]; s += rect(x - D.plaza / 2, z - D.plaza / 2, D.plaza, D.plaza, "#5a2c22"); const [cx, cz] = [[0, -C], [0, C], [C, 0], [-C, 0]][k]; s += txt(cx, cz - 110, pu.nombre, 20, "#9fc7a9"); });
  P.emplazamientos.filter(e => e.grupo === "sitio").forEach(e => s += dibujarEmplazamiento(e, 13));
  s += rect(-D.L / 2, -D.L / 2, D.L, D.L, "#8d8a82") + rect(-D.LI / 2, -D.LI / 2, D.LI, D.LI, "#245a3a") + rect(-D.CASA / 2, -D.CASA / 2, D.CASA, D.CASA, "#b08d57") + txt(0, 0, "Casa", 18, "#111");
  return svg(T, T, s);
}
function planoEdificio() {
  const { L, F, LI, VANO, CASA, M, aguaExt, calzadaLargo } = D, nuc = P.edificio.nucleos;
  let s = rect(-L / 2, -L / 2, L, L, "#8d8a82", 'stroke="#c9ced6" stroke-width="1.5"') + rect(-LI / 2, -LI / 2, LI, LI, "#245a3a");
  let g = ""; for (let i = 0; i <= P.edificio.geometria.reticula.modulos_por_lado; i++) { const p = -L / 2 + i * M; g += `M${p} ${-L / 2}V${L / 2}M${-L / 2} ${p}H${L / 2}`; }
  s += `<path d="${g}" stroke="#ffffff" stroke-opacity=".08" stroke-width=".6" fill="none"/>`;
  [[0, -L / 2 + F / 2], [0, L / 2 - F / 2], [L / 2 - F / 2, 0], [-L / 2 + F / 2, 0]].forEach(([x, y], k) => { const h = k < 2; s += rect(x - (h ? VANO / 2 : F / 2), y - (h ? F / 2 : VANO / 2), h ? VANO : F, h ? F : VANO, "#3fb27f", 'fill-opacity=".85"'); });
  const n2 = nuc.esquina_lado_m, TW = D.torre.lado, cc = D.torre.centro;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => { s += rect(i * cc - TW / 2, j * cc - TW / 2, TW, TW, "#6f6b62", 'stroke="#c9ced6" stroke-width=".8"'); s += rect(i * (L / 2 - M) - n2 / 2, j * (L / 2 - M) - n2 / 2, n2, n2, "#3a3a3c"); });
  [[VANO / 2, -L / 2 + F / 2], [VANO / 2, L / 2 - F / 2], [L / 2 - F / 2, VANO / 2], [-L / 2 + F / 2, VANO / 2]].forEach(([x, y], k) => s += rect(x - (k < 2 ? n2 / 2 : F / 2), y - (k < 2 ? F / 2 : n2 / 2), k < 2 ? n2 : F, k < 2 ? F : n2, "#3a3a3c"));
  [[0, -1], [0, 1], [1, 0], [-1, 0]].forEach(([i, j]) => { const w = i ? M : M, x = i ? i * (L / 2 - F / 2) : 0, y = j ? j * (L / 2 - F / 2) : 0; s += rect(x - (i ? F / 2 : M / 2), y - (j ? F / 2 : M / 2), i ? F : M, j ? F : M, "#a0442f"); });
  s += rect(-aguaExt / 2, -aguaExt / 2, aguaExt, aguaExt, "#2f6f9f") + rect(-CASA / 2, -CASA / 2, CASA, CASA, "#b08d57") + rect(-D.SUITE / 2, -D.SUITE / 2, D.SUITE, D.SUITE, "#8d6a3a") + rect(-M / 2, -M / 2, M, M, "#dfe6ee") + rect(-2.5, -2.5, 5, 5, "#3fb27f");
  [[0, -1], [0, 1], [1, 0], [-1, 0]].forEach(([i, j]) => { const w = i ? calzadaLargo : M, h = j ? calzadaLargo : M, x = i ? i * (CASA / 2 + calzadaLargo / 2) : 0, y = j ? j * (CASA / 2 + calzadaLargo / 2) : 0; s += rect(x - w / 2, y - h / 2, w, h, "#a0442f"); });
  P.emplazamientos.filter(e => e.grupo === "patio").forEach(e => s += dibujarEmplazamiento(e, 9));
  const sec = Object.fromEntries(P.edificio.sectores.map(x => [x.id, x.nombre]));
  s += txt(0, -L / 2 - 10, "Norte · " + sec.norte, 12, "#9aa1ad") + txt(0, L / 2 + 12, "Sur · " + sec.sur, 12, "#9aa1ad") + txt(L / 2 + 10, 0, "Oriente · " + sec.oriente, 12, "#9aa1ad", `transform="rotate(90 ${L / 2 + 10} 0)"`) + txt(-L / 2 - 10, 0, "Poniente · " + sec.poniente, 12, "#9aa1ad", `transform="rotate(-90 ${-L / 2 - 10} 0)"`);
  return svg(L, L, s);
}
function planoSuite() {
  const S = P.casa_de_decisiones.suite, c = S.celda_m, T = S.tablero, pp = S.pasillo_preparacion_m, lado = S.lado_m;
  let s = rect(-lado / 2 - pp, -lado / 2 - pp, lado + 2 * pp, lado + 2 * pp, "#2a2420", 'stroke="#b08d57" stroke-width=".6"');
  T.forEach((fila, j) => fila.forEach((nombre, i) => {
    const x = (i - 1) * c, y = (j - 1) * c, centro = i === 1 && j === 1, oficina = /Vice|Secre/.test(nombre);
    s += rect(x - c / 2 + .3, y - c / 2 + .3, c - .6, c - .6, centro ? "#b08d57" : oficina ? "#3a3a3c" : "#245a3a", 'rx=".4"');
    const partes = nombre.split(/\s(?=\()/);
    s += txt(x, y - (partes[1] ? 1 : 0), partes[0].replace("Oficina del Presidente", "Presidente"), 2.2, centro ? "#111" : "#e6e8ec", 'font-weight="600"');
    if (partes[1]) s += txt(x, y + 2.2, partes[1], 1.8, "#cfe8d8");
    if (centro) s += rect(-2.5, -2.5, 5, 5, "#3fb27f") + txt(0, 4.3, "patio · magnolia", 1.3, "#111");
  }));
  [[0, -c / 2], [0, c / 2], [c / 2, 0], [-c / 2, 0]].forEach(([x, y]) => s += rect(x - (y ? 2 : .5), y - (x ? 2 : .5), y ? 4 : 1, x ? 4 : 1, "#f0e6d2"));
  s += txt(0, lado / 2 + pp / 2, "pasillo de preparación · antesalas · cuartos de resultado · el carrusel", 1.5, "#9aa1ad");
  return svg(lado + 2 * pp, lado + 2 * pp, s);
}
$("#planos").innerHTML = `
  <div class="plano"><h2>El terreno · ${D.T} × ${D.T} m</h2><p>Nueve celdas de ${D.C} m. El edificio al centro, cuatro puertas, cuatro esquinas de bosque con el estacionamiento debajo. Cada pieza sale de <code>emplazamientos</code>.</p>${planoTerreno()}</div>
  <div class="plano"><h2>El edificio · ${D.L} × ${D.L} m</h2><p>Anillo de ${D.F} m, retícula de ${D.M} m, 8 núcleos, 4 torres de esquina, 4 parques de cielo (verde), 4 zaguanes, el agua, la Casa con su linterna y las cuatro calzadas.</p>${planoEdificio()}</div>
  <div class="plano"><h2>La suite de decisión · ${D.SUITE} × ${D.SUITE} m</h2><p>Nueve celdas de ${P.casa_de_decisiones.suite.celda_m} m: el Presidente al centro con cuatro puertas, seis salas conectadas, Vicepresidencia y Secretaría en las esquinas opuestas.</p>${planoSuite()}</div>`;

/* ---------- números ---------- */
function tabla(titulo, filas, extra = "") { return `<div class="tabla"><h2>${titulo}</h2>${extra}<table>${filas.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table></div>`; }
const G = P.edificio.geometria, Es = P.estacionamiento, Co = P.servicios.comer, Rc = P.recintos, Mv = P.movilidad, Nu = P.edificio.nucleos;
const barra = `<div class="barra-piso">${P.edificio.usos.map(u => `<i style="flex:${u.pisos[1] - u.pisos[0] + 1};background:${u.color}"></i>`).join("")}</div><p class="mut" style="font-size:12px;margin:0 0 6px">${P.edificio.usos.map(u => `${u.nombre.split(" ·")[0]} ${u.pisos[1] - u.pisos[0] + 1}`).join(" · ")} pisos</p>`;
$("#tablas").innerHTML = [
  tabla("El edificio", [["Lado", `${D.L} m`], ["Fondo del anillo", `${D.F} m`], ["Patio", `${D.LI.toFixed(1)} m`], ["Planta tipo", `${n(D.plantaTipo_m2)} m²`], ["Pisos", G.pisos], ["Techo", `${D.H_TOP} m · torres a ${D.torre.altoTotal} m`], ["Piso a piso", `${G.altura_piso_m} m (${G.altura_libre_m} libres)`], ["Sobre el suelo", `${n(D.sobreSuelo_m2 / 1e6, 2)} M m²`], ["Personas", n(D.personas)], ["Bahías de la greca", n(D.greca)]]),
  tabla("Quién va en qué piso", P.edificio.personas.por_piso.map(f => [`Pisos ${f.pisos[0]}–${f.pisos[1]} · ${f.uso}`, f.personas ? `${n(f.personas)} / piso` : "—"]), barra),
  tabla("Elevadores", [["Esquema", Nu.esquema], ["Lanzaderas de doble cabina", `${Nu.por_nucleo.lanzaderas_doble_cabina} × 8 = ${Nu.por_nucleo.lanzaderas_doble_cabina * 8}`], ["Locales", `${Nu.por_nucleo.locales_por_zona} × ${Nu.por_nucleo.zonas} zonas × 8 = ${Nu.por_nucleo.locales_por_zona * Nu.por_nucleo.zonas * 8}`], ["Servicio y evacuación", `${(Nu.por_nucleo.servicio + Nu.por_nucleo.evacuacion) * 8}`], ["Total", `${D.elevadoresTotal} elevadores · ${D.cabinasTotal} cabinas`], ["Suben los 30,000 en", `${Nu.metas.subir_todos_min} min`]]),
  tabla("Los 11 sótanos", P.sotanos.niveles.map(l => [`${l.id} · ${l.alto_m} m`, l.uso]).concat([["Profundidad", `~${D.profundidad_m} m`]])),
  tabla("Llegar", [["Bajo el bosque (4 esquinas, 2 niveles)", n(D.cajonesEsquinas)], ["Bajo el edificio (S2–S3)", n(Es.bajo_edificio.cajones)], ["Plaza Sur", n(Es.plaza_sur.cajones)], ["Motos", n(Es.motos)], ["Bicis", n(Es.bicis)], ["Total coches", n(D.cajonesTotal)], ["Patios de luz", `${Es.esquinas.patios_de_luz.por_esquina} por esquina`], ["Del coche al escritorio", `${Mv.tiempos_min.coche_a_escritorio} min`], ["Del andén al escritorio", `${Mv.tiempos_min.anden_a_escritorio} min`]]),
  tabla("Comer", [["Mercados de los 32 estados", `${Co.mercados.cantidad} × ${n(Co.mercados.asientos)} asientos`], ["Comedores de planta baja", `${Co.comedores_pb.cantidad} × ${n(Co.comedores_pb.asientos)}`], ["Cafés de piso", Co.cafes_de_piso], ["Restaurantes del bosque y de los teatros", Co.restaurantes_bosque + Co.restaurantes_teatros], ["Cafeterías de la estación", Co.cafeterias_estacion], ["Mirador 33", Co.mirador_33], ["Cocina central", `${n(Co.comidas_dia_cocina_central)} comidas/día`]]),
  tabla("Baños", [["Bloque tipo", `${P.servicios.banos.bloque_tipo.m2} m²: ${P.servicios.banos.bloque_tipo.cabinas_completas} cabinas completas + ${P.servicios.banos.bloque_tipo.mingitorios} mingitorios`], ["Bloques por piso", `${P.servicios.banos.bloques_por_piso} (+${P.servicios.banos.extra_pisos_densos} en los densos)`], ["Total", `~${n(P.servicios.banos.total_bloques)} bloques · ~${n(P.servicios.banos.total_muebles)} muebles`], ["Distancia máxima", `${P.servicios.banos.distancia_max_m} m`]]),
  tabla("Los 12 gimnasios", P.servicios.gimnasios.map(g => [g.nombre, g.donde])),
  tabla("Teatros y eventos", [["Teatro 333", `${Rc.teatro_333.sala_m2} m², nadie a más de ${Rc.teatro_333.distancia_max_m} m · foyer ${Rc.teatro_333.foyer.medida_xz.join(" × ")} m`], ["Teatro 999", `${n(Rc.teatro_999.sala_m2)} m², nadie a más de ${Rc.teatro_999.distancia_max_m} m · foyer ${Rc.teatro_999.foyer.medida_xz.join(" × ")} m`], ["Salón de Eventos", `${Rc.salon_de_eventos.medida_xz.join(" × ")} m · ${n(Rc.salon_de_eventos.capacidad.de_pie)} de pie · ${Rc.salon_de_eventos.capacidad.stands_3x3} stands`], ["Paso entre filas", `${Rc.butaca.paso_filas_m} m`], ["Ancho de butaca", `${Rc.butaca.ancho_m} m`]]),
  tabla("Agua y energía", [["Lluvia captable", `${n(P.agua.captacion_m3_anio)} m³/año`], ["Consumo", `${n(P.agua.consumo_m3_anio)} m³/año`], ["Cisternas", `${n(P.agua.cisternas_m3)} m³`], ["Paneles de azotea", `${P.energia.paneles_gwh} GWh/año`], ["Edificio", `${P.energia.edificio_gwh} GWh/año`], ["La Bóveda", `${P.energia.boveda_gwh[0]}–${n(P.energia.boveda_gwh[1])} GWh/año`], ["Baterías", `${P.energia.baterias_mwh} MWh`]]),
  tabla("Metas", Object.entries(P.metas).map(([k, v]) => [k.replace(/_/g, " ").replace(/\bmin\b/, "(min)").replace(/\bh\b/, "(horas)").replace(/dias/, "(días)"), v])),
  tabla("Obra", [["Años", P.obra.anios], ["Abre el bosque", `año ${P.obra.bosque_abre_anio}`], ["Primer lado ocupado", `año ${P.obra.primer_lado_ocupado_anio}`], ["Orden de magnitud", `US$ ${n(P.obra.costo_usd_m[0])}–${n(P.obra.costo_usd_m[1])} M`]]),
].join("");

/* ---------- documentos ---------- */
const slug = s => s.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");
async function cargarDoc(nombre) {
  const art = $("#articulo");
  art.dataset.listo = "1";
  $$("#docs button").forEach(b => b.setAttribute("aria-pressed", b.dataset.d === nombre));
  art.innerHTML = '<p class="mut">Cargando…</p>';
  const md = await (await fetch("/" + nombre + "?v=" + VER)).text();
  while (!window.marked) await new Promise(r => setTimeout(r, 50));
  art.innerHTML = window.marked.parse(md.replace(/<!--[\s\S]*?-->/g, ""));
  art.querySelectorAll("h1,h2,h3").forEach(h => { h.id = slug(h.textContent); });
  art.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => { e.preventDefault(); document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)))?.scrollIntoView({ behavior: "smooth", block: "start" }); }));
  art.querySelectorAll('a[href$=".json"],a[href$=".md"]').forEach(a => { const h = a.getAttribute("href"); if (h.endsWith("parametros.json")) a.href = "/parametros.json"; else if (/^(PROYECTO|PROMPT|ORIGEN)\.md$/.test(h)) { a.href = "#proyecto"; a.addEventListener("click", e => { e.preventDefault(); cargarDoc(h); scrollTo(0, 0); }); } });
  scrollTo(0, 0);
}
$$("#docs button").forEach(b => b.addEventListener("click", () => cargarDoc(b.dataset.d)));
// RLR · fin
