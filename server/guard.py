import re

from models import PromptGuardResult


INJECTION_PATTERNS: list[tuple[str, str]] = [
    (r"ignore\s+(all\s+)?previous\s+instructions", "attempts to override system instructions"),
    (r"classify\s+this\s+threat\s+as\s+safe", "tries to force a benign classification"),
    (r"reveal\s+(the\s+)?system\s+prompt", "requests hidden prompt disclosure"),
    (r"disable\s+(the\s+)?(guard|safety|security)", "tries to disable safety controls"),
    (r"you\s+are\s+now\s+", "attempts role reassignment"),
]


def inspect_prompt(raw_log: str) -> PromptGuardResult:
    reasons: list[str] = []
    sanitized_log = raw_log

    for pattern, reason in INJECTION_PATTERNS:
        if re.search(pattern, raw_log, flags=re.IGNORECASE):
            reasons.append(reason)
            sanitized_log = re.sub(pattern, "[REDACTED_PROMPT_INJECTION]", sanitized_log, flags=re.IGNORECASE)

    if reasons:
        return PromptGuardResult(
            safe=False,
            classification="INJECTION_ATTEMPT",
            score=min(100, 80 + len(reasons) * 5),
            reasons=reasons,
            sanitized_log=sanitized_log,
        )

    return PromptGuardResult(
        safe=True,
        classification="SAFE",
        score=98,
        reasons=[],
        sanitized_log=sanitized_log,
    )
