import api from './api';

export const planService = {
  getAll: async () => {
    const response = await api.get('/plans');
    return response.data.plans;
  },
  
  getById: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data.plan;
  }
};
