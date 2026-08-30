import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { policyService } from '../../../services/policyService';
import { ArrowLeft, FileSignature, Shield } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function PolicyDetail() {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicy();
  }, [id]);

  const fetchPolicy = async () => {
    try {
      const data = await policyService.getCustomerById(id);
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
        <Link to="/customer/policies" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
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
        
        {policy.status === 'ACTIVE' && (
          <Link to={`/customer/policy-requests/new?policyId=${policy.id}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center' }}>
            <FileSignature size={16} style={{ marginRight: '8px' }} />
            Submit Policy Request
          </Link>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Policy Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Policy Number</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>{policy.policy_number}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Status</div>
                <div style={{ marginTop: '4px' }}><StatusBadge status={policy.status} /></div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Start Date</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{new Date(policy.start_date).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>End Date</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{new Date(policy.end_date).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Insured Property
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Address</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{policy.Property?.address}</div>
              </div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Property Type</div>
                  <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{policy.Property?.property_type?.replace(/_/g, ' ')}</div>
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
              Premium
            </h3>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Annual Premium</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary-navy)', marginTop: '8px' }}>
                ${parseFloat(policy.premium).toLocaleString()}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Paid in full for the current term.
              </p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Coverage Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Insurance Plan</div>
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
