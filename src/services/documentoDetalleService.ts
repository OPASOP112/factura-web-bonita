
import { DetalleDocumento } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getDetallesByDocumento = async (idDocumento: number): Promise<DetalleDocumento[]> => {
  const response = await fetch(`${API_URL}/detalles/documento/${idDocumento}`);
  if (!response.ok) {
    throw new Error('Error al obtener detalles del documento');
  }
  return response.json();
};

export const createDetalle = async (detalle: Omit<DetalleDocumento, 'id'>): Promise<DetalleDocumento> => {
  const response = await fetch(`${API_URL}/detalles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(detalle),
  });
  if (!response.ok) {
    throw new Error('Error al crear detalle');
  }
  return response.json();
};

export const deleteDetalle = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/detalles/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar detalle');
  }
};
