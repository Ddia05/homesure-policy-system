import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../../services/applicationService';
import { Eye } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getAllCustomer();
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Applications</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading applications...</div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            You have not submitted any applications yet.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Quote</th>
                  <th>Property</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Submitted Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: '500' }}>APP-{app.id.toString().padStart(4, '0')}</td>
                    <td><Link to={`/customer/quotes/${app.quote_id}`}>#{app.quote_id}</Link></td>
                    <td>{app.Quote?.Property?.address || 'Unknown'}</td>
                    <td>{app.Quote?.InsurancePlan?.name || 'Unknown'}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/customer/applications/${app.id}`} style={{ color: 'var(--action-blue)', display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
                        <Eye size={16} style={{ marginRight: '4px' }} />
                        View
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
