import axios from 'axios'

export const signIn = (email: string, password: string) =>
  axios.post('/api/auth/signin', { email, password })

export const signUp = (email: string, password: string) =>
  axios.post('/api/auth/signup', { email, password })
