
import { Producto, ApiResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getAllProducts = async (): Promise<Producto[]> => {
  const response = await fetch(`${API_URL}/productos`);
  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }
  return response.json();
};

export const getProductById = async (id: number): Promise<Producto> => {
  const response = await fetch(`${API_URL}/productos/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener producto');
  }
  return response.json();
};

export const createProduct = async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
  const response = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(producto),
  });
  if (!response.ok) {
    throw new Error('Error al crear producto');
  }
  return response.json();
};

export const updateProduct = async (id: number, producto: Omit<Producto, 'id'>): Promise<Producto> => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(producto),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar producto');
  }
  return response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar producto');
  }
};
