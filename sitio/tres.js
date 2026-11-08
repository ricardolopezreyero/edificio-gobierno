// RLR · Modelo 3D del Edificio de Gobierno — Ricardo López Reyero
// 1 unidad = 1 metro. x = oriente, z = sur (el norte es −z), y = altura. Todo sale de parametros.json.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218; // firma (RLR en ROT13 y en el alfabeto)
const P = window.EDIFICIO.P;
const M = P.modulo, L = P.edificio.lado, F = P.edificio.fondo_anillo, LI = P.edificio.patio;
const H0 = P.edificio.altura_pb, HP = P.edificio.altura_piso_tipo, NP = P.edificio.pisos;
const yPiso = k => (k <= 0 ? 0 : H0 + (k - 1) * HP);          // base del piso k; PB = 0
const H_TOP = yPiso(NP + 1);                                    // 159.5: techo
const T = P.terreno.lado, C = P.terreno.celda;                 // 999 · 333
const CASA = P.casa_de_decisiones.lado, SUITE = P.casa_de_decisiones.suite.lado;
const VANO = P.edificio.parques_de_cielo.ancho;                 // 99
const [PC0, , PC2] = P.edificio.parques_de_cielo.pisos;        // 16 · 18
const Y_VANO0 = yPiso(PC0), Y_VANO1 = yPiso(PC2 + 1);          // 78.5 · 92
const Y_BASA = yPiso(4);                                        // 24.5: arriba del basamento de piedra
const Y_REMATE = yPiso(32);                                     // 150.5: el remate del gabinete
const AGUA = P.parque_interior.espejo_agua.ancho;              // 16.5
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
camara.position.set(-820, 480, 900);
const control = new OrbitControls(camara, renderer.domElement);
control.enableDamping = true;
control.dampingFactor = 0.06;
control.maxPolarAngle = rad(88);
control.minDistance = 12;
control.maxDistance = 2600;
control.target.set(0, 50, 0);
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
    !centro && i && j ? { t: "Bosque sobre el estacionamiento", c: `Celda de 333 × 333 m. Debajo, dos niveles de estacionamiento (${(P.estacionamiento.esquinas.cajones / 4).toLocaleString("es-MX")} cajones) con patios de luz entre los árboles. Encima, bosque de encinos y pinos.`, d: [["Niveles", "2"], ["Superficie", "221,778 m²"], ["Cajones", "~7,400"], ["Al edificio", "333 m por sendero cubierto, 12 min al escritorio"]] } : null);
  s.castShadow = false;
}
// tierra bajo todo (se ve en el corte)
const tierra = caja3(T, 60, T, MAT.tierra, 0, -31, 0, corteG); tierra.castShadow = false;
// anillo vial
[[0, -T / 2 - 12, T + 48, 24], [0, T / 2 + 12, T + 48, 24], [T / 2 + 12, 0, 24, T], [-T / 2 - 12, 0, 24, T]].forEach(([x, z, w, d]) => caja3(w, 0.4, d, MAT.asfalto, x, 0.1, z, sitio).castShadow = false);
// plazas de las cuatro puertas (tezontle)
const PLAZA = 99, dP = L / 2 + PLAZA / 2;
const plazas = [[0, -dP, "Puerta Norte", "Plaza de llegada principal: estación de transporte, terminal de 33 rutas eléctricas, Casa del Ciudadano Norte y jacarandas moradas en marzo."], [0, dP, "Puerta Sur", "Plaza del Teatro 999, abierto a la ciudad."], [dP, 0, "Puerta Oriente", "Prensa y visitas oficiales. Sale el sol: la puerta de las noticias."], [-dP, 0, "Puerta Poniente", "Deportes al aire libre, logística y vivero."]];
plazas.forEach(([x, z, t, c]) => caja3(PLAZA, 0.5, PLAZA, MAT.tezontle, x, 0.2, z, sitio, { t, c, d: [["Medida", "99 × 99 m"], ["Piso", "tezontle rojo, el de los palacios de la ciudad"]] }).castShadow = false);
// senderos cubiertos de las esquinas (pérgolas en diagonal)
[[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([i, j]) => {
  const a = new THREE.Vector3(i * (L / 2 + 4), 0, j * (L / 2 + 4)), b = new THREE.Vector3(i * (C - 40), 0, j * (C - 40));
  const len = a.distanceTo(b), mid = a.clone().add(b).multiplyScalar(0.5);
  const infoSendero = { t: "Sendero cubierto con bandas", c: "Del estacionamiento de la esquina al edificio: 333 m bajo una pérgola de madera y bronce con enredaderas. Dos bandas móviles de 150 m (una por sentido) hacen el tramo en 2 minutos; a un lado, el paso libre y el carril de los carritos eléctricos.", d: [["Largo", "333 m"], ["Bandas", "2 × 150 m, 2 m de ancho, 0.75 m/s + tu paso"], ["Tiempo", "~2.5 min del patio de luz al zaguán"]] };
  const p = caja3(len, 0.6, 12, MAT.bronce, mid.x, 4.8, mid.z, sitio, infoSendero); p.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
  const piso = caja3(len, 0.3, 11, MAT.cantera, mid.x, 0.15, mid.z, sitio, infoSendero); piso.rotation.y = p.rotation.y; piso.castShadow = false;
  [-2.4, 2.4].forEach(off => { const bnd = caja3(150, 0.12, 2.0, MAT.recinto, mid.x, 0.36, mid.z, sitio, infoSendero); bnd.rotation.y = p.rotation.y; bnd.translateZ(off); bnd.castShadow = false; });
  // los 9 patios de luz del estacionamiento: tragaluces de 11 × 11 con escaleras y elevadores al bosque
  for (let u = -1; u <= 1; u++) for (let v = -1; v <= 1; v++) { const x = i * C + u * 111, z = j * C + v * 111; caja3(M, 1.1, M, matVidrio(M, 1.1, true), x, 0.55, z, sitio, { t: "Patio de luz del estacionamiento", c: "Nueve por esquina, en una malla de 111 m: cada uno es un tragaluz de 11 × 11 m que mete sol y aire a los dos niveles, con escaleras eléctricas y dos elevadores al bosque. Nadie estaciona a más de 80 m de uno.", d: [["Por esquina", "9"], ["Medida", "11.1 × 11.1 m"], ["Elevadores", "2 + 2 escaleras eléctricas por patio"]] }); caja3(M + 1.2, 0.4, M + 1.2, MAT.bronce, x, 1.2, z, sitio); }
  // rampa al estacionamiento
  caja3(40, 0.5, 70, MAT.asfalto, i * (C + 110), 0.2, j * (C + 110), sitio).castShadow = false;
});
// estación (norte)
{ const infoEst = { t: "La Gran Estación · Metro y Tren Suburbano", c: "Los andenes van bajo tierra; la gente sube por escaleras eléctricas a un vestíbulo de 240 × 60 m y 22 m de altura, con doble techo: una bóveda de vidrio adentro y, encima, una pérgola de paneles solares que da sombra y lluvia afuera. Cuatro cafeterías, una en cada esquina del vestíbulo: pides desde el tren, recoges al salir y caminas a tu lugar. De ahí, la Rampa Norte con bandas hasta la plaza.", d: [["Vestíbulo", "240 × 60 m, 22 m de alto"], ["Cafeterías", "4 × 120 asientos, pedido desde el teléfono"], ["Andenes", "Metro a −12 m, tren a −18 m"], ["Rutas eléctricas", "33, con terminal en el S1"], ["Del andén al escritorio", "10 minutos"]] };
  caja3(240, 4, 60, matPiedra(texBasaPB, 240, 4, 1), 0, 2, -430, sitio, infoEst);                 // basamento de tezontle
  caja3(240, 18, 60, matVidrio(240, 18, true), 0, 13, -430, sitio, infoEst);                      // bóveda de vidrio
  caja3(248, 1.2, 68, MAT.cantera, 0, 22.6, -430, sitio, infoEst);                                 // cornisa
  caja3(264, 0.9, 84, MAT.pv, 0, 27, -430, sitio, infoEst);                                        // doble techo: pérgola de paneles
  for (let k = 0; k < 12; k++) [-1, 1].forEach(sg => { const col = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 27, 10), MAT.cantera); col.position.set(-126 + k * 23, 13.5, -430 + sg * 40); col.castShadow = true; sitio.add(col); });
  [[-105, -455], [105, -455], [-105, -405], [105, -405]].forEach(([x, z]) => caja3(22, 5, 14, MAT.bronce, x, 2.5 + 4, z, sitio, { t: "Cafetería de la estación", c: "Una en cada esquina del vestíbulo, 120 asientos: café, desayuno y pan. Pides desde el tren y lo recoges al pasar.", d: [] }));
  // la Rampa Norte: 135 m de galería cubierta con dos pares de bandas hasta la plaza
  const infoRampa = { t: "La Rampa Norte", c: "De la estación a la plaza Norte: 135 m bajo una pérgola de bronce con dos pares de bandas móviles (dos por sentido) y paso libre al centro. Con la banda, el tramo se hace en poco más de un minuto.", d: [["Largo", "135 m"], ["Bandas", "4 × 135 m, 2 m de ancho"], ["Ancho total", "22 m"]] };
  caja3(22, 0.3, 135, MAT.cantera, 0, 0.15, -332, sitio, infoRampa).castShadow = false;
  caja3(24, 0.6, 137, MAT.bronce, 0, 6.5, -332, sitio, infoRampa);
  for (let k = 0; k <= 12; k++) [-11.5, 11.5].forEach(x => { const col = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 6.5, 8), MAT.bronce); col.position.set(x, 3.25, -400 + k * 11.25); sitio.add(col); });
  [-7.5, -4.5, 4.5, 7.5].forEach(x => caja3(2, 0.12, 133, MAT.recinto, x, 0.36, -332, sitio, infoRampa).castShadow = false);
}
// teatro 999: colina + pórtico (sur)
function loma(x, z, rx, ry, rz, m, info) { const o = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24), m); o.scale.set(rx, ry, rz); o.position.set(x, 0, z); o.castShadow = o.receiveShadow = true; if (info) { o.userData.info = info; pickables.push(o); } sitio.add(o); return o; }
loma(0, 400, 112, 15, 82, MAT.pradera, { t: "Teatro 999", c: "Semienterrado bajo una colina de bosque, abierto a la ciudad: conciertos, actos nacionales, ceremonias. 999 butacas en platea y balcón, ninguna a más de 30 m del escenario.", d: [["Sala", "2,200 m²"], ["Escenario", "24 × 14 m con foso para 60 músicos"], ["Pantalla", "LED de 24 × 10 m"], ["Butaca", "paso 1.10 m, 0.65 m de ancho, ventilación individual"], ["Estacionamiento", "2,000 cajones bajo la plaza"]] });
// restaurante en planta baja con terraza al bosque, foyer de doble altura encima, la sala dentro de la colina
const infoR999 = { t: "Restaurante del Teatro 999", c: "Debajo del foyer, abierto todo el día y no solo en funciones: 300 asientos, 5 m de alto, terraza de 110 m hacia la plaza y el bosque. La cocina se comparte con el foyer.", d: [["Asientos", "300"], ["Terraza", "110 × 16 m"]] };
const infoF999 = { t: "Foyer del Teatro 999", c: "Aquí se recibe a la gente antes de acomodarla: 90 × 22 m, 12 m de altura, cantera y vidrio mirando a la plaza. Guardarropa, taquilla, baños 1:15 y acceso sin escalones a la platea.", d: [["Superficie", "1,980 m²"], ["Altura", "12 m"]] };
caja3(90, 5, 22, matVidrio(90, 5, true), 0, 2.5, 318, sitio, infoR999); caja3(96, 0.8, 26, MAT.cantera, 0, 5.4, 318, sitio);
caja3(90, 12, 22, matVidrio(90, 12, true), 0, 11.8, 324, sitio, infoF999); caja3(96, 1.2, 26, MAT.recinto, 0, 18.4, 324, sitio);
caja3(110, 0.4, 16, MAT.tezontle, 0, 0.2, 299, sitio, infoR999).castShadow = false;
// RLR · cabina de producción del 999: sobre el foyer, con ventana a la sala
caja3(14, 4, 6, matVidrio(14, 4, true), 0, 21.4, 334, sitio, { t: "Cabina de producción · Teatro 999", c: "Al fondo de la platea, con ventana a la sala: dirección de video, audio, luces, transmisión y traducción. Ocho cámaras robóticas, mezcla en 4K, señal lista para televisión y redes en el momento.", d: [["Superficie", "60 m²"], ["Cámaras", "8 robóticas + 2 de mano"], ["Salida", "TV, streaming, pantallas del edificio"]] });
// RLR · el Salón de Eventos: vacío, sin columnas, 11 m libres; se monta y desmonta todos los días; conectado al foyer por la galería
const infoSalon = { t: "Salón de Eventos", c: "Un salón vacío de 66 × 44 m sin columnas y 11 m libres, pegado al Teatro 999 y conectado a su foyer por una galería de vidrio. Se monta y desmonta todos los días: expo de proveedores, desayuno de 1,200, baile de Año Nuevo, feria de los estados. Los proveedores exponen aquí y presentan en el teatro. Muros móviles lo parten en tres; cajas de piso cada 5.55 m con energía, red y agua; parrilla de rigging en todo el techo; cabina de ambiente en el mezanine.", d: [["Superficie", "2,904 m²"], ["Capacidad", "2,000 de pie · 1,200 en banquete · 100 stands de 3 × 3"], ["Altura libre", "11 m"], ["Cocina", "propia, unida por pasillo de servicio a la del teatro"], ["Bodega", "800 m² contigua, con andén"]] };
caja3(66, 8, 44, matPiedra(texTorre, 66, 8, 2), 103, 4, 314, sitio, infoSalon);
caja3(66, 3, 44, matVidrio(66, 3, true), 103, 9.5, 314, sitio, infoSalon);
caja3(68, 0.9, 46, MAT.bronce, 103, 11.45, 314, sitio, infoSalon);
caja3(8, 3, 5, matVidrio(8, 3, true), 103, 13.4, 295, sitio, { t: "Cabina de ambiente · Salón", c: "En el mezanine del salón: luces, sonido, pantallas y clima se mueven desde aquí para que el ambiente cambie con el evento, de un desayuno de trabajo a un baile, sin que nadie suba a una escalera.", d: [["Superficie", "30 m²"]] });
// la galería: 25 m de vidrio entre el foyer del teatro y el salón; también es antesala de la expo
caja3(26, 7, M, matVidrio(26, 7, true), 57.5, 3.5, 322, sitio, { t: "La galería", c: "25 m de vidrio y doble altura entre el foyer del Teatro 999 y el Salón de Eventos. Es el paso y es la antesala de la expo: registro, café, los primeros stands.", d: [["Medida", "25 × 11.1 m, 7 m de alto"]] });
caja3(27, 0.6, M + 1, MAT.cantera, 57.5, 7.3, 322, sitio);
// pasillo de servicio (cocina con cocina) detrás de la galería
caja3(26, 4, 6, MAT.recinto, 57.5, 2, 331, sitio, { t: "Pasillo de servicio", c: "Une la cocina del teatro con la cocina del salón: los dos recintos se sirven como uno solo.", d: [] });
// bodegas y cuarto de máquinas del Sur
caja3(40, 6, 24, MAT.recinto, 124, 3, 362, sitio, { t: "Bodegas y máquinas del Sur", c: "Cada recinto tiene su bodega para montar y desmontar sin cruzarse: la del Teatro 999 (1,200 m², detrás del escenario), la del Salón (800 m², contigua, con andén de carga) y los cuartos de máquinas de los dos: clima, eléctrico, UPS, bombas contra incendio. Navidad, Año Nuevo, desayunos, comidas y cenas se guardan aquí, listos.", d: [["Bodega 999", "1,200 m²"], ["Bodega Salón", "800 m²"], ["Andén", "4 camiones"], ["Máquinas", "clima, eléctrico, UPS, bombas"]] });
caja3(44, 0.6, 28, MAT.cantera, 124, 6.3, 362, sitio);
caja3(30, 0.4, 14, MAT.asfalto, 124, 0.2, 384, sitio).castShadow = false; // andén
// canchas (poniente)
[[-430, -110, 40, 20], [-380, -110, 40, 20], [-430, -75, 36, 18], [-390, -75, 36, 18], [-350, -75, 36, 18], [-430, -40, 36, 18], [-390, -40, 36, 18], [-350, -40, 36, 18]].forEach(([x, z, w, d]) => caja3(w, 0.3, d, MAT.cancha, x, 0.3, z, sitio).castShadow = false);
for (let k = 0; k < 8; k++) caja3(20, 0.3, 10, MAT.pista, -440 + (k % 4) * 24, 0.3, 10 + Math.floor(k / 4) * 14, sitio).castShadow = false;
for (let k = 0; k < 4; k++) caja3(28, 0.3, 15, MAT.asfalto, -440 + (k % 2) * 32, 0.3, 50 + Math.floor(k / 2) * 19, sitio).castShadow = false;
const canchas = caja3(200, 0.1, 190, MAT.bosqueSuelo, -400, 0.05, -20, sitio, { t: "Canchas al aire libre", c: "Puerta Poniente: 8 de pádel, 6 de tenis, 2 de fútbol rápido, 4 de básquet y una pista de 5 km por el bosque. El gimnasio número 12.", d: [] }); canchas.castShadow = false;
// oriente: helipuerto y lomas de energía
const heli = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 0.4, 32), MAT.recinto); heli.position.set(400, 0.3, -90); sitio.add(heli);
const hMark = new THREE.Mesh(new THREE.RingGeometry(9, 11, 32), MAT.blanco); hMark.rotation.x = -Math.PI / 2; hMark.position.set(400, 0.55, -90); sitio.add(hMark);
loma(430, 110, 60, 11, 45, MAT.pradera, { t: "Energía y enfriamiento", c: "Subestación de 400 kV con dos acometidas y la planta de enfriamiento de La Bóveda, escondidas en lomas con bosque encima. El calor que sobra calienta la alberca y las regaderas.", d: [["Paneles de azotea", "~5 MW, menos del 5 % del consumo"], ["Energía limpia contratada", "100 % del consumo"]] });
loma(420, 40, 40, 8, 30, MAT.pradera);

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
const SECT = P.edificio.sectores;
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
const USO = [
  { hasta: 3, c: 0xd9a441, n: "Público y servicios" }, { hasta: 13, c: 0x3a7bd5, n: "Operación · 1,500 por piso" }, { hasta: 23, c: 0x3fb27f, n: "Mandos medios · 1,000 por piso" },
  { hasta: 29, c: 0x9b6fd6, n: "Direcciones · 500 por piso" }, { hasta: 31, c: 0xe66767, n: "La Fábrica · ingeniería" }, { hasta: 33, c: 0xb08d57, n: "Gabinete y coordinadores" },
];
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
  for (let i = 0; i < 14; i++) { const p = new THREE.Vector3(entre(-44, 44), Y_VANO0 + 0.6, entre(-12, 12)); g.localToWorld(p); arbolesCielo.push(p); }
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
// loma del Teatro 333 y milpa
loma(60, 105, 38, 9, 27, MAT.pradera, { t: "Teatro 333", c: "Bajo una loma del parque, a 60 m de la Casa: anuncios grandes, tomas de protesta, ceremonias con 333 invitados. Salida directa a la Sala de Prensa por túnel.", d: [["Butacas", "333, ninguna a más de 18 m"], ["Escenario", "16 × 10 m"], ["Pantalla", "LED de 14 × 6 m"]] });
{ const infoR = { t: "Restaurante del Teatro 333", c: "Debajo del foyer, con terraza hacia el parque y el agua de la Casa: 120 asientos. Abierto todo el día.", d: [["Asientos", "120"]] }, infoF = { t: "Foyer del Teatro 333", c: "Para recibir a los 333 invitados antes de acomodarlos: 40 × 12 m, 8 m de altura, vidrio contra la loma.", d: [["Superficie", "480 m²"]] };
  caja3(40, 4.5, 12, matVidrio(40, 4.5, true), 60, 2.25, 72, parque, infoR); caja3(44, 0.6, 14, MAT.cantera, 60, 4.8, 72, parque);
  caja3(40, 8, 12, matVidrio(40, 8, true), 60, 9, 78, parque, infoF); caja3(44, 1, 14, MAT.recinto, 60, 13.5, 78, parque);
  caja3(50, 0.3, 10, MAT.tezontle, 60, 0.3, 61, parque, infoR).castShadow = false;
  caja3(8, 3, 5, matVidrio(8, 3, true), 60, 15.5, 82, parque, { t: "Cabina de producción · Teatro 333", c: "Al fondo de la sala, con ventana: video, audio, luces, transmisión y traducción. Seis cámaras robóticas; la señal sale directo a la Sala de Prensa por el túnel.", d: [["Superficie", "40 m²"]] });
  caja3(16, 4, 10, MAT.cantera, 110, 2, 112, parque, { t: "Bodega del Teatro 333", c: "400 m² bajo la loma, con acceso desde el túnel del S1: montajes, mobiliario de ceremonias, banderas, el equipo de las tomas de protesta.", d: [["Superficie", "400 m²"]] }); }
