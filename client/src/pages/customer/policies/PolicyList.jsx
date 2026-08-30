import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { policyService } from '../../../services/policyService';
import { Eye } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function PolicyList() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await policyService.getAllCustomer();
      setPolicies(data);
    } catch (err) {
      setError('Failed to load policies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Policies</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading policies...</div>
        ) : policies.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            You do not have any active policies yet.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Policy Number</th>
                  <th>Property</th>
                  <th>Plan</th>
                  <th>Premium</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies.map(policy => (
                  <tr key={policy.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary-navy)' }}>{policy.policy_number}</td>
                    <td>{policy.Property?.address || 'Unknown'}</td>
                    <td>{policy.InsurancePlan?.name || 'Unknown'}</td>
                    <td style={{ fontWeight: '600' }}>${parseFloat(policy.premium).toLocaleString()}</td>
                    <td>{new Date(policy.start_date).toLocaleDateString()}</td>
                    <td>{new Date(policy.end_date).toLocaleDateString()}</td>
                    <td><StatusBadge status={policy.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/customer/policies/${policy.id}`} style={{ color: 'var(--action-blue)', display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
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
