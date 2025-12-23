interface BolgenieLogoProps {
  className?: string
}

export function BolgenieLogo({ className = 'w-10 h-10' }: BolgenieLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="5" y="5" width="90" height="90" rx="25" stroke="#0052FF" strokeWidth="8" />
      <path
        d="M30 25 H60 L75 40 V75 H30 V25 Z"
        stroke="#0052FF"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M52.5 35 L56 48 L69 51.5 L56 55 L52.5 68 L49 55 L36 51.5 L49 48 Z"
        fill="#10B981"
      />
      <line x1="35" y1="62" x2="70" y2="62" stroke="#0052FF" strokeWidth="4" strokeLinecap="round" />
      <line x1="35" y1="70" x2="70" y2="70" stroke="#0052FF" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
