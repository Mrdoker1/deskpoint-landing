import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Статический роут: нужно явно для `output: export` (превью на GitHub Pages).
export const dynamic = "force-static";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080503",
          color: "#fafaf9",
          fontSize: 96,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.04em",
          borderRadius: 37,
        }}
      >
        D
      </div>
    ),
    { ...size }
  );
}
