import { useEffect, useRef } from "react";

interface SpaghettiCanvasProps {
  imageSrc: string;
  spaghettificationFactor: number;
}

function clamp(v: number, mn: number, mx: number) {
  return Math.max(mn, Math.min(mx, v));
}

export function SpaghettiCanvas({
  imageSrc,
  spaghettificationFactor,
}: SpaghettiCanvasProps) {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const faceRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1, y: -1 });
  const imgDataRef = useRef<ImageData | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const bg = bgRef.current;
    const face = faceRef.current;
    if (!bg || !face) return;

    const SIZE = 340;
    bg.width = SIZE;
    bg.height = SIZE;
    face.width = SIZE;
    face.height = SIZE;
    const bgCtx = bg.getContext("2d")!;
    const faceCtx = face.getContext("2d")!;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      faceCtx.clearRect(0, 0, SIZE, SIZE);
      faceCtx.save();
      faceCtx.beginPath();
      faceCtx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      faceCtx.clip();
      faceCtx.drawImage(img, 0, 0, SIZE, SIZE);
      faceCtx.restore();
      imgDataRef.current = faceCtx.getImageData(0, 0, SIZE, SIZE);
    };
    img.onerror = () => {
      buildFallbackFace(faceCtx, SIZE);
      imgDataRef.current = faceCtx.getImageData(0, 0, SIZE, SIZE);
    };
    img.src = imageSrc;

    function buildFallbackFace(ctx: CanvasRenderingContext2D, s: number) {
      ctx.clearRect(0, 0, s, s);
      ctx.save();
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "#e8c89a";
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = "#c47850";
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.47, s * 0.32, s * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3a2510";
      [s * 0.38, s * 0.62].forEach((ex) => {
        ctx.beginPath();
        ctx.arc(ex, s * 0.43, s * 0.06, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#8b4513";
      ctx.beginPath();
      ctx.moveTo(s * 0.41, s * 0.63);
      ctx.quadraticCurveTo(s * 0.5, s * 0.7, s * 0.59, s * 0.63);
      ctx.stroke();
      ctx.restore();
    }

    function drawStars() {
      bgCtx.fillStyle = "#02060d";
      bgCtx.fillRect(0, 0, SIZE, SIZE);
      // DESPUÉS — tipado correcto para window
      const win = window as unknown as Record<string, unknown>;
      if (!win._stars) {
        win._stars = Array.from({ length: 120 }, () => ({
          x: Math.random() * SIZE,
          y: Math.random() * SIZE,
          r: Math.random() * 1.2 + 0.2,
          b: Math.random(),
        }));
      }

      (win._stars as { x: number; y: number; r: number; b: number }[]).forEach(
        (s) => {
          const brightness =
            0.2 + 0.8 * s.b * (0.7 + 0.3 * Math.sin(timeRef.current + s.b * 8));
          bgCtx.beginPath();
          bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          bgCtx.fillStyle = `rgba(200,230,255,${brightness})`;
          bgCtx.fill();
        },
      );
    }

    function drawAccretion() {
      const cx = SIZE / 2;
      const cy = SIZE / 2;
      const g = bgCtx.createRadialGradient(cx, cy, 20, cx, cy, 80);
      g.addColorStop(0, "rgba(255,120,30,0)");
      g.addColorStop(0.45, "rgba(255,90,15,0.18)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      bgCtx.fillStyle = g;
      bgCtx.fillRect(0, 0, SIZE, SIZE);
      bgCtx.beginPath();
      bgCtx.arc(cx, cy, 22, 0, Math.PI * 2);
      bgCtx.fillStyle = "#000";
      bgCtx.fill();
      bgCtx.beginPath();
      bgCtx.arc(cx, cy, 24, 0, Math.PI * 2);
      bgCtx.strokeStyle = "rgba(255,120,40,0.5)";
      bgCtx.lineWidth = 1.5;
      bgCtx.stroke();
    }

    function applyWarp() {
      if (!imgDataRef.current) return;
      const src = imgDataRef.current;
      const ctx = faceCtx;
      ctx.clearRect(0, 0, SIZE, SIZE);

      const { x: mx, y: my } = mouseRef.current;
      const bhX = mx < 0 ? SIZE / 2 : mx;
      const bhY = my < 0 ? SIZE / 2 : my;

      const spag = clamp(spaghettificationFactor / 6, 0, 1);
      const globalStrength = 0.6 + spag * 2.4;

      const dxFaceToHole = bhX - SIZE / 2;
      const dyFaceToHole = bhY - SIZE / 2;
      const distFaceToHole =
        Math.sqrt(dxFaceToHole ** 2 + dyFaceToHole ** 2) + 0.01;
      const bhDirX = dxFaceToHole / distFaceToHole;
      const bhDirY = dyFaceToHole / distFaceToHole;

      const dest = ctx.createImageData(SIZE, SIZE);

      for (let py = 0; py < SIZE; py++) {
        for (let px = 0; px < SIZE; px++) {
          const radialProj =
            (px - SIZE / 2) * bhDirX + (py - SIZE / 2) * bhDirY;
          const tangX = bhDirY;
          const tangY = -bhDirX;
          const tangProj = (px - SIZE / 2) * tangX + (py - SIZE / 2) * tangY;

          const proximity = clamp(radialProj / (SIZE / 2), -1, 1);
          const localStrength =
            globalStrength * clamp((proximity + 1) / 2, 0, 1) * 1.6;

          const stretch = 1 + localStrength * 1.8;
          const squeeze = 1 / (1 + localStrength * 0.7);

          const noise =
            Math.sin(timeRef.current * 0.8 + py * 0.04) *
            2 *
            localStrength *
            0.4;

          const srcPX =
            SIZE / 2 +
            (radialProj / stretch) * bhDirX +
            tangProj * squeeze * tangX +
            noise * bhDirX;
          const srcPY =
            SIZE / 2 +
            (radialProj / stretch) * bhDirY +
            tangProj * squeeze * tangY +
            noise * bhDirY;

          const sx = Math.round(srcPX);
          const sy = Math.round(srcPY);

          if (sx >= 0 && sx < SIZE && sy >= 0 && sy < SIZE) {
            const si = (sy * SIZE + sx) * 4;
            const di = (py * SIZE + px) * 4;
            dest.data[di] = src.data[si];
            dest.data[di + 1] = src.data[si + 1];
            dest.data[di + 2] = src.data[si + 2];
            dest.data[di + 3] = src.data[si + 3];

            if (localStrength > 0.5) {
              const red = clamp((localStrength - 0.5) * 160, 0, 200);
              dest.data[di] = clamp(dest.data[di] + red, 0, 255);
              dest.data[di + 1] = clamp(dest.data[di + 1] - red * 0.4, 0, 255);
            }
          }
        }
      }

      ctx.putImageData(dest, 0, 0);

      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function loop() {
      timeRef.current += 0.016;
      drawStars();
      drawAccretion();
      applyWarp();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [imageSrc, spaghettificationFactor]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handleMouseLeave() {
    mouseRef.current = { x: -1, y: -1 };
  }

  return (
    <div
      style={{
        position: "relative",
        width: 340,
        height: 340,
        cursor: "crosshair",
        flexShrink: 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          borderRadius: "50%",
        }}
      />
      <canvas
        ref={faceRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          mixBlendMode: "normal",
        }}
      />
    </div>
  );
}
