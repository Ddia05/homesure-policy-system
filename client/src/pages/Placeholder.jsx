export default function Placeholder({ title }) {
  return (
    <div>
      <h1 className="page-title">{title}</h1>
      <div className="card" style={{ marginTop: '24px' }}>
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>This module is pending implementation.</p>
        </div>
      </div>
    </div>
  );
}
