import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      await register(submitData);
      
      // Successfully authenticated during registration, redirect to customer dashboard
      navigate('/customer/dashboard');
    } catch (err) {
      // Format validation errors if they exist, or fallback to generic message
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <Shield size={24} color="white" style={{ marginRight: '8px' }} />
            <h1>HomeSure</h1>
          </div>
          <p>Enterprise Policy Administration System</p>
        </div>

        <div className="auth-body">
          <h2 className="auth-title">Customer Registration</h2>
          <p className="auth-subtitle">Create a new customer profile</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input 
                id="name"
                name="name"
                type="text" 
                className="form-input" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                id="email"
                name="email"
                type="email" 
                className="form-input" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input 
                id="phone"
                name="phone"
                type="text" 
                className="form-input" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">Mailing Address</label>
              <textarea 
                id="address"
                name="address"
                className="form-input" 
                value={formData.address}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input 
                  id="password"
                  name="password"
                  type="password" 
                  className="form-input" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password" 
                  className="form-input" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Register Account'}
            </button>
          </form>
          
          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
