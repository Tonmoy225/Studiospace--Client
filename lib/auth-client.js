import { createAuthClient } from "better-auth/react";

// no baseURL needed: auth runs on the same origin (/api/auth/*)
export const authClient = createAuthClient();
