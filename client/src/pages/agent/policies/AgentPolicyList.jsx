import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { policyService } from '../../../services/policyService';
import { Search, Filter, Eye } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function AgentPolicyList() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await policyService.getAllAgent();
      setPolicies(data);
    } catch (err) {
      setError('Failed to load policies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesStatus = statusFilter === 'ALL' || policy.status === statusFilter;
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        policy.policy_number.toLowerCase().includes(searchStr) ||
        (policy.Customer?.first_name + ' ' + policy.Customer?.last_name).toLowerCase().includes(searchStr) ||
        (policy.Property?.address || '').toLowerCase().includes(searchStr);
      return matchesStatus && matchesSearch;
    });
  }, [policies, searchTerm, statusFilter]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Policy Administration</h1>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#f8fafe' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by Policy Number, Customer, or Address..." 
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
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading policies...</div>
        ) : filteredPolicies.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No policies found matching your criteria.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Policy Number</th>
                  <th>Customer</th>
                  <th>Property</th>
                  <th>Plan</th>
                  <th>Premium</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPolicies.map(policy => (
                  <tr key={policy.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary-navy)' }}>{policy.policy_number}</td>
                    <td>{policy.Customer?.first_name} {policy.Customer?.last_name}</td>
                    <td>{policy.Property?.address || 'Unknown'}</td>
                    <td>{policy.InsurancePlan?.name || 'Unknown'}</td>
                    <td style={{ fontWeight: '600' }}>${parseFloat(policy.premium).toLocaleString()}</td>
                    <td><StatusBadge status={policy.status} /></td>
                    <td>{new Date(policy.start_date).toLocaleDateString()}</td>
                    <td>{new Date(policy.end_date).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/agent/policies/${policy.id}`} className="btn-primary" style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: 'var(--bg-white)', color: 'var(--text-main)', border: '1px solid var(--border-strong)' }}>
                        <Eye size={14} style={{ marginRight: '4px', display: 'inline' }} />
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
