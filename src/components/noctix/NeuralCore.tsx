import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const LIME = new THREE.Color("#3344ff");
const LIME_SOFT = new THREE.Color("#6e7cff");

/**
 * AI Automation Core
 * - Central wireframe icosahedron = the "brain"
 * - Orbiting agent nodes representing automation services (voice, CRM, leads, data, etc.)
 * - Connection lines between brain and nodes = neural / workflow links
 * - Pulses traveling along the links = data flowing
 * - Outer data rings on tilted axes
 */

const NODE_COUNT = 9;

function Brain() {
  const ico = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (ico.current) {
      ico.current.rotation.x += dt * 0.25;
      ico.current.rotation.y += dt * 0.32;
    }
    if (inner.current) {
      inner.current.rotation.x -= dt * 0.18;
      inner.current.rotation.y -= dt * 0.22;
    }
  });

  return (
    <group>
      <mesh ref={ico}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={LIME} wireframe transparent opacity={0.7} />
      </mesh>
      <mesh ref={inner} scale={0.55}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={LIME} wireframe transparent opacity={0.5} />
      </mesh>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={LIME} wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function AgentNodes() {
  const group = useRef<THREE.Group>(null);

  // Distribute nodes on a sphere using fibonacci spiral, then animate radius slightly
  const nodes = useMemo(() => {
    const arr: { dir: THREE.Vector3; baseR: number; phase: number; speed: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      arr.push({
        dir: new THREE.Vector3(x, y, z).normalize(),
        baseR: 2.4 + (i % 3) * 0.18,
        phase: i * 0.7,
        speed: 0.4 + (i % 4) * 0.08,
      });
    }
    return arr;
  }, []);

  // Each node: small cube + glow sprite
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lineRefs = useRef<(THREE.Line | null)[]>([]);
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.08;
      group.current.rotation.x += dt * 0.02;
    }
    const t = state.clock.elapsedTime;
    nodes.forEach((n, i) => {
      const r = n.baseR + Math.sin(t * n.speed + n.phase) * 0.12;
      const pos = n.dir.clone().multiplyScalar(r);
      const m = meshRefs.current[i];
      if (m) {
        m.position.copy(pos);
        m.rotation.x += dt * 1.2;
        m.rotation.y += dt * 1.5;
      }
      // Update connecting line geometry
      const line = lineRefs.current[i];
      if (line) {
        const geo = line.geometry as THREE.BufferGeometry;
        const positions = geo.getAttribute("position") as THREE.BufferAttribute;
        positions.setXYZ(0, 0, 0, 0);
        positions.setXYZ(1, pos.x, pos.y, pos.z);
        positions.needsUpdate = true;
      }
      // Pulse traveling along the line from brain to node
      const pulse = pulseRefs.current[i];
      if (pulse) {
        const k = Math.sin(t * 0.9 + n.phase) * 0.5 + 0.5; // 0..1
        pulse.position.set(pos.x * k, pos.y * k, pos.z * k);
        const s = 0.6 + Math.sin(t * 4 + n.phase) * 0.25;
        pulse.scale.setScalar(s);
      }
    });
  });

  return (
    <group ref={group}>
      {nodes.map((_, i) => (
        <group key={i}>
          {/* connection line brain -> node */}
          {/* @ts-expect-error r3f line is lower-case */}
          <line ref={(el) => (lineRefs.current[i] = el as unknown as THREE.Line)}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([0, 0, 0, 0, 0, 0]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color={LIME} transparent opacity={0.28} />
          </line>

          {/* moving data pulse */}
          <mesh ref={(el) => (pulseRefs.current[i] = el)}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshBasicMaterial color={LIME_SOFT} transparent opacity={0.95} />
          </mesh>

          {/* the agent node itself */}
          <mesh ref={(el) => (meshRefs.current[i] = el)}>
            <boxGeometry args={[0.16, 0.16, 0.16]} />
            <meshBasicMaterial color={LIME} wireframe transparent opacity={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DataRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (r1.current) r1.current.rotation.z += dt * 0.18;
    if (r2.current) {
      r2.current.rotation.x += dt * 0.12;
      r2.current.rotation.y += dt * 0.08;
    }
    if (r3.current) r3.current.rotation.y -= dt * 0.1;
  });

  return (
    <group>
      <mesh ref={r1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.9, 0.006, 8, 160]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.55} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[3.3, 0.004, 8, 160]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.32} />
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 2.4, Math.PI / 6, Math.PI / 8]}>
        <torusGeometry args={[3.7, 0.003, 8, 200]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const N = 900;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 4 + Math.random() * 2.5;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    if (points.current) {
      points.current.rotation.y += dt * 0.04;
      points.current.rotation.x += dt * 0.012;
    }
  });

  return (
    <points ref={points} geometry={geo}>
      <pointsMaterial size={0.02} color={LIME_SOFT} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    // Gentle parallax follow
    group.current.position.x += (x * 0.35 - group.current.position.x) * 0.05;
    group.current.position.y += (y * 0.25 - group.current.position.y) * 0.05;
    group.current.rotation.y += (x * 0.25 - group.current.rotation.y) * 0.03;
    group.current.rotation.x += (-y * 0.15 - group.current.rotation.x) * 0.03;
  });

  return (
    <group ref={group}>
      <Brain />
      <AgentNodes />
      <DataRings />
      <ParticleField />
    </group>
  );
}

export function NeuralCore() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <Scene />
    </Canvas>
  );
}
