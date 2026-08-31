import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { policyRequestService } from '../../../services/policyRequestService';
import { ArrowLeft, CheckCircle, XCircle, FileSignature } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function AgentPolicyRequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const data = await policyRequestService.getAgentById(id);
      setRequest(data);
    } catch (err) {
      setError('Failed to load request details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await policyRequestService.approve(id);
      fetchRequest();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve request.');
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await policyRequestService.reject(id);
      fetchRequest();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request.');
      setActionLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading endorsement details...</div>;
  if (error && !request) return <div className="error-message" style={{ margin: '24px' }}>{error}</div>;

  const policy = request.Policy;
  const customer = request.Customer;

  const getRequestTypeName = (type) => {
    if (!type) return 'Unknown';
    return type.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/agent/policy-requests" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} style={{ marginRight: '4px' }} />
          Back to Queue
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            Request REQ-{request.id.toString().padStart(4, '0')}
            <StatusBadge status={request.status} />
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Submitted by {customer?.name || 'N/A'} on {new Date(request.requested_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '24px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px', backgroundColor: '#f8fafe', border: '1px solid #dce4f5' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <FileSignature size={18} style={{ marginRight: '8px' }} />
              Request Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Request Type</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>
                  {getRequestTypeName(request.request_type)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Current Status</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{request.status}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Customer Description</div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-main)', 
                  marginTop: '8px', 
                  padding: '16px', 
                  backgroundColor: 'white', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '4px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {request.description}
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Policy & Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Policy Number</div>
                <div style={{ fontSize: '15px', color: 'var(--primary-navy)', fontWeight: 'bold', marginTop: '4px' }}>
                  <Link to={`/agent/policies/${policy?.id}`}>{policy?.policy_number}</Link>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Customer Name</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{customer?.name || 'N/A'}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Insured Property</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{policy?.Property?.address}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-strong)' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px' }}>
              Underwriter Action
            </h3>

            {request.status === 'PENDING' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Please review the customer's request and evaluate against underwriting guidelines before approving.
                </p>
                <button 
                  className="btn-primary" 
                  style={{ backgroundColor: 'var(--status-green)', borderColor: 'var(--status-green)', width: '100%', display: 'flex', justifyContent: 'center' }}
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  <CheckCircle size={16} style={{ marginRight: '8px' }} />
                  Approve Endorsement
                </button>
                <button 
                  className="btn-primary" 
                  style={{ backgroundColor: 'white', color: 'var(--status-red)', border: '1px solid var(--status-red)', width: '100%', display: 'flex', justifyContent: 'center' }}
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  <XCircle size={16} style={{ marginRight: '8px' }} />
                  Reject Request
                </button>
              </div>
            ) : (
              <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  Status: <span style={{ marginLeft: '8px' }}><StatusBadge status={request.status} /></span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  This request has already been processed by an underwriter and can no longer be modified.
                </div>
                {request.reviewed_by && (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Action taken by Agent ID: {request.reviewed_by} on {new Date(request.reviewed_at).toLocaleDateString()}
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
