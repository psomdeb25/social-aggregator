// A superellipse (|x|^n + |y|^n = 1) clip path in objectBoundingBox units, so
// any element can use `clip-path: url(#squircle)` at any size.
const N = 5
const STEPS = 96

function superellipsePath() {
  const pts: string[] = []
  for (let i = 0; i < STEPS; i++) {
    const t = (i / STEPS) * 2 * Math.PI
    const c = Math.cos(t)
    const s = Math.sin(t)
    const x = 0.5 + 0.5 * Math.sign(c) * Math.abs(c) ** (2 / N)
    const y = 0.5 + 0.5 * Math.sign(s) * Math.abs(s) ** (2 / N)
    pts.push(`${x.toFixed(4)} ${y.toFixed(4)}`)
  }
  return `M${pts.join('L')}Z`
}

export function SquircleDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <clipPath id="squircle" clipPathUnits="objectBoundingBox">
          <path d={superellipsePath()} />
        </clipPath>
      </defs>
    </svg>
  )
}
