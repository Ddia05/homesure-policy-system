import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { policyRequestService } from '../../../services/policyRequestService';
import { Search, Filter, Eye } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function AgentPolicyRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await policyRequestService.getAllAgent();
      setRequests(data);
    } catch (err) {
      setError('Failed to load request queue. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRequestTypeName = (type) => {
    if (!type) return 'Unknown';
    return type.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || req.request_type === typeFilter;
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        `REQ-${req.id.toString().padStart(4, '0')}`.toLowerCase().includes(searchStr) ||
        (req.Policy?.policy_number || '').toLowerCase().includes(searchStr) ||
        (req.Customer?.name || '').toLowerCase().includes(searchStr);
      
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [requests, searchTerm, statusFilter, typeFilter]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Endorsement Requests Queue</h1>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#f8fafe' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by Request ID, Policy, or Customer..." 
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
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ 
              padding: '10px', borderRadius: '6px', border: '1px solid var(--border-strong)',
              fontSize: '14px', backgroundColor: 'var(--bg-white)', cursor: 'pointer'
            }}
          >
            <option value="ALL">All Types</option>
            <option value="ADDRESS_CHANGE">Address Change</option>
            <option value="ADD_COVERAGE">Add Coverage</option>
            <option value="REMOVE_COVERAGE">Remove Coverage</option>
            <option value="RENEWAL">Renewal</option>
            <option value="CANCELLATION">Cancellation</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading queue...</div>
        ) : filteredRequests.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No requests found matching your criteria.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Policy Number</th>
                  <th>Customer</th>
                  <th>Request Type</th>
                  <th>Status</th>
                  <th>Requested Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(req => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: '500' }}>REQ-{req.id.toString().padStart(4, '0')}</td>
                    <td style={{ fontWeight: '600', color: 'var(--primary-navy)' }}>{req.Policy?.policy_number}</td>
                    <td>{req.Customer?.name || 'N/A'}</td>
                    <td>{getRequestTypeName(req.request_type)}</td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>{new Date(req.requested_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/agent/policy-requests/${req.id}`} className="btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
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
