export default function Logo({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo de SugarTrack"
      style={{
        borderRadius: size * 0.22,
        boxShadow: '0 12px 28px rgba(242, 106, 27, 0.35)',
        flexShrink: 0,
      }}
    >
      <rect width="512" height="512" rx="112" fill="#F26A1B" />
      <g transform="translate(256,256) scale(1.05) translate(-228,-178)">
        <ellipse cx="130" cy="190" rx="94" ry="64" fill="#F4F6FA" />
        <ellipse cx="130" cy="190" rx="74" ry="46" fill="#FFB347" />
        <path d="M78 178 C92 158 116 150 142 152" fill="none" stroke="#FFD58F" strokeWidth="9" strokeLinecap="round" />
        <g fill="#FFE3B8">
          <circle cx="152" cy="176" r="6" />
          <circle cx="108" cy="200" r="5" />
          <circle cx="160" cy="205" r="5" />
          <circle cx="130" cy="214" r="5" />
          <circle cx="178" cy="190" r="4" />
        </g>
        <path d="M225 190 H275 L297 138 L327 246 L350 190 H405" fill="none" stroke="#F4F6FA" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="425" cy="190" r="15" fill="#14284B" />
      </g>
    </svg>
  )
}