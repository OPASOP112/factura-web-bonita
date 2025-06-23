
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface DocumentDetail {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  igvDetalle: number;
}

export interface Document {
  id?: number;
  fechaEmision: string;
  idCliente: number;
  idEmpresa: number;
  idTipoDocumento: number;
  idFormaPago: number;
  importeIGV: number;
  importeTotal: number;
  detalles: DocumentDetail[];
}

export const getAllDocuments = async (): Promise<Document[]> => {
  const response = await fetch(`${API_URL}/documentos`);
  if (!response.ok) {
    throw new Error('Error al obtener documentos');
  }
  return response.json();
};

export const getDocumentById = async (id: number): Promise<Document> => {
  const response = await fetch(`${API_URL}/documentos/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener documento');
  }
  return response.json();
};

export const createDocument = async (document: Document): Promise<Document> => {
  const response = await fetch(`${API_URL}/documentos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(document),
  });
  if (!response.ok) {
    throw new Error('Error al crear documento');
  }
  return response.json();
};

export const updateDocument = async (id: number, document: Document): Promise<Document> => {
  const response = await fetch(`${API_URL}/documentos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(document),
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
