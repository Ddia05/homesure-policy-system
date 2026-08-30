import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quoteService } from '../../../services/quoteService';
import { Plus, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export default function QuoteList() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await quoteService.getAll();
      setQuotes(data);
    } catch (err) {
      setError('Failed to load quotes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My Quotes</h1>
        <Link to="/customer/quotes/new" className="btn-primary">
          <Plus size={16} style={{ marginRight: '8px' }} />
          Get a Quote
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            You have not requested any quotes yet.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quote ID</th>
                  <th>Property</th>
                  <th>Plan</th>
                  <th>Annual Premium</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(quote => (
                  <tr key={quote.id}>
                    <td style={{ fontWeight: '500' }}>#{quote.id}</td>
                    <td>{quote.Property?.address || 'Unknown Property'}</td>
                    <td>{quote.InsurancePlan?.name || 'Unknown Plan'}</td>
                    <td style={{ fontWeight: '600' }}>
                      ${parseFloat(quote.premium).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      <StatusBadge status={quote.status} />
                    </td>
                    <td>{new Date(quote.created_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/customer/quotes/${quote.id}`} style={{ color: 'var(--action-blue)', display: 'inline-flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
                        <Eye size={16} style={{ marginRight: '4px' }} />
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
