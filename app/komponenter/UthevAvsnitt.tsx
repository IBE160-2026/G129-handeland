"use client";

/**
 * Uthever avsnittet en lenke viser til, som «Les avsnittet» fra quizen og
 * fagsamtalen (FR-15, FR-22).
 *
 * Hvorfor ikke bare CSS `:target`: Next sine lenker bytter side uten full
 * sidelasting, og da oppdaterer ikke nettleseren `:target`. Avsnittet ble
 * scrollet fram, men ikke markert — funnet i testing 16.10, «jeg kunne tenkt
 * meg at det ble markert tydeligere hvilket avsnitt det var snakk om».
 * Komponenten leser derfor adressen selv og setter `data-uthevet` på
 * avsnittet, som MarkertAvsnitt har stil for.
 */

import { useEffect } from "react";

export function UthevAvsnitt() {
  useEffect(() => {
    function uthev() {
      for (const el of document.querySelectorAll("[data-uthevet]")) el.removeAttribute("data-uthevet");
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id.startsWith("avsnitt-")) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute("data-uthevet", "true");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    uthev();
    window.addEventListener("hashchange", uthev);
    return () => window.removeEventListener("hashchange", uthev);
  }, []);
  return null;
}
