
export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
}

export interface Empresa {
  id?: number;
  razonSocial: string;
  ruc: string;
  direccion: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  codigo: string;
  precio: number;
  stock: number;
  categoria: string;
  descripcion: string;
}

export interface DetalleDocumento {
  id?: number;
  idDocumento: number;
  idProducto: number;
  precioUnitario: number;
  cantidad: number;
  igvDetalle: number;
  descuento: number;
}

export interface Documento {
  id?: number;
  fechaEmision: string;
  importeTotal: number;
  importeIGV: number;
  idCliente: number;
  idEmpresa: number;
  idTipoDocumento: number;
  idFormaPago: number;
  detalles?: DetalleDocumento[];
}

export interface DocumentoDTO {
  id?: number;
  fechaEmision: string;
  importeTotal: number;
  importeIGV: number;
  idCliente: number;
  idEmpresa: number;
  idTipoDocumento: number;
  idFormaPago: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
