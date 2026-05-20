// Daily OpenAI spend during the runaway period in April 2026.
// Real data — pulled from the OpenAI cost export.
// The ramp + the peak + the cut tells the story without needing a paragraph.

interface DayCost {
  day: string
  cost: number
  note?: string
}

const DAYS: DayCost[] = [
  { day: 'Apr 1',  cost: 0.16,  note: 'first tests' },
  { day: 'Apr 2',  cost: 0     },
  { day: 'Apr 3',  cost: 0.65 },
  { day: 'Apr 4',  cost: 1.54 },
  { day: 'Apr 5',  cost: 1.12 },
  { day: 'Apr 6',  cost: 5.39,  note: 'cron live' },
  { day: 'Apr 7',  cost: 13.75 },
  { day: 'Apr 8',  cost: 18.88, note: 'peak' },
  { day: 'Apr 9',  cost: 14.69 },
  { day: 'Apr 10', cost: 11.89 },
  { day: 'Apr 11', cost: 12.20 },
  { day: 'Apr 12', cost: 16.01 },
  { day: 'Apr 13', cost: 13.76 },
  { day: 'Apr 14', cost: 8.47,  note: 'jobs paused →' },
]

const PEAK = Math.max(...DAYS.map(d => d.cost))
const TOTAL = DAYS.reduce((acc, d) => acc + d.cost, 0)
const SCALE = 20   // Y-axis maxes at $20 — gives the peak ~94% bar height

export default function CostChart() {
  return (
    <div className="cost-chart" role="img" aria-label={`Daily OpenAI spend bar chart. Peak $${PEAK.toFixed(2)} on Apr 8, total $${TOTAL.toFixed(2)} over 14 days, jobs disabled on Apr 15.`}>
      <div className="cost-chart-header">
        <div className="cost-chart-stat">
          <div className="cost-chart-stat-label">Peak</div>
          <div className="cost-chart-stat-value">${PEAK.toFixed(2)}<span className="cost-chart-stat-unit">/day</span></div>
        </div>
        <div className="cost-chart-stat">
          <div className="cost-chart-stat-label">14-day total</div>
          <div className="cost-chart-stat-value">${TOTAL.toFixed(2)}</div>
        </div>
        <div className="cost-chart-stat">
          <div className="cost-chart-stat-label">Implied month</div>
          <div className="cost-chart-stat-value">~${Math.round((TOTAL / 14) * 30)}</div>
        </div>
        <div className="cost-chart-stat">
          <div className="cost-chart-stat-label">After Apr 14</div>
          <div className="cost-chart-stat-value" style={{ color: 'var(--green)' }}>$0</div>
        </div>
      </div>

      <div className="cost-chart-plot">
        {/* Y-axis grid lines */}
        <div className="cost-chart-grid">
          {[20, 15, 10, 5, 0].map(v => (
            <div key={v} className="cost-chart-grid-line">
              <span className="cost-chart-grid-label">${v}</span>
            </div>
          ))}
        </div>

        <div className="cost-chart-bars">
          {DAYS.map((d, i) => {
            const heightPct = (d.cost / SCALE) * 100
            const isPeak = d.cost === PEAK
            return (
              <div key={i} className="cost-chart-col">
                <div className="cost-chart-bar-track">
                  <div
                    className={`cost-chart-bar ${isPeak ? 'is-peak' : ''}`}
                    style={{ height: `${heightPct}%` }}
                    title={`${d.day}: $${d.cost.toFixed(2)}`}
                  >
                    {d.cost > 0 && (
                      <span className="cost-chart-bar-value">
                        ${d.cost.toFixed(d.cost < 1 ? 2 : 0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="cost-chart-col-label">{d.day.replace('Apr ', '')}</div>
                {d.note && <div className="cost-chart-col-note">{d.note}</div>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="cost-chart-caption">
        OpenAI spend, daily · April 2026 · Two scheduled jobs (world news +
        portfolio briefing) on the default model with no token caps. Paused
        Apr 15 for audit · rebuild with budget guardrails is the next sprint.
      </div>
    </div>
  )
}
