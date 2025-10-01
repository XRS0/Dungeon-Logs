from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class PlanPhase(str, Enum):
    PLAN = "plan"
    APPLY = "apply"


class MirrorMode(str, Enum):
    NETWORK_MIRROR = "network_mirror"
    DIRECT = "direct"


class LaunchContext(BaseModel):
    phase: PlanPhase
    cli_args: List[str] = Field(default_factory=list)
    terraform_version: str
    go_version: str


class EnvironmentConfig(BaseModel):
    terraformrc_path: Optional[str]
    mirror_mode: MirrorMode
    workspace: Optional[str]
    cwd: str


class ProvidersInfo(BaseModel):
    providers_cache: List[str] = Field(default_factory=list)
    provider_selected_version: Optional[str]
    provider_binary_path: Optional[str]
    provider_pid: Optional[int]
    mtls_enabled: bool = False


class DependencySelection(BaseModel):
    dependency_selection: Optional[str]


class StateLockEvents(BaseModel):
    count: int = 0
    timestamps: List[str] = Field(default_factory=list)


class BackendState(BaseModel):
    backend_type: str = "local"
    state_lock_events: StateLockEvents = Field(default_factory=StateLockEvents)
    state_lineage: Optional[str]
    state_serial: Optional[int]
    state_backup_present: bool = False


class Inventory(BaseModel):
    resource_types: List[str] = Field(default_factory=list)
    data_sources: List[str] = Field(default_factory=list)
    resource_type_freq: Dict[str, int] = Field(default_factory=dict)


class OperationTiming(BaseModel):
    plan_start_ts: Optional[datetime]
    plan_end_ts: Optional[datetime]
    plan_duration_ms: Optional[int]
    apply_start_ts: Optional[datetime]
    apply_end_ts: Optional[datetime]
    apply_duration_ms: Optional[int]
    step_latency_p50_ms: Optional[float]
    step_latency_p95_ms: Optional[float]


class RpcActivity(BaseModel):
    rpc_calls_by_method: Dict[str, int] = Field(default_factory=dict)
    rpc_latency_p50_ms: Optional[float]
    rpc_latency_p95_ms: Optional[float]
    tf_req_id_presence: Optional[float]


class Diagnostics(BaseModel):
    trace_count: int = 0
    debug_count: int = 0
    info_count: int = 0
    warn_count: int = 0
    error_count: int = 0
    top_warn_messages: List[str] = Field(default_factory=list)
    top_error_messages: List[str] = Field(default_factory=list)


class PluginEvents(BaseModel):
    plugin_started_count: int = 0
    waiting_for_rpc_address_count: int = 0
    plugin_protocol_version: Optional[str]
    plugin_restarts_count: int = 0
    plugin_failures: List[str] = Field(default_factory=list)


class EnvironmentChecks(BaseModel):
    plugin_dirs_present: bool = True
    provisioners_checked: bool = False
    non_existing_dir_ignores_count: int = 0
    env_warnings: List[str] = Field(default_factory=list)


class TemporalActivity(BaseModel):
    runs_by_hour: List[int] = Field(default_factory=list)
    runs_by_day: List[int] = Field(default_factory=list)
    avg_interval_between_runs_min: Optional[float]


class QualitySignals(BaseModel):
    provider_version_drift: Optional[str]
    long_state_locks: Optional[str]
    warn_error_spikes: Optional[str]


class LogSummaryRequest(BaseModel):
    launch_context: LaunchContext
    environment: EnvironmentConfig
    providers: ProvidersInfo
    dependency: DependencySelection
    backend: BackendState
    inventory: Inventory
    operations: OperationTiming
    rpc_activity: RpcActivity
    diagnostics: Diagnostics
    plugin_events: PluginEvents
    environment_checks: EnvironmentChecks
    temporal_activity: TemporalActivity
    quality_signals: QualitySignals

    def as_prompt_sections(self) -> Dict[str, Dict[str, object]]:
        return {
            "Контекст запуска": self.launch_context.model_dump(exclude_none=True),
            "Среда и CLI": self.environment.model_dump(exclude_none=True),
            "Провайдеры": self.providers.model_dump(exclude_none=True),
            "Выбор зависимостей": self.dependency.model_dump(exclude_none=True),
            "Backend и State": self.backend.model_dump(exclude_none=True),
            "Инвентарь": self.inventory.model_dump(exclude_none=True),
            "Ход операций и тайминг": self.operations.model_dump(exclude_none=True),
            "RPC активность": self.rpc_activity.model_dump(exclude_none=True),
            "Диагностика": self.diagnostics.model_dump(exclude_none=True),
            "События плагинов": self.plugin_events.model_dump(exclude_none=True),
            "Проверки окружения": self.environment_checks.model_dump(exclude_none=True),
            "Временная активность": self.temporal_activity.model_dump(exclude_none=True),
            "Сигналы качества": self.quality_signals.model_dump(exclude_none=True),
        }
