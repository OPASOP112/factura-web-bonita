
import { Empresa, ApiResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getAllCompanies = async (): Promise<Empresa[]> => {
  const response = await fetch(`${API_URL}/empresas`);
  if (!response.ok) {
    throw new Error('Error al obtener empresas');
  }
  return response.json();
};

export const getCompanyById = async (id: number): Promise<Empresa> => {
  const response = await fetch(`${API_URL}/empresas/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener empresa');
  }
  return response.json();
};

export const createCompany = async (empresa: Omit<Empresa, 'id'>): Promise<Empresa> => {
  const response = await fetch(`${API_URL}/empresas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(empresa),
  });
  if (!response.ok) {
    throw new Error('Error al crear empresa');
  }
  return response.json();
};

export const updateCompany = async (id: number, empresa: Omit<Empresa, 'id'>): Promise<Empresa> => {
  const response = await fetch(`${API_URL}/empresas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(empresa),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar empresa');
  }
  return response.json();
};

export const deleteCompany = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/empresas/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar empresa');
  }
};
