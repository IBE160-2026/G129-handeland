/**
 * Navnet på headeren invitasjonskoden sendes i.
 *
 * Egen fil fordi registreringsskjemaet kjører i nettleseren og ikke kan
 * importere data/auth.ts, som drar med seg databasen og node:crypto.
 */
export const INVITASJONSKODE_HEADER = "x-lesevenn-invitasjonskode";
