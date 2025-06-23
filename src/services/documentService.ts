
import { Documento, ApiResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getAllDocuments = async (): Promise<Documento[]> => {
  const response = await fetch(`${API_URL}/documentos`);
  if (!response.ok) {
    throw new Error('Error al obtener documentos');
  }
  return response.json();
};

export const getDocumentById = async (id: number): Promise<Documento> => {
  const response = await fetch(`${API_URL}/documentos/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener documento');
  }
  return response.json();
};

export const createDocument = async (documento: Omit<Documento, 'id'>): Promise<Documento> => {
  const response = await fetch(`${API_URL}/documentos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(documento),
  });
  if (!response.ok) {
    throw new Error('Error al crear documento');
  }
  return response.json();
};

export const updateDocument = async (id: number, documento: Omit<Documento, 'id'>): Promise<Documento> => {
  const response = await fetch(`${API_URL}/documentos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(documento),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar documento');
  }
  return response.json();
};

export const deleteDocument = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/documentos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar documento');
  }
};
