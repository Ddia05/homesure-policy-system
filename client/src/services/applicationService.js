import api from './api';

export const applicationService = {
  // Customer Methods
  getAllCustomer: async () => {
    const response = await api.get('/applications');
    return response.data.applications;
  },
  
  getCustomerById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data.application;
  },
  
  create: async (quoteId) => {
    const response = await api.post('/applications', { quoteId });
    return response.data.application;
  },

  // Agent Methods
  getAllAgent: async () => {
    const response = await api.get('/agent/applications');
    return response.data.applications;
  },
  
  getAgentById: async (id) => {
    const response = await api.get(`/agent/applications/${id}`);
    return response.data.application;
  },
  
  approve: async (id, reviewNotes) => {
    const response = await api.put(`/agent/applications/${id}/approve`, { reviewNotes });
    return response.data.application;
  },
  
  reject: async (id, reviewNotes) => {
    const response = await api.put(`/agent/applications/${id}/reject`, { reviewNotes });
    return response.data.application;
  },

  issuePolicy: async (id) => {
    const response = await api.post(`/agent/applications/${id}/issue-policy`);
    return response.data.policy;
  }
};
