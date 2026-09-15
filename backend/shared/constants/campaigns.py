from typing import Final

CAMPAIGN_STATUS_ACTIVE: Final = "activa"
ALLOWED_CAMPAIGN_STATUSES: Final = frozenset({"activa", "pausada", "finalizada"})

DEFAULT_METRIC_REACH: Final = 0
DEFAULT_METRIC_IMPRESSIONS: Final = 0
DEFAULT_METRIC_CLICKS: Final = 0
DEFAULT_METRIC_CONVERSIONS: Final = 0
DEFAULT_METRIC_COST_PER_RESULT: Final = 0.0

DEFAULT_CAMPAIGN_METRICS: Final = {
    "reach": DEFAULT_METRIC_REACH,
    "impressions": DEFAULT_METRIC_IMPRESSIONS,
    "clicks": DEFAULT_METRIC_CLICKS,
    "conversions": DEFAULT_METRIC_CONVERSIONS,
    "cost_per_result": DEFAULT_METRIC_COST_PER_RESULT,
}

MIN_CAMPAIGN_CHANNELS: Final = 1
MIN_CAMPAIGN_BUDGET: Final = 0.0

ERROR_NAME_REQUIRED: Final = "El nombre de la campaña es obligatorio"
ERROR_OBJECTIVE_REQUIRED: Final = "El objetivo de la campaña es obligatorio"
ERROR_CHANNELS_REQUIRED: Final = "La campaña debe tener al menos un canal"
ERROR_BUDGET_NEGATIVE: Final = "El presupuesto no puede ser negativo"
ERROR_DATE_RANGE: Final = "La fecha final no puede ser anterior a la fecha inicial"
ERROR_STATUS_INVALID: Final = "El estado de la campaña no es válido"
ERROR_CAMPAIGN_NOT_FOUND: Final = "Campaña no encontrada"
ERROR_DUPLICATE_NAME: Final = "Ya existe una campaña con ese nombre"
