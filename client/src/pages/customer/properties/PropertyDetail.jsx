import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../../../services/propertyService';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await propertyService.getById(id);
      setProperty(data);
    } catch (err) {
      setError('Failed to load property details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone unless restricted by existing policies.')) {
      return;
    }
    
    try {
      await propertyService.delete(id);
      navigate('/customer/properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete property.');
    }
  };

  if (loading) return <div className="loading-state">Loading property details...</div>;
  if (error && !property) return <div className="error-message" style={{ margin: '24px' }}>{error}</div>;
  if (!property) return <div style={{ margin: '24px' }}>Property not found.</div>;

  return (
    <div>
      <div className="page-header">
        <Link to="/customer/properties" className="back-link">
          <ArrowLeft size={16} />
          Back to Properties
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Property Details</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>ID: {property.id}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/customer/properties/${property.id}/edit`} className="btn btn-secondary">
            <Edit size={16} className="btn-icon" />
            Edit
          </Link>
          <button onClick={handleDelete} className="btn" style={{ backgroundColor: 'var(--status-red)', color: 'white' }}>
            <Trash2 size={16} className="btn-icon" />
            Delete
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-header">
            <h3>Property Information</h3>
          </div>
          <div className="card-body">
            <div className="info-grid">
              <div className="info-item">
                <div className="label">Address</div>
                <div className="value">{property.address}</div>
              </div>
              <div className="info-item">
                <div className="label">Property Type</div>
                <div className="value">{property.property_type.replace(/_/g, ' ')}</div>
              </div>
              <div className="info-item">
                <div className="label">Estimated Value</div>
                <div className="value">
                  ${parseFloat(property.property_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div className="card">
            <div className="card-header">
              <h3>Construction Information</h3>
            </div>
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <div className="label">Construction Year</div>
                  <div className="value">{property.construction_year}</div>
                </div>
                <div className="info-item">
                  <div className="label">Construction Type</div>
                  <div className="value">{property.construction_type}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Security</h3>
            </div>
            <div className="card-body">
              <div className="info-item">
                <div className="label">Security System</div>
                <div className="value">
                  {property.security_system ? 'Yes - Active monitored system' : 'No monitored system'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
