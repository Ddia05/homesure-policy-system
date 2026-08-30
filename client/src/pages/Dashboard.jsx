import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PlusCircle, FileText, Shield } from 'lucide-react';

export default function Dashboard({ role }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only customer logic in this particular Dashboard for now
    if (role === 'CUSTOMER') {
      const fetchData = async () => {
        try {
          const dashboardData = await dashboardService.getCustomerDashboardData();
          setData(dashboardData);
        } catch (err) {
          setError('Failed to load dashboard data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false); // We'll implement agent dashboard later
    }
  }, [role]);

  if (loading) return <div className="loading-state">Loading workspace...</div>;
  
  if (role === 'AGENT') {
    return (
      <div>
        <h1 className="page-title">Agent Overview</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '24px' }}>
          Welcome back, {user?.name || user?.email}. Agent workspace is pending implementation.
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Derived metrics
  const activePolicies = data?.policies?.filter(p => p.status === 'ACTIVE') || [];
  const pendingApps = data?.applications?.filter(p => ['SUBMITTED', 'UNDER_REVIEW'].includes(p.status)) || [];
  const activeQuotes = data?.quotes?.filter(q => q.status === 'DRAFT' || q.status === 'OFFERED') || [];
  const pendingRequests = data?.policyRequests?.filter(r => r.status === 'PENDING') || [];

  // Recent Activity Merge (Taking latest 5 items across policies, apps, quotes)
  const allActivity = [
    ...(data?.policies || []).map(p => ({ type: 'Policy', id: p.id, ref: p.policy_number, status: p.status, date: p.createdAt, link: `/customer/policies/${p.id}` })),
    ...(data?.applications || []).map(a => ({ type: 'Application', id: a.id, ref: `APP-${a.id}`, status: a.status, date: a.createdAt, link: `/customer/applications` })),
    ...(data?.quotes || []).map(q => ({ type: 'Quote', id: q.id, ref: `QT-${q.id}`, status: q.status, date: q.createdAt, link: `/customer/quotes` }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customer Dashboard</h1>
      </div>
      
      {/* Context Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-body">
          <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', margin: '0 0 8px 0' }}>Welcome back, {user?.name}</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>
            {currentDate} • Manage your properties, review quotes, and monitor your active insurance policies.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: 'var(--spacing-lg)' }}>
        <Link to="/customer/properties/new" className="btn btn-secondary">
          <PlusCircle size={16} className="btn-icon" />
          Add Property
        </Link>
        <Link to="/customer/quotes/new" className="btn btn-primary">
          <FileText size={16} className="btn-icon" />
          Get a Quote
        </Link>
        <Link to="/customer/policies" className="btn btn-secondary">
          <Shield size={16} className="btn-icon" />
          View Policies
        </Link>
      </div>

      {/* Summary Grid */}
      <div className="info-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-body">
            <div className="info-item">
              <div className="label">Active Policies</div>
              <div className="value" style={{ fontSize: '24px', marginTop: '4px' }}>{activePolicies.length}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="info-item">
              <div className="label">Pending Applications</div>
              <div className="value" style={{ fontSize: '24px', marginTop: '4px' }}>{pendingApps.length}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="info-item">
              <div className="label">Available Quotes</div>
              <div className="value" style={{ fontSize: '24px', marginTop: '4px' }}>{activeQuotes.length}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="info-item">
              <div className="label">Pending Requests</div>
              <div className="value" style={{ fontSize: '24px', marginTop: '4px' }}>{pendingRequests.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        {/* Recent Policies Table */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Policies</h3>
          </div>
          <div className="data-table-container">
            {data?.policies?.length === 0 ? (
              <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No policies found.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Policy Number</th>
                    <th>Property</th>
                    <th>Premium</th>
                    <th>Status</th>
                    <th>Expiry</th>
                    <th className="actions">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.policies?.slice(0, 5).map(policy => (
                    <tr key={policy.id}>
                      <td style={{ fontWeight: '500' }}>{policy.policy_number}</td>
                      <td>{policy.Property?.address || `Property #${policy.property_id}`}</td>
                      <td>${parseFloat(policy.premium).toFixed(2)}</td>
                      <td><StatusBadge status={policy.status} /></td>
                      <td>{new Date(policy.end_date).toLocaleDateString()}</td>
                      <td className="actions">
                        <Link to={`/customer/policies/${policy.id}`} className="btn-text">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="data-table-container">
            {allActivity.length === 0 ? (
              <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No recent activity.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="actions">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allActivity.map((activity, idx) => (
                    <tr key={`${activity.type}-${activity.id}-${idx}`}>
                      <td style={{ fontWeight: '500' }}>{activity.type}</td>
                      <td>{activity.ref}</td>
                      <td><StatusBadge status={activity.status} /></td>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td className="actions">
                        <Link to={activity.link} className="btn-text">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
