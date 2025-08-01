import apiClient from './axios';

export const signIn = (email: string, password: string) =>
  apiClient.post('/signin', { email, password });

export const signUp = (email: string, password: string) =>
  apiClient.post('/signup', { email, password }); 