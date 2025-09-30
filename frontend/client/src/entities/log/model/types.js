/**
 * @typedef {Object} LogEntry
 * @property {string} id
 * @property {string} timestamp
 * @property {"info"|"warning"|"error"} level
 * @property {string} source
 * @property {string} message
 * @property {string=} meta
 */

export const LOG_LEVELS = ["info", "warning", "error"];
