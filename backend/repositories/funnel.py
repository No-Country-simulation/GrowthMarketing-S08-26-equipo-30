from copy import deepcopy


class InMemoryFunnelRepository:
    def __init__(self) -> None:
        self._events: list[dict] = []

    def reset(self) -> None:
        self._events.clear()

    def list_events(self) -> list[dict]:
        return deepcopy(self._events)

    def create_many(self, events: list[dict]) -> list[dict]:
        self._events.extend(deepcopy(events))
        return deepcopy(self._events)
