/**
 * Better Auths klient, brukt av skjemaene for konto.
 *
 * Skjemaene går via HTTP-rutene og ikke via server actions, fordi det er der
 * begrensningen av innloggingsforsøk ligger. Se data/auth.ts.
 */

import { createAuthClient } from "better-auth/react";

export const authKlient = createAuthClient();
