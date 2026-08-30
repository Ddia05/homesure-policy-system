import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { propertyService } from '../../../services/propertyService';

export default function PropertyForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: '',
    property_type: 'SINGLE_FAMILY',
    property_value: '',
    construction_year: new Date().getFullYear(),
    construction_type: 'WOOD',
    security_system: false
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await propertyService.getById(id);
      setFormData({
        address: data.address,
        property_type: data.property_type,
        property_value: data.property_value,
        construction_year: data.construction_year,
        construction_type: data.construction_type,
        security_system: data.security_system
      });
    } catch (err) {
      setError('Failed to load property details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        property_value: parseFloat(formData.property_value),
        construction_year: parseInt(formData.construction_year, 10)
      };

      if (isEditMode) {
        await propertyService.update(id, payload);
      } else {
        await propertyService.create(payload);
      }
      
      navigate('/customer/properties');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.response?.data?.message || 'Failed to save property.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading property...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          {isEditMode ? 'Edit Property' : 'Add New Property'}
        </h1>
        <Link to="/customer/properties" style={{ fontSize: '14px', fontWeight: '500' }}>Cancel</Link>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          
          <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
            Location & Basic Details
          </h3>
          
          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <input 
              id="address"
              name="address"
              type="text" 
              className="form-input" 
              value={formData.address}
              onChange={handleChange}
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="property_type">Property Type</label>
              <select 
                id="property_type" 
                name="property_type" 
                className="form-input"
                value={formData.property_type}
                onChange={handleChange}
                required
              >
                <option value="SINGLE_FAMILY">Single Family</option>
                <option value="MULTI_FAMILY">Multi Family</option>
                <option value="TOWNHOUSE">Townhouse</option>
                <option value="CONDO">Condo</option>
              </select>
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="property_value">Estimated Value ($)</label>
              <input 
                id="property_value"
                name="property_value"
                type="number" 
                step="0.01"
                min="0"
                className="form-input" 
                value={formData.property_value}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <h3 style={{ fontSize: '16px', color: 'var(--primary-navy)', marginBottom: '16px', marginTop: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
            Construction & Features
          </h3>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="construction_year">Construction Year</label>
              <input 
                id="construction_year"
                name="construction_year"
                type="number" 
                min="1800"
                max={new Date().getFullYear()}
                className="form-input" 
                value={formData.construction_year}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="construction_type">Construction Type</label>
              <select 
                id="construction_type" 
                name="construction_type" 
                className="form-input"
                value={formData.construction_type}
                onChange={handleChange}
                required
              >
                <option value="WOOD">Wood Frame</option>
                <option value="BRICK">Brick</option>
                <option value="CONCRETE">Concrete</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              <input 
                type="checkbox"
                name="security_system"
                checked={formData.security_system}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', marginRight: '8px' }}
              />
              Property has an active, monitored security system
            </label>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Property'}
            </button>
            <Link to="/customer/properties" className="btn-primary" style={{ backgroundColor: 'var(--bg-white)', color: 'var(--text-main)', border: '1px solid var(--border-strong)' }}>
              Cancel
            </Link>
          </div>
          
        </form>
      </div>
    </div>
  );
}
