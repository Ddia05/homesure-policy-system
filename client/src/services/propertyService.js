import api from './api';

export const propertyService = {
  getAll: async () => {
    const response = await api.get('/properties');
    return response.data.properties;
  },
  
  getById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data.property;
  },
  
  create: async (data) => {
    const response = await api.post('/properties', data);
    return response.data.property;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/properties/${id}`, data);
    return response.data.property;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  }
};
