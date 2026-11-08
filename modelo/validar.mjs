#!/usr/bin/env node
// RLR · Validador del Edificio de Gobierno — Ricardo López Reyero
// Revisa que parametros.json y recorridos.json sean coherentes e imprime los derivados. Corre antes de publicar.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { derivar, resolverPunto } from "../sitio/derivados.js";

const raiz = dirname(fileURLToPath(import.meta.url));
const P = JSON.parse(readFileSync(join(raiz, "parametros.json"), "utf8"));
const R = JSON.parse(readFileSync(join(raiz, "recorridos.json"), "utf8"));
const errores = [], avisos = [];
const ok = (cond, msg) => { if (!cond) errores.push(msg); };
const aviso = (cond, msg) => { if (!cond) avisos.push(msg); };

const D = derivar(P), G = P.edificio.geometria, M = P.modulo_m;
// geometría
ok(Math.abs(G.lado_m - G.reticula.modulos_por_lado * M) < 0.01, `lado ${G.lado_m} ≠ ${G.reticula.modulos_por_lado} módulos × ${M}`);
ok(Math.abs(G.anillo_m - G.reticula.modulos_fondo * M) < 0.01, `anillo ${G.anillo_m} ≠ ${G.reticula.modulos_fondo} módulos`);
ok(P.terreno.lado_m === 3 * G.lado_m, "el terreno debe medir 3 lados del edificio");
ok(P.casa_de_decisiones.suite.lado_m === 3 * P.casa_de_decisiones.suite.celda_m, "la suite son 3 × 3 celdas");
ok(P.casa_de_decisiones.suite.tablero.length === 3 && P.casa_de_decisiones.suite.tablero.every(f => f.length === 3), "el tablero es 3 × 3");
ok(P.casa_de_decisiones.suite.tablero[1][1] === "Oficina del Presidente", "el Presidente va al centro del tablero");
ok(P.casa_de_decisiones.lado_m < D.LI - 2 * P.patio.agua.ancho_m, "la Casa y el agua caben en el patio");
// pisos y personas
const usos = P.edificio.usos; ok(usos[0].pisos[0] === 0 && usos[usos.length - 1].pisos[1] === G.pisos, "los usos cubren PB..33");
for (let i = 1; i < usos.length; i++) ok(usos[i].pisos[0] === usos[i - 1].pisos[1] + 1, `usos: hueco o traslape entre ${usos[i - 1].id} y ${usos[i].id}`);
ok(D.personas === P.edificio.personas.total, `personas por piso suman ${D.personas}, no ${P.edificio.personas.total}`);
const pc = P.edificio.parques_de_cielo.pisos; ok(pc.length === 3 && pc[1] === Math.ceil(G.pisos / 2), "el parque de cielo va centrado en el piso 17");
ok(P.edificio.nucleos.lobbies.includes(0) && P.edificio.nucleos.lobbies.includes(G.pisos), "los lobbies incluyen PB y el último piso");
// sectores y esquinas
const ids = P.edificio.sectores.map(s => s.id); ok(ids.length === 4 && new Set(ids).size === 4, "4 sectores distintos");
P.edificio.esquinas.forEach(e => e.sectores.forEach(s => ok(ids.includes(s), `esquina ${e.id}: sector ${s} no existe`)));
// sótanos y estacionamiento
ok(P.sotanos.niveles.filter(n => n.boveda).length === 1, "una sola Bóveda");
ok(P.sotanos.niveles[P.sotanos.niveles.length - 1].boveda, "La Bóveda es el nivel más profundo");
aviso(D.cajonesTotal >= P.edificio.personas.total * (1 + P.estacionamiento.margen) * 0.9, `cajones ${D.cajonesTotal} por debajo del margen`);
// emplazamientos
const vistos = new Set();
P.emplazamientos.forEach(e => {
  ok(!vistos.has(e.id), `emplazamiento repetido: ${e.id}`); vistos.add(e.id);
  ok(Array.isArray(e.pos_xz) && e.pos_xz.length === 2, `${e.id}: pos_xz`);
  ok(Array.isArray(e.medida_xz) && e.medida_xz.length === 2, `${e.id}: medida_xz`);
  ok(["sitio", "patio"].includes(e.grupo), `${e.id}: grupo debe ser sitio o patio`);
  const dentroEdificio = Math.abs(e.pos_xz[0]) < D.L / 2 && Math.abs(e.pos_xz[1]) < D.L / 2;
  ok(e.grupo === "patio" ? dentroEdificio : !dentroEdificio, `${e.id}: grupo ${e.grupo} no coincide con su posición`);
  ok(Math.abs(e.pos_xz[0]) + e.medida_xz[0] / 2 <= D.T / 2 && Math.abs(e.pos_xz[1]) + e.medida_xz[1] / 2 <= D.T / 2, `${e.id}: se sale del terreno`);
  (e.partes || []).forEach((p, i) => {
    ok(["caja", "loma", "disco", "anillo", "columnas", "malla", "asta", "sendero"].includes(p.tipo), `${e.id}.partes[${i}]: tipo ${p.tipo}`);
    ok(["asta", "sendero"].includes(p.tipo) || typeof p.material === "string", `${e.id}.partes[${i}]: material`);
    if (p.tipo === "sendero") ok(Array.isArray(p.desde) && Array.isArray(p.hasta) && p.ancho > 0, `${e.id}.partes[${i}]: sendero sin desde/hasta/ancho`);
    if (p.tipo === "asta") ok(p.alto > 0 && (p.bandera === null || (Array.isArray(p.bandera) && p.colores?.length === 3)), `${e.id}.partes[${i}]: asta sin alto o bandera incompleta`);
    if (p.ficha) ok(e.fichas && e.fichas[p.ficha], `${e.id}.partes[${i}]: ficha ${p.ficha} no existe`);
  });
  if (e.ficha) ok(e.ficha.t && e.ficha.c && Array.isArray(e.ficha.d), `${e.id}: ficha incompleta`);
});
// recorridos
R.recorridos.forEach(r => {
  ok(r.id && r.nombre && Array.isArray(r.pasos) && r.pasos.length > 1, `recorrido ${r.id}: estructura`);
  ok(r.pasos[0].t === 0, `recorrido ${r.id}: el primer paso lleva t = 0`);
  r.pasos.forEach((p, i) => {
    ok(Array.isArray(p.c) && p.c.length === 3, `${r.id}[${i}]: cámara`);
    ok(p.m || p.mira, `${r.id}[${i}]: falta m o mira`);
    try { resolverPunto(p.c, D.yPiso); resolverPunto(p.m || p.mira, D.yPiso); } catch (err) { errores.push(`${r.id}[${i}]: ${err.message}`); }
  });
});
// colores
const hex = /^#[0-9a-f]{6}$/i;
usos.forEach(u => ok(hex.test(u.color), `uso ${u.id}: color`));
Object.values(P.presentacion.ambientes).forEach(a => ["arriba", "horizonte", "abajo", "niebla", "sol_color"].forEach(k => ok(hex.test(a[k]), `ambiente: ${k}`)));

const n = v => v.toLocaleString("es-MX");
console.log(`Edificio de Gobierno · parámetros v${P.meta.version} (${P.meta.actualizado})`);
console.log(`  planta tipo ${n(D.plantaTipo_m2)} m² · sobre el suelo ${n(D.sobreSuelo_m2)} m² · patio ${n(D.patio_m2)} m² · techo a ${D.H_TOP} m · torres a ${D.torre.altoTotal} m`);
console.log(`  sótanos ${P.sotanos.niveles.length} niveles · ${D.profundidad_m} m · ${n(D.sotanos_m2)} m² cada uno`);
console.log(`  cajones ${n(D.cajonesTotal)} (esquinas ${n(D.cajonesEsquinas)}) · elevadores ${D.elevadoresTotal} (${D.cabinasTotal} cabinas) · greca ${D.greca} bahías`);
console.log(`  emplazamientos ${P.emplazamientos.length} · recorridos ${R.recorridos.length} · personas ${n(D.personas)}`);
avisos.forEach(a => console.log("  aviso: " + a));
if (errores.length) { errores.forEach(e => console.error("  ERROR: " + e)); process.exit(1); }
console.log("  todo coherente ✓");
