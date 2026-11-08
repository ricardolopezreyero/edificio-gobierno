// RLR · Modelo 3D del Edificio de Gobierno — Ricardo López Reyero
// 1 unidad = 1 metro. x = oriente, z = sur (el norte es −z), y = altura. Todo sale de parametros.json.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { derivar, resolverPunto } from "/derivados.js?v=1";
import * as BGU from "three/addons/utils/BufferGeometryUtils.js";

const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218; // firma (RLR en ROT13 y en el alfabeto)
const P = window.EDIFICIO.P, D = derivar(P);
const { M, L, F, LI, NP, H0, HP, C, T, yPiso, H_TOP, Y_BASA, Y_REMATE, Y_VANO0, Y_VANO1, VANO, CASA, SUITE, AGUA } = D;
const [PC0, , PC2] = P.edificio.parques_de_cielo.pisos;
const hex = c => parseInt(String(c).replace("#", ""), 16);
// RLR · geometría de exclusión: ¿este punto cae sobre una pieza colocada? (lo usan el bosque, las jardineras y las veredas)
const dentro = (x, z, cx, cz, w, d) => Math.abs(x - cx) < w / 2 && Math.abs(z - cz) < d / 2;
const enElipse = (x, z, cx, cz, rx, rz) => ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2 < 1;
const MARGEN = P.terreno.bosque.margen_sin_arboles_m;
const distSegmento = (x, z, ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1))); return Math.hypot(x - (ax + dx * t), z - (az + dz * t)); };
function tapado(x, z, grupoId) {
  return P.emplazamientos.some(e => { if (e.grupo !== grupoId) return false; const [w, d] = e.medida_xz, esLoma = e.partes?.[0]?.tipo === "loma";
    if (esLoma ? enElipse(x, z, e.pos_xz[0], e.pos_xz[1], w / 2 + MARGEN, d / 2 + MARGEN) : dentro(x, z, e.pos_xz[0], e.pos_xz[1], w + 2 * MARGEN, d + 2 * MARGEN)) return true;
    return (e.partes || []).some(pt => pt.tipo === "sendero" ? distSegmento(x, z, e.pos_xz[0] + pt.desde[0], e.pos_xz[1] + pt.desde[1], e.pos_xz[0] + pt.hasta[0], e.pos_xz[1] + pt.hasta[1]) < pt.ancho / 2 + 3 : pt.tipo === "asta" ? Math.hypot(x - e.pos_xz[0] - pt.dxz[0], z - e.pos_xz[1] - pt.dxz[1]) < 33 : false); });
}
const rad = g => (g * Math.PI) / 180;
const lerp = (a, b, k) => a + (b - a) * k;
let semilla = 181218;
const azar = () => { semilla = (semilla * 48271) % 2147483647; return (semilla - 1) / 2147483646; }; // determinista: el bosque siempre es el mismo
const entre = (a, b) => a + azar() * (b - a);

/* ---------- Escena, cámara ---------- */
const caja = document.getElementById("escena");
const movil = innerWidth < 760;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
const DPR = Math.min(devicePixelRatio, movil ? 1.5 : 2);
renderer.setPixelRatio(DPR);
renderer.shadowMap.enabled = !movil;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;
caja.appendChild(renderer.domElement);
const escena = new THREE.Scene();
escena.fog = new THREE.Fog(0xc9dcef, 900, 3800);
const pmrem = new THREE.PMREMGenerator(renderer);
escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const camara = new THREE.PerspectiveCamera(40, 1, 1, 7000);
camara.position.set(...P.presentacion.camara_inicial.pos);
const control = new OrbitControls(camara, renderer.domElement);
control.enableDamping = true;
control.dampingFactor = 0.06;
control.maxPolarAngle = rad(88);
control.minDistance = 12;
control.maxDistance = 2600;
control.target.set(...P.presentacion.camara_inicial.mira);
control.autoRotate = true;
control.autoRotateSpeed = 0.25;

/* ---------- Cielo y luces ---------- */
const cieloU = { arriba: { value: new THREE.Color() }, horizonte: { value: new THREE.Color() }, abajo: { value: new THREE.Color() } };
const cielo = new THREE.Mesh(new THREE.SphereGeometry(5000, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false, uniforms: cieloU,
  vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: "uniform vec3 arriba, horizonte, abajo; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(horizonte, arriba, pow(h, 0.5)) : mix(horizonte, abajo, min(1.0, -h * 6.0)); gl_FragColor = vec4(c, 1.0); }",
}));
escena.add(cielo);
const estrellas = (() => {
  const n = 1400, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const th = azar() * Math.PI * 2, ph = Math.acos(azar() * 0.9 + 0.08); pos.set([4800 * Math.sin(ph) * Math.cos(th), 4800 * Math.cos(ph), 4800 * Math.sin(ph) * Math.sin(th)], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
})();
escena.add(estrellas);
const hemi = new THREE.HemisphereLight(0xdfe8ff, 0x3d4a3a, 1.0); escena.add(hemi);
const sol = new THREE.DirectionalLight(0xfff1dc, 2.4);
sol.castShadow = !movil;
sol.shadow.mapSize.set(4096, 4096);
Object.assign(sol.shadow.camera, { left: -720, right: 720, top: 720, bottom: -720, near: 50, far: 3000 });
sol.shadow.bias = -0.0006;
sol.shadow.normalBias = 0.6;
escena.add(sol, sol.target);

/* ---------- Materiales ---------- */
const DS = THREE.DoubleSide;
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, metalness: 0.0, side: DS, ...o });
const MAT = {
  recinto: mat(0x34343a, { roughness: 0.85 }),
  cantera: mat(0x8d8a82, { roughness: 0.8 }),
  tezontle: mat(0x8e3d2c, { roughness: 1 }),
  bronce: mat(0xb08d57, { metalness: 0.85, roughness: 0.35 }),
  bosqueSuelo: mat(0x2b4f2e),
  parque: mat(0x3b6b3a),
  pradera: mat(0x567a3a),
  agua: mat(0x2f6f9f, { metalness: 0.4, roughness: 0.08 }),
  asfalto: mat(0x1e2026),
  pv: mat(0x0f1f3f, { metalness: 0.6, roughness: 0.25 }),
  ciudad: mat(0x6f6f74, { roughness: 0.95 }),
  tierra: mat(0x3a2e24, { roughness: 1 }),
  pista: mat(0xb86a3c),
  cancha: mat(0x2f6f6f),
  blanco: mat(0xd9d5cc),
  milpa: mat(0x7a8a3a),
  tepetate: mat(0xb9a27a, { roughness: 1 }),
  flor: mat(0x7a5fb0, { roughness: 0.9 }),
  marcador: new THREE.MeshStandardMaterial({ color: 0xffb347, emissive: 0xffa030, emissiveIntensity: 2.5, roughness: 0.3, side: DS }),
};

// RLR · textura de un módulo (11.1 m) por un piso (4.5 m): vidrio con 3 lamas de bronce y antepecho de piedra
function lienzo(w, h, pinta) { const c = document.createElement("canvas"); c.width = w; c.height = h; pinta(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace; return t; }
const texVidrio = lienzo(256, 128, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5f7f9f"); gr.addColorStop(1, "#3b5572");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = "#3b3a3c"; g.fillRect(0, h * 0.8, w, h * 0.2);           // antepecho (losa)
  g.fillStyle = "#8d8a82"; g.fillRect(0, 0, 10, h);                      // pilar de piedra
  g.fillStyle = "#9a7a4a"; [w / 4, w / 2, (3 * w) / 4].forEach(x => g.fillRect(x - 1.5, 0, 3, h * 0.8)); // lamas
});
const texVidrioPB = lienzo(256, 128, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#7b9bb8"); gr.addColorStop(1, "#4d6a88");
  g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = "#8d8a82"; g.fillRect(0, 0, 10, h);
});
// RLR · ventanas encendidas de noche: 10 módulos × 10 pisos, 3 ventanas por módulo
const texNoche = lienzo(1200, 400, (g, w, h) => {
  g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
  const cw = w / 30, ch = h / 10;
  for (let i = 0; i < 30; i++) for (let j = 0; j < 10; j++) if (azar() < 0.38) { g.fillStyle = azar() < 0.7 ? "#ffd9a0" : "#cfe3ff"; g.globalAlpha = 0.5 + azar() * 0.5; g.fillRect(i * cw + 3, j * ch + 4, cw - 6, ch * 0.72); }
});
texNoche.colorSpace = THREE.SRGBColorSpace;
// RLR · basamento de tezontle: PB con vanos de 8 m y pisos 1–3 con tres ventanas por módulo; torres con rendijas verticales en cantera
const texBasaPB = lienzo(256, 256, (g, w, h) => {
  g.fillStyle = "#8e3d2c"; g.fillRect(0, 0, w, h); g.fillStyle = "#7a3324"; for (let i = 0; i < 60; i++) g.fillRect(azar() * w, azar() * h, 3, 2);
  g.fillStyle = "#8d8a82"; g.fillRect(0, 0, 14, h);
  [0.26, 0.64].forEach(x => { g.fillStyle = "#b08d57"; g.fillRect(w * x - 4, h * 0.14, w * 0.28 + 8, h * 0.76); g.fillStyle = "#2b3d52"; g.fillRect(w * x, h * 0.16, w * 0.28, h * 0.72); });
});
const texBasa = lienzo(256, 128, (g, w, h) => {
  g.fillStyle = "#8e3d2c"; g.fillRect(0, 0, w, h); g.fillStyle = "#7a3324"; for (let i = 0; i < 40; i++) g.fillRect(azar() * w, azar() * h, 3, 2);
  g.fillStyle = "#8d8a82"; g.fillRect(0, 0, 14, h); g.fillStyle = "#6f6b62"; g.fillRect(0, h * 0.86, w, h * 0.14);
  [0.14, 0.42, 0.70].forEach(x => { g.fillStyle = "#b08d57"; g.fillRect(w * x - 3, h * 0.12, w * 0.2 + 6, h * 0.66); g.fillStyle = "#2b3d52"; g.fillRect(w * x, h * 0.15, w * 0.2, h * 0.6); });
});
const texTorre = lienzo(256, 128, (g, w, h) => {
  g.fillStyle = "#8d8a82"; g.fillRect(0, 0, w, h); g.fillStyle = "#807c74"; for (let i = 0; i < 30; i++) g.fillRect(azar() * w, azar() * h, 6, 2);
  g.fillStyle = "#6f6b62"; g.fillRect(0, h * 0.88, w, h * 0.12);
  [0.3, 0.62].forEach(x => { g.fillStyle = "#b08d57"; g.fillRect(w * x - 2, h * 0.08, w * 0.1 + 4, h * 0.78); g.fillStyle = "#1f2d3f"; g.fillRect(w * x, h * 0.1, w * 0.1, h * 0.74); });
});
const vidrios = []; // materiales de fachada (para el brillo nocturno)
function matPiedra(tex, w, h, filas) {
  const map = tex.clone(); map.repeat.set(w / M, filas); map.needsUpdate = true;
  const em = texNoche.clone(); em.repeat.set(w / (10 * M), h / (10 * HP)); em.needsUpdate = true;
  const m = new THREE.MeshStandardMaterial({ map, emissiveMap: em, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.85, side: DS }); vidrios.push(m); return m;
}
function matVidrio(w, h, pb = false) {
  const map = (pb ? texVidrioPB : texVidrio).clone(); map.repeat.set(w / M, pb ? 1 : h / HP); map.needsUpdate = true;
  const em = texNoche.clone(); em.repeat.set(w / (10 * M), h / (10 * HP)); em.needsUpdate = true;
  const m = new THREE.MeshStandardMaterial({ map, emissiveMap: em, emissive: 0xffffff, emissiveIntensity: 0, metalness: 0.35, roughness: 0.3, side: DS, envMapIntensity: 1.4 });
  vidrios.push(m); return m;
}

/* ---------- Ayudas de geometría ---------- */
const planoCasa = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e6); // corta la Casa a una altura; 1e6 = apagado
const matsCasa = [];
const edificio = new THREE.Group(), sitio = new THREE.Group(), bosque = new THREE.Group(), ciudad = new THREE.Group(), etiquetas = new THREE.Group(), corteG = new THREE.Group();
escena.add(sitio, edificio, bosque, ciudad, etiquetas, corteG);
corteG.visible = false;
const pickables = [];
function caja3(w, h, d, m, x, y, z, grupo = edificio, info) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true;
  if (info) { o.userData.info = info; pickables.push(o); }
  grupo.add(o); return o;
}
function plano(w, h, m, x, y, z, rotY, grupo = edificio, info) {
  const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); o.position.set(x, y, z); o.rotation.y = rotY; o.castShadow = o.receiveShadow = true;
  if (info) { o.userData.info = info; pickables.push(o); }
  grupo.add(o); return o;
}