caja3(33, 0.6, 33, mat(0x7a8a3a), -80, 0.3, -90, parque, { t: "La milpa", c: "33 × 33 m de maíz, frijol y calabaza. La siembran los niños de las guarderías en mayo, la cosechan en octubre, y las tortillas se sirven en los Mercados.", d: [] }).castShadow = false;
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

/* ---------- Árboles instanciados ---------- */
// RLR · cada especie: tronco + copa en dos mallas instanciadas; el color de la copa es por instancia (estaciones)
function especie(nombre, tronco, copa, cTronco, cCopa, max) {
  const t = new THREE.InstancedMesh(tronco, mat(cTronco), max), c = new THREE.InstancedMesh(copa, mat(cCopa), max);
  t.count = c.count = 0; c.castShadow = !movil; t.castShadow = false; c.receiveShadow = true;
  return { nombre, t, c, cCopa: new THREE.Color(cCopa), n: 0, max };
}
const geoCopaRedonda = new THREE.IcosahedronGeometry(1, 1), geoCono = new THREE.ConeGeometry(1, 1, 7), geoTronco = new THREE.CylinderGeometry(0.7, 1, 1, 6);
const ESP = {
  encino: especie("Encino", geoTronco, geoCopaRedonda, 0x5a4634, 0x3e6b36, 6000),
  pino: especie("Pino", geoTronco, geoCono, 0x5a4634, 0x2b5236, 4500),
  cedro: especie("Cedro blanco", geoTronco, geoCono, 0x5a4634, 0x355f3a, 2500),
  fresno: especie("Fresno", geoTronco, geoCopaRedonda, 0x6a5444, 0x5d8c3c, 2500),
  madrono: especie("Madroño", geoTronco, geoCopaRedonda, 0x8b4a2e, 0x497a3a, 2000),
  ahuehuete: especie("Ahuehuete", geoTronco, geoCopaRedonda, 0x5a4634, 0x4f7f45, 80),
  jacaranda: especie("Jacaranda", geoTronco, geoCopaRedonda, 0x6a5444, 0x5a8a45, 400),
  colorin: especie("Colorín", geoTronco, geoCopaRedonda, 0x6a5444, 0x4d7a3f, 160),
  cielo: especie("Encino bajo", geoTronco, geoCopaRedonda, 0x5a4634, 0x4a7a3a, 80),
};
const m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(), v3 = new THREE.Vector3(), colTmp = new THREE.Color();
// forma de cada especie: [radio tronco, alto tronco, ancho copa, alto copa]
const FORMA = { encino: [0.4, 4, 9, 7], pino: [0.35, 5, 7, 11], cedro: [0.3, 3, 4.5, 13], fresno: [0.35, 5, 8.5, 9], madrono: [0.3, 3, 6, 5], ahuehuete: [1.2, 9, 15, 16], jacaranda: [0.35, 4, 9.5, 6], colorin: [0.3, 3, 6, 4.5], cielo: [0.3, 2.5, 5.5, 4.5] };
function planta(e, x, y, z, esc = 1, grupo = bosque) {
  const s = ESP[e]; if (s.n >= s.max) return;
  const [rt, ht, wc, hc] = FORMA[e], k = esc;
  m4.compose(v3.set(x, y + (ht * k) / 2, z), q0, new THREE.Vector3(rt * k, ht * k, rt * k)); s.t.setMatrixAt(s.n, m4);
  const ry = azar() * Math.PI;
  m4.compose(v3.set(x, y + ht * k + (hc * k) * (e === "pino" || e === "cedro" ? 0.5 : 0.38), z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3((wc * k) / 2, (hc * k) / (e === "pino" || e === "cedro" ? 1 : 2), (wc * k) / 2)); s.c.setMatrixAt(s.n, m4);
  const tono = entre(0.78, 1.12); s.c.setColorAt(s.n, colTmp.copy(s.cCopa).multiplyScalar(tono));
  s.n++;
}
// exclusiones del bosque
const dentro = (x, z, cx, cz, w, d) => Math.abs(x - cx) < w / 2 && Math.abs(z - cz) < d / 2;
const enElipse = (x, z, cx, cz, rx, rz) => ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2 < 1;
function libre(x, z) {
  if (Math.abs(x) < L / 2 + 6 && Math.abs(z) < L / 2 + 6) return false;              // edificio
  if (plazas.some(([px, pz]) => dentro(x, z, px, pz, PLAZA + 8, PLAZA + 8))) return false;
  if (dentro(x, z, 0, -430, 280, 100) || dentro(x, z, 0, -332, 34, 145)) return false; // estación y Rampa Norte
  if (enElipse(x, z, 0, 400, 118, 88) || dentro(x, z, 0, 305, 124, 60) || dentro(x, z, 100, 330, 110, 100) || dentro(x, z, 124, 384, 36, 20)) return false;  // teatro 999, foyer, restaurante, salón, bodegas
  if (dentro(x, z, -400, -20, 210, 200)) return false;                                // canchas
  if (enElipse(x, z, 400, -90, 22, 22) || enElipse(x, z, 430, 110, 66, 50) || enElipse(x, z, 420, 40, 44, 33)) return false;
  for (const [i, j] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { if (dentro(x, z, i * (C + 110), j * (C + 110), 50, 80)) return false; const t = ((x * i) + (z * j)) / 2; if (t > L / 2 && t < C - 40 && Math.abs(x * i - z * j) < 12) return false; }
  return true;
}
// bosque: malla de 8.2 m con desorden
for (let x = -T / 2 + 5; x < T / 2 - 5; x += 8.2) for (let z = -T / 2 + 5; z < T / 2 - 5; z += 8.2) {
  const px = x + entre(-3.2, 3.2), pz = z + entre(-3.2, 3.2);
  if (!libre(px, pz)) continue;
  const r = azar(), e = r < 0.36 ? "encino" : r < 0.64 ? "pino" : r < 0.78 ? "cedro" : r < 0.9 ? "fresno" : "madrono";
  planta(e, px, 0, pz, entre(0.75, 1.3));
}
// jacarandas en las plazas (bordes)
plazas.forEach(([px, pz]) => { for (let k = 0; k < 40; k++) { const lado = Math.floor(azar() * 4), u = entre(-PLAZA / 2, PLAZA / 2), b = PLAZA / 2 + entre(4, 14); const [x, z] = lado === 0 ? [px + u, pz - b] : lado === 1 ? [px + u, pz + b] : lado === 2 ? [px - b, pz + u] : [px + b, pz + u]; if (Math.abs(x) < L / 2 + 6 && Math.abs(z) < L / 2 + 6) continue; planta("jacaranda", x, 0, z, entre(0.9, 1.2)); } });
// parque interior: ahuehuetes en la orilla del agua, colorines en las calzadas, encinos y madroños
{ const ext = CASA / 2 + AGUA + 4; for (let k = 0; k < 13; k++) { const u = -ext + k * (2 * ext / 12); if (Math.abs(u) < 9) continue; [[u, -ext], [u, ext], [ext, u], [-ext, u]].forEach(([x, z]) => planta("ahuehuete", x, 0, z, entre(0.85, 1.1), parque)); } }
[[0, -1], [0, 1], [1, 0], [-1, 0]].forEach(([i, j]) => { const largo = (LI - CASA) / 2; for (let k = 0; k < 7; k++) { const u = CASA / 2 + AGUA + 6 + k * ((largo - AGUA - 10) / 6); [[-1], [1]].forEach(([s]) => planta("colorin", i ? i * u : s * 9, 0, j ? j * u : s * 9, 1, parque)); } });
for (let k = 0; k < 900; k++) {
  const x = entre(-LI / 2 + 6, LI / 2 - 6), z = entre(-LI / 2 + 6, LI / 2 - 6);
  if (Math.abs(x) < CASA / 2 + AGUA + 10 && Math.abs(z) < CASA / 2 + AGUA + 10) continue;   // la isla y el agua
  if (Math.abs(x) < 9 || Math.abs(z) < 9) continue;                                          // calzadas
  if (enElipse(x, z, 60, 105, 42, 31) || dentro(x, z, 60, 68, 58, 34) || dentro(x, z, 110, 112, 24, 18) || dentro(x, z, -80, -90, 40, 40)) continue;           // teatro y milpa
  if (azar() < 0.45) continue;                                                               // claros
  planta(azar() < 0.7 ? "encino" : "madrono", x, 0, z, entre(0.7, 1.1), parque);
}
arbolesCielo.forEach(p => planta("cielo", p.x, p.y, p.z, entre(0.8, 1.1), edificio));
// magnolia del Presidente
planta("cielo", 0, 0.4, 0, 0.9, parque);
Object.values(ESP).forEach(s => { s.t.count = s.c.count = s.n; s.t.instanceMatrix.needsUpdate = s.c.instanceMatrix.needsUpdate = true; if (s.c.instanceColor) s.c.instanceColor.needsUpdate = true; (s === ESP.cielo ? edificio : s === ESP.ahuehuete || s === ESP.colorin ? parque : bosque).add(s.t, s.c); });
const totalArboles = Object.values(ESP).reduce((a, s) => a + s.n, 0);

/* ---------- La ciudad alrededor (contexto) ---------- */
{
  const max = 9000, inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), MAT.ciudad, max); let n = 0;
  for (let x = -2700; x <= 2700; x += 64) for (let z = -2700; z <= 2700; z += 64) {
    if (Math.abs(x) < T / 2 + 70 && Math.abs(z) < T / 2 + 70) continue;
    if (azar() < 0.18) continue;
    const h = entre(5, 26) * (azar() < 0.06 ? 2.5 : 1), w = entre(26, 46), d = entre(26, 46);
    m4.compose(new THREE.Vector3(x + entre(-6, 6), h / 2 - 0.5, z + entre(-6, 6)), q0, new THREE.Vector3(w, h, d)); inst.setMatrixAt(n, m4);
    inst.setColorAt(n, colTmp.setHSL(0.08, 0.08, entre(0.35, 0.6))); n++; if (n >= max) break;
  }
  inst.count = n; inst.receiveShadow = true; ciudad.add(inst);
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), mat(0x3f4046)); piso.rotation.x = -Math.PI / 2; piso.position.y = -1; piso.receiveShadow = true; ciudad.add(piso);
}

