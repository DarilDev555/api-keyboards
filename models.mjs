import { DataTypes } from 'sequelize';
import { sequelize } from './connection.mjs';

const Cliente = sequelize.define('Cliente', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    direccion: {
        type: DataTypes.STRING
    },
    telefono: {
        type: DataTypes.STRING
    }
}, { tableName: 'clientes' });

const Producto = sequelize.define('Producto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipoProducto: {
        type: DataTypes.ENUM('Switch', 'PCB', 'Keycap', 'Placa', 'tecladoCustom', 'tecladoPreensamblado'),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { tableName: 'productos' });

const Compra = sequelize.define('Compra', {
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, { tableName: 'compras' });


const DetalleCompra = sequelize.define('DetalleCompra', {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precioUnitario: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, { tableName: 'detalles_compra' });

// Relaciones
Cliente.hasMany(Compra, { foreignKey: 'clienteId' }); // Un cliente puede tener muchas compras
Compra.belongsTo(Cliente, { foreignKey: 'clienteId' }); // Una compra pertenece a un cliente

Compra.hasMany(DetalleCompra, { foreignKey: 'compraId' }); // Una compra puede tener muchos detalles
DetalleCompra.belongsTo(Compra, { foreignKey: 'compraId' }); // Un detalle pertenece a una compra

Producto.hasMany(DetalleCompra, { foreignKey: 'productoId' }); // Un producto puede estar en muchos detalles
DetalleCompra.belongsTo(Producto, { foreignKey: 'productoId' }); // Un detalle pertenece a un producto

export {
    Cliente,
    Producto,
    Compra,
    DetalleCompra
};
