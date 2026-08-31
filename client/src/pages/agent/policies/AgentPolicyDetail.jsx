import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { policyService } from '../../../services/policyService';
import { ArrowLeft, Shield } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function AgentPolicyDetail() {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicy();
  }, [id]);

  const fetchPolicy = async () => {
    try {
      const data = await policyService.getAgentById(id);
      setPolicy(data);
    } catch (err) {
      setError('Failed to load policy details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading policy details...</div>;
  if (error || !policy) return <div className="error-message" style={{ margin: '24px' }}>{error || 'Policy not found.'}</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/agent/policies" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} style={{ marginRight: '4px' }} />
          Back to Policies
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={28} color="var(--primary-navy)" />
            Policy {policy.policy_number}
            <StatusBadge status={policy.status} />
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '15px' }}>
            Active from {new Date(policy.start_date).toLocaleDateString()} to {new Date(policy.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Name</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{policy.Customer?.name || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Email</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{policy.Customer?.User?.email || policy.Customer?.email || 'N/A'}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Customer Address</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{policy.Customer?.address}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Insured Property
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Property Address</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{policy.Property?.address}</div>
              </div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Type & Year</div>
                  <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>
                    {policy.Property?.property_type?.replace(/_/g, ' ')} • {policy.Property?.construction_year}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Insured Value</div>
                  <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>
                    ${parseFloat(policy.Property?.property_value || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ backgroundColor: '#f8fafe', border: '1px solid #dce4f5' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid #dce4f5', paddingBottom: '8px' }}>
              Financials
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Annual Premium</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-navy)', marginTop: '4px' }}>
                  ${parseFloat(policy.premium).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Payment Status</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--status-green)', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  PAID IN FULL
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Coverage Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Base Plan</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>{policy.InsurancePlan?.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Included Coverages</div>
                <ul style={{ paddingLeft: '0', margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {policy.InsurancePlan?.Coverages?.map(c => (
                    <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '500' }}>{c.name}</span>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Up to ${parseFloat(c.max_amount).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
