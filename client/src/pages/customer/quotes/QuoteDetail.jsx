import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quoteService } from '../../../services/quoteService';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuote();
  }, [id]);

  const fetchQuote = async () => {
    try {
      const data = await quoteService.getById(id);
      setQuote(data);
    } catch (err) {
      setError('Failed to load quote details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading quote details...</div>;
  if (error && !quote) return <div className="error-message" style={{ margin: '24px' }}>{error}</div>;
  if (!quote) return <div style={{ margin: '24px' }}>Quote not found.</div>;

  const getRiskColor = (level) => {
    switch(level) {
      case 'LOW': return 'var(--status-green)';
      case 'MEDIUM': return 'var(--status-amber)';
      case 'HIGH': return 'var(--status-red)';
      default: return 'var(--text-main)';
    }
  };

  const getRiskIcon = (level) => {
    switch(level) {
      case 'LOW': return <CheckCircle size={16} color="var(--status-green)" style={{ marginRight: '6px' }} />;
      case 'MEDIUM': return <AlertTriangle size={16} color="var(--status-amber)" style={{ marginRight: '6px' }} />;
      case 'HIGH': return <XCircle size={16} color="var(--status-red)" style={{ marginRight: '6px' }} />;
      default: return null;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/customer/quotes" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
          <ArrowLeft size={16} style={{ marginRight: '4px' }} />
          Back to Quotes
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            Quote #{quote.id}
            <StatusBadge status={quote.status} />
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Generated on {new Date(quote.created_at).toLocaleDateString()}
          </p>
        </div>
        
        {quote.status === 'GENERATED' && (
          <button 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => navigate(`/customer/applications/new?quoteId=${quote.id}`)}
          >
            <FileText size={16} style={{ marginRight: '8px' }} />
            Proceed with Application
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Property Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Address</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{quote.Property?.address}</div>
              </div>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Property Type</div>
                  <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>{quote.Property?.property_type?.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Estimated Value</div>
                  <div style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '4px' }}>
                    ${parseFloat(quote.Property?.property_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Insurance Plan
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Plan Name</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>{quote.InsurancePlan?.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Included Coverages</div>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>
                  {quote.InsurancePlan?.Coverages?.map(c => (
                    <li key={c.id} style={{ marginBottom: '4px' }}>{c.name} (Up to ${parseFloat(c.max_amount).toLocaleString()})</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ backgroundColor: '#f8fafe', border: '1px solid #dce4f5' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid #dce4f5', paddingBottom: '8px' }}>
              Premium Summary
            </h3>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>Annual Premium</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary-navy)', marginTop: '8px' }}>
                ${parseFloat(quote.premium).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Valid for 30 days from generation date.
              </p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              Risk Assessment
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Risk Score</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '4px' }}>{quote.risk_score} / 100</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Risk Level</div>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  fontSize: '15px', 
                  fontWeight: 'bold', 
                  color: getRiskColor(quote.risk_level), 
                  marginTop: '4px',
                  padding: '6px 12px',
                  backgroundColor: `${getRiskColor(quote.risk_level)}15`,
                  borderRadius: '4px'
                }}>
                  {getRiskIcon(quote.risk_level)}
                  {quote.risk_level}
                </div>
              </div>
              
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
                This assessment is based on factors such as property age, construction type, and installed security systems. 
                {quote.risk_level === 'HIGH' && ' High-risk properties may require additional manual underwriting before approval.'}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
