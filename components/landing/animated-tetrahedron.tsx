"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Horizontal center as fraction of width (0–1). Default 0.72 = right side. */
  centerXRatio?: number;
  /** Vertical center as fraction of height (0–1). */
  centerYRatio?: number;
  /** How much of the panel the shape can occupy (0–1). */
  fill?: number;
  /** Rotation speed multiplier (1 = original). */
  speed?: number;
  /** Multiplier for particle opacity (decorative quieter look). */
  opacityScale?: number;
};

export function AnimatedTetrahedron({
  centerXRatio = 0.72,
  centerYRatio = 0.5,
  fill = 0.92,
  speed = 1,
  opacityScale = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯";
    let time = 0;
    let cssW = 0;
    let cssH = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const vertices = [
      { x: 0, y: 1, z: 0 },
      { x: -0.943, y: -0.333, z: -0.5 },
      { x: 0.943, y: -0.333, z: -0.5 },
      { x: 0, y: -0.333, z: 1 },
    ];

    const edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [2, 3],
      [3, 1],
    ];

    const faces = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
      [1, 3, 2],
    ];

    const rotateY = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x * Math.cos(angle) - point.z * Math.sin(angle),
      y: point.y,
      z: point.x * Math.sin(angle) + point.z * Math.cos(angle),
    });

    const rotateX = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x,
      y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
      z: point.y * Math.sin(angle) + point.z * Math.cos(angle),
    });

    const rotateZ = (point: { x: number; y: number; z: number }, angle: number) => ({
      x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
      y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
      z: point.z,
    });

    /** Max radius of unit tetrahedron after rotation ≈ √(1²+1²) ~ 1.5 — pad to 1.55 */
    const modelRadius = 1.55;

    const render = () => {
      if (cssW < 2 || cssH < 2) {
        frameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, cssW, cssH);

      const centerX = cssW * centerXRatio;
      const centerY = cssH * centerYRatio;

      // Fit to the actual rectangular panel, not a square inset
      const maxReachX = Math.min(centerX, cssW - centerX) * fill;
      const maxReachY = Math.min(centerY, cssH - centerY) * fill;
      const scale = Math.min(maxReachX, maxReachY) / modelRadius;

      ctx.font = `${Math.max(12, Math.round(scale * 0.045))}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];

      const project = (raw: { x: number; y: number; z: number }) => {
        let point = rotateY(raw, time * 0.4 * speed);
        point = rotateX(point, time * 0.3 * speed);
        point = rotateZ(point, time * 0.2 * speed);

        const depth = (point.z + 1.5) / 3;
        const charIndex = Math.floor(depth * (chars.length - 1));

        const x = Math.min(cssW - 4, Math.max(4, centerX + point.x * scale));
        const y = Math.min(cssH - 4, Math.max(4, centerY - point.y * scale));

        return {
          x,
          y,
          z: point.z,
          char: chars[Math.min(charIndex, chars.length - 1)],
        };
      };

      edges.forEach(([i, j]) => {
        const v1 = vertices[i];
        const v2 = vertices[j];
        for (let t = 0; t <= 1; t += 0.05) {
          points.push(
            project({
              x: v1.x + (v2.x - v1.x) * t,
              y: v1.y + (v2.y - v1.y) * t,
              z: v1.z + (v2.z - v1.z) * t,
            })
          );
        }
      });

      faces.forEach(([i, j, k]) => {
        const v1 = vertices[i];
        const v2 = vertices[j];
        const v3 = vertices[k];
        for (let u = 0; u <= 1; u += 0.12) {
          for (let v = 0; v <= 1 - u; v += 0.12) {
            const w = 1 - u - v;
            points.push(
              project({
                x: v1.x * u + v2.x * v + v3.x * w,
                y: v1.y * u + v2.y * v + v3.y * w,
                z: v1.z * u + v2.z * v + v3.z * w,
              })
            );
          }
        }
      });

      points.sort((a, b) => a.z - b.z);

      points.forEach((point) => {
        const alpha = (0.1 + (point.z + 1.5) * 0.18) * opacityScale;
        ctx.fillStyle = `rgba(78, 48, 28, ${Math.min(alpha, 0.7)})`;
        ctx.fillText(point.char, point.x, point.y);
      });

      time += 0.015;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      ro.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [centerXRatio, centerYRatio, fill, speed, opacityScale]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
