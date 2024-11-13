import { DataTypes } from 'sequelize';
import { sequelize } from './connection.mjs';

// Modelo Usuarios
const Usuario = sequelize.define('Usuario', {
    nombreUsuario: { type: DataTypes.STRING, allowNull: false, unique: true },
    contrasena: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.ENUM('cliente', 'administrador'), allowNull: false },
    correoElectronico: { type: DataTypes.STRING, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'Usuarios' });

// Modelo Clientes
const Cliente = sequelize.define('Cliente', {
    nombre: { type: DataTypes.STRING },
    apellidoPaterno: { type: DataTypes.STRING },
    apellidoMaterno: { type: DataTypes.STRING },
    correoElectronico: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'Clientes' });

// Modelo Direcciones
const Direccion = sequelize.define('Direccion', {
    calle: { type: DataTypes.STRING, allowNull: false },
    numeroExterior: { type: DataTypes.STRING },
    numeroInterior: { type: DataTypes.STRING },
    colonia: { type: DataTypes.STRING },
    ciudad: { type: DataTypes.STRING, allowNull: false },
    estado: { type: DataTypes.STRING, allowNull: false },
    codigoPostal: { type: DataTypes.STRING, allowNull: false },
    pais: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'Direcciones' });

// Modelo Productos
const Producto = sequelize.define('Producto', {
    nombre: { type: DataTypes.STRING },
    precio: { type: DataTypes.DECIMAL(10, 2) },
    descripcion: { type: DataTypes.STRING },
    stock: { type: DataTypes.INTEGER },
    urlImagen: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'Productos' });

// Modelo Categoria
const Categoria = sequelize.define('Categoria', {
    nombreCategoria: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.STRING }
}, { tableName: 'Categoria' });

// Modelo Proveedores
const Proveedor = sequelize.define('Proveedor', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    contacto: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'Proveedores' });

// Modelo ComprasProveedores
const CompraProveedor = sequelize.define('CompraProveedor', {
    fechaCompra: { type: DataTypes.DATE, allowNull: false },
    totalCompra: { type: DataTypes.DECIMAL(10, 2) },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'ComprasProveedores' });

// Modelo DetallesCompraProveedor
const DetalleCompraProveedor = sequelize.define('DetalleCompraProveedor', {
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precioCompra: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2) },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'DetallesCompraProveedor' });

// Modelo Ventas
const Venta = sequelize.define('Venta', {
    fechaVenta: { type: DataTypes.DATE, allowNull: false },
    totalVenta: { type: DataTypes.DECIMAL(10, 2) },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'Ventas' });

// Modelo DetallesVenta
const DetalleVenta = sequelize.define('DetalleVenta', {
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precioVenta: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2) },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'DetallesVenta' });

// Modelo Pagos
const Pago = sequelize.define('Pago', {
    metodoPago: { type: DataTypes.STRING, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estadoPago: { type: DataTypes.ENUM('pendiente', 'completado', 'fallido'), allowNull: false, defaultValue: 'pendiente' },
    fechaPago: { type: DataTypes.DATE, allowNull: false },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'Pagos' });

// Modelo Carrito
const Carrito = sequelize.define('Carrito', {
    fechaCreacion: { type: DataTypes.DATE, allowNull: false },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'Carrito' });

// Modelo DetallesCarrito
const DetalleCarrito = sequelize.define('DetalleCarrito', {
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
}, { tableName: 'DetallesCarrito' });

// Relaciones
Cliente.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Direccion.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria' });
Proveedor.belongsTo(Direccion, { foreignKey: 'id_direccion' });
CompraProveedor.belongsTo(Proveedor, { foreignKey: 'id_proveedor' });
DetalleCompraProveedor.belongsTo(CompraProveedor, { foreignKey: 'id_compra' });
DetalleCompraProveedor.belongsTo(Producto, { foreignKey: 'codigo_producto' });
Venta.belongsTo(Cliente, { foreignKey: 'id_cliente' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'codigo_producto' });
Pago.belongsTo(Venta, { foreignKey: 'id_venta' });
Carrito.belongsTo(Cliente, { foreignKey: 'id_cliente' });
DetalleCarrito.belongsTo(Carrito, { foreignKey: 'id_carrito' });
DetalleCarrito.belongsTo(Producto, { foreignKey: 'codigo_producto' });

export {
    Usuario,
    Cliente,
    Direccion,
    Producto,
    Categoria,
    Proveedor,
    CompraProveedor,
    DetalleCompraProveedor,
    Venta,
    DetalleVenta,
    Pago,
    Carrito,
    DetalleCarrito
};