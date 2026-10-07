import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Promptfilene leses fra disk under kjøring (AD-3, AD-14), men de blir ikke
   * oppdaget av bundleren fordi ingen importerer dem — de leses med en
   * filsti som bygges opp under kjøring.
   *
   * Uten denne konfigurasjonen virker det lokalt og feiler i drift, med en
   * feilmelding om at fila ikke finnes. Det er nøyaktig den klassen feil
   * arkitekturspinen kaller stille, og den er verdt å kjenne: Next.js har
   * ingen måte å gjette at `prompts/` trengs.
   */
  outputFileTracingIncludes: {
    "/api/**": ["./prompts/**/*"],
    "/**": ["./prompts/**/*"],
  },
};

export default nextConfig;
