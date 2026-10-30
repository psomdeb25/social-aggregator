export function Avatar({ src, name, size }: { src?: string; name?: string; size: number | string }) {
  const style = { width: size, height: size }
  if (src) return <img className="avatar" src={src} alt={name ? `${name}’s profile photo` : ''} style={style} />
  return (
    <div className="avatar avatar--placeholder" style={style} role="img" aria-label={name ?? 'No profile photo'}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="25" r="12" fill="currentColor" />
        <path d="M10 58c2-12 11-19 22-19s20 7 22 19" fill="currentColor" />
      </svg>
    </div>
  )
}
