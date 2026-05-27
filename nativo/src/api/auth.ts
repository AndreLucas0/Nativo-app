import { api } from './client';
import { AuthResponse, LoginDTO, SignupDTO } from '@/src/types/auth';

export async function login(data: LoginDTO) {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export async function signup(data: SignupDTO) {
  const response = await api.post<AuthResponse>('/auth/signup', data);
  return response.data;
}