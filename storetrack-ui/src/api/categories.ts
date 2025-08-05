import apiClient from './axios';

export const deleteCategory = (id: number) => {
  return apiClient.delete(`/categories/${id}`);
};