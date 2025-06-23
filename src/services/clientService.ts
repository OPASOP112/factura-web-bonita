
import { Cliente, ApiResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getAllClients = async (): Promise<Cliente[]> => {
  const response = await fetch(`${API_URL}/clientes`);
  if (!response.ok) {
    throw new Error('Error al obtener clientes');
  }
  return response.json();
};

export const getClientById = async (id: number): Promise<Cliente> => {
  const response = await fetch(`${API_URL}/clientes/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener cliente');
  }
  return response.json();
};

export const createClient = async (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
  const response = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  });
  if (!response.ok) {
    throw new Error('Error al crear cliente');
  }
  return response.json();
};

export const updateClient = async (id: number, cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar cliente');
  }
  return response.json();
};

export const deleteClient = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar cliente');
  }
};