/* ---------- Sótanos y estacionamientos (solo en el corte) ---------- */
const colSotano = { S1: 0x8a7a5a, S2: 0x6b6b70, S3: 0x6b6b70, S4: 0x7a6a4a, S5: 0x3a6a8a, S6: 0x3a6a8a, S7: 0xa05a3a, S8: 0x5a5a9a, S9: 0x4a7a6a, "S10-S11": 0x1e3a6a };
const infoSotanos = [];
{ let y = 0; P.sotanos.niveles.forEach(l => { const h = l.h; y -= h; const m = l.n === "S10-S11" ? new THREE.MeshStandardMaterial({ color: 0x1e3a6a, emissive: 0x2a6aff, emissiveIntensity: 0.9, side: DS }) : mat(colSotano[l.n]);
  const b = caja3(L - 0.6, h - 0.4, L - 0.6, m, 0, y + h / 2, 0, corteG, { t: `${l.n === "S10-S11" ? "La Bóveda · S10–S11" : "Sótano " + l.n}`, c: l.uso, d: l.n === "S10-S11" ? [["Sala", "9 m de alto, 110,889 m², 4 cuadrantes independientes"], ["Cómputo", "50 MW al abrir, hasta 250 MW"], ["Gemelas", "Querétaro y Mérida, copia en vivo"], ["Calor", "calienta la alberca y las regaderas"]] : [["Altura", h + " m"]] });
  infoSotanos.push({ y: y + h / 2, n: l.n }); });
  // estacionamiento bajo las esquinas
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([i, j]) => { for (let k = 0; k < 2; k++) caja3(C - 4, 3.0, C - 4, mat(0x6b6b70), i * C, -1.8 - k * 3.3, j * C, corteG); });
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
etiqueta("Teatro 999", 0, 32, 400, 70); etiqueta("Salón de Eventos", 103, 24, 314, 90); etiqueta("Teatro 333", 60, 22, 105, 60); etiqueta("Estación de Metro y Tren", 0, 36, -430, 110); etiqueta("Canchas", -400, 20, -20, 60); etiqueta("Energía", 430, 26, 110, 60);
[[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([i, j]) => etiqueta("Bosque · estacionamiento debajo", i * C, 30, j * C, 150));
[[0, -(L - F) / 2], [0, (L - F) / 2], [(L - F) / 2, 0], [-(L - F) / 2, 0]].forEach(([x, z]) => etiqueta("Parque de cielo", x, Y_VANO1 + 8, z, 70));
const etiquetasCorte = new THREE.Group(); corteG.add(etiquetasCorte);
infoSotanos.forEach(s => etiqueta(s.n === "S10-S11" ? "La Bóveda" : s.n, L / 2 + 40, s.y, 0, s.n === "S10-S11" ? 60 : 30, etiquetasCorte, s.n === "S10-S11" ? "#7fb3ff" : "#cfd3da"));
[11, 22, 33].forEach(k => etiqueta(`Lobby ${k} · lanzaderas`, -L / 2 - 60, yPiso(k) + 2, 0, 80, etiquetasCorte, "#ffd9a0"));
USO.forEach((u, i) => { const k0 = i ? USO[i - 1].hasta + 1 : 0, y = (yPiso(k0) + yPiso(u.hasta + 1)) / 2; etiqueta(u.n, L / 2 + 70, y, 0, 100, etiquetasCorte, "#" + u.c.toString(16).padStart(6, "0")); });

/* ---------- Marcador de los recorridos ---------- */
const marcador = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 12), MAT.marcador); marcador.visible = false; escena.add(marcador);
const luzMarcador = new THREE.PointLight(0xffb060, 0, 40); marcador.add(luzMarcador);

