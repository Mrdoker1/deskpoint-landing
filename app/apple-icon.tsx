import { ImageResponse } from "next/og";
import { iconSvg } from "@/lib/logo-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Статический роут: нужно явно для `output: export` (превью на GitHub Pages).
export const dynamic = "force-static";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <img
        width={size.width}
        height={size.height}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(iconSvg(37 / 180))}`}
        alt=""
      />
    ),
    { ...size }
  );
}