/* ---------- El terreno ---------- */
// suelo: 9 celdas (la central es el parque interior)
for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
  const centro = i === 0 && j === 0;
  const s = caja3(C, 1, C, centro ? MAT.parque : MAT.bosqueSuelo, i * C, -0.5, j * C, sitio,
    !centro && i && j ? { t: "Bosque sobre el estacionamiento", c: `Celda de 333 × 333 m. Debajo, dos niveles de estacionamiento (${(D.cajonesEsquinas / 4).toLocaleString("es-MX")} cajones) con patios de luz entre los árboles. Encima, bosque de encinos y pinos.`, d: [["Niveles", "2"], ["Superficie", "221,778 m²"], ["Cajones", "~7,400"], ["Al edificio", "333 m por sendero cubierto, 12 min al escritorio"]] } : null);
  s.castShadow = false;
}
// tierra bajo todo (se ve en el corte)
const tierra = caja3(T, 60, T, MAT.tierra, 0, -31, 0, corteG); tierra.castShadow = false;
// anillo vial
{ const av = P.terreno.anillo_vial.ancho_m, o = T / 2 + av / 2; [[0, -o, T + 2 * av, av], [0, o, T + 2 * av, av], [o, 0, av, T], [-o, 0, av, T]].forEach(([x, z, w, d]) => caja3(w, 0.4, d, MAT.asfalto, x, 0.1, z, sitio).castShadow = false); }
// plazas de las cuatro puertas (tezontle)
const PLAZA = D.plaza, plazas = D.plazas;
plazas.forEach(([x, z], k) => { const pu = P.terreno.puertas[k]; caja3(PLAZA, 0.5, PLAZA, MAT.tezontle, x, 0.2, z, sitio, { t: pu.nombre, c: pu.descripcion, d: [["Medida", `${PLAZA} × ${PLAZA} m`], ["Piso", "tezontle rojo, el de los palacios de la ciudad"]] }).castShadow = false; });
// senderos cubiertos de las esquinas con bandas, patios de luz y rampas del estacionamiento
{ const SE = P.terreno.senderos_esquina, PL = P.estacionamiento.esquinas.patios_de_luz, RA = P.estacionamiento.esquinas.rampas;
  const infoSendero = { t: "Sendero cubierto con bandas", c: `Del estacionamiento de la esquina al edificio: ${SE.largo_m} m bajo una pérgola de madera y bronce con enredaderas. Dos bandas móviles de ${SE.bandas.largo_m} m (una por sentido) hacen el tramo en 2 minutos; a un lado, el paso libre y el carril de los carritos eléctricos.`, d: [["Largo", SE.largo_m + " m"], ["Bandas", `${SE.bandas.cantidad} × ${SE.bandas.largo_m} m, ${SE.bandas.ancho_m} m de ancho, ${SE.bandas.velocidad_ms} m/s + tu paso`], ["Tiempo", `~${SE.tiempo_min} min del patio de luz al zaguán`]] };
  const infoPatio = { t: "Patio de luz del estacionamiento", c: `${PL.por_esquina} por esquina, en una malla de ${PL.malla_m} m: cada uno es un tragaluz de ${PL.lado_m} × ${PL.lado_m} m que mete sol y aire a los dos niveles, con escaleras eléctricas y dos elevadores al bosque. Nadie estaciona a más de ${PL.distancia_max_m} m de uno.`, d: [["Por esquina", String(PL.por_esquina)], ["Medida", `${PL.lado_m} × ${PL.lado_m} m`], ["Elevadores", "2 + 2 escaleras eléctricas por patio"]] };
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([i, j]) => {
    const a = new THREE.Vector3(i * (L / 2 + 4), 0, j * (L / 2 + 4)), b = new THREE.Vector3(i * (C - 40), 0, j * (C - 40));
    const len = a.distanceTo(b), mid = a.clone().add(b).multiplyScalar(0.5), ry = -Math.atan2(b.z - a.z, b.x - a.x);
    const p = caja3(len, 0.6, SE.ancho_m + 1, MAT.bronce, mid.x, 4.8, mid.z, sitio, infoSendero); p.rotation.y = ry;
    const piso = caja3(len, 0.3, SE.ancho_m, MAT.cantera, mid.x, 0.15, mid.z, sitio, infoSendero); piso.rotation.y = ry; piso.castShadow = false;
    [-1, 1].forEach(sg => { const bnd = caja3(SE.bandas.largo_m, 0.12, SE.bandas.ancho_m, MAT.recinto, mid.x, 0.36, mid.z, sitio, infoSendero); bnd.rotation.y = ry; bnd.translateZ(sg * (SE.bandas.ancho_m / 2 + 1.4)); bnd.castShadow = false; });
    const lado = Math.round(Math.sqrt(PL.por_esquina)), m0 = (lado - 1) / 2;
    for (let u = 0; u < lado; u++) for (let v = 0; v < lado; v++) { const x = i * C + (u - m0) * PL.malla_m, z = j * C + (v - m0) * PL.malla_m; caja3(PL.lado_m, 1.1, PL.lado_m, matVidrio(PL.lado_m, 1.1, true), x, 0.55, z, sitio, infoPatio); caja3(PL.lado_m + 1.2, 0.4, PL.lado_m + 1.2, MAT.bronce, x, 1.2, z, sitio); }
    caja3(RA.medida_xz[0], 0.5, RA.medida_xz[1], MAT.asfalto, i * (C + RA.desde_centro_celda_m), 0.2, j * (C + RA.desde_centro_celda_m), sitio).castShadow = false;
  });
}
// RLR · emplazamientos: cada pieza del terreno y del patio se lee de parametros.json (pos_xz, medida_xz, partes relativas, ficha, etiqueta)
function matPorNombre(n, w, h) {
  if (n === "vidrio") return matVidrio(w, h, true);
  if (n === "piedra_pb") return matPiedra(texBasaPB, w, h, 1);
  if (n === "piedra_torre") return matPiedra(texTorre, w, h, Math.max(1, Math.round(h / HP)));
  const clave = { bosque_suelo: "bosqueSuelo" }[n] || n;
  if (!MAT[clave]) throw new Error("material desconocido: " + n);
  return MAT[clave];
}
const lomasMat = [];
function loma(x, z, rx, ry, rz, m, info, grupo = sitio) { m = m.clone(); lomasMat.push(m); const o = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24), m); o.scale.set(rx, ry, rz); o.position.set(x, 0, z); o.castShadow = o.receiveShadow = true; if (info) { o.userData.info = info; pickables.push(o); } grupo.add(o); return o; }
function construirEmplazamientos(grupoId, grupo) {
  P.emplazamientos.filter(e => e.grupo === grupoId).forEach(e => {
    const [ex, ez] = e.pos_xz;
    (e.partes || []).forEach(pt => {
      const info = pt.ficha ? e.fichas[pt.ficha] : e.ficha, dx = pt.dxz ? pt.dxz[0] : 0, dz = pt.dxz ? pt.dxz[1] : 0, x = ex + dx, z = ez + dz, y0 = pt.y || 0;
      if (pt.tipo === "caja") { const [w, d] = pt.medida_xz, o = caja3(w, pt.alto, d, matPorNombre(pt.material, Math.max(w, d), pt.alto), x, y0 + pt.alto / 2, z, grupo, info); if (pt.sombra === false) o.castShadow = false; }
      else if (pt.tipo === "loma") loma(x, z, pt.medida_xz[0] / 2, pt.alto, pt.medida_xz[1] / 2, matPorNombre(pt.material), info, grupo);
      else if (pt.tipo === "disco") { const o = new THREE.Mesh(new THREE.CylinderGeometry(pt.radio, pt.radio, pt.alto, 32), matPorNombre(pt.material)); o.position.set(x, y0 + pt.alto / 2, z); grupo.add(o); }
      else if (pt.tipo === "anillo") { const o = new THREE.Mesh(new THREE.RingGeometry(pt.radio[0], pt.radio[1], 32), matPorNombre(pt.material)); o.rotation.x = -Math.PI / 2; o.position.set(x, y0, z); grupo.add(o); }
      else if (pt.tipo === "columnas") { for (let k = 0; k < pt.n; k++) { const t = pt.n > 1 ? k / (pt.n - 1) : 0; const col = new THREE.Mesh(new THREE.CylinderGeometry(pt.radio, pt.radio, pt.alto, 10), matPorNombre(pt.material)); col.position.set(ex + pt.desde[0] + (pt.hasta[0] - pt.desde[0]) * t, y0 + pt.alto / 2, ez + pt.desde[1] + (pt.hasta[1] - pt.desde[1]) * t); col.castShadow = true; grupo.add(col); } }
      else if (pt.tipo === "asta") {
        const palo = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.4, pt.alto, 14), MAT.blanco); palo.position.set(x, pt.alto / 2, z); palo.castShadow = true; palo.userData.info = info; if (info) pickables.push(palo); grupo.add(palo);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.6, 2.2, 16), MAT.cantera); base.position.set(x, 1.1, z); grupo.add(base);
        if (pt.bandera) { const [bw, bh] = pt.bandera, y = pt.alto - bh / 2 - 2; pt.colores.forEach((c, k) => { const f = caja3(bw / 3, bh, 0.4, mat(hex(c), { side: DS, roughness: 0.95 }), x + 1.2 + bw / 6 + k * (bw / 3), y, z, grupo, info); f.castShadow = true; }); }
      }
      else if (pt.tipo === "sendero") {
        const a = new THREE.Vector3(ex + pt.desde[0], 0, ez + pt.desde[1]), b = new THREE.Vector3(ex + pt.hasta[0], 0, ez + pt.hasta[1]), len = a.distanceTo(b), mid = a.clone().add(b).multiplyScalar(0.5), ry = -Math.atan2(b.z - a.z, b.x - a.x);
        const techo = caja3(len, 0.6, pt.ancho + 1, MAT.bronce, mid.x, (pt.alto_techo || 5) - 0.3, mid.z, grupo, info); techo.rotation.y = ry;
        const piso = caja3(len, 0.3, pt.ancho, MAT.cantera, mid.x, 0.15, mid.z, grupo, info); piso.rotation.y = ry; piso.castShadow = false;
        for (let k = 0; k < (pt.bandas || 0); k++) { const off = (k - ((pt.bandas - 1) / 2)) * 2.8, bnd = caja3(pt.largo_bandas || len - 10, 0.12, 2.0, MAT.recinto, mid.x, 0.36, mid.z, grupo, info); bnd.rotation.y = ry; bnd.translateZ(off); bnd.castShadow = false; }
        const nPost = Math.floor(len / 11.1); for (let k = 0; k <= nPost; k++) { const t = k / nPost; [-1, 1].forEach(sg => { const po = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, pt.alto_techo || 5, 8), MAT.bronce); po.position.set(a.x + (b.x - a.x) * t, (pt.alto_techo || 5) / 2, a.z + (b.z - a.z) * t); po.translateOnAxis(new THREE.Vector3(-(b.z - a.z), 0, b.x - a.x).normalize(), sg * (pt.ancho / 2 - 0.4)); grupo.add(po); }); }
      }
      else if (pt.tipo === "malla") { for (let u = 0; u < pt.n_xz[0]; u++) for (let v = 0; v < pt.n_xz[1]; v++) { const o = caja3(pt.medida_xz[0], pt.alto, pt.medida_xz[1], matPorNombre(pt.material), x + u * pt.paso_xz[0], y0 + pt.alto / 2, z + v * pt.paso_xz[1], grupo, info); if (pt.sombra === false) o.castShadow = false; } }
    });
  });
}
construirEmplazamientos("sitio", sitio);

