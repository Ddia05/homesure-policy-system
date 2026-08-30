import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../../../services/applicationService';
import { ArrowLeft, Clock, Info } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const data = await applicationService.getCustomerById(id);
      setApplication(data);
    } catch (err) {
      setError('Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading application details...</div>;
  if (error || !application) return <div className="error-message" style={{ margin: '24px' }}>{error || 'Application not found.'}</div>;

  const quote = application.Quote;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/customer/applications" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} style={{ marginRight: '4px' }} />
          Back to Applications
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            Application APP-{application.id.toString().padStart(4, '0')}
            <StatusBadge status={application.status} />
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Submitted on {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {(application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW') && (
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px', backgroundColor: '#eef4ff', border: '1px solid #dce4f5', borderRadius: '8px', marginBottom: '24px' }}>
          <Clock size={20} color="var(--primary-navy)" style={{ marginRight: '12px', marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--primary-navy)', fontSize: '14px' }}>Under review by HomeSure</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Your application is currently being reviewed by our underwriting team. This process typically takes 1-2 business days. We will notify you once a decision has been made.
            </p>
          </div>
        </div>
      )}

      {application.status === 'REJECTED' && application.review_notes && (
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '24px' }}>
          <Info size={20} color="var(--status-red)" style={{ marginRight: '12px', marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--status-red)', fontSize: '14px' }}>Application Declined</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)' }}>
              <strong>Underwriter Notes:</strong> {application.review_notes}
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
            Property Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Address</div>
              <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{quote?.Property?.address}</div>
            </div>
            <div style={{ display: 'flex', gap: '48px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Type</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{quote?.Property?.property_type?.replace(/_/g, ' ')}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Value</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>
                  ${parseFloat(quote?.Property?.property_value || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
            Insurance Plan & Quote
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Selected Plan</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>{quote?.InsurancePlan?.name}</div>
            </div>
            <div style={{ display: 'flex', gap: '48px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Quote Reference</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>
                  <Link to={`/customer/quotes/${quote?.id}`}>#{quote?.id}</Link>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Annual Premium</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--primary-navy)', marginTop: '4px' }}>
                  ${parseFloat(quote?.premium || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
