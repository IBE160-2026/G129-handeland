/**
 * Ny tekst — innlesingen (FR-1 liming, FR-2 PDF, FR-44 bilder), flyttet fra
 * den gamle startsiden til en egen side (EXPERIENCE.md, Information
 * Architecture). Nås fra «+ Ny tekst» og «Legg en ny tekst på bordet».
 *
 * PRD §6.4: har eleven lagt inn 5 tekster i dag, står meldingen her i stedet
 * for innlesingen, før hun har limt inn noe, så hun ikke mister arbeid
 * (EXPERIENCE.md, Flyt 3). Handlingene avviser også på serveren, med samme
 * predikat (`opprettTekst`, AD-20).
 */

import { tekstgrenseNaadd } from "../../data/forbruk";
import { tilgang } from "../../data/konto";
import { limInnBilde, limInnPdf, limInnTekst } from "../handlinger";
import { GRENSE_FEIL } from "../../data/grenser";
import { Grensemelding } from "../komponenter/Grensemelding";
import { Innlesing } from "../komponenter/Innlesing";

export default async function NyTekst() {
  // FR-35: uten innlogging sendes eleven til innloggingssiden.
  const t = await tilgang();
  const grense = await tekstgrenseNaadd(t);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1>Ny tekst</h1>
      {grense ? (
        <Grensemelding {...GRENSE_FEIL.tekster} lenke={{ href: "/", tekst: "Til arbeidsbordet" }} />
      ) : (
        <>
          <p className="mt-2 max-w-[62ch] text-dempet">
            Lim inn en fagtekst, last opp en PDF eller ta bilder av sidene. Du får se hva teksten handler om, lese den
            med fagordene forklart, og sjekke om du forsto den.
          </p>
          <div className="mt-8">
            <Innlesing limInn={limInnTekst} limInnPdf={limInnPdf} limInnBilde={limInnBilde} />
          </div>
        </>
      )}
    </main>
  );
}