/* ---------- El edificio: anillo ---------- */
// caras de vidrio en 3 bandas (abajo del vano, el vano partido en dos, arriba) + planta baja
const caras = [
  // [eje, signo, exterior?]  N/S: largo en x; E/O: largo en z
  { lado: "norte", ext: true, pos: (u, y) => [u, y, -L / 2], rot: Math.PI, largo: L },
  { lado: "sur", ext: true, pos: (u, y) => [u, y, L / 2], rot: 0, largo: L },
  { lado: "oriente", ext: true, pos: (u, y) => [L / 2, y, u], rot: Math.PI / 2, largo: L },
  { lado: "poniente", ext: true, pos: (u, y) => [-L / 2, y, u], rot: -Math.PI / 2, largo: L },
  { lado: "norte", ext: false, pos: (u, y) => [u, y, -LI / 2], rot: 0, largo: LI },
  { lado: "sur", ext: false, pos: (u, y) => [u, y, LI / 2], rot: Math.PI, largo: LI },
  { lado: "oriente", ext: false, pos: (u, y) => [LI / 2, y, u], rot: -Math.PI / 2, largo: LI },
  { lado: "poniente", ext: false, pos: (u, y) => [-LI / 2, y, u], rot: Math.PI / 2, largo: LI },
];
const SECT = Object.fromEntries(P.edificio.sectores.map(sc => [sc.id, sc]));
const NOMBRE_LADO = { norte: "Norte", sur: "Sur", oriente: "Oriente", poniente: "Poniente" };
function infoLado(l) { const s = SECT[l]; return { t: `Lado ${NOMBRE_LADO[l]} · ${s.nombre}`, c: `Cada lado del cuadrado es un sector del gobierno. En el ${NOMBRE_LADO[l]} trabaja el sector ${s.nombre}: ${s.secretarias.join(", ")}. Las esquinas son de quien coordina dos sectores; a mayor altura, mayor rango.`, d: [["Pisos 4–13", "1,500 personas por piso · operación"], ["Pisos 14–23", "1,000 · mandos medios y proyectos"], ["Pisos 24–31", "500 · direcciones y La Fábrica (30–31)"], ["Pisos 32–33", "gabinete y coordinadores de sector"], ["Fondo del anillo", "33.3 m: ventana al bosque y ventana al parque"]] }; }
caras.forEach(c => {
  const info = infoLado(c.lado);
  const banda = (u0, u1, y0, y1, pb = false) => { const w = u1 - u0, h = y1 - y0, [x, y, z] = c.pos((u0 + u1) / 2, (y0 + y1) / 2); plano(w, h, matVidrio(w, h, pb), x, y, z, c.rot, edificio, info); };
  const a = -c.largo / 2, b = c.largo / 2;
  const bandaP = (u0, u1, y0, y1, tex, filas) => { const w = u1 - u0, h = y1 - y0, [x, y, z] = c.pos((u0 + u1) / 2, (y0 + y1) / 2); plano(w, h, matPiedra(tex, w, h, filas), x, y, z, c.rot, edificio, info); };
  bandaP(a, -M / 2, 0, H0, texBasaPB, 1); bandaP(M / 2, b, 0, H0, texBasaPB, 1); // planta baja de tezontle, partida por el zaguán
  bandaP(a, b, H0, Y_BASA, texBasa, 3);                                         // pisos 1–3: el basamento
  banda(a, b, Y_BASA, Y_VANO0);                                                 // pisos 4–15
  banda(a, -VANO / 2, Y_VANO0, Y_VANO1);    // 16–18 a un lado del vano
  banda(VANO / 2, b, Y_VANO0, Y_VANO1);     // 16–18 al otro
  banda(a, b, Y_VANO1, H_TOP);              // 19–33
});
// pilares de piedra que sobresalen cada módulo (exteriores)
{
  const g = new THREE.BoxGeometry(0.9, 1, 0.6), inst = new THREE.InstancedMesh(g, MAT.cantera, 4 * 31 * 3);
  const m4 = new THREE.Matrix4(); let n = 0;
  const bandas = [[Y_BASA, Y_VANO0], [Y_VANO0, Y_VANO1], [Y_VANO1, Y_REMATE]];
  for (let i = 0; i <= 30; i++) { const u = -L / 2 + i * M; bandas.forEach(([y0, y1], bi) => {
    if (bi === 1 && Math.abs(u) < VANO / 2 - 1) return; // en el vano no hay pilares, hay columnas
    const h = y1 - y0, y = (y0 + y1) / 2;
    [[u, -L / 2 - 0.3, 0], [u, L / 2 + 0.3, 0], [L / 2 + 0.3, u, Math.PI / 2], [-L / 2 - 0.3, u, Math.PI / 2]].forEach(([x, z, r]) => { m4.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, r, 0)), new THREE.Vector3(i % 3 === 0 ? 2.0 : 1, h, i % 3 === 0 ? 1.6 : 1)); inst.setMatrixAt(n++, m4); });
  }); }
  inst.count = n; inst.castShadow = true; edificio.add(inst);
}
// RLR · los cuatro zaguanes: el eje de cada calzada atraviesa el anillo en planta baja (11.1 m de ancho × 11 m) con portales de tezontle de 20 m
const infoZaguan = { t: "El zaguán", c: "El eje de cada calzada atraviesa el anillo: desde la plaza se ve el parque y la Casa de Decisiones. Un paso de 11.1 m de ancho y 11 m de alto, con portal de tezontle de 20 m por fuera y por dentro. La decisión se ve desde la calle.", d: [["Paso", "11.1 × 11 m, piso de tezontle"], ["Portal", "20 m de alto, jambas de 5 m"], ["Hay", "cuatro, uno por lado, con sus compuertas de vidrio"]] };
[[0, -L / 2, 0], [0, L / 2, 0], [L / 2, 0, Math.PI / 2], [-L / 2, 0, Math.PI / 2], [0, -LI / 2, 0], [0, LI / 2, 0], [LI / 2, 0, Math.PI / 2], [-LI / 2, 0, Math.PI / 2]].forEach(([x, z, r]) => {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r; edificio.add(g);
  [-1, 1].forEach(sg => caja3(5, 20, 5, MAT.tezontle, sg * (M / 2 + 2.5), 10, 0, g, infoZaguan));
  caja3(M + 10, 4.5, 5, MAT.tezontle, 0, 22.25, 0, g, infoZaguan);
});
[[M, F + 2, 0, -(L - F) / 2], [M, F + 2, 0, (L - F) / 2], [F + 2, M, (L - F) / 2, 0], [F + 2, M, -(L - F) / 2, 0]].forEach(([w, d, x, z]) => caja3(w, 0.4, d, MAT.tezontle, x, 0.5, z, edificio, infoZaguan).castShadow = false);
// RLR · la greca: en los pisos de dirección (24–31) una de cada tres oficinas sale 2.2 m, en diagonal; la textura viene del rango, no del capricho
{
  const matB = matVidrio(M, HP), inst = new THREE.InstancedMesh(new THREE.BoxGeometry(M - 1.6, HP - 0.9, 2.5), matB, 4 * 30 * 8);
  const marcos = new THREE.InstancedMesh(new THREE.BoxGeometry(M - 1.0, 0.35, 2.9), MAT.bronce, 4 * 30 * 8 * 2);
  let n = 0, nm = 0; const m4 = new THREE.Matrix4();
  for (let k = 24; k <= 31; k++) for (let i = 3; i <= 26; i++) { if ((i + k) % 3) continue; const u = -L / 2 + M / 2 + i * M, y = yPiso(k) + HP / 2;
    [[u, -L / 2 - 0.95, 0], [u, L / 2 + 0.95, 0], [L / 2 + 0.95, u, Math.PI / 2], [-L / 2 - 0.95, u, Math.PI / 2]].forEach(([x, z, r]) => {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, r, 0));
      m4.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1)); inst.setMatrixAt(n++, m4);
      m4.compose(new THREE.Vector3(x, y - HP / 2 + 0.3, z), q, new THREE.Vector3(1, 1, 1)); marcos.setMatrixAt(nm++, m4);
      m4.compose(new THREE.Vector3(x, y + HP / 2 - 0.3, z), q, new THREE.Vector3(1, 1, 1)); marcos.setMatrixAt(nm++, m4);
    }); }
  inst.count = n; marcos.count = nm; inst.castShadow = marcos.castShadow = true; edificio.add(inst, marcos);
  inst.userData.info = { t: "La greca", c: "En los pisos de dirección (24–31) una de cada tres oficinas sale 2.2 m de la fachada, en diagonal, un piso sí y dos no. La textura nace del rango, no del capricho: se lee como un textil mexicano y cada bahía da sombra a la de abajo.", d: [["Bahías", n.toLocaleString("es-MX")], ["Saliente", "2.2 m (un quinto de módulo)"], ["Marco", "bronce"]] }; pickables.push(inst);
}
// RLR · el remate: los dos pisos del gabinete (32–33) salen 2.2 m sobre toda la fachada, con cornisa de bronce
{
  const h = H_TOP - Y_REMATE, y = Y_REMATE + h / 2, infoR = { t: "El remate", c: "Los pisos 32 y 33, del gabinete y los coordinadores de sector, salen 2.2 m sobre toda la fachada y cierran la composición con una cornisa de bronce: basamento, cuerpo y remate, como los palacios de la ciudad.", d: [["Saliente", "2.2 m"], ["Altura", "9 m (dos pisos)"], ["Cornisa", "bronce, 4 m de vuelo"]] };
  [[L + 5, 2.5, 0, -L / 2 - 0.95], [L + 5, 2.5, 0, L / 2 + 0.95], [2.5, L, L / 2 + 0.95, 0], [2.5, L, -L / 2 - 0.95, 0]].forEach(([w, d, x, z]) => caja3(w, h, d, matVidrio(L, h), x, y, z, edificio, infoR));
  [[L + 8, 4, 0, -L / 2 - 1.5], [L + 8, 4, 0, L / 2 + 1.5], [4, L, L / 2 + 1.5, 0], [4, L, -L / 2 - 1.5, 0]].forEach(([w, d, x, z]) => caja3(w, 0.8, d, MAT.bronce, x, Y_REMATE - 0.4, z, edificio, infoR));
}
// RLR · las cuatro torres de esquina: 3 módulos por lado, salen 5.5 m de las dos fachadas y suben 11 m sobre el techo; linterna de vidrio arriba
{
  const TW = 3 * M + 5.5, HT = H_TOP + 11, cc = L / 2 - 1.5 * M + 2.75;
  const nombres = { "1,-1": "Nororiente · Personas y Orden", "1,1": "Suroriente · Orden y Economía", "-1,1": "Surponiente · Economía y Territorio", "-1,-1": "Norponiente · Territorio y Personas" };
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => {
    const info = { t: "Torre " + nombres[i + "," + j], c: "Las esquinas son de los superdirectores que coordinan dos sectores: aquí se vuelven volumen. Tres módulos por lado en cantera, salen 5.5 m de las dos fachadas y suben 11 m sobre el techo con una linterna de vidrio. Cuatro torres: un cuadrado que se reconoce desde lejos." + (i > 0 && j < 0 ? " En esta linterna está el Mirador 33, el restaurante de la azotea." : ""), d: [["Base", "38.8 × 38.8 m"], ["Altura", "170 m + linterna"], ["Oficinas de esquina", "33, una por piso"]] };
    const m = matPiedra(texTorre, TW, HT, HT / HP); m.roughness = 0.8;
    caja3(TW, HT, TW, m, i * cc, HT / 2, j * cc, edificio, info);
    caja3(TW + 2.4, 1.2, TW + 2.4, MAT.cantera, i * cc, HT + 0.6, j * cc, edificio, info);
    caja3(TW - 6, 6, TW - 6, matVidrio(TW - 6, 6, true), i * cc, HT + 4.2, j * cc, edificio, info);
    caja3(TW - 4, 0.9, TW - 4, MAT.bronce, i * cc, HT + 7.6, j * cc, edificio, info);
  });
}
// marcos de bronce de los parques de cielo (en la fachada exterior)
[[0, -L / 2, 0], [0, L / 2, 0], [L / 2, 0, Math.PI / 2], [-L / 2, 0, Math.PI / 2]].forEach(([x, z, r]) => {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r; edificio.add(g); const hv = Y_VANO1 - Y_VANO0;
  caja3(VANO + 3.6, 1.4, 1.4, MAT.bronce, 0, Y_VANO1 + 0.7, 0, g); caja3(VANO + 3.6, 1.4, 1.4, MAT.bronce, 0, Y_VANO0 - 0.7, 0, g);
  [-1, 1].forEach(sg => caja3(1.4, hv + 2.8, 1.4, MAT.bronce, sg * (VANO / 2 + 1.1), (Y_VANO0 + Y_VANO1) / 2, 0, g));
});
// losas interiores por piso, coloreadas por uso (se ven en el corte)
const USO = P.edificio.usos.map(u => ({ hasta: u.pisos[1], c: hex(u.color), n: u.nombre }));
const usoDe = k => USO.find(u => k <= u.hasta);
{
  const piezas = [];
  for (let k = 1; k <= NP; k++) {
    const y = yPiso(k), col = new THREE.Color(usoDe(k).c), enVano = k >= PC0 && k <= PC2;
    const zN = -(L - F) / 2, zS = (L - F) / 2, xE = (L - F) / 2, xO = -(L - F) / 2;
    const Fi = F - 1;
    if (!enVano) { piezas.push([L - 1, Fi, 0, y, zN, col], [L - 1, Fi, 0, y, zS, col], [Fi, LI - 1, xE, y, 0, col], [Fi, LI - 1, xO, y, 0, col]); }
    else { const w = (L - VANO) / 2, cx = VANO / 2 + w / 2, wi = (LI - VANO) / 2, ci = VANO / 2 + wi / 2;
      piezas.push([w - 1, Fi, -cx, y, zN, col], [w - 1, Fi, cx, y, zN, col], [w - 1, Fi, -cx, y, zS, col], [w - 1, Fi, cx, y, zS, col], [Fi, wi - 1, xE, y, -ci, col], [Fi, wi - 1, xE, y, ci, col], [Fi, wi - 1, xO, y, -ci, col], [Fi, wi - 1, xO, y, ci, col]); }
  }
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.35, 1), new THREE.MeshStandardMaterial({ roughness: 0.8, side: DS }), piezas.length);
  const m4 = new THREE.Matrix4();
  piezas.forEach(([w, d, x, y, z, col], i) => { m4.compose(new THREE.Vector3(x, y + 0.17, z), new THREE.Quaternion(), new THREE.Vector3(w, 1, d)); inst.setMatrixAt(i, m4); inst.setColorAt(i, col); });
  inst.castShadow = false; edificio.add(inst);
}
// núcleos: 4 de esquina y 4 al borde del vano
{
  const c = L / 2 - M - 0.5, n2 = 22.2, h = H_TOP + 5, Fi = F - 1;
  [[-c, -c], [c, -c], [-c, c], [c, c]].forEach(([x, z]) => caja3(n2, h, n2, MAT.recinto, x, h / 2, z));
  [[VANO / 2, -(L - F) / 2, n2, Fi], [VANO / 2, (L - F) / 2, n2, Fi], [(L - F) / 2, VANO / 2, Fi, n2], [-(L - F) / 2, VANO / 2, Fi, n2]].forEach(([x, z, w, d]) => caja3(w, h, d, MAT.recinto, x, h / 2, z));
}
// vanos de los parques de cielo: muros laterales, piso verde, columnas, árboles, cortaviento
const arbolesCielo = [];
[[0, -(L - F) / 2, 0], [0, (L - F) / 2, 0], [(L - F) / 2, 0, Math.PI / 2], [-(L - F) / 2, 0, Math.PI / 2]].forEach(([x, z, r], k) => {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = r; edificio.add(g);
  const hv = Y_VANO1 - Y_VANO0;
  const lados = ["norte", "sur", "oriente", "poniente"][k];
  const info = { t: `Parque de cielo · ${NOMBRE_LADO[lados]}`, c: "Al centro exacto de la fachada, los pisos 16, 17 y 18 desaparecen en 99 m: un jardín abierto al bosque y al parque, con las columnas atravesándolo como troncos de piedra. Es la cintura del edificio: aquí están los Mercados de los 32 estados, cuatro gimnasios y el piso de refugio.", d: [["Vacío", "99 × 33.3 × 13.5 m"], ["Tierra", "1.2 m sobre losa"], ["Árboles", "encinos bajos, fresnos, tejocotes, magnolias"], ["Extra", k === 3 ? "muro de escalada de 13.5 m" : "café y salas al aire libre"]] };
  const piso = caja3(VANO, 0.6, F - 0.4, MAT.pradera, 0, Y_VANO0 + 0.3, 0, g, info);
  const muro = (s) => caja3(0.8, hv, F - 0.6, MAT.recinto, s * (VANO / 2 + 0.4), Y_VANO0 + hv / 2, 0, g);
  muro(1); muro(-1);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) { const col = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, hv, 12), MAT.cantera); col.position.set(-44.4 + i * M, Y_VANO0 + hv / 2, -F / 2 + 1.6 + j * (F - 3.2) / 3); col.castShadow = true; g.add(col); }
  const cv = plano(VANO, 2.4, new THREE.MeshStandardMaterial({ color: 0x9fc7e8, transparent: true, opacity: 0.35, side: DS }), 0, Y_VANO0 + 1.8, -F / 2 + 0.3, 0, g); cv.castShadow = false;
  for (let i = 0; i < P.edificio.parques_de_cielo.arboles_por_parque; i++) { const p = new THREE.Vector3(entre(-44, 44), Y_VANO0 + 0.6, entre(-12, 12)); g.localToWorld(p); arbolesCielo.push(p); }
});
// techo: losa, parapetos, paneles, pista
{
  const techo = (w, d, x, z) => caja3(w, 1.0, d, MAT.cantera, x, H_TOP + 0.5, z, edificio, { t: "La azotea", c: "Pista de correr de 1.2 km por el perímetro, paneles solares sobre pérgolas caminables, jardines de sedum y agaves, cuatro miradores, el restaurante Mirador 33 y un helipuerto solo de emergencia.", d: [["Paneles", "~24,000 m², unos 5 MW (menos del 5 % del consumo)"], ["Pista", "1,200 m de caucho"], ["Mirador 33", "esquina Nororiente, 150 asientos"]] });
  techo(L, F, 0, -(L - F) / 2); techo(L, F, 0, (L - F) / 2); techo(F, LI, (L - F) / 2, 0); techo(F, LI, -(L - F) / 2, 0);
  [[L, 0.4, 0, -L / 2], [L, 0.4, 0, L / 2], [0.4, L, L / 2, 0], [0.4, L, -L / 2, 0], [LI, 0.4, 0, -LI / 2], [LI, 0.4, 0, LI / 2], [0.4, LI, LI / 2, 0], [0.4, LI, -LI / 2, 0]].forEach(([w, d, x, z]) => caja3(w, 1.4, d, MAT.cantera, x, H_TOP + 1.7, z));
  // pista (anillo ocre a 6 m del borde interior)
  const r = LI / 2 + 6; [[L - 2 * (F - 8), 3, 0, -r], [L - 2 * (F - 8), 3, 0, r], [3, L - 2 * (F - 8), r, 0], [3, L - 2 * (F - 8), -r, 0]].forEach(([w, d, x, z]) => caja3(w, 0.2, d, MAT.pista, x, H_TOP + 1.1, z).castShadow = false);
  // paneles: 2 filas por lado sobre pérgolas
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(M - 0.6, 0.12, 5.2), MAT.pv, 4 * 30 * 2), m4 = new THREE.Matrix4(); let n = 0;
  for (let i = 0; i < 30; i++) { const u = -L / 2 + M / 2 + i * M; for (let f = 0; f < 2; f++) { const off = (L - F) / 2 + 2 - f * 7;
    [[u, -off, 0], [u, off, 0], [off, u, Math.PI / 2], [-off, u, Math.PI / 2]].forEach(([x, z, ry]) => { m4.compose(new THREE.Vector3(x, H_TOP + 4.2, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(-14), ry, 0, "YXZ")), new THREE.Vector3(1, 1, 1)); inst.setMatrixAt(n++, m4); }); } }
  inst.count = n; inst.castShadow = true; edificio.add(inst);
  // patas de las pérgolas
  const patas = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.2, 3.2, 8), MAT.bronce, 4 * 31 * 2); n = 0;
  for (let i = 0; i <= 30; i++) { const u = -L / 2 + i * M; for (let f = 0; f < 2; f++) { const off = (L - F) / 2 + 2 - f * 7; [[u, -off], [u, off], [off, u], [-off, u]].forEach(([x, z]) => { m4.compose(new THREE.Vector3(x, H_TOP + 2.6, z), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1)); patas.setMatrixAt(n++, m4); }); } }
  patas.count = n; edificio.add(patas);
  // helipuerto de emergencia en el techo del lado Sur, junto a la torre Suroriente
  const c = L / 2 - M - 36;
  const hp = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 0.4, 32), MAT.recinto); hp.position.set(c, H_TOP + 1.2, (L - F) / 2); edificio.add(hp);
  const hr = new THREE.Mesh(new THREE.RingGeometry(8, 10, 32), MAT.blanco); hr.rotation.x = -Math.PI / 2; hr.position.set(c, H_TOP + 1.45, (L - F) / 2); edificio.add(hr);
}

