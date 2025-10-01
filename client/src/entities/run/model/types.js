/**
 * @typedef {Object} RunSession
 * @property {string} id
 * @property {string} title
 * @property {"plan"|"apply"} type
 * @property {"success"|"running"|"failed"} status
 * @property {string} environment
 * @property {string} startedAt ISO timestamp
 * @property {number} durationMinutes
 * @property {string} owner
 * @property {{ add: number, change: number, destroy: number }} changes
 */

/**
 * @typedef {Object} RunTimelineItem
 * @property {string} id
 * @property {string} label
 * @property {"done"|"in-progress"|"failed"} status
 * @property {number} durationMinutes
 * @property {string} details
 */
