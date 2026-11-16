import freeGlobal from './freeGlobal'

/** Detect free variable `exports`. */
const freeExports
  = typeof exports === 'object'
  && exports !== null
  // eslint-disable-next-line datadayrepos/no-cjs-exports -- This reads a legacy CommonJS shim; it does not export from this ESM module.
  && !exports.nodeType
  && exports

/** Detect free variable `module`. */
const freeModule
  = freeExports
  && typeof module === 'object'
  && module !== null
  // @ts-expect-error -- Legacy CommonJS shims can expose a DOM-like nodeType property.
  && !module.nodeType
  && module

/** Detect the popular CommonJS extension `module.exports`. */
const moduleExports = freeModule && freeModule.exports === freeExports

/** Detect free variable `process` from Node.js. */
const freeProcess = moduleExports && (freeGlobal as typeof globalThis).process

/** Used to access faster Node.js helpers. */
const nodeTypes = (() => {
  try {
    /* Detect public `util.types` helpers for Node.js v10+. */
    /* Node.js deprecation code: DEP0103. */
    const typesHelper
      = freeModule && freeModule.require && freeModule.require('util').types
    return typesHelper || (freeProcess && freeProcess.binding && freeProcess.binding('util'))
  }
  catch (e) {}
})()

export default nodeTypes
