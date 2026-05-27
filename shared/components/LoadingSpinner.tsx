export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: '24px',
        height: '24px',
        border: '4px solid #333333',
        borderTopColor: '#CCFF00',
        borderRadius: 0,
        animation: 'brut-spin 0.8s linear infinite',
      }}
    />
  )
}

// inject keyframes once
if (typeof document !== 'undefined') {
  const id = '__brut-spin'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = '@keyframes brut-spin { to { transform: rotate(360deg); } }'
    document.head.appendChild(style)
  }
}
