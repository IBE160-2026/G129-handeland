/**
 * B-merket som PNG-ikon — reserven for app/icon.svg (DESIGN.md, logo-mark:
 * «B-en er app-ikon, favicon og del av ordmerket»).
 *
 * Eldre Safari og iOS-hjemskjermen viser ikke SVG-ikonet, så `icon1.tsx` og
 * `apple-icon.tsx` lager PNG med `ImageResponse` fra `next/og`. Tegningen er
 * den samme som i icon.svg, men med fargene som attributter (resvg, som
 * tegner bildet, leser ikke <style>), i primærfargen på hvit bakgrunn. PNG
 * har ingen mørk modus, så bare lys utgave.
 */

const PRIMAER = "#6427d6";
const MARKERING = "#ffe0ee";

const GLASS_V = "M25 40 H49 Q55 40 55 46 V58 Q55 72 41 72 H25 Q16 72 16 63 V49 Q16 40 25 40 Z";
const GLASS_H = "M71 40 H95 Q104 40 104 49 V63 Q104 72 95 72 H79 Q65 72 65 58 V46 Q65 40 71 40 Z";
const RAMME = `fill="none" stroke="${PRIMAER}" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"`;

/** Samme som app/icon.svg: brillene rotert −90°, så de blir en B, og ryggen. */
export const B_MERKE_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 100 100" width="100" height="100">` +
  `<g transform="translate(-16 20)">` +
  `<g transform="rotate(-90 60 40)">` +
  `<path fill="${MARKERING}" d="${GLASS_V}"/>` +
  `<path fill="${MARKERING}" d="${GLASS_H}"/>` +
  `<path ${RAMME} d="${GLASS_V}"/>` +
  `<path ${RAMME} d="${GLASS_H}"/>` +
  `<path ${RAMME} d="M55 44 Q60 37 65 44"/>` +
  `</g>` +
  `<path fill="none" stroke="${PRIMAER}" stroke-width="10.5" stroke-linecap="round" d="M60 -4 V84"/>` +
  `</g>` +
  `</svg>`;

export const B_MERKE_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(B_MERKE_SVG).toString("base64")}`;
