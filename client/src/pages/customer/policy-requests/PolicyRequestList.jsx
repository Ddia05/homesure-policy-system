import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { policyRequestService } from '../../../services/policyRequestService';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { FileSignature } from 'lucide-react';

export default function PolicyRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await policyRequestService.getAllCustomer();
      setRequests(data);
    } catch (err) {
      setError('Failed to load policy requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRequestTypeName = (type) => {
    return type.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Policy Requests</h1>
        <Link to="/customer/policies" className="btn-primary" style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-main)', border: '1px solid var(--border-strong)' }}>
          <FileSignature size={16} style={{ marginRight: '8px' }} />
          New Request
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            You do not have any policy requests.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Policy Number</th>
                  <th>Request Type</th>
                  <th>Status</th>
                  <th>Requested Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: '500' }}>REQ-{req.id.toString().padStart(4, '0')}</td>
                    <td style={{ fontWeight: '600', color: 'var(--primary-navy)' }}>
                      <Link to={`/customer/policies/${req.policy_id}`}>{req.Policy?.policy_number || 'Unknown'}</Link>
                    </td>
                    <td>{getRequestTypeName(req.request_type)}</td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>{new Date(req.requested_at).toLocaleDateString()}</td>
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