/* ---------- Ambientes ---------- */
const AMB = {
  dia: { arriba: 0x5f93d6, horizonte: 0xcfe0f2, abajo: 0x6f7a84, niebla: 0xc9dcef, sol: [900, 1300, -500], solI: 2.4, solC: 0xfff1dc, hemi: 1.0, estrellas: 0, ventanas: 0, exp: 1.0 },
  tarde: { arriba: 0x3a4a8a, horizonte: 0xf2a65a, abajo: 0x3a3238, niebla: 0xe0a070, sol: [-1800, 260, 500], solI: 1.6, solC: 0xffb070, hemi: 0.55, estrellas: 0.15, ventanas: 0.6, exp: 0.95 },
  noche: { arriba: 0x05070f, horizonte: 0x1a2235, abajo: 0x05060a, niebla: 0x0e1420, sol: [-400, 900, 800], solI: 0.25, solC: 0x8fa8d8, hemi: 0.18, estrellas: 1, ventanas: 1.6, exp: 1.1 },
};
let ambAct = AMB.dia, ambObj = AMB.dia, ambK = 1;
function ponerAmbiente(n) { ambAct = mezclaAmb(ambK); ambObj = AMB[n]; ambK = 0; }
function mezclaAmb(k) { const a = ambAct, b = ambObj, c = (x, y) => new THREE.Color(x).lerp(new THREE.Color(y), k).getHex(); return { arriba: c(a.arriba, b.arriba), horizonte: c(a.horizonte, b.horizonte), abajo: c(a.abajo, b.abajo), niebla: c(a.niebla, b.niebla), sol: a.sol.map((v, i) => lerp(v, b.sol[i], k)), solI: lerp(a.solI, b.solI, k), solC: c(a.solC, b.solC), hemi: lerp(a.hemi, b.hemi, k), estrellas: lerp(a.estrellas, b.estrellas, k), ventanas: lerp(a.ventanas, b.ventanas, k), exp: lerp(a.exp, b.exp, k) }; }
function aplicarAmbiente(a) {
  cieloU.arriba.value.set(a.arriba); cieloU.horizonte.value.set(a.horizonte); cieloU.abajo.value.set(a.abajo); escena.fog.color.set(a.niebla);
  sol.position.set(...a.sol); sol.intensity = a.solI; sol.color.set(a.solC); hemi.intensity = a.hemi; estrellas.material.opacity = a.estrellas;
  vidrios.forEach(m => { m.emissiveIntensity = a.ventanas; }); renderer.toneMappingExposure = a.exp;
}

