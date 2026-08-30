import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login(email, password);
      // Route based on role
      if (data.user.role === 'AGENT') {
        navigate('/agent/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left Branding Side */}
      <div className="auth-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <Shield size={48} color="white" style={{ marginRight: '16px' }} />
          <h1>HomeSure</h1>
        </div>
        <p>
          Enterprise Policy Administration System. Manage properties, assess risks, 
          generate quotes, and track policy lifecycles with our comprehensive platform.
        </p>
      </div>

      {/* Right Content Side */}
      <div className="auth-content">
        <div className="auth-form-container">
          <h2>Sign In</h2>
          <p className="subtitle">Welcome back. Please enter your credentials to access your account.</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                autoComplete="email"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                autoComplete="current-password"
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div style={{ marginTop: '32px', fontSize: '14px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Are you a new customer? <Link to="/register" style={{ fontWeight: '600' }}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
