from typing import Final

FUNNEL_STAGE_VISITA: Final = "visita"
FUNNEL_STAGE_REGISTRO: Final = "registro"
FUNNEL_STAGE_ACTIVACION: Final = "activacion"
FUNNEL_STAGE_INTERACCION: Final = "interaccion"
FUNNEL_STAGE_CONVERSION: Final = "conversion"
FUNNEL_STAGE_RETENCION: Final = "retencion"

FUNNEL_STAGES: Final = (
    (FUNNEL_STAGE_VISITA, "Visita"),
    (FUNNEL_STAGE_REGISTRO, "Registro"),
    (FUNNEL_STAGE_ACTIVACION, "Activación"),
    (FUNNEL_STAGE_INTERACCION, "Interacción"),
    (FUNNEL_STAGE_CONVERSION, "Conversión"),
    (FUNNEL_STAGE_RETENCION, "Retención"),
)

FUNNEL_STAGE_KEYS: Final = tuple(key for key, _ in FUNNEL_STAGES)
FUNNEL_STAGE_LABELS: Final = {key: label for key, label in FUNNEL_STAGES}

ERROR_INVALID_STAGE: Final = "La etapa del funnel no es válida"
ERROR_FUNNEL_DATA_NOT_FOUND: Final = "No se encontraron datos del funnel"
