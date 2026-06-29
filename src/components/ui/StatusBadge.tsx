type Status = 'draft' | 'sent' | 'paid' | 'overdue'

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string }> = {
  draft: { label: 'Draft', bg: 'var(--status-draft-bg)', text: 'var(--status-draft-text)' },
  sent: { label: 'Dikirim', bg: 'var(--status-sent-bg)', text: 'var(--status-sent-text)' },
  paid: { label: 'Lunas', bg: 'var(--status-paid-bg)', text: 'var(--status-paid-text)' },
  overdue: { label: 'Belum lunas', bg: 'var(--status-overdue-bg)', text: 'var(--status-overdue-text)' },
}

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      style={{
        background: config.bg,
        color: config.text,
        fontSize: '9px',
        padding: '2px 7px',
        borderRadius: '4px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {config.label}
    </span>
  )
}
