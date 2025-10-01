from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta

import requests


API_URL = "http://localhost:8000/v1/log-summary"


def build_sample_payload() -> dict:
    now = datetime.now(UTC)
    def iso_z(dt: datetime) -> str:
        return dt.isoformat().replace("+00:00", "Z")
    return {
        "launch_context": {
            "phase": "plan",
            "cli_args": ["terraform", "plan", "-out=plan.tfplan"],
            "terraform_version": "1.8.5",
            "go_version": "1.22.3",
        },
        "environment": {
            "terraformrc_path": "~/.terraformrc",
            "mirror_mode": "network_mirror",
            "workspace": "production",
            "cwd": "/srv/iac/terraform",
        },
        "providers": {
            "providers_cache": ["hashicorp/aws@5.53.0", "hashicorp/random@3.6.0"],
            "provider_selected_version": "hashicorp/aws@5.53.0",
            "provider_binary_path": "/home/terraform/.terraform/providers/aws_v5.53.0",
            "provider_pid": 4312,
            "mtls_enabled": False,
        },
        "dependency": {
            "dependency_selection": "hashicorp/aws@>=5.50.0 satisfied by 5.53.0",
        },
        "backend": {
            "backend_type": "local",
            "state_lock_events": {
                "count": 1,
                "timestamps": [iso_z(now)],
            },
            "state_lineage": "76a1d41b-5ef1-4d11-830c-02a064ccff7d",
            "state_serial": 58,
            "state_backup_present": True,
        },
        "inventory": {
            "resource_types": ["aws_s3_bucket", "aws_iam_role"],
            "data_sources": ["aws_caller_identity"],
            "resource_type_freq": {"aws_s3_bucket": 12, "aws_iam_role": 4},
        },
        "operations": {
            "plan_start_ts": iso_z(now - timedelta(minutes=5)),
            "plan_end_ts": iso_z(now - timedelta(minutes=4, seconds=20)),
            "plan_duration_ms": 40000,
            "apply_start_ts": iso_z(now - timedelta(minutes=2)),
            "apply_end_ts": iso_z(now - timedelta(minutes=1, seconds=10)),
            "apply_duration_ms": 50000,
            "step_latency_p50_ms": 1200,
            "step_latency_p95_ms": 3800,
        },
        "rpc_activity": {
            "rpc_calls_by_method": {"PlanResourceChange": 24, "ReadResource": 12},
            "rpc_latency_p50_ms": 180,
            "rpc_latency_p95_ms": 720,
            "tf_req_id_presence": 0.92,
        },
        "diagnostics": {
            "trace_count": 156,
            "debug_count": 87,
            "info_count": 312,
            "warn_count": 6,
            "error_count": 1,
            "top_warn_messages": ["S3 bucket already exists, skipping create"],
            "top_error_messages": ["IAM role policy attachment failed: throttling"],
        },
        "plugin_events": {
            "plugin_started_count": 3,
            "waiting_for_rpc_address_count": 0,
            "plugin_protocol_version": "6.0",
            "plugin_restarts_count": 1,
            "plugin_failures": ["aws provider crashed once while fetching schema"],
        },
        "environment_checks": {
            "plugin_dirs_present": True,
            "provisioners_checked": True,
            "non_existing_dir_ignores_count": 0,
            "env_warnings": ["TF_LOG variable unset, using default INFO"],
        },
        "temporal_activity": {
            "runs_by_hour": [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0],
            "runs_by_day": [0, 1, 0, 0, 1, 0, 0],
            "avg_interval_between_runs_min": 720,
        },
        "quality_signals": {
            "provider_version_drift": "AWS provider 5.53.0 vs team standard 5.52.1",
            "long_state_locks": "Lock held 65s by ci-runner-42",
            "warn_error_spikes": "Warn spike at 21:00 UTC, correlated with throttling",
        },
    }


def main() -> None:
    payload = build_sample_payload()
    response = requests.post(API_URL, json=payload, timeout=10)
    response.raise_for_status()
    data = response.json()
    print("Summary:\n")
    print(data["summary"])
    if "prompt_messages" in data:
        print("\nPrompt messages:\n")
        print(json.dumps(data["prompt_messages"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
