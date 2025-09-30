/**
 * @typedef {Object} SystemMetric
 * @property {string} label
 * @property {string} value
 * @property {{ value: string, trend: "up"|"down"|"steady"}=} delta
 * @property {"positive"|"warning"|"critical"=} tone
 */

/**
 * @typedef {Object} HealthSignal
 * @property {string} id
 * @property {string} title
 * @property {"ok"|"attention"|"critical"} status
 * @property {string} description
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} SummaryInsight
 * @property {string} id
 * @property {string} title
 * @property {string} detail
 * @property {"high"|"medium"|"low"} impact
 */

export const SYSTEM_TRENDS = ["up", "down", "steady"];
export const SYSTEM_TONES = ["positive", "warning", "critical"];
export const SYSTEM_STATUSES = ["ok", "attention", "critical"];
export const SUMMARY_IMPACTS = ["high", "medium", "low"];
