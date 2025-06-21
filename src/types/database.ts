
// Database schema types based on your provided structure

export interface TipoDocumento {
  id: number;
  descripcion: string;
}

export interface FormaPago {
  id: number;
  descripcion: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
}

export interface Empresa {
  id: number;
  razonSocial: string;
  ruc: string;
  direccion: string;
}

export interface Oferta {
  id: number;
  descuento: number;
  fechaInicio: Date;
  fechaFin: Date;
  idProducto: number;
}

export interface Producto {
  id: number;
  descripcion: string;
}

export interface Tarifario {
  id: number;
  fechaInicio: Date;
  fechaFin: Date;
  precio: number;
  idProducto: number;
}

export interface Documento {
  id: number;
  fechaEmision: Date;
  importeTotal: number;
  importeIGV: number;
  idCliente: number;
  idEmpresa: number;
  idFormaPago: number;
  idTipoDocumento: number;
}

export interface DocumentoDetalle {
  id: number;
  precioUnitario: number;
  cantidad: number;
  igvDetalle: number;
  descuento: number;
  idDocumento: number;
  idProducto: number;
}
