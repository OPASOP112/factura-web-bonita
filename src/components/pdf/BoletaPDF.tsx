import React from 'react';
import { pdf } from '@react-pdf/renderer';
import {
  Document as PDFDocument,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import Logo from '../../assets/logo-upn.png'
import { Documento, DetalleDocumento, Producto, Cliente, Empresa } from '@/types';



const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 40,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  section: { marginBottom: 10 },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 16, fontWeight: 'bold' },
  subTitle: { fontSize: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bold: { fontWeight: 'bold' },
  table: { marginTop: 10, borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row' },
  tableHeader: {
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableCol: { flex: 1, padding: 5, borderRightWidth: 1, borderColor: '#000' },
  tableLastCol: { flex: 1, padding: 5 },
  totalBox: { marginTop: 10, alignSelf: 'flex-end', width: '40%' },
});

type BoletaPDFProps = {
  documento: Documento;
  detalles: DetalleDocumento[];
  productos: Producto[];
  cliente: Cliente;
  empresa: Empresa;
  numeroDocumento: string;
};

const BoletaPDF: React.FC<BoletaPDFProps> = ({
  documento,
  detalles,
  productos,
  cliente,
  empresa,
  numeroDocumento,
}) => {
  const subtotal = detalles.reduce(
    (sum, item) => sum + item.cantidad * item.precioUnitario - item.descuento,
    0
  );
  const totalIGV = detalles.reduce((sum, item) => sum + item.igvDetalle, 0);
  const total = subtotal + totalIGV;

  return (
    <PDFDocument>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            src={Logo}
            style={{ width: 80, height: 80, marginBottom: 10 }}
          />
          <Text style={styles.title}>Sistema Facturación EF POO</Text>
          <Text style={styles.subTitle}>
            RUC: {empresa.ruc} - {empresa.razonSocial}
          </Text>
          <Text style={styles.subTitle}>{empresa.direccion}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>BOLETA DE VENTA</Text>
          <Text>N° {numeroDocumento}</Text>
          <Text>Fecha de emisión: {documento.fechaEmision}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Cliente:</Text>
          <Text>
            {cliente.nombre} {cliente.apellido}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Producto</Text>
            <Text style={styles.tableCol}>Código</Text>
            <Text style={styles.tableCol}>Cantidad</Text>
            <Text style={styles.tableCol}>P. Unitario</Text>
            <Text style={styles.tableCol}>Descuento</Text>
            <Text style={styles.tableLastCol}>IGV</Text>
          </View>
          {detalles.map((detalle, index) => {
            const producto = productos.find(p => p.id === detalle.idProducto);
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCol}>{producto?.nombre}</Text>
                <Text style={styles.tableCol}>{producto?.codigo}</Text>
                <Text style={styles.tableCol}>{detalle.cantidad}</Text>
                <Text style={styles.tableCol}>
                  S/. {detalle.precioUnitario.toFixed(2)}
                </Text>
                <Text style={styles.tableCol}>
                  S/. {detalle.descuento.toFixed(2)}
                </Text>
                <Text style={styles.tableLastCol}>
                  S/. {detalle.igvDetalle.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalBox}>
          <Text>Subtotal: S/. {subtotal.toFixed(2)}</Text>
          <Text>IGV (18%): S/. {totalIGV.toFixed(2)}</Text>
          <Text style={styles.bold}>Total: S/. {total.toFixed(2)}</Text>
        </View>
      </Page>
    </PDFDocument>
  );
};

export default BoletaPDF;
