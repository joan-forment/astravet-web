import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* Sprite circular suave para que las partículas no sean cuadrados */
let glowTexture = null;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

const PALETTE = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#ffffff"),
  new THREE.Color("#ffffff"),
  new THREE.Color("#12b3b6"),
  new THREE.Color("#2adfe2"),
  new THREE.Color("#ffb347"),
];

/* Campo estelar: la "oscuridad del aprendizaje" salpicada de luz */
function Starfield({ count = 900, reduced }) {
  const ref = useRef();

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Cáscara esférica alrededor de la cámara
      const r = 8 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      pos[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 2;
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      siz[i] = 0.04 + Math.random() * 0.12;
    }
    return [pos, col, siz];
  }, [count]);

  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.012;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        map={getGlowTexture()}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/*
 * Astra: estrella polar de cuatro puntas fusionada con la cruz veterinaria.
 * Nodos unidos por líneas, con un núcleo brillante que "respira".
 */
const STAR_NODES = [
  [0, 2.5, 0], // norte
  [0.55, 0.55, 0.15],
  [2.1, 0, 0],
  [0.55, -0.55, -0.15],
  [0, -2.5, 0],
  [-0.55, -0.55, 0.15],
  [-2.1, 0, 0],
  [-0.55, 0.55, -0.15],
];

function AstraStar({ reduced }) {
  const coreRef = useRef();
  const linesRef = useRef();

  const { outline, cross, nodePositions } = useMemo(() => {
    const pts = STAR_NODES.map((p) => new THREE.Vector3(...p));
    const outlinePairs = [];
    for (let i = 0; i < pts.length; i++) {
      outlinePairs.push(pts[i], pts[(i + 1) % pts.length]);
    }
    // La cruz: eje norte-sur y este-oeste atravesando el centro
    const crossPairs = [pts[0], pts[4], pts[2], pts[6]];
    const nodeArr = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => p.toArray(nodeArr, i * 3));
    return {
      outline: new THREE.BufferGeometry().setFromPoints(outlinePairs),
      cross: new THREE.BufferGeometry().setFromPoints(crossPairs),
      nodePositions: nodeArr,
    };
  }, []);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.12;
      coreRef.current.scale.setScalar(s);
    }
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        line.material.opacity = 0.35 + Math.sin(t * 1.2 + i) * 0.15;
      });
    }
  });

  return (
    <group>
      <group ref={linesRef}>
        <lineSegments geometry={outline}>
          <lineBasicMaterial
            color="#2adfe2"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
        <lineSegments geometry={cross}>
          <lineBasicMaterial
            color="#ffb347"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      </group>

      {/* Nodos de la constelación */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={STAR_NODES.length}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          map={getGlowTexture()}
          color="#2adfe2"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Núcleo: la Estrella Polar */}
      <sprite ref={coreRef} scale={[1.4, 1.4, 1.4]}>
        <spriteMaterial
          map={getGlowTexture()}
          color="#ffffff"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <sprite scale={[4.6, 4.6, 4.6]}>
        <spriteMaterial
          map={getGlowTexture()}
          color="#12b3b6"
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

/* Orbita lentamente y reacciona con suavidad a la posición del cursor */
function Rig({ children, reduced }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    if (reduced) return;
    const damp = 1 - Math.pow(0.001, delta);
    ref.current.rotation.x +=
      (state.pointer.y * 0.18 - ref.current.rotation.x) * damp;
    ref.current.rotation.y +=
      (state.pointer.x * 0.25 - ref.current.rotation.y) * damp;
  });
  return <group ref={ref}>{children}</group>;
}

export default function Constellation({ reduced = false, className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <Rig reduced={reduced}>
          <Starfield reduced={reduced} />
          <Float
            enabled={!reduced}
            speed={1.2}
            rotationIntensity={0.08}
            floatIntensity={0.6}
          >
            <group position={[2.6, 0.4, 0]} rotation={[0, 0, 0.18]}>
              <AstraStar reduced={reduced} />
            </group>
          </Float>
        </Rig>
      </Canvas>
    </div>
  );
}
