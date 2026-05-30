import asyncio
import uuid

from models import ActionExecution, IOC, ThreatInput, utc_now


async def simulate_firewall_block(threat: ThreatInput, iocs: list[IOC]) -> ActionExecution:
    started_at = utc_now()
    ip = next((ioc.value for ioc in iocs if ioc.kind == "ip"), threat.source)
    action = ActionExecution(
        id=str(uuid.uuid4()),
        action_type="FIREWALL_BLOCK",
        destination="https://firewall.internal.example/v1/rules/block",
        payload={"source_ip": ip, "incident_id": threat.id, "ttl_seconds": 3600, "reason": threat.title},
        status="EXECUTING",
        started_at=started_at,
    )
    await asyncio.sleep(0.08)
    action.status = "SUCCESS"
    action.completed_at = utc_now()
    action.diagnostics = {"http_status": 202, "rule_id": f"fw-{threat.id.lower()}", "simulated": True}
    return action


async def simulate_supabase_session_revoke(threat: ThreatInput) -> ActionExecution:
    action = ActionExecution(
        id=str(uuid.uuid4()),
        action_type="SUPABASE_SESSION_REVOKE",
        destination="https://supabase.example/auth/v1/admin/users/{user_id}/factors",
        payload={"incident_id": threat.id, "target": threat.target, "operation": "revoke_active_sessions"},
        status="EXECUTING",
        started_at=utc_now(),
    )
    await asyncio.sleep(0.08)
    action.status = "SUCCESS"
    action.completed_at = utc_now()
    action.diagnostics = {"http_status": 200, "revoked_sessions": 3, "simulated": True}
    return action


async def simulate_key_rotation(threat: ThreatInput) -> ActionExecution:
    action = ActionExecution(
        id=str(uuid.uuid4()),
        action_type="KEY_ROTATION",
        destination="https://vault.internal.example/v1/keys/rotate",
        payload={"incident_id": threat.id, "resource": threat.target, "rotation_scope": "access_tokens"},
        status="EXECUTING",
        started_at=utc_now(),
    )
    await asyncio.sleep(0.08)
    action.status = "SUCCESS"
    action.completed_at = utc_now()
    action.diagnostics = {"http_status": 202, "rotation_job": f"rot-{threat.id.lower()}", "simulated": True}
    return action


async def execute_containment(threat: ThreatInput, iocs: list[IOC], include_identity: bool) -> list[ActionExecution]:
    actions = [simulate_firewall_block(threat, iocs)]
    if include_identity:
        actions.extend([simulate_supabase_session_revoke(threat), simulate_key_rotation(threat)])
    return await asyncio.gather(*actions)
