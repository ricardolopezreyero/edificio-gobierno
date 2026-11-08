// RLR · Edificio de Gobierno · pestañas, plano, números y documentos — Ricardo López Reyero
// Todo sale de parametros.json (+ recorridos.json) y de los derivados compartidos con el 3D.
import { derivar } from "/derivados.js?v=1";
const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218; // firma
const VER = 21; // sube al cambiar tres.js
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
// RLR · cota: línea con remates y texto, en metros
const cota = (x1, y1, x2, y2, texto, size = 8, color = "#b08d57") => { const h = y1 === y2, mx = (x1 + x2) / 2, my = (y1 + y2) / 2, t = size * 0.6; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${size / 10}"/>` + (h ? `<line x1="${x1}" y1="${y1 - t}" x2="${x1}" y2="${y1 + t}" stroke="${color}" stroke-width="${size / 10}"/><line x1="${x2}" y1="${y2 - t}" x2="${x2}" y2="${y2 + t}" stroke="${color}" stroke-width="${size / 10}"/>` : `<line x1="${x1 - t}" y1="${y1}" x2="${x1 + t}" y2="${y1}" stroke="${color}" stroke-width="${size / 10}"/><line x1="${x2 - t}" y1="${y2}" x2="${x2 + t}" y2="${y2}" stroke="${color}" stroke-width="${size / 10}"/>`) + txt(mx, my - (h ? size * 0.7 : 0), texto, size, color, h ? "" : `transform="rotate(-90 ${mx} ${my})"`); };
function planoCorte() { // corte vertical por el eje norte–sur: sótanos, el anillo con sus usos, el vano, la Casa y la linterna
  const { L, F, LI, NP, H0, HP, yPiso, H_TOP, CASA } = D, prof = D.profundidad_m, esc = 1, W = L + 120, Hh = H_TOP + 12 + prof + 20;
  let s = rect(-W / 2, -(H_TOP + 30), W, Hh, "#0d1117");
  s += rect(-L / 2 - 60, 0, L + 120, prof + 12, "#2a2118"); // tierra
  let y = 0; P.sotanos.niveles.forEach(l => { y += l.alto_m; s += rect(-L / 2, y - l.alto_m, L, l.alto_m - 0.3, l.color) + txt(-L / 2 - 28, y - l.alto_m / 2, l.id, 7, "#cfd3da"); });
  const T = P.edificio.arquitectura.torres_esquina, pc = P.edificio.parques_de_cielo.pisos;
  [[-1, "N"], [1, "S"]].forEach(([sg]) => { const x0 = sg < 0 ? -L / 2 : L / 2 - F;
    for (let k = 0; k <= NP; k++) { const yb = -yPiso(k + 1), h = k ? HP : H0, enVano = k >= pc[0] && k <= pc[2]; if (enVano) continue; const u = D.usoDe(k); s += rect(x0, yb, F, h - 0.25, k <= 3 ? "#5a2c22" : u.color); }
    s += rect(x0 - 2.2, -H_TOP, F + 2.2, yPiso(32 + 1) - yPiso(32) + HP, "#3b4a5c"); // remate
    s += rect(x0 - 1, -H_TOP - 1, F + 2, 1, "#8d8a82"); // techo
    s += rect(x0 - 1.2, -(yPiso(pc[0]) + (yPiso(pc[2] + 1) - yPiso(pc[0]))), 1.2, yPiso(pc[2] + 1) - yPiso(pc[0]), "#b08d57"); // marco del vano
    for (let c = 0; c < 4; c++) s += rect(x0 + 2 + c * (F - 4) / 3, -yPiso(pc[2] + 1), 1, yPiso(pc[2] + 1) - yPiso(pc[0]), "#8d8a82"); // columnas del vano
    s += rect(x0, -20, F, 20, "#5a2c22"); s += rect(x0 + (sg < 0 ? 0 : F - 11.1), -11, 11.1, 11, "#0d1117"); // basamento y zaguán
  });
  // patio: agua, Casa, linterna, calzadas
  s += rect(-LI / 2, -0.4, LI, 0.4, "#245a3a") + rect(-D.aguaExt / 2, -0.3, D.aguaExt, 0.3, "#2f6f9f");
  const hC = P.casa_de_decisiones.altura_planta_baja_m, hA = P.casa_de_decisiones.altura_planta_alta_m, hL = P.casa_de_decisiones.linterna.altura_total_m;
  s += rect(-CASA / 2, -(hC + hA), CASA, hC + hA, "#b08d57") + rect(-D.SUITE / 2, -hC, D.SUITE, hC, "#8d6a3a") + rect(-5.55, -hL, 11.1, hL, "#dfe6ee") + rect(-CASA / 2 - 3.3, -hC, 3.3, hC, "#8d8a82") + rect(CASA / 2, -hC, 3.3, hC, "#8d8a82");
  [[-1], [1]].forEach(([sg]) => s += rect(sg > 0 ? CASA / 2 : -LI / 2, -5.6, (LI - CASA) / 2, 0.5, "#8a6f45"));
  // cotas
  s += cota(L / 2 + 12, 0, L / 2 + 12, -H_TOP, "159.5 m · 33 pisos", 7) + cota(L / 2 + 22, 0, L / 2 + 22, prof, `${prof} m · 11 sótanos`, 7) + cota(-L / 2, prof + 16, L / 2, prof + 16, "333 m", 8) + cota(-L / 2, -H_TOP - 8, -L / 2 + F, -H_TOP - 8, "33.3", 6) + cota(-CASA / 2, -(hL + 4), CASA / 2, -(hL + 4), "Casa 99 m · linterna 22 m", 6);
  [[-yPiso(4), "24.5 basamento"], [-yPiso(pc[0]), "78.5 parque de cielo"], [-yPiso(pc[2] + 1), "92"], [-yPiso(32), "150.5 remate"]].forEach(([yy, t]) => s += `<line x1="${L / 2 + 1}" y1="${yy}" x2="${L / 2 + 8}" y2="${yy}" stroke="#7c8490" stroke-width=".5"/>` + txt(L / 2 + 44, yy, t, 6, "#9aa1ad"));
  return `<svg viewBox="${-W / 2 - 10} ${-(H_TOP + 34)} ${W + 20} ${Hh + 10}" xmlns="http://www.w3.org/2000/svg" role="img">${s}</svg>`;
}
function planoManzana() { // planta amueblada de una manzana de operación: 4 módulos × 3 bandas, vista desde arriba (ventana exterior abajo)
  const { M, F } = D, MB = P.mobiliario, R = MB.por_uso.operacion, IS = MB.islas, W = 4 * M, muebles = { mesa: "#8a5a3a", silla: "#3b3f46", cubiculo: "#9fc7e8", junta: "#7a5030", redonda: "#8d8a82", banca: "#8a5a3a", maceta: "#3f8a4a" };
  let s = rect(0, 0, W, F, "#141a22");
  [M, 2 * M].forEach(v => s += `<line x1="0" y1="${v}" x2="${W}" y2="${v}" stroke="#2b3340" stroke-width=".3"/>`);
  for (let i = 0; i <= 4; i++) s += `<line x1="${i * M}" y1="0" x2="${i * M}" y2="${F}" stroke="#2b3340" stroke-width=".3"/>`;
  const mesa = (x, y, ry) => rect(x - (ry ? 0.45 : 0.9), y - (ry ? 0.9 : 0.45), ry ? 0.9 : 1.8, ry ? 1.8 : 0.9, muebles.mesa, 'rx=".1"');
  const silla = (x, y) => rect(x - 0.25, y - 0.25, 0.5, 0.5, muebles.silla, 'rx=".12"');
  const isla = (uc, vc) => { let t = ""; IS.pares_u.forEach(du => IS.filas_v.forEach(dv => { t += mesa(uc + du, vc + dv, true) + silla(uc + Math.sign(du) * IS.silla_fuera_u, vc + dv); })); return t + `<circle cx="${uc}" cy="${vc + IS.largo_v / 2 + 0.9}" r=".55" fill="${muebles.maceta}"/>`; };
  const salaJ = (uc, vc, tam) => { const [lt, wt] = MB.catalogo.find(c => c.id === "junta").tamanos[tam].medida, n = MB.catalogo.find(c => c.id === "junta").tamanos[tam].sillas, porLado = Math.max(1, Math.floor((n - 2) / 2)); let t = rect(uc - lt / 2, vc - wt / 2, lt, wt, muebles.junta, 'rx=".2"'); for (let j = 1; j <= porLado; j++) [-1, 1].forEach(sg => t += silla(uc - lt / 2 + j * lt / (porLado + 1), vc + sg * (wt / 2 + 0.45))); [-1, 1].forEach(sg => t += silla(uc + sg * (lt / 2 + 0.45), vc)); return t; };
  const cub = (uc, vc) => rect(uc - 1, vc - 1, 2, 2, muebles.cubiculo, 'fill-opacity=".6" stroke="#9fc7e8" stroke-width=".15"');
  for (let i = 0; i < 4; i++) { const uc = i * M + M / 2;
    R.islas_u.forEach(du => { s += isla(uc + du, IS.v_centro) + isla(uc + du, F - IS.v_centro); });
    s += rect(uc - 1.1, 8.6 - 0.22, 2.2, 0.45, muebles.banca) + rect(uc - 1.1, F - 8.6 - 0.22, 2.2, 0.45, muebles.banca);
    const pat = R.banda_media[i % 4];
    if (pat === "cubiculos") for (let j = 0; j < 4; j++) s += cub(uc - 3.9 + j * 2.6, 13.3);
    else if (pat === "estancia") { MB.estancia.bancas_v.forEach(v => s += rect(uc - 1.1, v - 0.22, 2.2, 0.45, muebles.banca)); s += `<circle cx="${uc}" cy="16.65" r=".8" fill="${muebles.redonda}"/>`; MB.estancia.macetas_u.forEach(du => s += `<circle cx="${uc + du}" cy="16.65" r=".55" fill="${muebles.maceta}"/>`); }
    else if (pat === "charla") s += salaJ(uc - 2.4, 16.65, "charla") + cub(uc + 3.6, 13.3) + cub(uc + 3.6, 20);
    else s += salaJ(uc, 16.65, pat);
    if (i > 0) { s += `<line x1="${i * M}" y1="0.6" x2="${i * M}" y2="10.5" stroke="#9fc7e8" stroke-width=".25" stroke-dasharray=".6 .4"/><line x1="${i * M}" y1="${F - 10.5}" x2="${i * M}" y2="${F - 0.6}" stroke="#9fc7e8" stroke-width=".25" stroke-dasharray=".6 .4"/>`; }
    s += txt(uc, 2.2 + 8, ["cubículos", "sala de equipo", "estancia", "sala de charla"][i % 4], 1.1, "#9aa1ad");
  }
  s += txt(W / 2, -1.2, "ventana al bosque", 1.2, "#9aa1ad") + txt(W / 2, F + 1.6, "ventana al parque", 1.2, "#9aa1ad") + cota(0, F + 3.2, M, F + 3.2, "11.1 · un barrio de 8", 1.1) + cota(W + 1.5, 0, W + 1.5, M, "banda exterior", 1) + cota(W + 1.5, M, W + 1.5, 2 * M, "banda media", 1) + cota(W + 1.5, 2 * M, W + 1.5, F, "banda interior", 1) + cota(-1.5, 0, -1.5, F, "33.3", 1.1);
  return `<svg viewBox="-4 -3 ${W + 10} ${F + 8}" xmlns="http://www.w3.org/2000/svg" role="img">${s}</svg>`;
}
function planoCasa() { // la Casa de Decisiones: agua, portales, suite, linterna, salas de espera, calzadas
  const { CASA, SUITE, AGUA, M } = D, C = P.casa_de_decisiones, ext = CASA / 2 + AGUA, W = 2 * ext + 60;
  let s = rect(-W / 2, -W / 2, W, W, "#245a3a") + rect(-ext, -ext, 2 * ext, 2 * ext, "#2f6f9f") + rect(-CASA / 2, -CASA / 2, CASA, CASA, "#b08d57");
  const pf = C.portales.fondo_m; s += rect(-CASA / 2 - pf, -CASA / 2 - pf, CASA + 2 * pf, CASA + 2 * pf, "none", 'stroke="#8d8a82" stroke-width=".6"');
  for (let k = 0; k <= 9; k++) { const u = -CASA / 2 + k * (CASA / 9); [[u, -CASA / 2 - pf], [u, CASA / 2 + pf], [CASA / 2 + pf, u], [-CASA / 2 - pf, u]].forEach(([x, z]) => s += `<circle cx="${x}" cy="${z}" r=".8" fill="#8d8a82"/>`); }
  s += rect(-SUITE / 2, -SUITE / 2, SUITE, SUITE, "#8d6a3a");
  C.suite.tablero.forEach((fila, j) => fila.forEach((n, i) => { const x = (i - 1) * M, z = (j - 1) * M, centro = i === 1 && j === 1; s += rect(x - M / 2 + .3, z - M / 2 + .3, M - .6, M - .6, centro ? "#dfe6ee" : /Vice|Secre/.test(n) ? "#3a3a3c" : "#245a3a") + txt(x, z, n.replace("Oficina del Presidente", "Presidente").replace(/\s\(.*\)/, ""), 1.9, centro ? "#111" : "#e6e8ec"); }));
  s += rect(-2.5, -2.5, 5, 5, "#3fb27f");
  [[0, -1], [0, 1], [1, 0], [-1, 0]].forEach(([i, j]) => { const d = ext + C.salas_espera.separacion_del_agua_m, [w, dd] = i ? [14, 22] : [22, 14]; s += rect(i * d - w / 2, j * d - dd / 2, w, dd, "#2a3a4a", 'stroke="#9fc7e8" stroke-width=".4"') + rect(i ? (i > 0 ? CASA / 2 : -ext - 30) : -M / 2, j ? (j > 0 ? CASA / 2 : -ext - 30) : -M / 2, i ? ext + 30 - CASA / 2 : M, j ? ext + 30 - CASA / 2 : M, "#a0442f", 'fill-opacity=".8"'); });
  s += txt(0, -ext - 24, "sala de espera de Estado y esclusa", 2.2, "#cfe8d8") + txt(CASA / 2 + 10, -CASA / 2 - 8, "portales 3.3 m", 2, "#cfd3da", 'text-anchor="start"');
  s += cota(-CASA / 2, CASA / 2 + pf + 6, CASA / 2, CASA / 2 + pf + 6, "99 m", 3) + cota(-ext, ext + 12, ext, ext + 12, "132 m · agua 16.5 m", 3) + cota(-SUITE / 2, -SUITE / 2 - 2.5, SUITE / 2, -SUITE / 2 - 2.5, "suite 33.3 · celda 11.1", 2.2) + cota(-ext - 16, -CASA / 2, -ext - 16, CASA / 2, "PB 11 m + PA 7 m · linterna 22 m", 2.2);
  return `<svg viewBox="${-W / 2 - 4} ${-W / 2 - 4} ${W + 8} ${W + 8}" xmlns="http://www.w3.org/2000/svg" role="img">${s}</svg>`;
}
function planoCelda(ij, titulo) { // una celda del terreno con sus piezas, la plaza y el borde del edificio
  const { C, L } = D, [ci, cj] = ij, cx = ci * C, cz = cj * C;
  let s = rect(cx - C / 2, cz - C / 2, C, C, "#1b3a26", 'stroke="#2b4a36"');
  const idx = [[0, -1], [0, 1], [1, 0], [-1, 0]].findIndex(([i, j]) => i === ci && j === cj); if (idx >= 0) { const [px, pz] = D.plazas[idx]; s += rect(px - D.plaza / 2, pz - D.plaza / 2, D.plaza, D.plaza, "#5a2c22"); }
  // veredas de la celda (malla de 111 m)
  const paso = P.terreno.veredas.malla_m; for (let k = -4; k <= 4; k++) { const v = k * paso; if (Math.abs(v - cx) <= C / 2) s += `<line x1="${v}" y1="${cz - C / 2}" x2="${v}" y2="${cz + C / 2}" stroke="#b9a27a" stroke-opacity=".45" stroke-width="1.2"/>`; if (Math.abs(v - cz) <= C / 2) s += `<line x1="${cx - C / 2}" y1="${v}" x2="${cx + C / 2}" y2="${v}" stroke="#b9a27a" stroke-opacity=".45" stroke-width="1.2"/>`; }
  P.emplazamientos.filter(e => e.grupo === "sitio" && Math.abs(e.pos_xz[0] - cx) < C / 2 + 20 && Math.abs(e.pos_xz[1] - cz) < C / 2 + 20).forEach(e => s += dibujarEmplazamiento(e, 8));
  s += rect(-L / 2, -L / 2, L, L, "#8d8a82", 'fill-opacity=".9"') + txt(0, 0, "edificio", 12, "#111");
  s += cota(cx - C / 2, cz + C / 2 + 14, cx + C / 2, cz + C / 2 + 14, "333 m", 9) + txt(cx, cz - C / 2 - 10, titulo, 11, "#9fc7a9");
  return `<svg viewBox="${cx - C / 2 - 24} ${cz - C / 2 - 24} ${C + 48} ${C + 48}" xmlns="http://www.w3.org/2000/svg" role="img">${s}</svg>`;
}
function planoTerreno() {
  const T = D.T, C = D.C;
  let s = rect(-T / 2, -T / 2, T, T, "#17301f", 'stroke="#23262e" stroke-width="2"');
  P.terreno.celdas.filter(c => c.id !== "centro").forEach(c => { const [i, j] = c.ij; s += rect(i * C - C / 2, j * C - C / 2, C, C, "#1b3a26", 'stroke="#2b4a36"'); if (i && j) { s += txt(i * C, j * C - 14, "Bosque", 20, "#9fc7a9") + txt(i * C, j * C + 14, "estacionamiento debajo", 14, "#7c8490"); } });
  P.terreno.puertas.forEach((pu, k) => { const [x, z] = D.plazas[k]; s += rect(x - D.plaza / 2, z - D.plaza / 2, D.plaza, D.plaza, "#5a2c22"); const [cx, cz] = [[0, -C], [0, C], [C, 0], [-C, 0]][k]; s += txt(cx, cz - 110, pu.nombre, 20, "#9fc7a9"); });
  P.emplazamientos.filter(e => e.grupo === "sitio").forEach(e => s += dibujarEmplazamiento(e, 13));
  s += rect(-D.L / 2, -D.L / 2, D.L, D.L, "#8d8a82") + rect(-D.LI / 2, -D.LI / 2, D.LI, D.LI, "#245a3a") + rect(-D.CASA / 2, -D.CASA / 2, D.CASA, D.CASA, "#b08d57") + txt(0, 0, "Casa", 18, "#111");
  s += cota(-T / 2, T / 2 + 12, T / 2, T / 2 + 12, "999 m · 3 celdas de 333", 14) + cota(-D.L / 2, -D.L / 2 - 10, D.L / 2, -D.L / 2 - 10, "333", 11) + cota(-T / 2 - 12, -T / 2, -T / 2 - 12, -T / 2 + C, "333 · estacionamiento debajo", 11);
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
  s += cota(-L / 2, L / 2 + 22, L / 2, L / 2 + 22, "333 m", 9) + cota(L / 2 + 20, -L / 2, L / 2 + 20, -L / 2 + F, "33.3", 7) + cota(L / 2 + 20, -LI / 2, L / 2 + 20, LI / 2, "patio 266.4 m", 8) + cota(-VANO / 2, -L / 2 - 6, VANO / 2, -L / 2 - 6, "parque de cielo 99", 7) + cota(-CASA / 2, CASA / 2 + 4, CASA / 2, CASA / 2 + 4, "99", 7);
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
  <div class="plano ancho"><h2>Corte por el eje Norte–Sur</h2><p>Los 11 sótanos, el basamento de tezontle, los pisos por uso, el parque de cielo con sus columnas pasantes, el remate, y al centro la Casa con su linterna. Cotas en metros.</p>${planoCorte()}</div>
  <div class="plano"><h2>El terreno · ${D.T} × ${D.T} m</h2><p>Nueve celdas de ${D.C} m. El edificio al centro, cuatro puertas, cuatro esquinas de bosque con el estacionamiento debajo. Cada pieza sale de <code>emplazamientos</code>.</p>${planoTerreno()}</div>
  <div class="plano"><h2>El edificio · ${D.L} × ${D.L} m</h2><p>Anillo de ${D.F} m, retícula de ${D.M} m, 8 núcleos, 4 torres de esquina, 4 parques de cielo (verde), 4 zaguanes, el agua, la Casa con su linterna y las cuatro calzadas.</p>${planoEdificio()}</div>
  <div class="plano"><h2>La Casa de Decisiones · ${D.CASA} × ${D.CASA} m</h2><p>El agua alrededor, los portales de 11 m, la suite 3 × 3 con la linterna al centro, las cuatro salas de espera de Estado al final de las calzadas.</p>${planoCasa()}</div>
  <div class="plano ancho"><h2>Una manzana amueblada · operación, pisos 4–13</h2><p>Cuatro módulos por tres bandas: islas de 4 perpendiculares a la ventana con su maceta, banca por barrio, separadores de vidrio con persiana (línea punteada) en cada borde de módulo, y en la banda media cubículos, sala de equipo, estancia y sala de charla.</p>${planoManzana()}</div>
  <div class="plano"><h2>Puerta Norte</h2><p>Plaza, Rampa Norte con bandas, las dos banderas, la Gran Estación, el Helipuerto; veredas cada 111 m.</p>${planoCelda([0, -1], "Puerta Norte · la ciudad y el cielo")}</div>
  <div class="plano"><h2>Puerta Sur</h2><p>Teatro 999 bajo su colina, foyer y restaurante, la galería, el Salón de Eventos, bodegas y máquinas.</p>${planoCelda([0, 1], "Puerta Sur · abierta a la ciudad")}</div>
  <div class="plano"><h2>Puerta Oriente</h2><p>Plaza de prensa, El Cuartel con su patio de armas, el polvorín bajo su montículo, las lomas de energía.</p>${planoCelda([1, 0], "Puerta Oriente · el Orden")}</div>
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
  tabla("Mobiliario (contado por el modelo)", Object.entries(P.mobiliario.conteo_modelo || {}).map(([k, v]) => [k, n(v)]).concat([["Unidades", "isla 4 · barrio 8 · manzana 33"], ["Catálogo", P.mobiliario.catalogo.length + " piezas"]])),
  tabla("Recintos y eventos", [["Salón de Eventos", `${Rc.salon_de_eventos.medida_xz.join(" × ")} m · ${Rc.salon_de_eventos.alto_libre_m} m libres · divisible en ${Rc.salon_de_eventos.divisible_en}`], ["Galería", `${Rc.salon_de_eventos.galeria.largo_m} m`], ["Bodegas", `999: ${n(Rc.teatro_999.bodega_m2)} m² · Salón: ${Rc.salon_de_eventos.bodega_m2} · 333: ${Rc.teatro_333.bodega_m2} · Casa: ${Rc.bodegas.casa_m2}`], ["Cabinas de producción", `999: ${Rc.teatro_999.cabina_m2} m² · 333: ${Rc.teatro_333.cabina_m2} · Salón: ${Rc.salon_de_eventos.cabina_m2}`], ["Cuartos de máquinas", Rc.cuartos_de_maquinas.length + " ubicaciones"]]),
  tabla("El Cuartel", [["Medida", `${Rc.cuartel.medida_xz.join(" × ")} m · ${Rc.cuartel.pisos} pisos (${Rc.cuartel.altura_m} m)`], ["Personas", n(Rc.cuartel.personas)]].concat(Rc.cuartel.programa.map(([p, q]) => [p, q])).concat([["Polvorín", `${n(Rc.cuartel.polvorin.m2)} m² a ${Rc.cuartel.polvorin.distancia_cuartel_m} m`]])),
  tabla("Helipuerto y banderas", [["Plataformas", `${Mv.helipuerto.plataformas} · ${Mv.helipuerto.movimientos_hora} movimientos/h`], ["Hangar", `${Mv.helipuerto.hangar} helicópteros`], ["Torre", `${Mv.helipuerto.torre_alto_m} m`], ["Pabellón", `${Mv.helipuerto.pabellon.banos_bloques} bloques de baños · cafetería de ${Mv.helipuerto.pabellon.cafeteria_asientos}`], ["Banda a la plaza", `${Mv.helipuerto.banda_largo_m} m`], ["Vuelos", `AICM ${Mv.helipuerto.vuelos_min.aicm} · AIFA ${Mv.helipuerto.vuelos_min.aifa} · Toluca ${Mv.helipuerto.vuelos_min.toluca} min`], ["Astas", "2 × 111 m · bandera 50 × 28.6 m"]]),
  tabla("Veredas y bancas", [["Malla", `${P.terreno.veredas.malla_m} m · ${P.terreno.veredas.ancho_m} m de ancho`], ["Cuadra", `${P.terreno.veredas.formato.cuadra_min} min`], ["Junta de 11 min", P.terreno.veredas.formato.junta_11_min], ["Circuito de 11", P.terreno.veredas.formato.circuito_11_min], ["Frutales", `cada ${P.terreno.veredas.frutales_cada_m} m`], ["Bancas", `cruces ${P.mobiliario.bancas.cruces_veredas} · veredas cada ${P.mobiliario.bancas.veredas_cada_m} m · agua cada ${P.mobiliario.bancas.agua_cada_m} m · plazas ${P.mobiliario.bancas.plazas_por_lado}/lado`]]),
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
  const idx = $("#indice"); if (idx) { idx.innerHTML = [...art.querySelectorAll("h2")].map(h => `<a href="#${h.id}">${h.textContent.replace(/^\d+\.\s*/, "")}</a>`).join(""); idx.querySelectorAll("a").forEach(l => l.addEventListener("click", e => { e.preventDefault(); document.getElementById(decodeURIComponent(l.getAttribute("href").slice(1)))?.scrollIntoView({ behavior: "smooth", block: "start" }); })); }
  art.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => { e.preventDefault(); document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)))?.scrollIntoView({ behavior: "smooth", block: "start" }); }));
  art.querySelectorAll('a[href$=".json"],a[href$=".md"]').forEach(a => { const h = a.getAttribute("href"); if (h.endsWith("parametros.json")) a.href = "/parametros.json"; else if (/^(PROYECTO|PROMPT|ORIGEN)\.md$/.test(h)) { a.href = "#proyecto"; a.addEventListener("click", e => { e.preventDefault(); cargarDoc(h); scrollTo(0, 0); }); } });
  scrollTo(0, 0);
}
$$("#docs button").forEach(b => b.addEventListener("click", () => cargarDoc(b.dataset.d)));
// RLR · fin
