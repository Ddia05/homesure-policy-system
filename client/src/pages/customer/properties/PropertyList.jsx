import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../../services/propertyService';
import { Plus, Search, Trash2, Edit, Eye } from 'lucide-react';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // For deletion
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone unless restricted by existing policies.')) {
      return;
    }
    
    setDeleteError(null);
    setDeletingId(id);
    
    try {
      await propertyService.delete(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete property.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.property_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Properties</h1>
        <Link to="/customer/properties/new" className="btn btn-primary">
          <Plus size={16} className="btn-icon" />
          Add Property
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {deleteError && <div className="error-message">{deleteError}</div>}

      <div className="card">
        <div className="card-body">
          <div className="toolbar">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by address or property type..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-state">Loading properties...</div>
          ) : filteredProperties.length === 0 ? (
            <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
              {searchTerm ? 'No properties match your search.' : 'You have not added any properties yet.'}
            </div>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Address</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Built</th>
                    <th>Security System</th>
                    <th className="actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property, index) => (
                    <tr key={property.id}>
                      <td style={{ fontWeight: '500' }}>{index + 1}</td>
                      <td>{property.address}</td>
                      <td>{property.property_type.replace(/_/g, ' ')}</td>
                      <td>${parseFloat(property.property_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>{property.construction_year}</td>
                      <td>{property.security_system ? 'Yes' : 'No'}</td>
                      <td className="actions">
                        <Link to={`/customer/properties/${property.id}`} className="btn-text" title="View">
                          <Eye size={16} />
                        </Link>
                        <Link to={`/customer/properties/${property.id}/edit`} className="btn-text" title="Edit">
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(property.id)} 
                          className="btn-text"
                          style={{ color: 'var(--status-red)' }}
                          title="Delete"
                          disabled={deletingId === property.id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
