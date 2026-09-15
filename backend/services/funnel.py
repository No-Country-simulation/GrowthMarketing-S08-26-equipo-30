from backend.repositories.contracts import FunnelRepository
from backend.shared.constants.funnel import FUNNEL_STAGES


class FunnelService:
    def __init__(self, repository: FunnelRepository) -> None:
        self.repository = repository

    def get_summary(self) -> dict:
        events = self.repository.list_events()
        users_by_stage = self._count_users_by_stage(events)
        stages = self._build_stages(users_by_stage)
        return {
            "stages": stages,
            "leak_point": self._find_leak_point(stages),
            "total_users": len({event["user_id"] for event in events}),
        }

    def _count_users_by_stage(self, events: list[dict]) -> dict[str, int]:
        unique_users: dict[str, set[str]] = {key: set() for key, _ in FUNNEL_STAGES}
        for event in events:
            unique_users[event["stage"]].add(event["user_id"])
        return {key: len(users) for key, users in unique_users.items()}

    def _build_stages(self, users_by_stage: dict[str, int]) -> list[dict]:
        keys = [key for key, _ in FUNNEL_STAGES]
        stages: list[dict] = []
        for index, (key, label) in enumerate(FUNNEL_STAGES):
            users = users_by_stage[key]
            next_stage_users = (
                users_by_stage[keys[index + 1]] if index + 1 < len(keys) else 0
            )
            stages.append(
                {
                    "key": key,
                    "label": label,
                    "users": users,
                    "next_stage_users": next_stage_users,
                    "conversion_rate": self._rate(next_stage_users, users),
                }
            )
        return stages

    def _find_leak_point(self, stages: list[dict]) -> dict | None:
        leak_point: dict | None = None
        for current, following in zip(stages, stages[1:]):
            dropoff_users = current["users"] - following["users"]
            if dropoff_users <= 0:
                continue
            candidate = {
                "from_stage": current["key"],
                "to_stage": following["key"],
                "dropoff_users": dropoff_users,
                "dropoff_rate": self._rate(dropoff_users, current["users"]),
            }
            if leak_point is None or dropoff_users > leak_point["dropoff_users"]:
                leak_point = candidate
        return leak_point

    @staticmethod
    def _rate(part: int, total: int) -> float:
        if total <= 0:
            return 0.0
        return round(part / total, 4)
