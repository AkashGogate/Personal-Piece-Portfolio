"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

interface VesicleDef { p: [number, number, number]; r: number }
interface MitoDef    { x: number; y: number; z: number; len: number; wid: number; rot: number }
interface IcoDef     { x: number; y: number; z: number; r: number }
interface OctaDef    { x: number; y: number; z: number; r: number }
interface RingDef    { x: number; y: number; z: number; r: number; tube: number; rotX?: number; rotY?: number }
interface KnotDef    { x: number; y: number; z: number; r: number; tube: number; p?: number; q?: number }

interface VariantCfg {
  vesicles: VesicleDef[];
  mitos:    MitoDef[];
  icos:     IcoDef[];
  octas:    OctaDef[];
  rings:    RingDef[];
  knots:    KnotDef[];
}

const VARIANTS: VariantCfg[] = [
  // 0 — About  (even 3-column spread: left ≈ -6, center ≈ 0, right ≈ +6)
  {
    vesicles: [
      { p: [-6.5,  3.5, -1.0], r: 0.18 },
      { p: [-1.5,  4.0, -0.8], r: 0.14 },
      { p: [ 5.8,  3.0, -0.9], r: 0.16 },
      { p: [-5.5, -3.5, -1.1], r: 0.19 },
      { p: [ 1.0, -4.0, -0.7], r: 0.13 },
      { p: [ 6.5, -2.5, -1.0], r: 0.21 },
    ],
    mitos: [
      { x: -5.0, y:  1.2, z: -1.0, len: 0.65, wid: 0.26, rot:  0.4 },
      { x:  5.2, y: -1.5, z: -1.1, len: 0.55, wid: 0.22, rot: -0.7 },
    ],
    icos: [
      { x: -2.0, y: -2.0, z: -0.8, r: 0.36 },
      { x:  3.0, y:  2.5, z: -0.6, r: 0.28 },
    ],
    octas: [
      { x:  6.8, y:  0.5, z: -0.9, r: 0.28 },
      { x: -6.8, y: -1.0, z: -1.2, r: 0.22 },
    ],
    rings: [
      { x: -3.5, y:  2.8, z: -1.1, r: 0.32, tube: 0.065, rotX: 0.45 },
      { x:  4.5, y: -2.5, z: -0.8, r: 0.26, tube: 0.055, rotX: 1.10, rotY: 0.3 },
    ],
    knots: [
      { x: -6.5, y:  0.5, z: -1.0, r: 0.30, tube: 0.055 },
      { x:  0.5, y:  1.2, z: -0.8, r: 0.25, tube: 0.045, p: 2, q: 3 },
      { x:  5.5, y:  2.5, z: -0.9, r: 0.22, tube: 0.040, p: 3, q: 2 },
    ],
  },
  // 1 — Education
  {
    vesicles: [
      { p: [ 6.5,  3.5, -0.9], r: 0.15 },
      { p: [ 1.5,  4.0, -0.7], r: 0.19 },
      { p: [-5.8,  3.0, -1.2], r: 0.14 },
      { p: [ 5.5, -3.5, -0.8], r: 0.18 },
      { p: [-1.0, -4.0, -1.0], r: 0.16 },
      { p: [-6.5, -2.5, -0.6], r: 0.13 },
    ],
    mitos: [
      { x:  5.0, y:  1.2, z: -1.0, len: 0.60, wid: 0.24, rot: -0.5 },
      { x: -5.2, y: -1.5, z: -0.9, len: 0.68, wid: 0.27, rot:  0.3 },
    ],
    icos: [
      { x:  2.0, y: -2.0, z: -0.7, r: 0.30 },
      { x: -3.0, y:  2.5, z: -1.0, r: 0.38 },
    ],
    octas: [
      { x: -6.8, y:  0.5, z: -0.8, r: 0.25 },
      { x:  6.8, y: -1.0, z: -1.0, r: 0.30 },
    ],
    rings: [
      { x:  3.5, y:  2.8, z: -1.2, r: 0.30, tube: 0.060, rotX: 0.80, rotY: 0.5 },
      { x: -4.5, y: -2.5, z: -0.8, r: 0.24, tube: 0.052, rotX: 0.30 },
    ],
    knots: [
      { x:  6.5, y:  0.5, z: -1.0, r: 0.28, tube: 0.050 },
      { x: -0.5, y:  1.2, z: -0.9, r: 0.24, tube: 0.042, p: 3, q: 4 },
      { x: -5.5, y:  2.5, z: -0.8, r: 0.20, tube: 0.038, p: 2, q: 3 },
    ],
  },
  // 2 — Skills
  {
    vesicles: [
      { p: [-6.5,  3.8, -0.6], r: 0.16 },
      { p: [ 0.5,  4.2, -1.0], r: 0.13 },
      { p: [ 6.0,  3.0, -0.9], r: 0.21 },
      { p: [-5.5, -3.0, -0.8], r: 0.14 },
      { p: [-0.5, -4.0, -1.1], r: 0.19 },
      { p: [ 5.5, -3.5, -0.7], r: 0.12 },
    ],
    mitos: [
      { x:  5.5, y: -1.5, z: -1.0, len: 0.70, wid: 0.28, rot:  0.6 },
      { x: -5.5, y:  1.5, z: -0.8, len: 0.58, wid: 0.23, rot: -0.4 },
    ],
    icos: [
      { x: -2.5, y: -2.5, z: -0.7, r: 0.38 },
      { x:  2.5, y:  2.5, z: -0.9, r: 0.32 },
    ],
    octas: [
      { x:  7.0, y:  0.0, z: -0.8, r: 0.28 },
      { x: -7.0, y: -2.0, z: -1.2, r: 0.22 },
    ],
    rings: [
      { x:  4.0, y:  1.5, z: -1.0, r: 0.28, tube: 0.058, rotX: 1.20 },
      { x: -4.0, y: -1.5, z: -0.9, r: 0.22, tube: 0.048, rotX: 0.55, rotY: 0.8 },
    ],
    knots: [
      { x: -7.0, y:  2.0, z: -1.0, r: 0.32, tube: 0.058, p: 2, q: 5 },
      { x:  0.0, y: -1.0, z: -0.9, r: 0.26, tube: 0.046 },
      { x:  6.5, y: -2.5, z: -0.8, r: 0.22, tube: 0.040, p: 3, q: 2 },
    ],
  },
  // 3 — Contact
  {
    vesicles: [
      { p: [ 6.0,  3.5, -0.8], r: 0.19 },
      { p: [-1.5,  4.0, -1.0], r: 0.14 },
      { p: [-6.0,  3.0, -0.7], r: 0.16 },
      { p: [ 5.5, -3.5, -1.2], r: 0.22 },
      { p: [ 0.0, -4.0, -0.9], r: 0.13 },
      { p: [-5.5, -2.5, -1.0], r: 0.17 },
    ],
    mitos: [
      { x:  5.5, y: -1.0, z: -1.0, len: 0.62, wid: 0.25, rot: -0.3 },
      { x: -5.5, y:  1.5, z: -0.8, len: 0.55, wid: 0.22, rot:  0.5 },
    ],
    icos: [
      { x: -3.0, y:  2.5, z: -0.6, r: 0.32 },
      { x:  3.0, y: -2.5, z: -0.9, r: 0.28 },
    ],
    octas: [
      { x: -7.0, y: -0.5, z: -0.8, r: 0.26 },
      { x:  7.0, y:  1.5, z: -0.7, r: 0.32 },
    ],
    rings: [
      { x: -4.5, y: -2.0, z: -1.0, r: 0.30, tube: 0.062, rotX: 0.70 },
      { x:  4.5, y:  2.5, z: -0.7, r: 0.24, tube: 0.050, rotX: 1.40, rotY: 0.4 },
    ],
    knots: [
      { x: -6.5, y:  0.0, z: -1.0, r: 0.28, tube: 0.050, p: 3, q: 4 },
      { x:  0.5, y: -1.0, z: -0.9, r: 0.24, tube: 0.044 },
      { x:  6.5, y:  2.0, z: -0.8, r: 0.20, tube: 0.038, p: 2, q: 3 },
    ],
  },
  // 4 — Experience (more elements; 4-column spread)
  {
    vesicles: [
      { p: [-7.0,  3.8, -1.0], r: 0.15 },
      { p: [-2.5,  4.5, -0.8], r: 0.17 },
      { p: [ 2.5,  4.0, -0.9], r: 0.13 },
      { p: [ 7.0,  3.0, -1.1], r: 0.20 },
      { p: [-6.5, -3.5, -0.7], r: 0.14 },
      { p: [-1.5, -4.5, -1.2], r: 0.16 },
      { p: [ 1.5, -4.0, -0.9], r: 0.18 },
      { p: [ 7.0, -2.5, -1.0], r: 0.13 },
      { p: [-4.5,  0.5, -0.8], r: 0.15 },
      { p: [ 4.5, -0.5, -1.2], r: 0.12 },
    ],
    mitos: [
      { x: -6.0, y: -1.0, z: -1.0, len: 0.65, wid: 0.26, rot: -0.5 },
      { x:  0.5, y:  3.0, z: -0.8, len: 0.58, wid: 0.23, rot:  0.3 },
      { x:  6.0, y: -3.0, z: -0.9, len: 0.62, wid: 0.25, rot:  0.7 },
    ],
    icos: [
      { x: -3.5, y:  2.0, z: -0.7, r: 0.34 },
      { x:  3.5, y: -2.5, z: -1.1, r: 0.26 },
      { x:  7.2, y:  0.5, z: -0.8, r: 0.30 },
      { x: -7.2, y: -2.0, z: -0.9, r: 0.22 },
    ],
    octas: [
      { x: -1.5, y:  3.5, z: -0.8, r: 0.28 },
      { x:  1.5, y: -3.5, z: -1.0, r: 0.22 },
      { x:  6.5, y:  1.5, z: -0.7, r: 0.24 },
    ],
    rings: [
      { x: -5.5, y:  2.5, z: -1.0, r: 0.32, tube: 0.065, rotX: 0.60 },
      { x:  0.0, y: -1.5, z: -0.8, r: 0.26, tube: 0.054, rotX: 1.10, rotY: 0.5 },
      { x:  5.5, y:  1.0, z: -0.9, r: 0.22, tube: 0.046, rotX: 0.30, rotY: 1.2 },
    ],
    knots: [
      { x: -7.0, y:  1.5, z: -1.0, r: 0.32, tube: 0.055, p: 2, q: 3 },
      { x: -2.5, y: -2.0, z: -0.9, r: 0.26, tube: 0.046 },
      { x:  2.5, y:  2.0, z: -0.8, r: 0.22, tube: 0.040, p: 3, q: 4 },
      { x:  7.0, y: -1.0, z: -1.0, r: 0.28, tube: 0.050, p: 2, q: 5 },
      { x: -5.0, y: -0.5, z: -0.9, r: 0.20, tube: 0.036, p: 3, q: 2 },
    ],
  },
  // 5 — Projects (4-column spread, mirrored from Experience)
  {
    vesicles: [
      { p: [ 7.0,  3.8, -0.9], r: 0.16 },
      { p: [ 2.5,  4.5, -1.0], r: 0.13 },
      { p: [-2.5,  4.0, -0.7], r: 0.18 },
      { p: [-7.0,  3.0, -1.2], r: 0.14 },
      { p: [ 6.5, -3.5, -0.8], r: 0.21 },
      { p: [ 1.5, -4.5, -1.0], r: 0.15 },
      { p: [-1.5, -4.0, -0.9], r: 0.13 },
      { p: [-7.0, -2.5, -0.9], r: 0.17 },
      { p: [ 4.5,  0.5, -0.7], r: 0.14 },
      { p: [-4.5, -0.5, -1.1], r: 0.12 },
    ],
    mitos: [
      { x:  6.0, y: -1.0, z: -1.0, len: 0.62, wid: 0.25, rot:  0.6 },
      { x: -0.5, y:  3.0, z: -0.9, len: 0.60, wid: 0.24, rot: -0.4 },
      { x: -6.0, y: -3.0, z: -0.8, len: 0.55, wid: 0.22, rot:  0.2 },
    ],
    icos: [
      { x:  3.5, y:  2.0, z: -0.8, r: 0.30 },
      { x: -3.5, y: -2.5, z: -1.0, r: 0.36 },
      { x: -7.2, y:  0.5, z: -0.7, r: 0.26 },
      { x:  7.2, y: -2.0, z: -0.9, r: 0.22 },
    ],
    octas: [
      { x:  1.5, y:  3.5, z: -0.7, r: 0.24 },
      { x: -1.5, y: -3.5, z: -1.1, r: 0.28 },
      { x: -6.5, y:  1.5, z: -0.9, r: 0.20 },
    ],
    rings: [
      { x:  5.5, y:  2.5, z: -1.0, r: 0.30, tube: 0.060, rotX: 0.85 },
      { x:  0.0, y: -1.5, z: -0.7, r: 0.24, tube: 0.050, rotX: 0.40, rotY: 0.9 },
      { x: -5.5, y:  1.0, z: -0.9, r: 0.20, tube: 0.044, rotX: 1.30, rotY: 0.3 },
    ],
    knots: [
      { x:  7.0, y:  1.5, z: -1.0, r: 0.30, tube: 0.052, p: 2, q: 3 },
      { x:  2.5, y: -2.0, z: -0.9, r: 0.26, tube: 0.046, p: 3, q: 4 },
      { x: -2.5, y:  2.0, z: -0.8, r: 0.22, tube: 0.040 },
      { x: -7.0, y: -1.0, z: -1.0, r: 0.24, tube: 0.044, p: 2, q: 5 },
      { x:  5.0, y: -0.5, z: -0.9, r: 0.20, tube: 0.036, p: 3, q: 2 },
    ],
  },
];

