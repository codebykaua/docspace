// Runtime env placeholder for modular services.
// No ambiente Cloudflare Worker real, as bindings vêm de env no fetch handler.
// Este módulo existe para o código em src/services não quebrar na importação.

export const env = globalThis.DOCSPACE_ENV || {};