/* ---------- El parque interior ---------- */
const parque = new THREE.Group(); edificio.add(parque);
// agua alrededor de la Casa
{ const ext = CASA / 2 + AGUA, m = MAT.agua;
  [[2 * ext, AGUA, 0, -(ext - AGUA / 2)], [2 * ext, AGUA, 0, ext - AGUA / 2], [AGUA, CASA, ext - AGUA / 2, 0], [AGUA, CASA, -(ext - AGUA / 2), 0]].forEach(([w, d, x, z]) => caja3(w, 0.4, d, m, x, 0.25, z, parque, { t: "El espejo de agua", c: "Un anillo de agua de lluvia tratada de 16.5 m de ancho rodea la Casa de Decisiones: el lago alrededor de la isla, con ahuehuetes en la orilla. Las cuatro calzadas lo cruzan como puentes.", d: [["Por fuera", "132 × 132 m"], ["Profundidad", "30 cm"], ["Árbol", "ahuehuete, el árbol nacional"]] }).castShadow = false); }
// las cuatro calzadas: piso, pérgola y postes
[[0, -1], [0, 1], [1, 0], [-1, 0]].forEach(([i, j]) => {
  const largo = (LI - CASA) / 2, centro = CASA / 2 + largo / 2;
  const x = i * centro, z = j * centro, w = i ? largo : M, d = j ? largo : M;
  caja3(w, 0.5, d, MAT.tezontle, x, 0.5, z, parque, { t: "Las cuatro calzadas", c: "Del centro exacto de cada lado del anillo sale una galería cubierta de 11.1 m de ancho hasta la Casa de Decisiones, como las calzadas de Tenochtitlan a la isla. Colorines rojos en marzo a ambos lados.", d: [["Largo", "84 m"], ["Ancho", "11.1 m"], ["Techo", "pérgola de bronce y tezontle"]] }).castShadow = false;
  caja3(w, 0.5, d, MAT.bronce, x, 5.6, z, parque);
  const n = Math.round(largo / M);
  for (let k = 0; k <= n; k++) { const u = -largo / 2 + k * (largo / n); [[-1], [1]].forEach(([s]) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5.4, 8), MAT.bronce); p.position.set(i ? x + u : s * (M / 2 - 0.4), 2.7, j ? z + u : s * (M / 2 - 0.4)); if (i) p.position.z = s * (M / 2 - 0.4); else p.position.x = s * (M / 2 - 0.4); parque.add(p); }); }
});
construirEmplazamientos("patio", parque); // Teatro 333 con foyer, restaurante, cabina y bodega; la milpa
// RLR · jardineras: corridas al pie de las cuatro fachadas (entre torre y zaguán), círculos en las plazas, corridas en las calzadas; manchas de flor en las praderas
{ const JA = P.vegetacion.jardineras, TW3 = 3 * M, fin = L / 2 - TW3 - 1, ini = M / 2 + 5.5, len = fin - ini, mid = (ini + fin) / 2, ancho = JA.facade_pb.ancho_m, alto = JA.facade_pb.alto_m, off = L / 2 + 1.4 + ancho / 2;
  [[mid, -off, true], [-mid, -off, true], [mid, off, true], [-mid, off, true], [off, mid, false], [off, -mid, false], [-off, mid, false], [-off, -mid, false]].forEach(([a, b, enX]) => {
    const [w, d, x, z] = enX ? [len, ancho, a, b] : [ancho, len, b, a];
    caja3(w, alto, d, MAT.cantera, x, alto / 2, z, edificio, { t: "Jardinera de la fachada", c: "Al pie de las cuatro fachadas, entre la torre y el zaguán: una jardinera corrida de cantera de 3 m con salvias, dalias y agaves. La flor cambia con el mes.", d: [] }).castShadow = false;
    caja3(w - 0.6, 0.35, d - 0.6, MAT.flor, x, alto + 0.1, z, edificio).castShadow = false; });
  plazas.forEach(([px, pz]) => [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => { const x = px + i * 30, z = pz + j * 30, r = JA.plazas.radio_m;
    const b = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.6, 24), MAT.cantera); b.position.set(x, 0.75, z); sitio.add(b);
    const f = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.5, r - 0.5, 0.3, 24), MAT.flor); f.position.set(x, 1.15, z); sitio.add(f); }));
  [[0, -1], [0, 1], [1, 0], [-1, 0]].forEach(([i, j]) => { const largo = (LI - CASA) / 2 - AGUA - 2, centro = CASA / 2 + AGUA + 1 + largo / 2, x = i * centro, z = j * centro, aw = JA.calzadas.ancho_m;
    [-1, 1].forEach(sg => { const o = sg * (M / 2 + 0.9 + aw / 2); const [w, d, cx, cz] = i ? [largo, aw, x, o] : [aw, largo, o, z]; caja3(w, 0.5, d, MAT.flor, cx, 0.3, cz, parque).castShadow = false; }); });
  for (let k = 0, intentos = 0; k < JA.patio_manchas.cantidad && intentos < 3000; intentos++) { const x = entre(-LI / 2 + 14, LI / 2 - 14), z = entre(-LI / 2 + 14, LI / 2 - 14), r = entre(...JA.patio_manchas.radio_m);
    if ((Math.abs(x) < CASA / 2 + AGUA + 14 && Math.abs(z) < CASA / 2 + AGUA + 14) || Math.abs(x) < 10 + r || Math.abs(z) < 10 + r || tapado(x, z, "patio")) continue;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.12, 20), MAT.flor); m.position.set(x, 0.1, z); m.receiveShadow = true; parque.add(m); k++; }
}
// la Casa de Decisiones
{
  const h1 = 11, h2 = 7, H = h1 + h2, hueco = SUITE + 4, HL = 11; // planta baja 11 m, planta alta 7 m, linterna del Presidente 11 m más
  const infoCasa = { t: "La Casa de Decisiones", c: "Al centro exacto del parque: la oficina del Presidente con cuatro puertas a cuatro salas, seis salas conectadas en anillo, Vicepresidencia y Secretaría en las esquinas opuestas, y un pasillo de preparación donde el siguiente equipo ya tiene su presentación en pantalla. El carrusel. Alrededor: Sala del Gabinete, Sala de Situación, Sala de Prensa, 300 personas de Presidencia.", d: [["Medida", "99 × 99 m, 2 niveles (11 m + 7 m) + sótano"], ["Suite", "33.3 × 33.3 m en 3 × 3 celdas de 11.1 m, 11 m de altura"], ["Linterna", "la oficina del Presidente sube a 22 m: la única marca vertical del centro"], ["Portales", "columnata de 11 m alrededor, 3.3 m de fondo, pisa el agua"], ["Techo", "verde, continúa el parque"], ["Sismo", "aislamiento de base completo"], ["Llegada", "cuatro calzadas o túnel desde el S1"]] };
  const MC = { pradera: MAT.pradera.clone(), cantera: MAT.cantera.clone(), bronce: MAT.bronce.clone(), parque: MAT.parque.clone(), madera: mat(0x7a5a3a) };
  Object.values(MC).forEach(m => { m.clippingPlanes = [planoCasa]; matsCasa.push(m); });
  const vidrioCasa = (w, h) => { const m = matVidrio(w, h, true); m.clippingPlanes = [planoCasa]; matsCasa.push(m); return m; };
  const anillo = (w, d, x, z) => { caja3(w, H, d, vidrioCasa(Math.max(w, d), H), x, H / 2, z, parque, infoCasa); };
  const a = (CASA - hueco) / 2; anillo(CASA, a, 0, -(CASA - a) / 2); anillo(CASA, a, 0, (CASA - a) / 2); anillo(a, hueco, (CASA - a) / 2, 0); anillo(a, hueco, -(CASA - a) / 2, 0);
  const techoV = (w, d, x, z) => caja3(w, 0.8, d, MC.pradera, x, H + 0.4, z, parque, infoCasa);
  techoV(CASA + 1, a + 1, 0, -(CASA - a) / 2); techoV(CASA + 1, a + 1, 0, (CASA - a) / 2); techoV(a + 1, hueco, (CASA - a) / 2, 0); techoV(a + 1, hueco, -(CASA - a) / 2, 0);
  // los portales: columnata de 11 m y 3.3 m de fondo alrededor de la Casa; las columnas pisan el agua
  const PF = 3.3;
  for (let k = 0; k <= 9; k++) { const u = -CASA / 2 + k * (CASA / 9); [[u, -CASA / 2 - PF], [u, CASA / 2 + PF], [CASA / 2 + PF, u], [-CASA / 2 - PF, u]].forEach(([x, z]) => { const col = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, h1, 14), MC.cantera); col.position.set(x, h1 / 2, z); col.castShadow = true; parque.add(col); }); }
  [[CASA + 2 * PF + 1.6, PF + 1, 0, -(CASA / 2 + PF / 2 + 0.3)], [CASA + 2 * PF + 1.6, PF + 1, 0, CASA / 2 + PF / 2 + 0.3], [PF + 1, CASA, CASA / 2 + PF / 2 + 0.3, 0], [PF + 1, CASA, -(CASA / 2 + PF / 2 + 0.3), 0]].forEach(([w, d, x, z]) => caja3(w, 0.7, d, MC.cantera, x, h1 + 0.35, z, parque, infoCasa));
  // pilares de piedra de la planta alta
  for (let k = 0; k <= 9; k++) { const u = -CASA / 2 + k * (CASA / 9); [[u, -CASA / 2 - 0.5], [u, CASA / 2 + 0.5], [CASA / 2 + 0.5, u], [-CASA / 2 - 0.5, u]].forEach(([x, z]) => caja3(1.2, h2, 1.2, MC.cantera, x, h1 + h2 / 2, z, parque)); }
  // la suite: bloque de 33.3 con tragaluces 3 × 3 y el patio de la magnolia
  const suite = caja3(SUITE, h1, SUITE, MC.cantera, 0, h1 / 2, 0, parque, { t: "La suite de decisión", c: "Nueve celdas de 11.1 m: el Presidente al centro (su oficina sube 22 m como una linterna de vidrio, con patio de luz y una magnolia mexicana), salas de 11 m de altura, salas Norte y Sur para 33, Oriente y Poniente para 24, dos esquinas para 16, y Vicepresidencia y Secretaría en las otras dos. Todas conectadas con puertas corredizas.", d: [["Medida", "33.3 × 33.3 m"], ["Pantalla por sala", "4 m + dos laterales"], ["Acústica", "25 dB de fondo"], ["Mesa", "una sola pieza de parota"]] });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { if (i === 1 && j === 1) continue; caja3(M - 2, 0.5, M - 2, vidrioCasa(M, 1), (i - 1) * M, h1 + 0.3, (j - 1) * M, parque); }
  // la linterna: la oficina del Presidente sube 11 m más sobre el techo, vidrio y bronce, abierta al cielo por el patio de la magnolia
  const infoLin = { t: "La linterna del Presidente", c: "La celda central de la suite sube 11 m sobre el techo verde: 22 m en total, el doble de las salas. Vidrio y bronce, abierta al cielo por el patio de 5 × 5 m de la magnolia. Es la única marca vertical en el centro del complejo y se ve desde los cuatro zaguanes.", d: [["Base", "11.1 × 11.1 m"], ["Altura total", "22 m"], ["Árbol", "Magnolia mexicana (yoloxóchitl)"]] };
  caja3(M, HL, M, vidrioCasa(M, HL), 0, h1 + HL / 2, 0, parque, infoLin);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => caja3(0.9, HL + 1, 0.9, MC.bronce, i * (M / 2), h1 + HL / 2 + 0.3, j * (M / 2), parque));
  [[M + 1.4, 0.8, 0, -(M / 2 + 0.3)], [M + 1.4, 0.8, 0, M / 2 + 0.3], [0.8, M + 1.4, M / 2 + 0.3, 0], [0.8, M + 1.4, -(M / 2 + 0.3), 0]].forEach(([w, d, x, z]) => caja3(w, 0.9, d, MC.bronce, x, h1 + HL + 0.3, z, parque, infoLin));
  const marco = (w, d, x, z) => caja3(w, 0.7, d, MC.bronce, x, h1 + 0.35, z, parque);
  for (let k = -1; k <= 2; k++) { marco(SUITE, 0.8, 0, (k - 0.5) * M); marco(0.8, SUITE, (k - 0.5) * M, 0); }
  caja3(5, 0.4, 5, MC.parque, 0, h1 + HL + 0.2, 0, parque); // el patio de la magnolia, abierto arriba de la linterna
  // la terraza del Presidente: 33 × 33 en el techo verde, alrededor de la linterna, con barandal de bronce
  caja3(SUITE, 0.3, SUITE, MC.pradera, 0, H + 0.95, 0, parque, { t: "La terraza del Presidente", c: "33 × 33 m de jardín en el techo de la Casa, alrededor de la linterna, con acceso solo desde la oficina: para la conversación que no cabe en una sala, con el edificio entero alrededor.", d: [] });
  [[SUITE + 0.4, 0.2, 0, -SUITE / 2], [SUITE + 0.4, 0.2, 0, SUITE / 2], [0.2, SUITE + 0.4, SUITE / 2, 0], [0.2, SUITE + 0.4, -SUITE / 2, 0]].forEach(([w, d, x, z]) => caja3(w, 1.1, d, MC.bronce, x, H + 1.6, z, parque));
  // salas de espera y esclusas al final de cada calzada, a la orilla del agua
  [[0, -1], [0, 1], [1, 0], [-1, 0]].forEach(([i, j]) => { const d = CASA / 2 + AGUA + 9, x = i * d, z = j * d, w = i ? 14 : 22, dd = j ? 14 : 22;
    caja3(w, 6.5, dd, vidrioCasa(22, 6.5), x, 3.25, z, parque, { t: "Sala de espera de Estado y esclusa", c: "Al final de cada calzada, a la orilla del agua: una sala de espera de 60 m² con vista al espejo y a la linterna, café servido, y la esclusa de dos puertas hacia la Casa. Quien espera, espera frente al agua, nunca en un pasillo.", d: [["Hay", "4, una por calzada"], ["Sala", "60 m²"], ["Esclusa", "dos puertas en serie, verificación de dos factores"]] });
    caja3(w + 1.5, 0.6, dd + 1.5, MC.cantera, x, 6.8, z, parque); });
  // por dentro de la suite (se ve cuando la Casa se corta a 6.5 m): piso de madera, muros del tablero 3 × 3 con sus puertas, mesas
  caja3(SUITE - 0.6, 0.3, SUITE - 0.6, MC.madera, 0, 0.3, 0, parque);
  const muroS = (w, d, x, z) => caja3(w, h1 - 0.8, d, MC.cantera, x, (h1 - 0.8) / 2, z, parque);
  [-M / 2, M / 2].forEach(p => { [[-M, 0], [M, 0]].forEach(([u]) => { muroS(M - 3, 0.3, u, p); muroS(0.3, M - 3, p, u); }); muroS(M - 3, 0.3, 0, p); muroS(0.3, M - 3, p, 0); });
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { if (!i && !j) { caja3(4.5, 0.08, 4.5, MC.parque, 0, 0.5, 0, parque); continue; } caja3(4.2, 0.12, 2.0, MC.madera, i * M, 1.0, j * M, parque); }
}

