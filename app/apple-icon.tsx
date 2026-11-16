/**
 * Ikonet på iPhone-hjemskjermen (apple-touch-icon): B-merket i primærfargen
 * på hvit bakgrunn. iOS runder hjørnene selv, så merket har luft rundt seg.
 * Se app/komponenter/ikonmerke.ts.
 */

import { ImageResponse } from "next/og";
import { B_MERKE_DATA_URI } from "./komponenter/ikonmerke";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- ImageResponse tegner et bilde, ikke en side */}
        <img src={B_MERKE_DATA_URI} width={132} height={132} />
      </div>
    ),
    size,
  );
}
