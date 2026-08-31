import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../../services/applicationService';
import { Search, Filter, Eye } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function AgentApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getAllAgent();
      setApplications(data);
    } catch (err) {
      setError('Failed to load application queue. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        `APP-${app.id.toString().padStart(4, '0')}`.toLowerCase().includes(searchStr) ||
        (app.Customer?.name || '').toLowerCase().includes(searchStr) ||
        (app.Quote?.Property?.address || '').toLowerCase().includes(searchStr);
      return matchesStatus && matchesSearch;
    });
  }, [applications, searchTerm, statusFilter]);

  const getRiskColor = (level) => {
    switch(level) {
      case 'LOW': return 'var(--status-green)';
      case 'MEDIUM': return 'var(--status-amber)';
      case 'HIGH': return 'var(--status-red)';
      default: return 'inherit';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Application Review Queue</h1>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#f8fafe' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by ID, customer name, or address..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '10px 10px 10px 40px', 
              borderRadius: '6px', border: '1px solid var(--border-strong)',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ 
              padding: '10px', borderRadius: '6px', border: '1px solid var(--border-strong)',
              fontSize: '14px', backgroundColor: 'var(--bg-white)', cursor: 'pointer'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted (New)</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading queue...</div>
        ) : filteredApplications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No applications found matching your criteria.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Customer</th>
                  <th>Property</th>
                  <th>Plan</th>
                  <th>Risk Level</th>
                  <th>Premium</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(app => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: '500' }}>APP-{app.id.toString().padStart(4, '0')}</td>
                    <td>{app.Customer?.name || 'N/A'}</td>
                    <td>{app.Quote?.Property?.address || 'Unknown'}</td>
                    <td>{app.Quote?.InsurancePlan?.name || 'Unknown'}</td>
                    <td style={{ fontWeight: '600', color: getRiskColor(app.Quote?.risk_level) }}>
                      {app.Quote?.risk_level || 'N/A'}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      ${parseFloat(app.Quote?.premium || 0).toLocaleString()}
                    </td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>{new Date(app.submitted_at || app.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/agent/applications/${app.id}`} className="btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
