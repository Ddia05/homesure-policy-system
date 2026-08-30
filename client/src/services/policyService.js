import api from './api';

export const policyService = {
  // Customer Methods
  getAllCustomer: async () => {
    const response = await api.get('/policies');
    return response.data.policies;
  },
  
  getCustomerById: async (id) => {
    const response = await api.get(`/policies/${id}`);
    return response.data.policy;
  },

  // Agent Methods
  getAllAgent: async () => {
    const response = await api.get('/agent/policies');
    return response.data.policies;
  },
  
  getAgentById: async (id) => {
    const response = await api.get(`/agent/policies/${id}`);
    return response.data.policy;
  }
};
