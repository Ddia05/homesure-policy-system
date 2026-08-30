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
  }
};
