import math
import re
from collections import Counter

from models import RagCitation


PLAYBOOKS: list[dict[str, str]] = [
    {
        "source": "NIST SP 800-61 r2: Computer Security Incident Handling Guide",
        "text": (
            "Incident response should follow preparation, detection and analysis, containment, "
            "eradication, recovery, and post-incident activity. Containment strategies should "
            "prioritize business impact, evidence preservation, and attacker movement control."
        ),
    },
    {
        "source": "MITRE ATT&CK T1110 Brute Force",
        "text": (
            "Credential stuffing and password spraying map to brute force behavior. Defensive "
            "actions include adaptive MFA, account lockout tuning, token revocation, and "
            "blocking suspicious authentication sources."
        ),
    },
    {
        "source": "MITRE ATT&CK T1078 Valid Accounts",
        "text": (
            "Adversaries may use valid accounts to maintain access and evade detection. "
            "Responders should revoke active sessions, rotate credentials, investigate "
            "privilege changes, and audit identity provider logs."
        ),
    },
    {
        "source": "MITRE ATT&CK T1190 Exploit Public-Facing Application",
        "text": (
            "Public-facing application exploitation often requires WAF policy updates, "
            "input validation review, vulnerable endpoint isolation, and emergency patching."
        ),
    },
    {
        "source": "MITRE ATT&CK T1611 Escape to Host",
        "text": (
            "Container escape attempts require workload isolation, removal of privileged mounts, "
            "node rebuilds, admission control enforcement, and review of runtime security alerts."
        ),
    },
]


def _tokens(text: str) -> Counter[str]:
    return Counter(re.findall(r"[a-z0-9]+", text.lower()))


def _cosine(left: Counter[str], right: Counter[str]) -> float:
    numerator = sum(left[token] * right[token] for token in left.keys() & right.keys())
    left_norm = math.sqrt(sum(value * value for value in left.values()))
    right_norm = math.sqrt(sum(value * value for value in right.values()))
    if left_norm == 0 or right_norm == 0:
        return 0.0
    return numerator / (left_norm * right_norm)


def retrieve_context(query: str, limit: int = 3) -> list[RagCitation]:
    query_vector = _tokens(query)
    ranked: list[RagCitation] = []

    for playbook in PLAYBOOKS:
        score = _cosine(query_vector, _tokens(playbook["text"]))
        ranked.append(
            RagCitation(
                source=playbook["source"],
                score=round(score, 4),
                excerpt=playbook["text"][:240],
            )
        )

    ranked.sort(key=lambda item: item.score, reverse=True)
    return ranked[:limit]
