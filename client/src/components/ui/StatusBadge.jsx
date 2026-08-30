export function StatusBadge({ status }) {
  if (!status) return null;

  let bgColor = 'var(--bg-app)';
  let textColor = 'var(--text-muted)';
  let borderColor = 'var(--border-strong)';

  switch (status) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'ISSUED':
      bgColor = 'var(--status-green-bg)';
      textColor = 'var(--status-green)';
      borderColor = 'var(--status-green)';
      break;
    case 'PENDING':
    case 'UNDER_REVIEW':
    case 'SUBMITTED':
      bgColor = 'var(--status-amber-bg)';
      textColor = 'var(--status-amber)';
      borderColor = 'var(--status-amber)';
      break;
    case 'REJECTED':
    case 'CANCELLED':
    case 'EXPIRED':
      bgColor = 'var(--status-red-bg)';
      textColor = 'var(--status-red)';
      borderColor = 'var(--status-red)';
      break;
    case 'DRAFT':
      bgColor = 'var(--status-blue-bg)';
      textColor = 'var(--status-blue)';
      borderColor = 'var(--status-blue)';
      break;
  }

  const label = status.replace(/_/g, ' ');

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '2px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      backgroundColor: bgColor,
      color: textColor,
      border: `1px solid ${borderColor}50`,
      whiteSpace: 'nowrap'
    }}>
      {label}
    </span>
  );
}
