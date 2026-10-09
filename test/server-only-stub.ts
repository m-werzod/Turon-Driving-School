/**
 * No-op stand-in for the `server-only` package under Vitest.
 *
 * The real package throws when resolved through the client condition, which
 * is exactly what we want in the app build — it keeps server modules out of
 * client bundles. Vitest resolves that same client condition, so server
 * modules would be untestable without this alias. The guard still applies
 * to every real build; only the test runner sees this file.
 */
export {};
