const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const RUN_SESSIONS = [
  {
    id: "run-042",
    title: "Apply · daysi-prod-eu",
    status: "success",
    type: "apply",
    environment: "prod-eu",
    startedAt: "2025-09-29T20:40:00Z",
    durationMinutes: 14,
    owner: "Иван К.",
    changes: { add: 2, change: 1, destroy: 0 }
  },
  {
    id: "run-043",
    title: "Plan · daysi-staging-eu",
    status: "running",
    type: "plan",
    environment: "staging-eu",
    startedAt: "2025-09-30T06:05:00Z",
    durationMinutes: 9,
    owner: "Анна Р.",
    changes: { add: 0, change: 3, destroy: 0 }
  },
  {
    id: "run-041",
    title: "Apply · daysi-prod-us",
    status: "failed",
    type: "apply",
    environment: "prod-us",
    startedAt: "2025-09-28T17:10:00Z",
    durationMinutes: 21,
    owner: "Мария С.",
    changes: { add: 1, change: 4, destroy: 2 }
  }
];

export const getRunSessions = async () => {
  await delay();
  return RUN_SESSIONS;
};

export const getRunSessionById = async (runId) => {
  await delay(200);
  return RUN_SESSIONS.find((run) => run.id === runId) ?? null;
};
