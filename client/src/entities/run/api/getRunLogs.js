const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const RUN_LOGS = {
  "run-042": [
    "terraform init",
    "Initializing the backend...",
    "Successfully configured the backend!",
    "terraform apply -auto-approve",
    "Apply complete! Resources: 2 added, 1 changed, 0 destroyed."
  ],
  "run-043": [
    "terraform plan",
    "Refreshing state...",
    "Plan: 0 to add, 3 to change, 0 to destroy.",
    "Awaiting approval to continue..."
  ],
  "run-041": [
    "terraform init",
    "terraform plan -out=tfplan",
    "Plan: 1 to add, 4 to change, 2 to destroy.",
    "terraform apply tfplan",
    "Error: AccessDenied updating sg-0421" 
  ]
};

export const getRunLogs = async (runId) => {
  await delay();
  return RUN_LOGS[runId] ?? [];
};
