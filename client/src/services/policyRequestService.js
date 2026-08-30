import api from './api';

export const policyRequestService = {
  // Customer Methods
  getAllCustomer: async () => {
    const response = await api.get('/policy-requests');
    return response.data.policyRequests;
  },
  
  create: async (data) => {
    const response = await api.post('/policy-requests', data);
    return response.data.policyRequest;
  },

  // Agent Methods
  getAllAgent: async () => {
    const response = await api.get('/agent/policy-requests');
    return response.data.policyRequests;
  },
  
  getAgentById: async (id) => {
    const response = await api.get(`/agent/policy-requests/${id}`);
    return response.data.policyRequest;
  },
  
  approve: async (id) => {
    const response = await api.put(`/agent/policy-requests/${id}/approve`);
    return response.data.policyRequest;
  },
  
  reject: async (id) => {
    const response = await api.put(`/agent/policy-requests/${id}/reject`);
    return response.data.policyRequest;
  }
};
