const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const INCIDENTS = [
  {
    id: "inc-501",
    title: "Утечка латентности в daysi-prod-eu",
    severity: "high",
    status: "investigating",
    rule: "latency_p95_gt_400",
    startedAt: "2025-09-30T05:25:00Z",
    acknowledgedBy: "Смена #7",
    tags: ["api", "prod", "latency"]
  },
  {
    id: "inc-502",
    title: "Провальный Terraform apply в prod-us",
    severity: "medium",
    status: "open",
    rule: "terraform_apply_failures",
    startedAt: "2025-09-28T17:32:00Z",
    acknowledgedBy: null,
    tags: ["terraform", "iam"]
  },
  {
    id: "inc-503",
    title: "Увеличение ошибок 5xx в staging-eu",
    severity: "low",
    status: "suppressed",
    rule: "http_5xx_rate",
    startedAt: "2025-09-29T14:10:00Z",
    acknowledgedBy: "Auto-suppress",
    tags: ["staging", "http"]
  }
];

export const getIncidents = async () => {
  await delay();
  return INCIDENTS;
};
