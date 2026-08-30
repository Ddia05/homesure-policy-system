import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { policyService } from '../../../services/policyService';
import { policyRequestService } from '../../../services/policyRequestService';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function PolicyRequestForm() {
  const [searchParams] = useSearchParams();
  const policyId = searchParams.get('policyId');
  const navigate = useNavigate();
  
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [requestType, setRequestType] = useState('ADDRESS_CHANGE');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!policyId) {
      setError('No policy specified for request.');
      setLoading(false);
      return;
    }
    fetchPolicy();
  }, [policyId]);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const data = await policyService.getCustomerById(policyId);
      if (data.status !== 'ACTIVE') {
        setError(`Cannot submit a request for a policy that is ${data.status}.`);
      } else {
        setPolicy(data);
      }
    } catch (err) {
      setError('Failed to load policy details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description of your request.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await policyRequestService.create({
        policyId,
        requestType,
        description
      });
      navigate('/customer/policy-requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading form...</div>;
  if (error && !policy) return <div className="error-message" style={{ margin: '24px' }}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to={`/customer/policies/${policyId}`} style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} style={{ marginRight: '4px' }} />
          Back to Policy
        </Link>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Submit Policy Request</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Request an endorsement, modification, or cancellation for Policy {policy.policy_number}.
        </p>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '24px' }}>{error}</div>}

      <div className="card" style={{ padding: '24px', maxWidth: '800px' }}>
        
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Selected Policy</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--primary-navy)', marginTop: '4px' }}>
            {policy.policy_number}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {policy.Property?.address} • {policy.InsurancePlan?.name}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Request Type</label>
            <select 
              className="form-control"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              required
            >
              <option value="ADDRESS_CHANGE">Address Change / Move</option>
              <option value="ADD_COVERAGE">Add Coverage</option>
              <option value="REMOVE_COVERAGE">Remove Coverage</option>
              <option value="RENEWAL">Policy Renewal</option>
              <option value="CANCELLATION">Policy Cancellation</option>
            </select>
          </div>

          {requestType === 'CANCELLATION' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '24px' }}>
              <AlertTriangle size={20} color="var(--status-red)" style={{ marginRight: '12px', marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--status-red)', fontSize: '14px' }}>Cancellation Warning</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)' }}>
                  Submitting a cancellation request will initiate a review to terminate your coverage. This may result in early termination fees or a lapse in your property insurance. Please provide details in the description below.
                </p>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Request Description</label>
            <textarea 
              className="form-control"
              rows={5}
              placeholder={`Please provide details regarding your ${requestType.toLowerCase().replace('_', ' ')}...`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <Link to={`/customer/policies/${policyId}`} className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--text-main)', border: '1px solid var(--border-strong)' }}>
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
