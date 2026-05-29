/**
 * Build-time constants injected by esbuild's `define` option.
 *
 * `DEBUG_MODE` is replaced at build time with the literal `true` or `false`
 * based on the `DEBUG_MODE` env var (e.g. `DEBUG_MODE=true npm run dev`).
 * In production builds it is always `false`, so guarded blocks are dead-code
 * eliminated by esbuild.
 */
declare const DEBUG_MODE: boolean;
