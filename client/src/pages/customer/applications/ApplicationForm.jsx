import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { quoteService } from '../../../services/quoteService';
import { applicationService } from '../../../services/applicationService';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

export default function ApplicationForm() {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get('quoteId');
  const navigate = useNavigate();
  
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!quoteId) {
      setError('No quote specified for application.');
      setLoading(false);
      return;
    }
    fetchQuote();
  }, [quoteId]);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const data = await quoteService.getById(quoteId);
      if (data.status !== 'GENERATED') {
        setError(`Quote is in ${data.status} status and cannot be applied for.`);
      } else {
        setQuote(data);
      }
    } catch (err) {
      setError('Failed to load quote details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const application = await applicationService.create(quoteId);
      navigate(`/customer/applications/${application.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading application details...</div>;
  if (error && !quote) return <div className="error-message" style={{ margin: '24px' }}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to={`/customer/quotes/${quoteId}`} style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} style={{ marginRight: '4px' }} />
          Back to Quote
        </Link>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          Submit Application
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Review the details below and submit your application for underwriting review.
        </p>
      </div>

      {error && <div className="error-message" style={{ marginBottom: '24px' }}>{error}</div>}

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
          Application Summary
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Property</div>
            <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px', fontWeight: '500' }}>{quote.Property?.address}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{quote.Property?.property_type?.replace(/_/g, ' ')} • Value: ${parseFloat(quote.Property?.property_value).toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Plan</div>
            <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px', fontWeight: '500' }}>{quote.InsurancePlan?.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Annual Premium: ${parseFloat(quote.premium).toLocaleString()}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafe', border: '1px solid #dce4f5', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <FileText size={16} style={{ marginRight: '8px' }} color="var(--primary-navy)" />
            Terms and Conditions
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
            By submitting this application, you confirm that all information provided regarding the property is true and accurate to the best of your knowledge. 
            This application will be reviewed by an underwriter. Submission does not guarantee coverage.
          </p>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <Link to={`/customer/quotes/${quoteId}`} className="btn-primary" style={{ backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-strong)' }}>
            Cancel
          </Link>
          <button 
            className="btn-primary" 
            onClick={handleSubmit} 
            disabled={submitting}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {submitting ? 'Submitting...' : (
              <>
                <CheckCircle size={16} style={{ marginRight: '8px' }} />
                Submit Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
