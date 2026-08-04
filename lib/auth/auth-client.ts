import { createAuthClient } from 'better-auth/react'; // make sure to import from better-auth/react
import { usernameClient } from 'better-auth/client/plugins';

/**
 * Client `better-auth` utilisé côté navigateur (hooks React, appels
 * authentifiés depuis les composants clients).
 */
export const authClient = createAuthClient({
  plugins: [usernameClient()],
});
