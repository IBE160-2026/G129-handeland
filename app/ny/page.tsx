/**
 * Ny tekst — innlesingen (FR-1 liming, FR-2 PDF, FR-44 bilder), flyttet fra
 * den gamle startsiden til en egen side (EXPERIENCE.md, Information
 * Architecture). Nås fra «+ Ny tekst» og «Legg en ny tekst på bordet».
 *
 * Bruksgrensen på fem tekster per døgn finnes ikke ennå.
 */

import { tilgang } from "../../data/konto";
import { limInnBilde, limInnPdf, limInnTekst } from "../handlinger";
import { Innlesing } from "../komponenter/Innlesing";

export default async function NyTekst() {
  // FR-35: uten innlogging sendes eleven til innloggingssiden.
  await tilgang();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1>Ny tekst</h1>
      <p className="mt-2 max-w-[62ch] text-dempet">
        Lim inn en fagtekst, last opp en PDF eller ta bilder av sidene. Du får se hva teksten handler om, lese den med
        fagordene forklart, og sjekke om du forsto den.
      </p>
      <div className="mt-8">
        <Innlesing limInn={limInnTekst} limInnPdf={limInnPdf} limInnBilde={limInnBilde} />
      </div>
    </main>
  );
}
