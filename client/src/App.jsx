import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { RoleRoute } from './components/routing/RoleRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';

// Customer Property Pages
import PropertyList from './pages/customer/properties/PropertyList';
import PropertyForm from './pages/customer/properties/PropertyForm';
import PropertyDetail from './pages/customer/properties/PropertyDetail';

// Customer Quote Pages
import QuoteList from './pages/customer/quotes/QuoteList';
import QuoteForm from './pages/customer/quotes/QuoteForm';
import QuoteDetail from './pages/customer/quotes/QuoteDetail';

// Customer Application Pages
import ApplicationList from './pages/customer/applications/ApplicationList';
import ApplicationForm from './pages/customer/applications/ApplicationForm';
import ApplicationDetail from './pages/customer/applications/ApplicationDetail';

// Agent Application Pages
import AgentApplicationList from './pages/agent/applications/AgentApplicationList';
import AgentApplicationDetail from './pages/agent/applications/AgentApplicationDetail';

// Customer Policy Pages
import PolicyList from './pages/customer/policies/PolicyList';
import PolicyDetail from './pages/customer/policies/PolicyDetail';

// Agent Policy Pages
import AgentPolicyList from './pages/agent/policies/AgentPolicyList';
import AgentPolicyDetail from './pages/agent/policies/AgentPolicyDetail';

// Customer Policy Request Pages
import PolicyRequestList from './pages/customer/policy-requests/PolicyRequestList';
import PolicyRequestForm from './pages/customer/policy-requests/PolicyRequestForm';

// Agent Policy Request Pages
import AgentPolicyRequestList from './pages/agent/policy-requests/AgentPolicyRequestList';
import AgentPolicyRequestDetail from './pages/agent/policy-requests/AgentPolicyRequestDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          
          {/* Customer Area */}
          <Route path="/customer" element={<RoleRoute requiredRole="CUSTOMER" />}>
            <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard role="CUSTOMER" />} />
              <Route path="properties" element={<PropertyList />} />
              <Route path="properties/new" element={<PropertyForm />} />
              <Route path="properties/:id" element={<PropertyDetail />} />
              <Route path="properties/:id/edit" element={<PropertyForm />} />
              <Route path="quotes" element={<QuoteList />} />
              <Route path="quotes/new" element={<QuoteForm />} />
              <Route path="quotes/:id" element={<QuoteDetail />} />
              <Route path="applications" element={<ApplicationList />} />
              <Route path="applications/new" element={<ApplicationForm />} />
              <Route path="applications/:id" element={<ApplicationDetail />} />
              <Route path="policies" element={<PolicyList />} />
              <Route path="policies/:id" element={<PolicyDetail />} />
              <Route path="policy-requests" element={<PolicyRequestList />} />
              <Route path="policy-requests/new" element={<PolicyRequestForm />} />
            </Route>
          </Route>

          {/* Agent Area */}
          <Route path="/agent" element={<RoleRoute requiredRole="AGENT" />}>
            <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard role="AGENT" />} />
              <Route path="applications" element={<AgentApplicationList />} />
              <Route path="applications/:id" element={<AgentApplicationDetail />} />
              <Route path="policies" element={<AgentPolicyList />} />
              <Route path="policies/:id" element={<AgentPolicyDetail />} />
              <Route path="policy-requests" element={<AgentPolicyRequestList />} />
              <Route path="policy-requests/:id" element={<AgentPolicyRequestDetail />} />
            </Route>
          </Route>

        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
