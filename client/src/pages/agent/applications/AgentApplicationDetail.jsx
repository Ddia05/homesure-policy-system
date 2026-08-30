import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../../../services/applicationService';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function AgentApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Actions State
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      // NOTE: getApplicationForReview transitions SUBMITTED to UNDER_REVIEW on the backend automatically
      const data = await applicationService.getAgentById(id);
      setApplication(data);
    } catch (err) {
      setError('Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const updated = await applicationService.approve(id, reviewNotes);
      // Fetch latest to get full joined data again
      fetchApplication();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve application.');
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reviewNotes.trim()) {
      setError('Review notes are required for rejection.');
      return;
    }
    try {
      setActionLoading(true);
      setError(null);
      const updated = await applicationService.reject(id, reviewNotes);
      fetchApplication();
      setShowRejectForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject application.');
      setActionLoading(false);
    }
  };

  const handleIssuePolicy = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await applicationService.issuePolicy(id);
      // We don't have a specific policy route configured yet, so just refresh for now
      // which will reflect if there is any status change (though policy issuance doesn't change app status natively in standard setup, it creates a policy record)
      alert('Policy issued successfully! (Redirect to policy view would happen here)');
      setActionLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue policy.');
      setActionLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading application workspace...</div>;
  if (error && !application) return <div className="error-message" style={{ margin: '24px' }}>{error}</div>;

  const quote = application.Quote;
  const customer = application.Customer;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/agent/applications" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} style={{ marginRight: '4px' }} />
          Back to Queue
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            Application APP-{application.id.toString().padStart(4, '0')}
            <StatusBadge status={application.status} />
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Submitted by {customer?.first_name} {customer?.last_name} on {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '24px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Name</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{customer?.first_name} {customer?.last_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Email</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{customer?.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Phone</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{customer?.phone || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Customer Address</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{customer?.address || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Property & Risk Assessment
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Insured Property</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{quote?.Property?.address}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {quote?.Property?.property_type?.replace(/_/g, ' ')} • Built {quote?.Property?.construction_year}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Value: ${parseFloat(quote?.Property?.property_value || 0).toLocaleString()}
                </div>
              </div>
              <div style={{ backgroundColor: '#fff9f0', border: '1px solid #ffedd5', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#9a3412', fontWeight: '600', textTransform: 'uppercase' }}>System Risk Assessment</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>
                  Score: {quote?.risk_score}/100
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px', color: quote?.risk_level === 'HIGH' ? 'var(--status-red)' : quote?.risk_level === 'MEDIUM' ? 'var(--status-amber)' : 'var(--status-green)' }}>
                  {quote?.risk_level} RISK
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Requested Coverage
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Plan</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px', fontWeight: 'bold' }}>{quote?.InsurancePlan?.name}</div>
                <ul style={{ paddingLeft: '20px', margin: '8px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                  {quote?.InsurancePlan?.Coverages?.map(c => (
                    <li key={c.id}>{c.name} (${parseFloat(c.max_amount).toLocaleString()})</li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Calculated Annual Premium</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-navy)', marginTop: '4px' }}>
                  ${parseFloat(quote?.premium || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-strong)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <ShieldCheck size={18} style={{ marginRight: '8px' }} />
              Underwriter Action
            </h3>

            {(application.status === 'UNDER_REVIEW' || application.status === 'SUBMITTED') ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {!showRejectForm ? (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Review Notes (Optional for Approval)</label>
                      <textarea 
                        className="form-control" 
                        rows={4} 
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add notes for the file..."
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button 
                        className="btn-primary" 
                        style={{ backgroundColor: 'var(--status-green)', borderColor: 'var(--status-green)', width: '100%', display: 'flex', justifyContent: 'center' }}
                        onClick={handleApprove}
                        disabled={actionLoading}
                      >
                        <CheckCircle size={16} style={{ marginRight: '8px' }} />
                        Approve Application
                      </button>
                      <button 
                        className="btn-primary" 
                        style={{ backgroundColor: 'white', color: 'var(--status-red)', border: '1px solid var(--status-red)', width: '100%', display: 'flex', justifyContent: 'center' }}
                        onClick={() => setShowRejectForm(true)}
                        disabled={actionLoading}
                      >
                        <XCircle size={16} style={{ marginRight: '8px' }} />
                        Decline Application
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--status-red)' }}>Reason for Rejection *</label>
                      <textarea 
                        className="form-control" 
                        rows={4} 
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Please provide required notes..."
                        style={{ borderColor: 'var(--status-red)' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        className="btn-primary" 
                        style={{ backgroundColor: 'white', color: 'var(--text-main)', border: '1px solid var(--border-strong)', flex: 1 }}
                        onClick={() => setShowRejectForm(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn-primary" 
                        style={{ backgroundColor: 'var(--status-red)', borderColor: 'var(--status-red)', flex: 1 }}
                        onClick={handleReject}
                        disabled={actionLoading}
                      >
                        Confirm Decline
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  Status: <span style={{ marginLeft: '8px' }}><StatusBadge status={application.status} /></span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  <strong>Notes:</strong> {application.review_notes || 'No notes provided.'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Reviewed by Agent ID: {application.reviewed_by} on {new Date(application.reviewed_at).toLocaleDateString()}
                </div>

                {application.status === 'APPROVED' && (
                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                    <button 
                      className="btn-primary" 
                      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                      onClick={handleIssuePolicy}
                      disabled={actionLoading}
                    >
                      Issue Policy
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
}