/* ---------- Meses (vegetación) ---------- */
const COPA = { verde: { jacaranda: 0x5a8a45, colorin: 0x4d7a3f, pradera: 0x567a3a }, marzo: { jacaranda: 0x8a6fd1, colorin: 0xc43a2f, pradera: 0x5f7f3a }, noviembre: { jacaranda: 0x5a8a45, colorin: 0x4d7a3f, pradera: 0xc98a2a } };
function ponerMes(m) {
  const c = COPA[m];
  ["jacaranda", "colorin"].forEach(e => { const s = ESP[e]; s.cCopa.set(c[e]); for (let i = 0; i < s.n; i++) s.c.setColorAt(i, colTmp.copy(s.cCopa).multiplyScalar(entre(0.85, 1.1))); s.c.instanceColor.needsUpdate = true; });
  MAT.pradera.color.set(c.pradera);
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
const y25 = yPiso(25) + 1.2, y30 = yPiso(30) + 1.2, y33 = yPiso(33) + 1.2;
const RECORRIDOS = [
  // corte: el edificio se abre y queda solo lo que está al sur de esa z (hacia la cámara); casa: altura a la que se corta la Casa
  { id: "vuelo", nombre: "Vuelo", dur: "60 s", pasos: [
    { c: [-1500, 700, 1500], mira: [0, 60, 0], t: 0 }, { c: [0, 950, 1250], mira: [0, 40, 0], t: 9, txt: "<strong>Un cuadrado de 333 m.</strong> Un anillo de 33 m de fondo, 33 pisos, y un parque de 7 hectáreas al centro." },
    { c: [700, 260, -520], mira: [0, 90, -150], t: 9, txt: "<strong>Cuatro parques de cielo.</strong> Al centro de cada fachada faltan tres pisos: un jardín abierto al bosque y al parque." },
    { c: [240, 60, 240], mira: [0, 10, 0], t: 10, txt: "<strong>La Casa de Decisiones.</strong> El Presidente al centro, rodeado de agua, a cuatro calzadas de los cuatro lados del gobierno." },
    { c: [-60, 230, 260], mira: [0, 160, 0], t: 9, txt: "<strong>La azotea.</strong> Una pista de 1.2 km, paneles solares caminables, jardines de agave." },
    { c: [-600, 120, 700], mira: [0, 20, 400], t: 9, txt: "<strong>El bosque es de la ciudad.</strong> 78 hectáreas, 15,000 árboles nativos, el Teatro 999 bajo una colina. Debajo de las esquinas, el estacionamiento." },
    { c: [-820, 480, 900], mira: [0, 50, 0], t: 9, txt: "<strong>Estructura, liderazgo, ejecución.</strong> Por eso es un cuadrado." } ] },
  { id: "coche", nombre: "Del coche al escritorio", dur: "12 min reales · 50 s", pasos: [
    { m: [400, 1.6, -400], c: [480, 60, -300], t: 0 }, { m: [330, 1.6, -330], c: [430, 50, -250], t: 6, txt: "<strong>7:52.</strong> Estacionas en tu celda del bosque, la del lado donde trabajas. Sales a un sendero cubierto entre encinos." },
    { m: [178, 1.6, -178], c: [270, 48, -110], t: 9, txt: "<strong>7:57.</strong> 333 m de sendero, o un carrito eléctrico cada 2 minutos. Las aves ya cantan." },
    { m: [30, 1.6, -172], c: [10, 34, -262], t: 8, txt: "<strong>8:00.</strong> La plaza Norte, de tezontle. La puerta de vidrio te reconoce y se abre 3 m antes de que llegues." },
    { m: [20, 1.6, -150], c: [20, 26, -236], t: 5, corte: -160, txt: "<strong>8:01.</strong> Vestíbulo de 11 m de altura, muro verde, café de la casa. Elevador express de doble cabina." },
    { m: [20, y25, -150], c: [20, y25 + 28, -262], t: 7, corte: -160, txt: "<strong>8:03.</strong> Piso 25, lado Norte: sector Personas. Nadie esperó el elevador más de 40 segundos." },
    { m: [75, y25, -150], c: [40, y25 + 14, -246], t: 9, corte: -160, txt: "<strong>8:04.</strong> Tu escritorio, a 15 m de una ventana al bosque. Doce minutos del coche a la silla." } ] },
  { id: "casa", nombre: "Del escritorio a la Casa", dur: "5 min reales · 45 s", pasos: [
    { m: [75, y25, -150], c: [40, y25 + 14, -246], t: 0, corte: -160 }, { m: [20, y25, -150], c: [-30, y25 + 12, -250], t: 6, corte: -160, txt: "<strong>Te llaman del centro.</strong> 60 m al núcleo, elevador express a la planta baja." },
    { m: [20, 1.6, -150], c: [-40, 26, -250], t: 7, corte: -160, txt: "<strong>Planta baja.</strong> Cruzas el anillo hacia el parque." },
    { m: [0, 1.6, -120], c: [-70, 30, -95], t: 6, txt: "<strong>La calzada Norte.</strong> 84 m bajo una pérgola de bronce, colorines a los lados, el agua al frente." },
    { m: [0, 1.6, -60], c: [-64, 26, -34], t: 8, txt: "<strong>El puente sobre el agua.</strong> Ahuehuetes en la orilla. La Casa de Decisiones adelante." },
    { m: [0, 1.6, -30], c: [-50, 30, -10], t: 6, casa: 9.5, txt: "<strong>La esclusa.</strong> Dos puertas en serie, verificación de dos factores. Cinco minutos desde tu escritorio." },
    { m: [0, 1.6, 0], c: [30, 42, 30], t: 8, casa: 9.5, txt: "<strong>La suite.</strong> Tu equipo ya puso la presentación en la antesala. Cuando la puerta se abre, la pantalla ya tiene tu material." } ] },
  { id: "ciudadano", nombre: "El ciudadano", dur: "45 s", pasos: [
    { m: [0, 1.6, -300], c: [70, 50, -390], t: 0 }, { m: [0, 1.6, -230], c: [70, 36, -300], t: 7, txt: "<strong>Un agricultor de Michoacán</strong> baja del tren en la Puerta Norte. Tiene cita; no hay fila." },
    { m: [-30, 1.6, -155], c: [-70, 28, -250], t: 8, corte: -160, txt: "<strong>La Casa del Ciudadano.</strong> 99 mesas redondas de piedra, dos sillas iguales, sin mostrador." },
    { m: [-30, 1.6, -155], c: [-10, 16, -215], t: 7, corte: -160, txt: "<strong>Su caso entra al Tablero</strong> y llega al mismo tiempo a tres lados: el área responsable, Sistemas y Valor y Estudios." },
    { c: [-60, y30 + 16, -262], mira: [0, y30, -150], t: 8, corte: -160, txt: "<strong>Pisos 30–31, La Fábrica.</strong> Los ingenieros ven que la misma queja se repitió 33 veces esta semana. Lo que se repite se arregla en el sistema." },
    { c: [-60, y33 + 14, -262], mira: [0, y33, -150], t: 7, corte: -160, txt: "<strong>Piso 33.</strong> La Secretaria baja una escalera y está con quien construye su herramienta. Respuesta humana en 1 hora; solución o fecha en 11 días." },
    { m: [-30, 1.6, -155], c: [70, 70, -340], t: 8, corte: -160, txt: "<strong>El gobierno aprende</strong> de cada persona que viene a hablar." } ] },
  { id: "decision", nombre: "Una decisión", dur: "11 min reales · 40 s", pasos: [
    { c: [30, 42, 30], mira: [0, 3, 0], t: 0, casa: 9.5 }, { c: [44, 30, 8], mira: [8, 3, 0], t: 7, casa: 9.5, txt: "<strong>Sala Oriente, 24 personas.</strong> El Presidente decide. La decisión queda en el Tablero con dueño y fecha antes de que salga de la sala." },
    { c: [60, 36, -60], mira: [10, 4, -20], t: 7, casa: 9.5, txt: "<strong>Minuto 1.</strong> En la antesala, el siguiente equipo ya está listo. El carrusel no se detiene." },
    { c: [200, y33 + 16, -262], mira: [150, y33, -150], t: 8, corte: -160, txt: "<strong>Minuto 3.</strong> La esquina Nororiente, piso 33: la coordinadora de Personas y Orden ve la decisión en su pantalla." },
    { c: [40, yPiso(12) + 14, -246], mira: [75, yPiso(12), -150], t: 9, corte: -160, txt: "<strong>Minuto 11.</strong> Piso 12, lado Norte: la dueña de la tarea la tiene en su escritorio. El ingeniero de piso ya está a su lado." },
    { c: [-240, 300, 420], mira: [0, 60, 0], t: 9, txt: "<strong>Aquí se decide y se cumple.</strong>" } ] },
];
let tour = null; // { r, i, t0, de:{c,m,mira}, a:{...} }
const sub = document.getElementById("subtitulo"), listaRec = document.getElementById("recorridos");
RECORRIDOS.forEach(r => { const b = document.createElement("button"); b.type = "button"; b.dataset.r = r.id; b.innerHTML = `<span>${r.nombre}</span><small>${r.dur}</small>`; b.addEventListener("click", () => (tour && tour.r === r ? pararTour() : empezarTour(r))); listaRec.appendChild(b); });
function estadoCam() { return { c: camara.position.toArray(), mira: control.target.toArray(), m: marcador.visible ? marcador.position.toArray() : null }; }
function corteDePaso(p) {
  const z = p.corte; if (z != null) { if (!corteOn) ponerCorte(true, z, true); else planoCorte.constant = -z; } else if (corteOn && tour?.auto) ponerCorte(false);
  planoCasa.constant = p.casa != null ? p.casa : 1e6;
}
function empezarTour(r) {
  pararTour(); control.autoRotate = false; control.enabled = false; document.getElementById("panel").classList.remove("abierto"); document.getElementById("pista").hidden = true;
  const p0 = r.pasos[0]; marcador.visible = !!p0.m; if (p0.m) marcador.position.set(...p0.m);
  camara.position.set(...p0.c); control.target.set(...(p0.m || p0.mira)); camara.lookAt(control.target); luzMarcador.intensity = p0.m ? 3 : 0;
  tour = { r, i: 1, t0: performance.now(), de: estadoCam(), auto: false }; corteDePaso(p0);
  listaRec.querySelectorAll("button").forEach(b => b.classList.toggle("activo", b.dataset.r === r.id));
  document.getElementById("ficha").hidden = true;
}
function pararTour() { if (tour?.auto) ponerCorte(false); planoCasa.constant = 1e6; tour = null; sub.hidden = true; document.getElementById("pista").hidden = false; marcador.visible = false; luzMarcador.intensity = 0; control.enabled = true; control.autoRotate = true; listaRec.querySelectorAll("button").forEach(b => b.classList.remove("activo")); }
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
$$("#capas input").forEach(i => i.addEventListener("change", () => { ({ bosque, ciudad, etiquetas })[i.dataset.c].visible = i.checked; if (i.dataset.c === "etiquetas" && corteOn) etiquetas.visible = false; }));
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
if (new URLSearchParams(location.search).has("og")) { document.body.classList.add("og"); control.autoRotate = false; etiquetas.visible = false; camara.position.set(-640, 360, 700); control.target.set(0, 70, -20); control.update(); }
requestAnimationFrame(animar);
document.getElementById("cargando").remove();
window.__edificio = { escena, camara, control, ponerAmbiente, ponerMes, ponerCorte, empezarTour, RECORRIDOS, totalArboles, pickables };
console.log(`Edificio de Gobierno · ${totalArboles.toLocaleString("es-MX")} árboles · ${pickables.length} elementos con ficha`);
// RLR · fin — Ricardo López Reyero · EYE · 181218
