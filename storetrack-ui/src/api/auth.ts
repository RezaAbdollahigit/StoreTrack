// src/api/auth.ts
import apiClient from './axios'; // Use the new instance

export const signIn = (email: string, password: string) =>
  apiClient.post('/auth/signin', { email, password });

export const signUp = (email: string, password: string) =>
  apiClient.post('/auth/signup', { email, password });