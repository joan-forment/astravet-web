import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

/*
 * AstraScene — el escenario celeste del hero.
 *
 * La estrella de 8 puntas arde en una nebulosa viva, rodeada de un campo
 * estelar de miles de magnitudes. La entrada la dirige una timeline GSAP
 * que muta el objeto `anim`; los componentes leen sus valores en useFrame,
 * sin re-renders.
 *
 * ── Rendimiento ────────────────────────────────────────────────────────────
 * Una escena 3D a pantalla completa es lo más caro de toda la web, así que
 * está sujeta a tres reglas:
 *
 *  1. NO se dibuja nada cuando el hero no está en pantalla, ni cuando la
 *     pestaña está en segundo plano. Antes seguía dibujando durante toda la
 *     página, tirando a la basura ~6.000 llamadas a la GPU por segundo.
 *  2. La calidad se decide una sola vez, según el tamaño de pantalla y los
 *     núcleos del dispositivo (ver CALIDAD). En móvil se rebaja resolución,
 *     número de estrellas y detalle de la nebulosa.
 *  3. El shader de la nebulosa es lo más caro por píxel: cada octava de ruido
 *     multiplica el coste de TODA la pantalla. Por eso hay las mínimas.
 *
 * Antes de tocar esta escena, mide con: node scripts/perf-3d.mjs
 */

/* ---------- Nivel de calidad, decidido una sola vez ---------- */
function medirCalidad() {
  if (typeof window === "undefined") {
    return { octavas: 3, estrellas: 1400, dpr: [1, 1.5], planeta: true };
  }
  const estrecha = window.innerWidth < 768;
  const nucleos = navigator.hardwareConcurrency ?? 4;
  const flojo = estrecha || nucleos <= 4;

  return flojo
    ? { octavas: 2, estrellas: 700, dpr: [1, 1.25], planeta: false }
    : { octavas: 3, estrellas: 1400, dpr: [1, 1.5], planeta: true };
}

const CALIDAD = medirCalidad();

/* ---------- Balanceo suave (sustituye a <Float> de drei) ----------
   Reimplementado aquí para no cargar toda la librería drei solo por esto:
   son 8 líneas y ahorra decenas de kilobytes de descarga. */
function Flotar({
  enabled = true,
  speed = 1,
  rotationIntensity = 1,
  floatIntensity = 1,
  children,
}) {
  const ref = useRef();
  const desfase = useMemo(() => Math.random() * 1000, []);

  useFrame((state) => {
    if (!enabled || !ref.current) return;
    const t = (desfase + state.clock.elapsedTime) * 0.25 * speed;
    ref.current.rotation.x = (Math.cos(t) * rotationIntensity) / 8;
    ref.current.rotation.y = (Math.sin(t) * rotationIntensity) / 8;
    ref.current.rotation.z = (Math.sin(t) * rotationIntensity) / 20;
    ref.current.position.y = (Math.sin(t) * floatIntensity) / 10;
  });

  return <group ref={ref}>{children}</group>;
}

/* ---------- Sprite circular de brillo (compartido) ---------- */
let glowTexture = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

/* ---------- Ruido GLSL compartido por los shaders ---------- */
const GLSL_NOISE = /* glsl */ `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  // El número de octavas lo fija OCTAVAS desde JavaScript: cada octava
  // multiplica el coste de la nebulosa en TODA la pantalla.
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < OCTAVAS; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.55;
    }
    return v;
  }
`;

