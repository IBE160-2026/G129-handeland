/**
 * Etter et vellykket «Prøv igjen» eller en ny vurdering: samme sti uten
 * feilparametrene, så ingen gammel feil står igjen i adressen for senere
 * svar (Tenker.tsx, overleveringen). Uten feil i adressen holder en refresh.
 *
 * Ett sted for «Prøv igjen»-stedene (Samtale.tsx og Skjemaer.tsx), så de ikke
 * glir fra hverandre.
 */

import type { useRouter } from "next/navigation";
import { adresseUtenFeil, feilIAdressen } from "../feiladresse";

export function oppdaterUtenFeil(router: ReturnType<typeof useRouter>) {
  const { pathname, search } = window.location;
  if (feilIAdressen(search)) router.replace(adresseUtenFeil(pathname, search), { scroll: false });
  else router.refresh();
}