/* ---------- Mobiliario: seis piezas, acomodadas por regla en los 33 pisos ---------- */
// RLR · cada pieza es una malla instanciada; las posiciones salen de P.mobiliario (bandas, reglas por uso, patrón de la banda media)
const MB = P.mobiliario, mobiliario = new THREE.Group(); edificio.add(mobiliario);
const CAT = Object.fromEntries(MB.catalogo.map(c => [c.id, c]));
const conteoMob = {};
{
  const listas = { mesa: [], silla: [], cubiculo: [], junta: [], redonda: [], butaca: [] };
  const add = (p, x, y, z, ry = 0, sx = 1, sz = 1) => listas[p].push([x, y, z, ry, sx, sz]);
  const yBase = k => (k ? yPiso(k) + 0.35 : 0.5);
  // marco por lado: u a lo largo del lado (−L/2..L/2), v hacia adentro del anillo (0 = fachada exterior, 33.3 = fachada interior)
  const LADOS = [
    { id: "norte", xz: (u, v) => [u, -L / 2 + v], ry: 0 }, { id: "sur", xz: (u, v) => [u, L / 2 - v], ry: 0 },
    { id: "oriente", xz: (u, v) => [L / 2 - v, u], ry: Math.PI / 2 }, { id: "poniente", xz: (u, v) => [-L / 2 + v, u], ry: Math.PI / 2 },
  ];
  const TAM = CAT.junta.tamanos;
  function sala(lado, uc, vc, y, tam) { // mesa de junta con sus sillas alrededor
    const t = TAM[tam], [lt, wt] = t.medida, n = t.sillas, [x, z] = lado.xz(uc, vc); add("junta", x, y, z, lado.ry, lt / TAM.equipo.medida[0], wt / TAM.equipo.medida[1]);
    const porLado = Math.max(1, Math.floor((n - 2) / 2)), paso = lt / (porLado + 1);
    for (let j = 1; j <= porLado; j++) [-1, 1].forEach(sg => { const [sx, sz] = lado.xz(uc - lt / 2 + j * paso, vc + sg * (wt / 2 + 0.45)); add("silla", sx, y, sz, lado.ry); });
    [-1, 1].forEach(sg => { const [sx, sz] = lado.xz(uc + sg * (lt / 2 + 0.45), vc); add("silla", sx, y, sz, lado.ry + Math.PI / 2); });
  }
  function cubiculos(lado, uc, y, n, v = 13.3) { for (let j = 0; j < n; j++) { const [x, z] = lado.xz(uc - (n - 1) * 1.3 + j * 2.6, v); add("cubiculo", x, y, z, lado.ry); } }
  function filaMesas(lado, uc, v, y, n, paso, espejo) { // n mesas en fila frente a la ventana; la silla del lado de adentro
    for (let j = 0; j < n; j++) { const u = uc - ((n - 1) * paso) / 2 + j * paso, [x, z] = lado.xz(u, v); add("mesa", x, y, z, lado.ry); const [cx, cz] = lado.xz(u, v + (espejo ? -0.8 : 0.8)); add("silla", cx, y, cz, lado.ry); }
  }
  function comedor(lado, uc, v, y, espejo) { // mesa doble (dos mesas juntas) con 8 sillas
    const [x, z] = lado.xz(uc, v); add("mesa", x, y, z, lado.ry, 2, 1);
    for (let j = 0; j < 4; j++) [-1, 1].forEach(sg => { const [cx, cz] = lado.xz(uc - 1.35 + j * 0.9, v + sg * 0.85); add("silla", cx, y, cz, lado.ry); });
  }
  const nMod = P.edificio.geometria.reticula.modulos_por_lado, cTorre = P.edificio.arquitectura.torres_esquina.modulos;
  for (let k = 0; k <= NP; k++) {
    const y = yBase(k), uso = k ? D.usoDe(k).id : "pb", R = k ? MB.por_uso[uso] : null;
    for (const lado of LADOS) {
      for (let i = cTorre; i < nMod - cTorre; i++) {
        const uc = -L / 2 + i * M + M / 2;
        if (Math.abs(uc - VANO / 2) < M) continue;                                   // núcleo de medio lado
        if (k >= PC0 && k <= PC2 && Math.abs(uc) < VANO / 2) continue;              // parque de cielo
        if (k === 0 && Math.abs(uc) < M) continue;                                    // zaguán
        if (k === 0) { // planta baja: Casa del Ciudadano afuera, comedores adentro
          const cz = MB.pb.ciudadano; for (let j = 0; j < cz.mesas_por_modulo; j++) { const u = uc - ((cz.mesas_por_modulo - 1) * cz.paso_u) / 2 + j * cz.paso_u, [x, z] = lado.xz(u, cz.v); add("redonda", x, y, z); [-1, 1].forEach(sg => { const [sx, sz] = lado.xz(u + sg * 0.95, cz.v); add("silla", sx, y, sz, lado.ry + Math.PI / 2); }); }
          MB.pb.comedor.filas_v.forEach(v => { for (let j = 0; j < MB.pb.comedor.mesas_dobles_por_modulo; j++) comedor(lado, uc - 2.6 + j * 5.2, v, y, true); });
          continue;
        }
        if (uso === "publico") { R.comedor.filas_v.forEach(v => { for (let j = 0; j < R.comedor.mesas_dobles_por_modulo; j++) { comedor(lado, uc - 2.6 + j * 5.2, v, y, false); comedor(lado, uc - 2.6 + j * 5.2, F - v, y, true); } }); continue; }
        // bandas exterior e interior
        if (R.mesas_por_modulo) { R.filas_v.forEach((v, f) => { filaMesas(lado, uc, v, y, R.por_fila[f], R.paso_u, false); filaMesas(lado, uc, F - v, y, R.por_fila[f], R.paso_u, true); }); }
        else if (R.oficinas_por_modulo) {
          const n = R.oficinas_por_modulo, paso = M / n;
          for (let o = 0; o < n; o++) { const u = uc - M / 2 + paso / 2 + o * paso;
            [[R.mesa_v, false], [F - R.mesa_v, true]].forEach(([v, esp]) => { const [x, z] = lado.xz(u, v); add("mesa", x, y, z, lado.ry); const [cx, cz] = lado.xz(u, v + (esp ? -0.8 : 0.8)); add("silla", cx, y, cz, lado.ry);
              if (R.visitas_v) [-0.6, 0.6].forEach(du => { const [vx, vz] = lado.xz(u + du, esp ? F - R.visitas_v : R.visitas_v); add("silla", vx, y, vz, lado.ry); });
              if (R.junta) sala(lado, u, esp ? F - R.junta_v : R.junta_v, y, R.junta); }); }
        }
        // banda media: patrón de tres módulos
        const pat = R.banda_media[i % 3];
        if (pat === "cubiculos") cubiculos(lado, uc, y, MB.cubiculos_por_modulo);
        else if (pat === "charla") { sala(lado, uc - 2.4, 16.65, y, "charla"); cubiculos(lado, uc + 3.6, y, 1, 13.3); cubiculos(lado, uc + 3.6, y, 1, 20); }
        else sala(lado, uc, 16.65, y, pat);
      }
    }
    // oficinas de esquina en las torres: una mesa y una sala de 8
    if (k >= 1) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => { const cc = D.torre.centro; add("mesa", i * (cc - 7), y, j * (cc - 7), 0); add("silla", i * (cc - 7), y, j * (cc - 7) + j * 0.8, 0);
      const ladoF = { id: "esq", xz: (u, v) => [u, v], ry: 0 }; sala(ladoF, i * (cc + 5), j * (cc + 5), y, MB.esquinas.junta); });
  }
  // teatros: filas de butacas con rake, escenario y pantalla, dentro de la colina
  [["t999", "teatro_999", -1], ["t333", "teatro_333", -1]].forEach(([tid, eid]) => {
    const e = P.emplazamientos.find(x => x.id === eid), te = MB.teatros[tid], [cx, cz] = e.pos_xz, prof = e.medida_xz[1] / 2, grupo = e.grupo === "patio" ? parque : sitio;
    const zPantalla = cz - prof * 0.3, zEsc = zPantalla + 7, z0 = zEsc + 7, [pw, ph] = te.pantalla_xz;
    const pantalla = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, 0.4), new THREE.MeshStandardMaterial({ color: 0x0b1020, emissive: 0x1a2a4a, emissiveIntensity: 0.8, side: DS })); pantalla.position.set(cx, ph / 2 + 1, zPantalla); grupo.add(pantalla);
    caja3(pw, 1, 14, MAT.cantera, cx, 0.5, zEsc, grupo);
    for (let r = 0; r < te.filas; r++) for (let b = 0; b < te.por_fila; b++) add("butaca", cx - ((te.por_fila - 1) * te.ancho_m) / 2 + b * te.ancho_m, 0.1 + r * te.rake_m, z0 + r * te.paso_m, Math.PI);
    caja3(te.por_fila * te.ancho_m + 2, 0.3, te.filas * te.paso_m + 2, MAT.recinto, cx, 0.05, z0 + (te.filas * te.paso_m) / 2, grupo).castShadow = false;
  });
  // geometrías (una por pieza) y mallas instanciadas
  const geoCaja = (w, h, d, dx = 0, dy = 0, dz = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(dx, dy, dz); return g; };
  const union = (...gs) => { const g = BGU.mergeGeometries(gs.map(x => x.toNonIndexed()), false); return g; };
  const mesaC = CAT.mesa.medida, sillaC = CAT.silla.medida, cubC = CAT.cubiculo.medida, jun = TAM.equipo.medida;
  const GEO = {
    mesa: union(geoCaja(mesaC[0], 0.05, mesaC[2], 0, mesaC[1] - 0.025), geoCaja(0.06, mesaC[1] - 0.05, mesaC[2] - 0.2, -mesaC[0] / 2 + 0.1, (mesaC[1] - 0.05) / 2), geoCaja(0.06, mesaC[1] - 0.05, mesaC[2] - 0.2, mesaC[0] / 2 - 0.1, (mesaC[1] - 0.05) / 2)),
    silla: union(geoCaja(sillaC[0], 0.08, sillaC[2], 0, 0.46), geoCaja(sillaC[0], 0.5, 0.06, 0, 0.72, -sillaC[2] / 2 + 0.03), geoCaja(0.06, 0.42, 0.06, 0, 0.21)),
    cubiculo: geoCaja(cubC[0], cubC[1], cubC[2], 0, cubC[1] / 2),
    junta: union(geoCaja(jun[0], 0.06, jun[1], 0, 0.72), geoCaja(0.08, 0.69, jun[1] - 0.4, -jun[0] / 2 + 0.3, 0.345), geoCaja(0.08, 0.69, jun[1] - 0.4, jun[0] / 2 - 0.3, 0.345)),
    redonda: union(new THREE.CylinderGeometry(CAT.redonda.diametro / 2, CAT.redonda.diametro / 2, 0.06, 20).translate(0, 0.72, 0), new THREE.CylinderGeometry(0.25, 0.35, 0.69, 12).translate(0, 0.345, 0)),
    butaca: union(geoCaja(CAT.butaca.medida[0] - 0.08, 0.1, 0.55, 0, 0.45), geoCaja(CAT.butaca.medida[0] - 0.08, 0.6, 0.1, 0, 0.75, 0.25), geoCaja(CAT.butaca.medida[0] - 0.08, 0.4, 0.5, 0, 0.2)),
  };
  const MATM = { mesa: mat(hex(CAT.mesa.color), { roughness: 0.6 }), silla: mat(hex(CAT.silla.color), { roughness: 0.8 }), cubiculo: new THREE.MeshStandardMaterial({ color: hex(CAT.cubiculo.color), transparent: true, opacity: 0.45, roughness: 0.2, side: DS }), junta: mat(hex(CAT.junta.color), { roughness: 0.5 }), redonda: mat(hex(CAT.redonda.color), { roughness: 0.7 }), butaca: mat(hex(CAT.butaca.color), { roughness: 0.75 }) };
  const q = new THREE.Quaternion(), e3 = new THREE.Euler(), m4m = new THREE.Matrix4();
  Object.entries(listas).forEach(([id, lista]) => { if (!lista.length) return; if (movil && id === "silla") lista = lista.filter((_, i) => i % 3 === 0);
    const inst = new THREE.InstancedMesh(GEO[id], MATM[id], lista.length);
    lista.forEach(([x, y, z, ry, sx, sz], i) => { e3.set(0, ry, 0); q.setFromEuler(e3); m4m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(sx, 1, sz)); inst.setMatrixAt(i, m4m); });
    inst.castShadow = false; inst.receiveShadow = true; mobiliario.add(inst); conteoMob[id] = lista.length; });
}

