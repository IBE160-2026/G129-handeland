/**
 * Hvor kortene i viften legger seg rundt bunken — DESIGN.md (Layout &
 * Spacing) og EXPERIENCE.md (Viften).
 *
 * Kortene legges på en ellipse rundt bunken, regnet ut fra de MÅLTE
 * størrelsene, så de aldri dekker bunken eller hverandre. Er det ikke plass i
 * bredden (stor tekst, smal skjerm), gir funksjonen `null`, og viften faller
 * tilbake til et rutenett under bunken.
 *
 * Ren funksjon, så regelen kan testes uten nettleser.
 */

export type Maal = { b: number; h: number };
export type Punkt = { x: number; y: number };

/** Fem kort: øverst, oppe til høyre, nede til høyre, nede til venstre, oppe til venstre. */
const VINKLER = [-90, -18, 54, 126, 198].map((g) => (g * Math.PI) / 180);

function overlapper(a: Punkt & Maal, b: Punkt & Maal, luft: number): boolean {
  return Math.abs(a.x - b.x) < (a.b + b.b) / 2 + luft && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + luft;
}

/**
 * @param bredde  bredden flaten har til rådighet
 * @param senter  bunken i midten
 * @param kort    kortene, i rekkefølge (høyst fem)
 * @param luft    minste avstand mellom to flater, og til kanten
 * @returns høyden flaten trenger, midtpunktet til bunken, og midtpunktet til
 *          hvert kort (alt regnet fra flatens øvre venstre hjørne), eller
 *          `null` når kortene ikke får plass rundt bunken.
 */
export function plasserRundt(
  bredde: number,
  senter: Maal,
  kort: Maal[],
  luft = 24,
): { hoeyde: number; senter: Punkt; kort: Punkt[] } | null {
  if (kort.length === 0 || kort.length > VINKLER.length) return null;
  const kb = Math.max(...kort.map((k) => k.b));
  const kh = Math.max(...kort.map((k) => k.h));

  let rx = senter.b / 2 + kb / 2 + luft;
  let ry = senter.h / 2 + kh / 2 + luft;

  for (let forsoek = 0; forsoek < 40; forsoek++) {
    const flater = [
      { x: 0, y: 0, ...senter },
      ...kort.map((k, i) => ({ x: Math.cos(VINKLER[i]) * rx, y: Math.sin(VINKLER[i]) * ry, ...k })),
    ];
    let kollisjon = false;
    for (let i = 0; i < flater.length && !kollisjon; i++)
      for (let j = i + 1; j < flater.length && !kollisjon; j++) kollisjon = overlapper(flater[i], flater[j], luft);

    if (!kollisjon) {
      const venstre = Math.min(...flater.map((f) => f.x - f.b / 2));
      const hoeyre = Math.max(...flater.map((f) => f.x + f.b / 2));
      const topp = Math.min(...flater.map((f) => f.y - f.h / 2));
      const bunn = Math.max(...flater.map((f) => f.y + f.h / 2));
      // Bunken står midt i bredden; den bredeste siden avgjør om det er plass.
      const halv = Math.max(-venstre, hoeyre) + luft;
      if (2 * halv > bredde) return null;
      const cx = bredde / 2;
      const cy = -topp + luft;
      return {
        hoeyde: bunn - topp + 2 * luft,
        senter: { x: cx, y: cy },
        kort: flater.slice(1).map((f) => ({ x: cx + f.x, y: cy + f.y })),
      };
    }
    rx *= 1.08;
    ry *= 1.08;
  }
  return null;
}
