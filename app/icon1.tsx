/**
 * Favicon som PNG — reserven for app/icon.svg i nettlesere som ikke viser
 * SVG-ikoner. Se app/komponenter/ikonmerke.ts.
 */

import { ImageResponse } from "next/og";
import { B_MERKE_DATA_URI } from "./komponenter/ikonmerke";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- ImageResponse tegner et bilde, ikke en side */}
        <img src={B_MERKE_DATA_URI} width={30} height={30} />
      </div>
    ),
    size,
  );
}