/* ---------- Árboles instanciados ---------- */
// RLR · cada especie: tronco + copa en dos mallas instanciadas; el color de la copa es por instancia (estaciones)
function especie(nombre, tronco, copa, cTronco, cCopa, max) {
  const t = new THREE.InstancedMesh(tronco, mat(cTronco), max), c = new THREE.InstancedMesh(copa, mat(cCopa), max);
  t.count = c.count = 0; c.castShadow = !movil; t.castShadow = false; c.receiveShadow = true;
  return { nombre, t, c, cCopa: new THREE.Color(cCopa), n: 0, max };
}
const geoCopaRedonda = new THREE.IcosahedronGeometry(1, 1), geoCono = new THREE.ConeGeometry(1, 1, 7), geoTronco = new THREE.CylinderGeometry(0.7, 1, 1, 6);
const ESP = Object.fromEntries(Object.entries(P.vegetacion.especies_3d).map(([id, e]) => [id, especie(e.nombre, geoTronco, e.copa === "cono" ? geoCono : geoCopaRedonda, hex(e.tronco), hex(e.copa_color), e.max)]));
const m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(), v3 = new THREE.Vector3(), colTmp = new THREE.Color();
// forma de cada especie: [radio tronco, alto tronco, ancho copa, alto copa]
const FORMA = Object.fromEntries(Object.entries(P.vegetacion.especies_3d).map(([id, e]) => [id, e.forma]));
const MEZCLA = (() => { let acum = 0; return Object.entries(P.vegetacion.mezcla_bosque).map(([id, f]) => [id, (acum += f)]); })();
function planta(e, x, y, z, esc = 1, grupo = bosque) {
  const s = ESP[e]; if (s.n >= s.max) return;
  const [rt, ht, wc, hc] = FORMA[e], k = esc;
  m4.compose(v3.set(x, y + (ht * k) / 2, z), q0, new THREE.Vector3(rt * k, ht * k, rt * k)); s.t.setMatrixAt(s.n, m4);
  const ry = azar() * Math.PI;
  m4.compose(v3.set(x, y + ht * k + (hc * k) * (e === "pino" || e === "cedro" ? 0.5 : 0.38), z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3((wc * k) / 2, (hc * k) / (e === "pino" || e === "cedro" ? 1 : 2), (wc * k) / 2)); s.c.setMatrixAt(s.n, m4);
  const tono = entre(0.78, 1.12); s.c.setColorAt(s.n, colTmp.copy(s.cCopa).multiplyScalar(tono));
  s.n++;
}
// exclusiones del bosque (dentro, enElipse y tapado viven en la cabecera)
function libre(x, z) {
  if (Math.abs(x) < L / 2 + MARGEN && Math.abs(z) < L / 2 + MARGEN) return false;              // edificio
  if (plazas.some(([px, pz]) => dentro(x, z, px, pz, PLAZA + 8, PLAZA + 8))) return false;
  if (tapado(x, z, "sitio")) return false;
  const RA = P.estacionamiento.esquinas.rampas, SE = P.terreno.senderos_esquina;
  for (const [i, j] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { if (dentro(x, z, i * (C + RA.desde_centro_celda_m), j * (C + RA.desde_centro_celda_m), RA.medida_xz[0] + 10, RA.medida_xz[1] + 10)) return false; const t = ((x * i) + (z * j)) / 2; if (t > L / 2 && t < C - 40 && Math.abs(x * i - z * j) < SE.ancho_m + 2) return false; }
  return true;
}
// RLR · veredas: la misma malla de 111 m de los patios de luz, sobre las ocho celdas del bosque, interrumpida donde hay una pieza; postes de bronce en los cruces y frutales a la orilla
const VRD = P.terreno.veredas, lineasV = [];
{
  const paso = VRD.malla_m, nL = VRD.extension_lineas, lim = nL * paso + paso / 2, w = VRD.ancho_m;
  for (let k = -nL; k <= nL; k++) lineasV.push(k * paso);
  const bloqueado = (x, z) => (Math.abs(x) < L / 2 + 10 && Math.abs(z) < L / 2 + 10) || Math.abs(x) > T / 2 - 4 || Math.abs(z) > T / 2 - 4 || plazas.some(([px, pz]) => dentro(x, z, px, pz, PLAZA + 2, PLAZA + 2)) || tapado(x, z, "sitio");
  const tramo = (a, b, fijo, enX) => { // un tramo de vereda de a a b sobre la línea fija
    const len = b - a, mid = (a + b) / 2; if (len < 22) return;
    const o = enX ? caja3(len, 0.15, w, MAT.tepetate, mid, 0.08, fijo, sitio) : caja3(w, 0.15, len, MAT.tepetate, fijo, 0.08, mid, sitio); o.castShadow = false;
    for (let u = a + 5.55, lado = 1; u < b - 5; u += VRD.frutales_cada_m, lado = -lado) { const [x, z] = enX ? [u, fijo + lado * 3.5] : [fijo + lado * 3.5, u]; planta("frutal", x, 0, z, entre(0.8, 1.15)); }
  };
  lineasV.forEach(fijo => {
    [true, false].forEach(enX => { let ini = null;
      for (let u = -lim; u <= lim + 0.1; u += 5.55) { const [x, z] = enX ? [u, fijo] : [fijo, u]; const libreAqui = u <= lim && !bloqueado(x, z);
        if (libreAqui && ini === null) ini = u; if (!libreAqui && ini !== null) { tramo(ini, u - 5.55, fijo, enX); ini = null; } }
    });
  });
  if (VRD.postes_en_cruces) lineasV.forEach(x => lineasV.forEach(z => { if (bloqueado(x, z)) return; const po = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.4, 8), MAT.bronce); po.position.set(x, 0.7, z); sitio.add(po); }));
}
const cercaVereda = (x, z) => lineasV.some(l => Math.abs(x - l) < 2.8 || Math.abs(z - l) < 2.8);
// RLR · macetas de barro con palma camedor: bordes de las plazas y Rampa Norte
{ const JM = P.vegetacion.jardineras.macetas;
  plazas.forEach(([px, pz]) => { for (let u = -PLAZA / 2 + 3; u <= PLAZA / 2 - 3; u += JM.cada_m) [[px + u, pz - PLAZA / 2 + 3], [px + u, pz + PLAZA / 2 - 3], [px - PLAZA / 2 + 3, pz + u], [px + PLAZA / 2 - 3, pz + u]].forEach(([x, z]) => { if (Math.abs(x) < L / 2 + 2 && Math.abs(z) < L / 2 + 2) return; planta("maceta", x, 0.5, z, 1); }); });
  const RN = P.emplazamientos.find(e => e.id === "rampa_norte"); if (RN) for (let z = RN.pos_xz[1] - RN.medida_xz[1] / 2 + 4; z < RN.pos_xz[1] + RN.medida_xz[1] / 2 - 2; z += JM.cada_m) [-10, 10].forEach(dx => planta("maceta", RN.pos_xz[0] + dx, 0.3, z, 1));
}
// bosque: malla de 8.2 m con desorden
for (let x = -T / 2 + 5; x < T / 2 - 5; x += 8.2) for (let z = -T / 2 + 5; z < T / 2 - 5; z += 8.2) {
  const px = x + entre(-3.2, 3.2), pz = z + entre(-3.2, 3.2);
  if (!libre(px, pz) || cercaVereda(px, pz)) continue;
  const r = azar(), e = (MEZCLA.find(([, hasta]) => r < hasta) || MEZCLA[MEZCLA.length - 1])[0];
  planta(e, px, 0, pz, entre(0.75, 1.3));
}
// jacarandas en las plazas (bordes)
plazas.forEach(([px, pz]) => { for (let k = 0; k < 40; k++) { const lado = Math.floor(azar() * 4), u = entre(-PLAZA / 2, PLAZA / 2), b = PLAZA / 2 + entre(4, 14); const [x, z] = lado === 0 ? [px + u, pz - b] : lado === 1 ? [px + u, pz + b] : lado === 2 ? [px - b, pz + u] : [px + b, pz + u]; if (Math.abs(x) < L / 2 + 6 && Math.abs(z) < L / 2 + 6) continue; planta("jacaranda", x, 0, z, entre(0.9, 1.2)); } });
// parque interior: ahuehuetes en la orilla del agua, colorines en las calzadas, encinos y madroños
{ const ext = CASA / 2 + AGUA + 4; for (let k = 0; k < 13; k++) { const u = -ext + k * (2 * ext / 12); if (Math.abs(u) < 9) continue; [[u, -ext], [u, ext], [ext, u], [-ext, u]].forEach(([x, z]) => planta("ahuehuete", x, 0, z, entre(0.85, 1.1), parque)); } }
[[0, -1], [0, 1], [1, 0], [-1, 0]].forEach(([i, j]) => { const largo = (LI - CASA) / 2; for (let k = 0; k < 7; k++) { const u = CASA / 2 + AGUA + 6 + k * ((largo - AGUA - 10) / 6); [[-1], [1]].forEach(([s]) => planta("colorin", i ? i * u : s * 9, 0, j ? j * u : s * 9, 1, parque)); } });
const BQ = P.patio.bosquecillos;
for (let k = 0; k < BQ.intentos; k++) {
  const x = entre(-LI / 2 + 6, LI / 2 - 6), z = entre(-LI / 2 + 6, LI / 2 - 6);
  if (Math.abs(x) < CASA / 2 + AGUA + 10 && Math.abs(z) < CASA / 2 + AGUA + 10) continue;   // la isla y el agua
  if (Math.abs(x) < 9 || Math.abs(z) < 9) continue;                                          // calzadas
  if (tapado(x, z, "patio")) continue;                                                        // teatro 333, foyer, bodega, milpa
  if (azar() < BQ.claros) continue;                                                           // claros
  planta(azar() < BQ.especies.encino ? "encino" : "madrono", x, 0, z, entre(0.7, 1.1), parque);
}
arbolesCielo.forEach(p => planta("cielo", p.x, p.y, p.z, entre(0.8, 1.1), edificio));
// magnolia del Presidente
planta("cielo", 0, 0.4, 0, 0.9, parque);
Object.values(ESP).forEach(s => { s.t.count = s.c.count = s.n; s.t.instanceMatrix.needsUpdate = s.c.instanceMatrix.needsUpdate = true; if (s.c.instanceColor) s.c.instanceColor.needsUpdate = true; (s === ESP.cielo ? edificio : s === ESP.ahuehuete || s === ESP.colorin ? parque : s === ESP.maceta ? sitio : bosque).add(s.t, s.c); });
const totalArboles = Object.values(ESP).reduce((a, s) => a + s.n, 0);

