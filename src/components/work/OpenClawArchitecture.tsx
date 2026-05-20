// Inline architecture diagram for the OpenClaw case study.
// CSS-driven flow chart — DOM nodes for crisp typography, CSS lines for
// connectors. Stays responsive without per-element SVG coordinates.

export default function OpenClawArchitecture() {
  return (
    <div className="openclaw-arch" role="img" aria-label="OpenClaw architecture: User talks to the OpenClaw gateway, which reads JSON files written by a Python pipeline that connects to IB Gateway and IBKR. A side branch shows the WhatsApp sender skill.">
      <div className="arch-node arch-node-user">
        <div className="arch-label">Surface</div>
        <div className="arch-title">User</div>
        <div className="arch-sub">WhatsApp · Portal · CLI</div>
      </div>

      <div className="arch-line" aria-hidden />

      <div className="arch-node arch-node-primary">
        <div className="arch-label">Reasoning</div>
        <div className="arch-title">OpenClaw Gateway</div>
        <div className="arch-sub">Hetzner VPS · Skills · Channels</div>
      </div>

      <div className="arch-line arch-line-branch" aria-hidden>
        <span className="arch-branch-label">JSON contract</span>
      </div>

      <div className="arch-node">
        <div className="arch-label">Interface</div>
        <div className="arch-title">Shared Data Layer</div>
        <div className="arch-sub">
          <code>latest_portfolio_context.json</code>
          <br />
          <code>openclaw_review_input.json</code>
        </div>
      </div>

      <div className="arch-line" aria-hidden />

      <div className="arch-node">
        <div className="arch-label">Deterministic</div>
        <div className="arch-title">Python Pipeline</div>
        <div className="arch-sub">
          <code>snapshot.py</code> · <code>enrich_prices.py</code> · <code>build_portfolio_context.py</code>
        </div>
      </div>

      <div className="arch-line" aria-hidden />

      <div className="arch-node">
        <div className="arch-label">Auth boundary</div>
        <div className="arch-title">IB Gateway</div>
        <div className="arch-sub">Headless · <code>127.0.0.1:4001</code></div>
      </div>

      <div className="arch-line" aria-hidden />

      <div className="arch-node arch-node-source">
        <div className="arch-label">Source</div>
        <div className="arch-title">IBKR</div>
        <div className="arch-sub">Read-only · positions · market data</div>
      </div>
    </div>
  )
}
