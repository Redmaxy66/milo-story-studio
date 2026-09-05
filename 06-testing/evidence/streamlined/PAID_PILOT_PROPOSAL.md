# Bounded paid pilot — approval requested, not granted

Purpose: resolve the failed provider binding with one actual request, then produce enough usable motion for a short reviewed cut and a two-minute hybrid episode. Do not fund an entire week's production before quality and costs are known.

Proposed ceiling: **750 existing OpenArt credits, at most three ten-second clips, plus US$5 total for writing/narration if needed**. No top-up, subscription, public upload or automatic retries. These are proposed authorisation ceilings, not a verified quote. The handoff's last staged video estimate was 250 credits/clip; current schema and quote must be verified before submission. If a current quote exceeds the per-clip or total ceiling, or the charge cannot be bounded, stop before submission. Do not assume the last reported 3,343-credit balance is current.

Sequence:
1. Read-only provider discovery/account checks, exact candidate payload review and corrected nested params binding in a separate pilot workflow. Use existing approved Milo/reference assets under D-018–D-023 restrictions. Do not reinterpret `submit-failed` as a history ID.
2. Reserve one request durably, submit at most one ten-second clip at a time, record the actual history ID, poll that job and reconcile actual cost. An unknown outcome blocks new submissions. Retrieve, hash and review the output before another attempt.
3. Only use remaining attempts for useful distinct motion or an explicitly recorded rejected take within the same ceiling. Maximum three submissions total, including charged failures.
4. Use approved reusable stills/backgrounds, those clips and the approved voice to finish a 30-second quality cut and, if adequate, one 120-second hybrid episode. Review Milo identity, reference fidelity, continuity, voice, pacing, audio, and measured duration. Real 120-second narration may require the separately capped voice spend.
5. Report actual credits/cash, usable seconds, operator effort and remaining production risks. Unused budget is not permission to generate unrelated material.

This pilot cannot prove a full five-day delivery cadence. A subsequent week validation must produce five distinct real 120-second stories and one approximately 600-second compilation and measure cost/effort. Only then request final cutover. Publication remains separately approved.

Implementation work after budget approval includes wiring the verified provider/voice adapters and durable reservation/retrieval path; current build workflows intentionally contain no callable paid nodes. Persistent authenticated rendering hosting remains a before-cutover dependency.