interface FloatObj {
  obj: THREE.Object3D;
  bx: number; by: number; bz: number;
  fx: number; fy: number; fz: number;
  ampX: number; ampY: number;
  phase: number;
  spinX: number; spinY: number; spinZ: number;
}

interface BioMats {
  shell:   THREE.MeshBasicMaterial;
  vesicle: THREE.MeshBasicMaterial;
  ico:     THREE.MeshBasicMaterial;
  octa:    THREE.MeshBasicMaterial;
  ring:    THREE.MeshBasicMaterial;
  knot:    THREE.LineBasicMaterial;
}

function themeColors(isDark: boolean) {
  const MINT = new THREE.Color(isDark ? 0x52b788 : 0x0f4828);
  const CELL = isDark ? new THREE.Color(0x4a8a6a) : new THREE.Color(0x0f4828);
  const op   = (v: number) => isDark ? v * 0.28 : v * 0.60;
  return { MINT, CELL, op };
}

interface Props { variant?: number }

export default function BioCanvas({ variant = 0 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const matsRef = useRef<BioMats | null>(null);

  // Live color/opacity update — no scene teardown, no animation freeze
  useEffect(() => {
    const m = matsRef.current;
    if (!m) return;
    const isDark = theme === "dark";
    const { MINT, CELL, op } = themeColors(isDark);

    m.shell.color.copy(CELL);    m.shell.opacity   = op(0.50);
    m.vesicle.color.copy(CELL);  m.vesicle.opacity = op(0.55);
    m.ico.color.copy(MINT);      m.ico.opacity     = op(0.48);
    m.octa.color.copy(MINT);     m.octa.opacity    = op(0.42);
    m.ring.color.copy(MINT);     m.ring.opacity    = op(0.44);
    m.knot.color.copy(MINT);     m.knot.opacity    = op(0.38);

    (Object.values(m) as THREE.Material[]).forEach(mat => { mat.needsUpdate = true; });
  }, [theme]);

  // Scene setup — runs once per variant, never on theme change
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isDark = theme === "dark";
    const { MINT, CELL, op } = themeColors(isDark);

    const shellMat   = new THREE.MeshBasicMaterial({ color: CELL, transparent: true, opacity: op(0.50) });
    const vesicleMat = new THREE.MeshBasicMaterial({ color: CELL, wireframe: true, transparent: true, opacity: op(0.55) });
    const icoMat     = new THREE.MeshBasicMaterial({ color: MINT, wireframe: true, transparent: true, opacity: op(0.48) });
    const octaMat    = new THREE.MeshBasicMaterial({ color: MINT, wireframe: true, transparent: true, opacity: op(0.42) });
    const ringMat    = new THREE.MeshBasicMaterial({ color: MINT, wireframe: true, transparent: true, opacity: op(0.44) });
    const knotMat    = new THREE.LineBasicMaterial({ color: MINT, transparent: true, opacity: op(0.38) });

    matsRef.current = {
      shell: shellMat, vesicle: vesicleMat, ico: icoMat,
      octa: octaMat, ring: ringMat, knot: knotMat,
    };

    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    const cfg = VARIANTS[variant % VARIANTS.length];
    const floaters: FloatObj[] = [];

    cfg.vesicles.forEach((v, i) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(v.r, 10, 8), vesicleMat);
      mesh.position.set(v.p[0], v.p[1], v.p[2]);
      scene.add(mesh);
      floaters.push({
        obj: mesh, bx: v.p[0], by: v.p[1], bz: v.p[2],
        fx: 0.00055 + i * 0.00008, fy: 0.00048 + i * 0.00010, fz: 0.00038,
        ampX: 0.32, ampY: 0.26,
        phase: i * 1.3, spinX: 0, spinY: 0, spinZ: 0,
      });
    });

    cfg.mitos.forEach((m, i) => {
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 64; j++) {
        const a = (j / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * m.len, Math.sin(a) * m.wid, 0));
      }
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 80, 0.022, 6, true),
        shellMat
      );
      mesh.position.set(m.x, m.y, m.z);
      mesh.rotation.z = m.rot;
      scene.add(mesh);
      floaters.push({
        obj: mesh, bx: m.x, by: m.y, bz: m.z,
        fx: 0.00040, fy: 0.00034, fz: 0.00026,
        ampX: 0.32, ampY: 0.26,
        phase: i * 2.5, spinX: 0, spinY: 0.00009, spinZ: 0,
      });
    });

    cfg.icos.forEach((ic, i) => {
      const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(ic.r, 0), icoMat);
      mesh.position.set(ic.x, ic.y, ic.z);
      scene.add(mesh);
      floaters.push({
        obj: mesh, bx: ic.x, by: ic.y, bz: ic.z,
        fx: 0.00048, fy: 0.00040, fz: 0.00032,
        ampX: 0.32, ampY: 0.26,
        phase: i * 3.7, spinX: 0.00008 * (i % 2 === 0 ? 1 : -1), spinY: -0.00015, spinZ: 0.00006,
      });
    });

    cfg.octas.forEach((oc, i) => {
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(oc.r, 0), octaMat);
      mesh.position.set(oc.x, oc.y, oc.z);
      scene.add(mesh);
      floaters.push({
        obj: mesh, bx: oc.x, by: oc.y, bz: oc.z,
        fx: 0.00052, fy: 0.00044, fz: 0.00036,
        ampX: 0.32, ampY: 0.26,
        phase: i * 4.1 + 1.5, spinX: 0.00012, spinY: 0.00020, spinZ: -0.00008,
      });
    });

    cfg.rings.forEach((rg, i) => {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(rg.r, rg.tube, 9, 22), ringMat);
      mesh.position.set(rg.x, rg.y, rg.z);
      mesh.rotation.x = rg.rotX ?? 0;
      mesh.rotation.y = rg.rotY ?? 0;
      scene.add(mesh);
      floaters.push({
        obj: mesh, bx: rg.x, by: rg.y, bz: rg.z,
        fx: 0.00042, fy: 0.00036, fz: 0.00028,
        ampX: 0.28, ampY: 0.22,
        phase: i * 5.1 + 0.8,
        spinX: 0.00006 * (i % 2 === 0 ? 1 : -1),
        spinY: 0.00022,
        spinZ: 0.00008 * (i % 3 === 0 ? -1 : 1),
      });
    });

    cfg.knots.forEach((k, ki) => {
      const geo   = new THREE.TorusKnotGeometry(k.r, k.tube, 80, 8, k.p ?? 2, k.q ?? 3);
      const edges = new THREE.EdgesGeometry(geo);
      const mesh  = new THREE.LineSegments(edges, knotMat);
      mesh.position.set(k.x, k.y, k.z);
      scene.add(mesh);
      floaters.push({
        obj: mesh, bx: k.x, by: k.y, bz: k.z,
        fx: 0.00038, fy: 0.00032, fz: 0.00025,
        ampX: 0.22, ampY: 0.18,
        phase: ki * 3.8 + 1.2,
        spinX: 0.00010 * (ki % 2 === 0 ? 1 : -1),
        spinY: 0.00018,
        spinZ: 0.00008 * (ki % 3 === 0 ? -1 : 1),
      });
    });

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let paused = false;

    const animate = (t: number) => {
      if (paused) return;
      raf = requestAnimationFrame(animate);

      floaters.forEach(({ obj, bx, by, bz, fx, fy, fz, ampX, ampY, phase, spinX, spinY, spinZ }) => {
        obj.position.x = bx + Math.sin(t * fx + phase) * ampX;
        obj.position.y = by + Math.cos(t * fy + phase + 1.0) * ampY;
        obj.position.z = bz + Math.sin(t * fz + phase + 2.1) * 0.14;
        if (spinX) obj.rotation.x += spinX;
        if (spinY) obj.rotation.y += spinY;
        if (spinZ) obj.rotation.z += spinZ;
      });

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        paused = false;
        raf = requestAnimationFrame(animate);
      } else {
        paused = true;
        cancelAnimationFrame(raf);
      }
    }, { threshold: 0 });
    obs.observe(mount);

    return () => {
      matsRef.current = null;
      paused = true;
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