/* ---------- La ciudad alrededor (contexto) ---------- */
{
  const max = 9000, inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), MAT.ciudad, max); let n = 0;
  const CI = P.presentacion.ciudad;
  for (let x = -CI.radio_m; x <= CI.radio_m; x += CI.malla_m) for (let z = -CI.radio_m; z <= CI.radio_m; z += CI.malla_m) {
    if (Math.abs(x) < T / 2 + 70 && Math.abs(z) < T / 2 + 70) continue;
    if (azar() < CI.vacios) continue;
    const h = entre(CI.alto_m[0], CI.alto_m[1]) * (azar() < 0.06 ? 2.5 : 1), w = entre(26, 46), d = entre(26, 46);
    m4.compose(new THREE.Vector3(x + entre(-6, 6), h / 2 - 0.5, z + entre(-6, 6)), q0, new THREE.Vector3(w, h, d)); inst.setMatrixAt(n, m4);
    inst.setColorAt(n, colTmp.setHSL(0.08, 0.08, entre(0.35, 0.6))); n++; if (n >= max) break;
  }
  inst.count = n; inst.receiveShadow = true; ciudad.add(inst);
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), mat(0x3f4046)); piso.rotation.x = -Math.PI / 2; piso.position.y = -1; piso.receiveShadow = true; ciudad.add(piso);
}

/* ---------- Sótanos y estacionamientos (solo en el corte) ---------- */
const infoSotanos = [];
{ let y = 0; const BV = P.sotanos.boveda; P.sotanos.niveles.forEach(l => { const h = l.alto_m; y -= h;
  const m = l.boveda ? new THREE.MeshStandardMaterial({ color: hex(l.color), emissive: 0x2a6aff, emissiveIntensity: 0.9, side: DS }) : mat(hex(l.color));
  caja3(L - 0.6, h - 0.4, L - 0.6, m, 0, y + h / 2, 0, corteG, { t: l.boveda ? `La Bóveda · ${l.id.replace("-", "–")}` : "Sótano " + l.id, c: l.uso, d: l.boveda ? [["Sala", `${h} m de alto, ${D.sotanos_m2.toLocaleString("es-MX")} m², ${BV.cuadrantes} cuadrantes independientes`], ["Cómputo", `${BV.mw_inicial} MW al abrir, hasta ${BV.mw_max} MW`], ["Gemelas", BV.gemelas.join(" y ") + ", copia en vivo"], ["Calor", "calienta " + BV.calor_reusado]] : [["Altura", h + " m"]] });
  infoSotanos.push({ y: y + h / 2, n: l.id, boveda: !!l.boveda }); });
  // estacionamiento bajo las esquinas
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([i, j]) => { for (let k = 0; k < P.estacionamiento.esquinas.niveles; k++) caja3(C - 4, P.estacionamiento.libre_m - 0.3, C - 4, mat(0x6b6b70), i * C, -1.8 - k * P.estacionamiento.libre_m, j * C, corteG); });
}

/* ---------- Etiquetas (sprites) ---------- */
function etiqueta(texto, x, y, z, ancho = 60, grupo = etiquetas, color = "#e6e8ec") {
  const c = document.createElement("canvas"), g = c.getContext("2d"); g.font = "600 40px Inter, system-ui, sans-serif";
  const tw = Math.ceil(g.measureText(texto).width) + 60; c.width = tw; c.height = 96; g.font = "600 40px Inter, system-ui, sans-serif";
  g.fillStyle = "rgba(11,12,16,.72)"; g.beginPath(); g.roundRect(4, 10, tw - 8, 76, 20); g.fill();
  g.fillStyle = color; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(texto, tw / 2, 48);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const alto = ancho * (96 / tw);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, fog: false })); s.scale.set(ancho, alto, 1); s.position.set(x, y, z); grupo.add(s); return s;
}
Object.entries(SECT).forEach(([l, s]) => { const d = L / 2 + 30, p = { norte: [0, -d], sur: [0, d], oriente: [d, 0], poniente: [-d, 0] }[l]; etiqueta(`${NOMBRE_LADO[l]} · ${s.nombre}`, p[0], H_TOP + 26, p[1], 110); });
etiqueta("Casa de Decisiones", 0, 42, 0, 90);
P.emplazamientos.filter(e => e.etiqueta).forEach(e => etiqueta(e.etiqueta.texto, e.pos_xz[0], e.etiqueta.y, e.pos_xz[1], e.etiqueta.ancho));
[[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([i, j]) => etiqueta("Bosque · estacionamiento debajo", i * C, 30, j * C, 150));
[[0, -(L - F) / 2], [0, (L - F) / 2], [(L - F) / 2, 0], [-(L - F) / 2, 0]].forEach(([x, z]) => etiqueta("Parque de cielo", x, Y_VANO1 + 8, z, 70));
const etiquetasCorte = new THREE.Group(); corteG.add(etiquetasCorte);
infoSotanos.forEach(s => etiqueta(s.boveda ? "La Bóveda" : s.n, L / 2 + 40, s.y, 0, s.boveda ? 60 : 30, etiquetasCorte, s.boveda ? "#7fb3ff" : "#cfd3da"));
P.edificio.nucleos.lobbies.filter(k => k > 0 && k !== 17).forEach(k => etiqueta(`Lobby ${k} · lanzaderas`, -L / 2 - 60, yPiso(k) + 2, 0, 80, etiquetasCorte, "#ffd9a0"));
USO.forEach((u, i) => { const k0 = i ? USO[i - 1].hasta + 1 : 0, y = (yPiso(k0) + yPiso(u.hasta + 1)) / 2; etiqueta(u.n, L / 2 + 70, y, 0, 100, etiquetasCorte, "#" + u.c.toString(16).padStart(6, "0")); });

/* ---------- Marcador de los recorridos ---------- */
const marcador = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 12), MAT.marcador); marcador.visible = false; escena.add(marcador);
const luzMarcador = new THREE.PointLight(0xffb060, 0, 40); marcador.add(luzMarcador);

/* ---------- Ambientes ---------- */
const AMB = Object.fromEntries(Object.entries(P.presentacion.ambientes).map(([id, a]) => [id, { arriba: hex(a.arriba), horizonte: hex(a.horizonte), abajo: hex(a.abajo), niebla: hex(a.niebla), sol: a.sol, solI: a.sol_intensidad, solC: hex(a.sol_color), hemi: a.hemi, estrellas: a.estrellas, ventanas: a.ventanas, exp: a.exposicion }]));
let ambAct = AMB.dia, ambObj = AMB.dia, ambK = 1;
function ponerAmbiente(n) { ambAct = mezclaAmb(ambK); ambObj = AMB[n]; ambK = 0; }
function mezclaAmb(k) { const a = ambAct, b = ambObj, c = (x, y) => new THREE.Color(x).lerp(new THREE.Color(y), k).getHex(); return { arriba: c(a.arriba, b.arriba), horizonte: c(a.horizonte, b.horizonte), abajo: c(a.abajo, b.abajo), niebla: c(a.niebla, b.niebla), sol: a.sol.map((v, i) => lerp(v, b.sol[i], k)), solI: lerp(a.solI, b.solI, k), solC: c(a.solC, b.solC), hemi: lerp(a.hemi, b.hemi, k), estrellas: lerp(a.estrellas, b.estrellas, k), ventanas: lerp(a.ventanas, b.ventanas, k), exp: lerp(a.exp, b.exp, k) }; }
function aplicarAmbiente(a) {
  cieloU.arriba.value.set(a.arriba); cieloU.horizonte.value.set(a.horizonte); cieloU.abajo.value.set(a.abajo); escena.fog.color.set(a.niebla);
  sol.position.set(...a.sol); sol.intensity = a.solI; sol.color.set(a.solC); hemi.intensity = a.hemi; estrellas.material.opacity = a.estrellas;
  vidrios.forEach(m => { m.emissiveIntensity = a.ventanas; }); renderer.toneMappingExposure = a.exp;
}

