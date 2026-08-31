import api from './api';

export const dashboardService = {
  async getCustomerDashboardData() {
    try {
      const [policiesRes, applicationsRes, quotesRes, requestsRes, propertiesRes] = await Promise.all([
        api.get('/policies'),
        api.get('/applications'),
        api.get('/quotes'),
        api.get('/policy-requests'),
        api.get('/properties')
      ]);

      return {
        policies: policiesRes.data.policies || [],
        applications: applicationsRes.data.applications || [],
        quotes: quotesRes.data.quotes || [],
        policyRequests: requestsRes.data.policyRequests || requestsRes.data.requests || [],
        properties: propertiesRes.data.properties || []
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  async getAgentDashboardData() {
    try {
      const [applicationsRes, policiesRes, requestsRes] = await Promise.all([
        api.get('/agent/applications'),
        api.get('/agent/policies'),
        api.get('/agent/policy-requests')
      ]);

      return {
        applications: applicationsRes.data.applications || [],
        policies: policiesRes.data.policies || [],
        policyRequests: requestsRes.data.policyRequests || requestsRes.data.requests || []
      };
    } catch (error) {
      console.error('Error fetching agent dashboard data:', error);
      throw error;
    }
  }
};
