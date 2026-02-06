export default function LabelCode({ code, size = 'md' }) {
  const sizes = {
    sm: 'text-xs',
    md: 'font-mono text-sm tracking-wide',
    lg: 'font-mono text-4xl font-bold tracking-wider',
    xl: 'font-mono text-6xl font-bold tracking-wider',
  }

  return (
    <span className={`${sizes[size] || sizes.md} text-soil-400`}>
      {code}
    </span>
  )
}
