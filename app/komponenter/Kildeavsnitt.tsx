import Link from "next/link";

/**
 * Kildeavsnittet bak en utfellbar del, lukket til eleven trykker — FR-15 og
 * FR-16 (endret 11.11). Telefontesten 9.11 fant at åpne kildeavsnitt gjorde
 * quizresultatet og øvekortene tunge å lese. Felles for quizen og øvekortene,
 * så de ser og virker likt.
 */
export function Kildeavsnitt({
  tekstId,
  nummer,
  innhold,
}: {
  tekstId: string;
  nummer: number;
  innhold: string;
}) {
  return (
    <details>
      <summary className="cursor-pointer text-sm font-bold underline underline-offset-4">
        Se hvor det står i teksten
      </summary>
      <div className="mt-2 rounded-md bg-slate-50 p-4 dark:bg-slate-900">
        <blockquote className="border-l-4 border-slate-300 pl-4 text-slate-700 dark:border-slate-600 dark:text-slate-300">
          {innhold}
        </blockquote>
        <Link
          href={`/tekst/${tekstId}/lesing#avsnitt-${nummer}`}
          className="mt-2 inline-block text-sm underline underline-offset-4"
        >
          Les avsnittet i teksten
        </Link>
      </div>
    </details>
  );
}