/* ---------- Meses (vegetación) ---------- */
const COPA = Object.fromEntries(Object.entries(P.presentacion.meses).map(([id, m]) => [id, { jacaranda: hex(m.jacaranda), colorin: hex(m.colorin), pradera: hex(m.pradera) }]));
MAT.flor.color.set(hex(P.presentacion.meses.verde.flor));
function ponerMes(m) {
  const c = COPA[m];
  ["jacaranda", "colorin"].forEach(e => { const s = ESP[e]; s.cCopa.set(c[e]); for (let i = 0; i < s.n; i++) s.c.setColorAt(i, colTmp.copy(s.cCopa).multiplyScalar(entre(0.85, 1.1))); s.c.instanceColor.needsUpdate = true; });
  MAT.pradera.color.set(c.pradera); if (P.presentacion.meses[m].flor) MAT.flor.color.set(hex(P.presentacion.meses[m].flor));
}

/* ---------- Ver adentro (transparencia) ---------- */
let rayosX = false;
function transparencia(on) {
  rayosX = on; const lista = [...vidrios, ...lomasMat, ...matsCasa];
  lista.forEach(m => { m.transparent = on; m.opacity = on ? 0.22 : 1; m.depthWrite = !on; m.needsUpdate = true; });
}
/* ---------- Corte ---------- */
const corteChk = document.getElementById("corte"), corteZ = document.getElementById("corte-z");
const planoCorte = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
let corteOn = false;
function ponerCorte(on, z = 0, auto = false) {
  corteOn = on; if (tour) tour.auto = auto; corteChk.checked = on; corteZ.disabled = !on; if (on) corteZ.value = z;
  planoCorte.constant = -z; corteG.visible = on && !auto; etiquetas.visible = on ? false : document.querySelector('[data-c="etiquetas"]').checked;
  escena.traverse(o => { if (o.material && o !== cielo && o !== estrellas && o !== marcador && !o.isSprite) o.material.clippingPlanes = matsCasa.includes(o.material) ? (on ? [planoCorte, planoCasa] : [planoCasa]) : on ? [planoCorte] : null; });
  Object.values(MAT).forEach(m => { m.clippingPlanes = on ? [planoCorte] : null; });
  document.getElementById("leyenda").hidden = !on;
}
document.getElementById("leyenda").innerHTML = `<strong style="color:#e6e8ec">Corte</strong>${USO.map(u => `<span><i style="background:#${u.c.toString(16).padStart(6, "0")}"></i>${u.n}</span>`).join("")}<span><i style="background:#2a6aff"></i>La Bóveda</span><span><i style="background:#6b6b70"></i>Estacionamiento</span>`;

/* ---------- Recorridos ---------- */
// RLR · cada paso: m = a dónde va la persona (marcador), c = dónde está la cámara, mira = a dónde ve si no hay persona, t = segundos, txt = subtítulo
const RECORRIDOS = window.EDIFICIO.R.recorridos.map(r => ({ ...r, pasos: r.pasos.map(p => ({ ...p, c: resolverPunto(p.c, yPiso), m: resolverPunto(p.m, yPiso), mira: resolverPunto(p.mira, yPiso) })) }));
let tour = null; // { r, i, t0, de:{c,m,mira}, a:{...} }
const sub = document.getElementById("subtitulo"), listaRec = document.getElementById("recorridos");
RECORRIDOS.forEach(r => { const b = document.createElement("button"); b.type = "button"; b.dataset.r = r.id; b.innerHTML = `<span>${r.nombre}</span><small>${r.dur}</small>`; b.addEventListener("click", () => (tour && tour.r === r ? pararTour() : empezarTour(r))); listaRec.appendChild(b); });
function estadoCam() { return { c: camara.position.toArray(), mira: control.target.toArray(), m: marcador.visible ? marcador.position.toArray() : null }; }
function corteDePaso(p) {
  const z = p.corte; if (z != null) { if (!corteOn) ponerCorte(true, z, true); else planoCorte.constant = -z; } else if (corteOn && tour?.auto) ponerCorte(false);
  planoCasa.constant = p.casa != null ? p.casa : 1e6;
  const chk = document.querySelector('[data-c="rayosx"]'); if (p.xray && !rayosX) { transparencia(true); tour.xrayAuto = true; } else if (!p.xray && tour?.xrayAuto) { transparencia(false); tour.xrayAuto = false; }
  if (chk) chk.checked = rayosX;
}
function empezarTour(r) {
  pararTour(); control.autoRotate = false; control.enabled = false; document.getElementById("panel").classList.remove("abierto"); document.getElementById("pista").hidden = true;
  const p0 = r.pasos[0]; marcador.visible = !!p0.m; if (p0.m) marcador.position.set(...p0.m);
  camara.position.set(...p0.c); control.target.set(...(p0.m || p0.mira)); camara.lookAt(control.target); luzMarcador.intensity = p0.m ? 3 : 0;
  tour = { r, i: 1, t0: performance.now(), de: estadoCam(), auto: false }; corteDePaso(p0);
  listaRec.querySelectorAll("button").forEach(b => b.classList.toggle("activo", b.dataset.r === r.id));
  document.getElementById("ficha").hidden = true;
}
function pararTour() { if (tour?.auto) ponerCorte(false); if (tour?.xrayAuto) { transparencia(false); const chk = document.querySelector('[data-c="rayosx"]'); if (chk) chk.checked = false; } planoCasa.constant = 1e6; tour = null; sub.hidden = true; document.getElementById("pista").hidden = false; marcador.visible = false; luzMarcador.intensity = 0; control.enabled = true; control.autoRotate = true; listaRec.querySelectorAll("button").forEach(b => b.classList.remove("activo")); }
const suave = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
function animarTour(ahora) {
  const p = tour.r.pasos[tour.i]; if (!p) { pararTour(); return; }
  const k = Math.min(1, (ahora - tour.t0) / 1000 / p.t), s = suave(k);
  if (p.txt && sub.innerHTML !== p.txt) { sub.innerHTML = p.txt; sub.hidden = false; }
  const de = tour.de;
  camara.position.set(lerp(de.c[0], p.c[0], s), lerp(de.c[1], p.c[1], s), lerp(de.c[2], p.c[2], s));
  if (p.m) { if (!marcador.visible) { marcador.visible = true; luzMarcador.intensity = 3; } const dm = de.m || p.m; marcador.position.set(lerp(dm[0], p.m[0], s), lerp(dm[1], p.m[1], s), lerp(dm[2], p.m[2], s)); control.target.copy(marcador.position); }
  else { const dm = de.mira; control.target.set(lerp(dm[0], p.mira[0], s), lerp(dm[1], p.mira[1], s), lerp(dm[2], p.mira[2], s)); if (marcador.visible && !p.m) { marcador.visible = false; luzMarcador.intensity = 0; } }
  camara.lookAt(control.target);
  if (k >= 1) { tour.i++; tour.t0 = ahora; tour.de = estadoCam(); if (!tour.de.m && p.m) tour.de.m = p.m; const sig = tour.r.pasos[tour.i]; if (sig) corteDePaso(sig); }
}
renderer.domElement.addEventListener("pointerdown", () => { if (tour) pararTour(); });

/* ---------- Clic: ficha ---------- */
const ray = new THREE.Raycaster(), punt = new THREE.Vector2(); let bajada = null;
renderer.domElement.addEventListener("pointerdown", e => { bajada = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener("pointerup", e => {
  if (!bajada || Math.hypot(e.clientX - bajada[0], e.clientY - bajada[1]) > 6) return;
  const r = renderer.domElement.getBoundingClientRect(); punt.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(punt, camara);
  const lista = pickables.filter(o => { let p = o; while (p) { if (!p.visible) return false; p = p.parent; } return true; });
  const hit = ray.intersectObjects(lista, false).find(h => !corteOn || planoCorte.distanceToPoint(h.point) >= 0);
  if (!hit) { document.getElementById("ficha").hidden = true; return; }
  const i = hit.object.userData.info;
  document.getElementById("ficha-t").textContent = i.t;
  document.getElementById("ficha-c").innerHTML = `<p>${i.c}</p>` + (i.d?.length ? `<table>${i.d.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table>` : "");
  document.getElementById("ficha").hidden = false;
});
document.getElementById("ficha-cerrar").addEventListener("click", () => { document.getElementById("ficha").hidden = true; });

/* ---------- Controles del panel ---------- */
const $$ = s => [...document.querySelectorAll(s)];
$$("#amb button").forEach(b => b.addEventListener("click", () => { $$("#amb button").forEach(x => x.setAttribute("aria-pressed", x === b)); ponerAmbiente(b.dataset.a); history.replaceState(null, "", location.pathname + "?amb=" + b.dataset.a + location.hash); }));
$$("#mes button").forEach(b => b.addEventListener("click", () => { $$("#mes button").forEach(x => x.setAttribute("aria-pressed", x === b)); ponerMes(b.dataset.m); }));
$$("#capas input").forEach(i => i.addEventListener("change", () => { if (i.dataset.c === "rayosx") return transparencia(i.checked); ({ bosque, ciudad, etiquetas, mobiliario })[i.dataset.c].visible = i.checked; if (i.dataset.c === "etiquetas" && corteOn) etiquetas.visible = false; }));
corteChk.addEventListener("change", () => { corteZ.disabled = !corteChk.checked; ponerCorte(corteChk.checked, Number(corteZ.value)); if (corteChk.checked && !tour) { control.autoRotate = false; camara.position.set(-420, 220, -700); control.target.set(0, 40, 0); } });
corteZ.addEventListener("input", () => { planoCorte.constant = -Number(corteZ.value); });
document.getElementById("pantalla").addEventListener("click", () => { if (document.fullscreenElement) document.exitFullscreen(); else document.getElementById("v-3d").requestFullscreen?.(); });
document.getElementById("foto").addEventListener("click", () => {
  const w = renderer.domElement.width, h = renderer.domElement.height; renderer.setPixelRatio(DPR * 1.5); renderer.setSize(w / DPR, h / DPR, false); renderer.render(escena, camara);
  const url = renderer.domElement.toDataURL("image/png"); renderer.setPixelRatio(DPR); redimensionar();
  const amb = document.querySelector("#amb [aria-pressed=true]").textContent, f = new Date(), p = n => String(n).padStart(2, "0");
  const a = document.createElement("a"); a.href = url; a.download = `Edificio de Gobierno · 3D · ${amb} · ${f.getFullYear()}-${p(f.getMonth() + 1)}-${p(f.getDate())} ${p(f.getHours())}h${p(f.getMinutes())}.png`; a.click();
});
document.getElementById("plegar").addEventListener("click", e => { const p = document.getElementById("panel"); p.classList.toggle("abierto"); e.currentTarget.setAttribute("aria-expanded", p.classList.contains("abierto")); });
const ambURL = new URLSearchParams(location.search).get("amb"); if (AMB[ambURL]) { $$("#amb button").forEach(x => x.setAttribute("aria-pressed", x.dataset.a === ambURL)); ambAct = ambObj = AMB[ambURL]; }

/* ---------- Tamaño y bucle ---------- */
function redimensionar() { const w = caja.clientWidth, h = caja.clientHeight; renderer.setSize(w, h, false); camara.aspect = w / h; camara.updateProjectionMatrix(); }
new ResizeObserver(redimensionar).observe(caja); redimensionar();
let activo = true; export function visible(v) { activo = v; }
let reloj = performance.now();
function animar(ahora) {
  requestAnimationFrame(animar);
  if (!activo) return;
  const dt = Math.min(0.1, (ahora - reloj) / 1000); reloj = ahora;
  if (ambK < 1) { ambK = Math.min(1, ambK + dt / 1.6); aplicarAmbiente(mezclaAmb(ambK)); }
  if (tour) animarTour(ahora); else control.update();
  marcador.position.y += Math.sin(ahora / 300) * 0.004;
  renderer.render(escena, camara);
}
aplicarAmbiente(ambObj);
// RLR · modo ?og=1: sin interfaz, cámara fija para la imagen de la liga
if (new URLSearchParams(location.search).has("og")) { document.body.classList.add("og"); control.autoRotate = false; etiquetas.visible = false; camara.position.set(...P.presentacion.og.pos); control.target.set(...P.presentacion.og.mira); control.update(); }
requestAnimationFrame(animar);
document.getElementById("cargando").remove();
window.__edificio = { escena, camara, control, ponerAmbiente, ponerMes, ponerCorte, transparencia, empezarTour, RECORRIDOS, totalArboles, pickables, conteoMob };
console.log(`Edificio de Gobierno · ${totalArboles.toLocaleString("es-MX")} árboles · ${pickables.length} elementos con ficha · mobiliario`, conteoMob);
// RLR · fin — Ricardo López Reyero · EYE · 181218
