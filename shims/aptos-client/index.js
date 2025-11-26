/**
 * Shim for @aptos-labs/aptos-client that re-exports the browser implementation.
 * This forces the browser build (which uses fetch) instead of the Node.js build (which uses got).
 *
 * The browser build doesn't require Node.js-specific dependencies like @szmarczak/http-timer,
 * making it compatible with bare runtime.
 *
 * Note: Using relative path because bare-pack doesn't walk up node_modules tree.
 * Path is relative from node_modules/@aptos-labs/aptos-client/ to node_modules/aptos-client-upstream/
 */
export * from '../../aptos-client-upstream/dist/browser/index.browser.mjs'
export { default } from '../../aptos-client-upstream/dist/browser/index.browser.mjs'
