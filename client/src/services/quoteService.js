import api from './api';

export const quoteService = {
  getAll: async () => {
    const response = await api.get('/quotes');
    return response.data.quotes;
  },
  
  getById: async (id) => {
    const response = await api.get(`/quotes/${id}`);
    return response.data.quote;
  },
  
  create: async (data) => {
    const response = await api.post('/quotes', data);
    return response.data.quote;
  }
};