/* ---------- Nebulosa de fondo (plano con FBM y warp de dominio) ---------- */
function Nebula({ anim, reduced, octavas = CALIDAD.octavas }) {
  const matRef = useRef();
  const groupRef = useRef();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          #define OCTAVAS ${octavas}
          uniform float uTime;
          uniform float uIntensity;
          varying vec2 vUv;
          ${GLSL_NOISE}
          void main() {
            vec2 p = vUv * 3.0;
            float t = uTime * 0.018;
            // Warp de dominio: remolinos de gas
            vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
            float n = fbm(p + 2.2 * q);

            vec3 purple = vec3(0.24, 0.10, 0.46);
            vec3 teal   = vec3(0.07, 0.62, 0.64);
            vec3 gold   = vec3(1.00, 0.66, 0.26);

            // Las capas turquesa y dorada se derivan de los campos que ya
            // tenemos calculados en vez de pedir dos fbm más. Mismo aspecto
            // de gas, a un 40 % del coste por píxel.
            float capaTeal = smoothstep(0.60, 0.99, mix(n, q.y, 0.45));
            float capaGold = smoothstep(0.58, 0.96, mix(n, q.x, 0.30) * 1.04);

            vec3 col = vec3(0.015, 0.04, 0.11);
            col = mix(col, purple, smoothstep(0.34, 0.82, n) * 0.55);
            col = mix(col, teal, capaTeal * 0.45);
            col += gold * pow(capaGold, 3.0) * 0.5;
            col += teal * pow(q.x, 3.0) * 0.18;

            // La riqueza vive a la derecha; la zona del titular queda oscura
            float focus = smoothstep(0.95, 0.3, distance(vUv, vec2(0.68, 0.58)));

            // Viñeta para fundirse con el navy del fondo
            float vig = smoothstep(0.0, 0.28, vUv.x) * smoothstep(1.0, 0.72, vUv.x) *
                        smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
            gl_FragColor = vec4(col * vig * uIntensity * (0.25 + 0.75 * focus) * 0.7, 1.0);
          }
        `,
      }),
    [octavas]
  );

  useFrame((state) => {
    material.uniforms.uIntensity.value = anim.nebula;
    if (reduced) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (groupRef.current) {
      // La nebulosa apenas responde al ratón: es el plano más lejano
      const damp = 0.03;
      groupRef.current.position.x +=
        (state.pointer.x * 0.18 - groupRef.current.position.x) * damp;
      groupRef.current.position.y +=
        (state.pointer.y * 0.12 - groupRef.current.position.y) * damp;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -26]} material={material} ref={matRef}>
        <planeGeometry args={[78, 42]} />
      </mesh>
    </group>
  );
}

/* ---------- Campo estelar: miles de magnitudes distintas ---------- */
const STAR_PALETTE = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#ffffff"),
  new THREE.Color("#dfe9ff"),
  new THREE.Color("#12b3b6"),
  new THREE.Color("#2adfe2"),
  new THREE.Color("#ffb347"),
  new THREE.Color("#caa6ff"),
];

function Starfield({ anim, reduced, count = CALIDAD.estrellas }) {
  const ref = useRef();
  const matRef = useRef();

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      pos[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 2;
      const c = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      siz[i] = 0.03 + Math.pow(Math.random(), 2.2) * 0.16;
    }
    return [pos, col, siz];
  }, [count]);

  useFrame((state) => {
    if (matRef.current) matRef.current.opacity = anim.stars * 0.9;
    if (reduced || !ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.04) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.085}
        map={getGlowTexture()}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/*
 * ---------- Estrella de 8 puntas ----------
 * Proporciones medidas del logotipo: la punta sur es la más larga,
 * la norte algo menor, las horizontales anchas y las diagonales cortas.
 */
function buildStarShape(scaleInner = 0.14) {
  const radii = [0.7, 0.4, 0.74, 0.4, 1.0, 0.4, 0.74, 0.4];
  const shape = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const aOut = Math.PI / 2 - (i * Math.PI) / 4;
    const aIn = aOut - Math.PI / 8;
    const ox = Math.cos(aOut) * radii[i];
    const oy = Math.sin(aOut) * radii[i];
    if (i === 0) shape.moveTo(ox, oy);
    else shape.lineTo(ox, oy);
    shape.lineTo(Math.cos(aIn) * scaleInner, Math.sin(aIn) * scaleInner);
  }
  shape.closePath();
  return shape;
}

function Star({ anim }) {
  const groupRef = useRef();
  const flashRef = useRef();
  const lightRef = useRef();
  const raysRef = useRef();

  const { outerGeo, innerGeo } = useMemo(
    () => ({
      outerGeo: new THREE.ShapeGeometry(buildStarShape()),
      innerGeo: new THREE.ShapeGeometry(buildStarShape(0.11)),
    }),
    []
  );

  const raysMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#F5A429",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const core = Math.max(anim.starCore, 0.0001);
    if (groupRef.current) {
      const breath = 1 + Math.sin(t * 1.8) * 0.045;
      groupRef.current.scale.setScalar(core * 0.92 * breath);
    }
    if (flashRef.current) flashRef.current.material.opacity = anim.starFlash;
    if (lightRef.current)
      lightRef.current.intensity = core * 2.4 + anim.starFlash * 9;
    if (raysRef.current) raysRef.current.rotation.z = t * 0.05;
    raysMaterial.opacity =
      (0.05 + 0.03 * Math.sin(t * 0.9)) *
      THREE.MathUtils.clamp(anim.starCore, 0, 1);
  });

  return (
    <group>
      <group ref={groupRef}>
        {/* Cuerpo naranja-ámbar */}
        <mesh geometry={outerGeo}>
          <meshBasicMaterial
            color="#F5A429"
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Núcleo caliente */}
        <mesh geometry={innerGeo} scale={0.32} position={[0, 0, 0.01]}>
          <meshBasicMaterial
            color="#ffe9c4"
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Rayos de luz que giran muy despacio */}
        <group ref={raysRef} position={[0, 0, -0.05]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              rotation={[0, 0, (i * Math.PI) / 4 + 0.4]}
              material={raysMaterial}
            >
              <planeGeometry args={[0.05, 4.6]} />
            </mesh>
          ))}
        </group>
        {/* Halos */}
        <sprite scale={[2.3, 2.3, 1]}>
          <spriteMaterial
            map={getGlowTexture()}
            color="#F5A429"
            transparent
            opacity={0.5}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
        <sprite scale={[4.4, 4.4, 1]}>
          <spriteMaterial
            map={getGlowTexture()}
            color="#F5A429"
            transparent
            opacity={0.18}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      {/* Destello del ensamblaje final */}
      <sprite ref={flashRef} scale={[14, 14, 1]}>
        <spriteMaterial
          map={getGlowTexture()}
          color="#fff3dd"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <pointLight ref={lightRef} color="#F5A429" intensity={0} distance={14} />
    </group>
  );
}

/* ---------- Capa de la estrella: fija en su sitio, orienta su rostro al cursor ---------- */
function StarLayer({ anim, reduced, compact }) {
  const ref = useRef();
  // En móvil la estrella se centra; en el resto vive a la derecha, muy zoomeada
  const base = compact ? [0, 0, 0] : [3.3, 0.2, 0];
  const scale = compact ? 1.15 : 2.1;

  useFrame((state) => {
    if (reduced || !ref.current) return;
    const damp = 0.06;
    // La estrella no se desplaza: gira para mirar hacia el cursor
    const targetY = state.pointer.x * 0.32;
    const targetX = -state.pointer.y * 0.26;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * damp;
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * damp;
  });

  return (
    <group ref={ref} position={base} scale={scale}>
      <Star anim={anim} />
    </group>
  );
}

/* ---------- Meteoros fugaces en el fondo ---------- */
function Meteors({ anim, reduced, count = 3 }) {
  const spritesRef = useRef([]);

  const meteors = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        next: 3 + i * 4 + Math.random() * 3,
        dur: 0.9 + Math.random() * 0.5,
        active: false,
        x0: 0,
        y0: 0,
        vx: 0,
        vy: 0,
      })),
    [count]
  );

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    meteors.forEach((m, i) => {
      const spr = spritesRef.current[i];
      if (!spr) return;
      if (t < m.next) {
        spr.material.opacity = 0;
        return;
      }
      if (!m.active) {
        m.active = true;
        m.x0 = -6 + Math.random() * 16;
        m.y0 = 2.5 + Math.random() * 3.5;
        m.vx = -(5 + Math.random() * 4);
        m.vy = -(1.4 + Math.random() * 1.6);
        spr.material.rotation = Math.atan2(m.vy, m.vx);
      }
      const u = (t - m.next) / m.dur;
      if (u >= 1) {
        m.active = false;
        m.next = t + 5 + Math.random() * 9;
        spr.material.opacity = 0;
        return;
      }
      spr.position.set(m.x0 + m.vx * u * m.dur, m.y0 + m.vy * u * m.dur, -12);
      spr.material.opacity = Math.sin(Math.PI * u) * 0.7 * anim.stars;
    });
  });

  return (
    <group>
      {meteors.map((_, i) => (
        <sprite
          key={i}
          ref={(el) => (spritesRef.current[i] = el)}
          scale={[2.4, 0.06, 1]}
        >
          <spriteMaterial
            map={getGlowTexture()}
            color="#cfeffd"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

/* ---------- Un planeta lejano con anillo, dormido en la nebulosa ---------- */
function Planet({ anim, reduced }) {
  const groupRef = useRef();
  const bodyMatRef = useRef();
  const ringMatRef = useRef();
  const hazeMatRef = useRef();

  useFrame((state) => {
    const k = anim.nebula;
    if (bodyMatRef.current) bodyMatRef.current.opacity = k * 0.9;
    if (ringMatRef.current) ringMatRef.current.opacity = k * 0.22;
    if (hazeMatRef.current) hazeMatRef.current.opacity = k * 0.14;
    if (reduced || !groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <group position={[-7.4, 3.4, -16]} rotation={[0.15, 0, -0.12]}>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.62, 24, 24]} />
          <meshStandardMaterial
            ref={bodyMatRef}
            color="#5d4f9e"
            emissive="#221a4d"
            emissiveIntensity={0.55}
            roughness={0.9}
            transparent
            opacity={0}
          />
        </mesh>
      </group>
      <mesh rotation={[1.45, 0, 0.35]}>
        <ringGeometry args={[0.88, 1.28, 48]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color="#ffb347"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <sprite scale={[3.2, 3.2, 1]}>
        <spriteMaterial
          ref={hazeMatRef}
          map={getGlowTexture()}
          color="#12b3b6"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

/* Con "demand" o al volver de estar oculta, la escena necesita que alguien le
   pida un fotograma: si no, se quedaría con la última imagen dibujada. */
function PedirFotograma({ visible, sello }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (visible) invalidate();
  }, [visible, sello, invalidate]);
  return null;
}

/* ---------- Escena raíz dentro del canvas ---------- */
function SceneRoot({ anim, reduced, visible, sello }) {
  // En pantallas estrechas la estrella se centra y encoge
  const aspect = useThree((s) => s.viewport.aspect);
  const compact = aspect < 0.85;
  return (
    <>
      <PedirFotograma visible={visible} sello={sello} />
      <ambientLight intensity={0.4} />
      <Nebula anim={anim} reduced={reduced} />
      <Starfield anim={anim} reduced={reduced} />
      <Meteors anim={anim} reduced={reduced} />
      {!compact && CALIDAD.planeta && <Planet anim={anim} reduced={reduced} />}
      <Flotar
        enabled={!reduced}
        speed={1.1}
        rotationIntensity={0.06}
        floatIntensity={0.5}
      >
        <StarLayer anim={anim} reduced={reduced} compact={compact} />
      </Flotar>
    </>
  );
}

/* ---------- Componente público ---------- */
export default function AstraScene({
  reduced = false,
  start = false,
  onAssembled,
  className = "",
}) {
  // Valores mutados por GSAP y leídos en useFrame (cero re-renders)
  const anim = useMemo(
    () => ({
      stars: 0,
      nebula: 0,
      starCore: 0,
      starFlash: 0,
    }),
    []
  );
  const onAssembledRef = useRef(onAssembled);
  onAssembledRef.current = onAssembled;
  const playedRef = useRef(false);

  /* Cada vez que cambia, la escena vuelve a dibujarse. Hace falta cuando no se
     está animando (movimiento reducido): sin esto, los valores de la escena se
     asignan pero nadie pide el fotograma que los pinta, y el hero se quedaba
     vacío para quien tiene activado "reducir movimiento" en su sistema. */
  const [sello, setSello] = useState(0);

  useEffect(() => {
    if (!start || playedRef.current) return;
    playedRef.current = true;

    if (reduced) {
      Object.assign(anim, {
        stars: 1,
        nebula: 1,
        starCore: 1,
      });
      setSello((n) => n + 1);
      onAssembledRef.current?.();
      return;
    }

    /*
     * La entrada:
     *  1. Oscuridad: una sola punta de luz naranja perfora el negro.
     *  2. La estrella estalla iluminando la nebulosa.
     *  3. (En Hero.jsx) los títulos pasan de desenfoque a foco.
     */
    const tl = gsap.timeline({ delay: 0.1 });

    // Fase 1 — la punta de luz
    tl.to(anim, { starCore: 0.16, duration: 0.9, ease: "power2.in" }, 0);
    tl.to(anim, { stars: 1, duration: 1.5, ease: "power1.inOut" }, 0.45);

    // Fase 2 — el destello que enciende la nebulosa
    tl.to(anim, { starCore: 1.4, duration: 0.4, ease: "power4.in" }, 1.6);
    tl.to(anim, { starFlash: 1, duration: 0.16, ease: "power4.in" }, 1.85);
    tl.add(() => onAssembledRef.current?.(), 1.92);
    tl.to(anim, { starFlash: 0, duration: 1.0, ease: "power2.out" }, 2.02);
    tl.to(anim, { starCore: 1, duration: 1.0, ease: "elastic.out(1, 0.55)" }, 2.04);
    tl.to(anim, { nebula: 1, duration: 1.8, ease: "power2.out" }, 1.85);

    return () => tl.kill();
  }, [start, reduced, anim]);

  /*
   * La escena solo dibuja cuando de verdad se está viendo.
   *
   * Sin esto, el canvas seguía renderizando a pantalla completa durante TODA
   * la página: el usuario leía el temario o rellenaba el carrito mientras la
   * GPU pintaba una nebulosa que nadie veía. Es la mayor fuente de lentitud
   * que tenía la web.
   */
  const contenedorRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const nodo = contenedorRef.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;

    let enPantalla = true;
    let pestanaActiva = !document.hidden;
    const actualizar = () => setVisible(enPantalla && pestanaActiva);

    // rootMargin: se reanuda un poco antes de que el hero vuelva a asomar,
    // para que nunca se vea el primer fotograma "saltando".
    const observador = new IntersectionObserver(
      ([entrada]) => {
        enPantalla = entrada.isIntersecting;
        actualizar();
      },
      { rootMargin: "200px 0px" }
    );
    observador.observe(nodo);

    // Pestaña en segundo plano: tampoco tiene sentido gastar batería.
    const alCambiarPestana = () => {
      pestanaActiva = !document.hidden;
      actualizar();
    };
    document.addEventListener("visibilitychange", alCambiarPestana);

    return () => {
      observador.disconnect();
      document.removeEventListener("visibilitychange", alCambiarPestana);
    };
  }, []);

  /* "never" no dibuja nada en absoluto; "demand" solo cuando se le pide. */
  const frameloop = !visible ? "never" : reduced ? "demand" : "always";

  return (
    <div
      ref={contenedorRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 48 }}
        dpr={CALIDAD.dpr}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={frameloop}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <SceneRoot
          anim={anim}
          reduced={reduced}
          visible={visible}
          sello={sello}
        />
      </Canvas>
    </div>
  );
}
