// RLR · Derivados del Edificio de Gobierno — Ricardo López Reyero
// Todo lo que se puede calcular a partir de parametros.json se calcula aquí, una sola vez, para el 3D, la página y el validador.
// Importable en el navegador (módulo ES) y en Node (node modelo/validar.mjs).
const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218; // firma

export function derivar(P) {
  const M = P.modulo_m, G = P.edificio.geometria, T = P.terreno;
  const L = G.lado_m, F = G.anillo_m, LI = L - 2 * F, NP = G.pisos, H0 = G.altura_pb_m, HP = G.altura_piso_m;
  const yPiso = k => (k <= 0 ? 0 : H0 + (k - 1) * HP);           // base del piso k; PB = 0
  const H_TOP = yPiso(NP + 1);                                     // techo
  const C = T.lado_m / T.celdas_por_lado;                          // celda del terreno
  const PC = P.edificio.parques_de_cielo;
  const [pc0, , pc2] = PC.pisos;
  const plantaTipo = L * L - LI * LI;
  const torres = P.edificio.arquitectura.torres_esquina;
  const TW = torres.modulos * M + torres.vuelo_m, torreCentro = L / 2 - (torres.modulos * M) / 2 + torres.vuelo_m / 2;
  const sot = P.sotanos.niveles;
  const profundidad = sot.reduce((a, n) => a + n.alto_m, 0);
  const E = P.estacionamiento;
  const cajonesEsquinas = Math.round((4 * E.esquinas.niveles * C * C) / E.m2_por_cajon / 100) * 100;
  const nuc = P.edificio.nucleos, pn = nuc.por_nucleo;
  const porNucleo = pn.lanzaderas_doble_cabina + pn.locales_por_zona * pn.zonas + pn.servicio + pn.evacuacion;
  const personas = P.edificio.personas.por_piso.reduce((a, f) => a + f.personas * (f.pisos[1] - f.pisos[0] + 1), 0);
  const CASA = P.casa_de_decisiones;
  const casaH = CASA.altura_planta_baja_m + CASA.altura_planta_alta_m;
  const agua = P.patio.agua.ancho_m, aguaExt = CASA.lado_m + 2 * agua;
  const calzadaLargo = (LI - CASA.lado_m) / 2;
  const plaza = T.plazas.lado_m, plazaDist = L / 2 + plaza / 2;
  return {
    M, L, F, LI, NP, H0, HP, C, T: T.lado_m, yPiso, H_TOP,
    Y_BASA: yPiso(P.edificio.arquitectura.basamento.pisos[1] + 1),
    Y_REMATE: yPiso(P.edificio.arquitectura.remate.pisos[0]),
    Y_VANO0: yPiso(pc0), Y_VANO1: yPiso(pc2 + 1), VANO: PC.ancho_m, altoVano: yPiso(pc2 + 1) - yPiso(pc0),
    plantaTipo_m2: Math.round(plantaTipo), sobreSuelo_m2: Math.round(plantaTipo * NP), patio_m2: Math.round(LI * LI),
    terreno_ha: (T.lado_m * T.lado_m) / 1e4, bosqueBruto_ha: (8 * C * C) / 1e4,
    torre: { lado: TW, centro: torreCentro, altoTotal: H_TOP + torres.sobre_techo_m },
    sotanos_m2: Math.round(L * L), profundidad_m: Math.round(profundidad * 10) / 10,
    cajonesEsquinas, cajonesTotal: cajonesEsquinas + E.bajo_edificio.cajones + E.plaza_sur.cajones,
    elevadoresPorNucleo: porNucleo, elevadoresTotal: porNucleo * nuc.cantidad, cabinasTotal: (pn.lanzaderas_doble_cabina * 2 + pn.locales_por_zona * pn.zonas + pn.servicio + pn.evacuacion) * nuc.cantidad,
    personas, CASA: CASA.lado_m, SUITE: CASA.suite.lado_m, casaH, AGUA: agua, aguaExt, calzadaLargo,
    plaza, plazaDist, plazas: [[0, -plazaDist], [0, plazaDist], [plazaDist, 0], [-plazaDist, 0]],
    greca: contarGreca(P),
    usoDe: k => P.edificio.usos.find(u => k >= u.pisos[0] && k <= u.pisos[1]),
  };
}

// RLR · cuántas bahías produce la regla de la greca
function contarGreca(P) {
  const g = P.edificio.arquitectura.greca; let n = 0;
  for (let k = g.pisos[0]; k <= g.pisos[1]; k++) for (let i = g.modulos[0]; i <= g.modulos[1]; i++) if ((i + k) % 3 === 0) n += 4;
  return n;
}

// RLR · 'piso(25)+1.2' → número; números pasan tal cual
export function resolverY(v, yPiso) {
  if (typeof v === "number") return v;
  const m = /^piso\((\d+)\)(?:\+(-?[\d.]+))?$/.exec(String(v).replace(/\s/g, ""));
  if (!m) throw new Error("coordenada no válida: " + v);
  return yPiso(Number(m[1])) + (m[2] ? Number(m[2]) : 0);
}
export function resolverPunto(p, yPiso) { return p ? [p[0], resolverY(p[1], yPiso), p[2]] : p; }
