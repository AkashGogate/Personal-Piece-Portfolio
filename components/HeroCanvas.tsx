"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

// ── Theme palette ─────────────────────────────────────────────────────────────

const BASE_DARK  = [0x52b788, 0x74c69d, 0x2d6a4f, 0x95d5b2];
const BASE_LIGHT = [0x40916c, 0x52b788, 0x1b4332, 0x74c69d];

function heroColors(isDark: boolean) {
  const MINT    = new THREE.Color(isDark ? 0x52b788 : 0x1a7a46);
  const STRAND2 = isDark ? new THREE.Color(0x2a4a38) : new THREE.Color(0x156335);
  const op      = (v: number) => isDark ? v : Math.min(v * 1.55, 0.98);
  const basePalette = isDark ? BASE_DARK : BASE_LIGHT;
  return { MINT, STRAND2, op, basePalette };
}

// ── Materials ref ─────────────────────────────────────────────────────────────

interface DnaMats {
  dnaS1:  THREE.MeshBasicMaterial;
  dnaS2:  THREE.MeshBasicMaterial;
  bases:  THREE.LineBasicMaterial[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const matsRef = useRef<DnaMats | null>(null);

  // Live color update — no scene teardown, no animation freeze
  useEffect(() => {
    const m = matsRef.current;
    if (!m) return;
    const isDark = theme === "dark";
    const { MINT, STRAND2, op, basePalette } = heroColors(isDark);

    m.dnaS1.color.copy(MINT);    m.dnaS1.opacity = op(0.58); m.dnaS1.needsUpdate = true;
    m.dnaS2.color.copy(STRAND2); m.dnaS2.opacity = op(0.28); m.dnaS2.needsUpdate = true;
    m.bases.forEach((bm, i) => {
      bm.color.set(basePalette[i]);
      bm.opacity = isDark ? 0.68 : 0.55;
      bm.needsUpdate = true;
    });
  }, [theme]);

  // Scene setup — runs once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isDark = theme === "dark";
    const { MINT, STRAND2, op, basePalette } = heroColors(isDark);

    const W = mount.clientWidth, H = mount.clientHeight;
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const dnaS1Mat = new THREE.MeshBasicMaterial({ color: MINT,   transparent: true, opacity: op(0.58) });
    const dnaS2Mat = new THREE.MeshBasicMaterial({ color: STRAND2, transparent: true, opacity: op(0.28) });
    const baseMats = basePalette.map((hex) =>
      new THREE.LineBasicMaterial({ color: hex, transparent: true, opacity: isDark ? 0.68 : 0.55 })
    );

    const PTS = 320, TURNS = 6, HEIGHT = 9, RAD = 0.62;

    // ── DNA helix (right) ──────────────────────────────────────────────
    const dnaGroup = new THREE.Group();
    dnaGroup.position.set(8.5, 0, -1);

    const s1: THREE.Vector3[] = [], s2: THREE.Vector3[] = [];
    for (let i = 0; i <= PTS; i++) {
      const t = i / PTS, a = t * Math.PI * 2 * TURNS, y = (t - 0.5) * HEIGHT;
      s1.push(new THREE.Vector3(Math.cos(a) * RAD, y, Math.sin(a) * RAD));
      s2.push(new THREE.Vector3(Math.cos(a + Math.PI) * RAD, y, Math.sin(a + Math.PI) * RAD));
    }
    const c1 = new THREE.CatmullRomCurve3(s1), c2 = new THREE.CatmullRomCurve3(s2);
    dnaGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c1, 320, 0.018, 7), dnaS1Mat));
    dnaGroup.add(new THREE.Mesh(new THREE.TubeGeometry(c2, 320, 0.018, 7), dnaS2Mat));
    for (let i = 0; i <= PTS; i += 8) {
      const t = i / PTS;
      const baseIdx = Math.floor((Math.floor(i / 8) * 1.618033988) % 4);
      dnaGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([c1.getPoint(t), c2.getPoint(t)]), baseMats[baseIdx]));
    }
    scene.add(dnaGroup);

    // ── DNA helix (left mirror) ────────────────────────────────────────
    const dnaGroup2 = new THREE.Group();
    dnaGroup2.position.set(-8.5, 0, -1);

    const s1L: THREE.Vector3[] = [], s2L: THREE.Vector3[] = [];
    for (let i = 0; i <= PTS; i++) {
      const t = i / PTS, a = t * Math.PI * 2 * TURNS, y = (t - 0.5) * HEIGHT;
      s1L.push(new THREE.Vector3(Math.cos(a) * RAD, y, Math.sin(a) * RAD));
      s2L.push(new THREE.Vector3(Math.cos(a + Math.PI) * RAD, y, Math.sin(a + Math.PI) * RAD));
    }
    const c1L = new THREE.CatmullRomCurve3(s1L), c2L = new THREE.CatmullRomCurve3(s2L);
    dnaGroup2.add(new THREE.Mesh(new THREE.TubeGeometry(c1L, 320, 0.018, 7), dnaS1Mat));
    dnaGroup2.add(new THREE.Mesh(new THREE.TubeGeometry(c2L, 320, 0.018, 7), dnaS2Mat));
    for (let i = 0; i <= PTS; i += 8) {
      const t = i / PTS;
      const baseIdx = Math.floor((Math.floor(i / 8) * 1.618033988) % 4);
      dnaGroup2.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([c1L.getPoint(t), c2L.getPoint(t)]), baseMats[baseIdx]));
    }
    scene.add(dnaGroup2);

    matsRef.current = { dnaS1: dnaS1Mat, dnaS2: dnaS2Mat, bases: baseMats };

    // ── Animation ──────────────────────────────────────────────────────
    let my = 0;
    const onMouse = (e: MouseEvent) => {
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let raf: number;
    const animate = (t: number) => {
      raf = requestAnimationFrame(animate);
      dnaGroup.rotation.y  =  t * 0.00022;
      dnaGroup.rotation.x  =  my * 0.04;
      dnaGroup2.rotation.y = -t * 0.00018;
      dnaGroup2.rotation.x =  my * 0.04;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      matsRef.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        const geom = (obj as THREE.Mesh | THREE.Line).geometry;
        geom?.dispose();
      });
      dnaS1Mat.dispose();
      dnaS2Mat.dispose();
      baseMats.forEach((m) => m.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // theme updates handled by the effect above — intentionally omitted

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
