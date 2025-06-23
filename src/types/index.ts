
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
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  igvDetalle: number;
}

export interface Documento {
  id?: number;
  fechaEmision: string;
  idCliente: number;
  idEmpresa: number;
  idTipoDocumento: number;
  idFormaPago: number;
  importeIGV: number;
  importeTotal: number;
  detalles: DetalleDocumento[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
