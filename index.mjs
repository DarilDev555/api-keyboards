import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sequelize } from './connection.mjs';
import { Usuario, Cliente, Direccion, Producto, Categoria, Proveedor, CompraProveedor, DetalleCompraProveedor, Venta, DetalleVenta, Pago, Carrito, DetalleCarrito } from './models.mjs';
import cors from 'cors';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
dotenv.config();
app.use(cors());



const generateAccessToken = (Usuario) => {
    // user debe ser un objeto, por ejemplo: { username: 'nombre' }
    return jwt.sign(Usuario, process.env.SECRET, { expiresIn: '50m' });
};

const validateToken = (req, res, next) => {
    const accessToken = req.headers['authorization'] || req.query.accessToken;
    if (!accessToken) res.send('Acceso denegado');

    jwt.verify(accessToken, process.env.SECRET, (err, user) => {
        if (err) {
            return res.send('Acceso Denegado, Token inválido o expirado');
        }
        req.Usuario = Usuario;
        next();
    });

};

const verificarUsuario = async (nombreUsuario2, contrasena) => {
    try {
        // Busca el usuario en la base de datos
        const usuario = await Usuario.findOne({ where: { nombreUsuario: nombreUsuario2 } });

        if (!usuario) {
            // Usuario no encontrado
            console.log('Usuario no encontrado');
            return 1;
        }

        // Verifica si la contraseña coincide
        if (usuario.contrasena === contrasena) {
            return 0;
        } else {
            return 2;
        }
    } catch (error) {
        console.log('Error en la verificación de usuario:', error);
        return 3;
    }
};


app.get('/', (req, res) => {
    res.send('Hello Keyboard Store API!');
});

app.get('/usuarios', validateToken, async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        return res.json({ usuarios: usuarios });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/usuarios', async (req, res) => {
    try {
        const { nombreUsuario, contrasena, rol, correoElectronico } = req.body;
        if (!nombreUsuario || !contrasena || !rol || !correoElectronico) {
            return res.status(400).json({ message: 'Nombre de Usuario, Contraseña, Rol y Correo Electrónico son requeridos' });
        }
        const nuevoUsuario = await Usuario.create({ nombreUsuario, contrasena, rol, correoElectronico });
        return res.status(201).json({ usuario: nuevoUsuario });
    }
    catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { nombreUsuario, contrasena } = req.body;

    if (!nombreUsuario || !contrasena) {
        return res.status(400).json({ message: 'Usuario o contraseña no proporcionado' });
    }
    const isVerified = await verificarUsuario(nombreUsuario, contrasena);
    if (isVerified === 0) {
        const nombreUsuario2 = nombreUsuario;
        const usuario = await Usuario.findOne({ where: { nombreUsuario: nombreUsuario2 } });
        const accessToken = generateAccessToken({ nombreUsuario: nombreUsuario });
        return res.header('authorization', accessToken).json({
            message: 'Login exitoso',
            accessToken: accessToken,
            usuario: usuario
        });
    } else {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos ' + isVerified });
    }
});


// Obtener todos los clientes
app.get('/clientes', validateToken, async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        return res.json({ 
            message: 'Clientes obtenidos correctamente',
            username: req.user, 
            clientes 
        });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Crear un nuevo cliente
app.post('/clientes', validateToken, async (req, res) => {
    try{
        const { nombre, apellidoPaterno, apellidoMaterno, correoElectronico, telefono } = req.body;
        if (!nombre || !correoElectronico) {
            return res.status(400).json({ message: 'Nombre y Correo Electrónico son requeridos' });
        }
        const nuevoCliente = await Cliente.create({ nombre, apellidoPaterno, apellidoMaterno, correoElectronico, telefono });
        return res.status(201).json({
            message: 'Cliente creado correctamente',
            cliente: nuevoCliente 
        });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Actualizar un cliente por id
app.put('/clientes/:id', validateToken, async (req, res) => {
    try{
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        const { nombre, apellidoPaterno, apellidoMaterno, correoElectronico, telefono } = req.body;
        if (nombre) {
            cliente.nombre = nombre;
        }
        if (apellidoPaterno) {
            cliente.apellidoPaterno = apellidoPaterno;
        }
        if (apellidoMaterno) {
            cliente.apellidoMaterno = apellidoMaterno;
        }
        if (correoElectronico) {
            cliente.correoElectronico = correoElectronico;
        }
        if (telefono) {
            cliente.telefono = telefono;
        }
        await cliente.save();
        return res.json({ 
            message: 'Cliente actualizado correctamente',
            cliente: cliente 
        });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    // try {
    //     const cliente = await Cliente.findByPk(req.params.id);
    //     if (!cliente) {
    //         return res.status(404).json({ message: 'Cliente no encontrado' });
    //     }
    //     const { nombre, correoElectronico, direccion, telefono } = req.body;
    //     if (nombre) {
    //         cliente.nombre = nombre;
    //     }
    //     if (correoElectronico) {
    //         cliente.correoElectronico = correoElectronico;
    //     }
    //     if (direccion) {
    //         cliente.direccion = direccion;
    //     }
    //     if (telefono) {
    //         cliente.telefono = telefono;
    //     }
    //     await cliente.save();
    //     return res.json({ cliente });
    // } catch (error) {
    //     console.log('Error', error);
    //     return res.status(500).json({ message: 'Internal server error' });
    // }
});

// Eliminar un cliente por id
app.delete('/clientes/:id', validateToken, async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        await cliente.destroy();
        return res.json({ message: 'Cliente eliminado' });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Obtener todos los productos
app.get('/productos', validateToken, async (req, res) => {
    try {
        const productos = await Producto.findAll();
        return res.json({ 
            message: 'Productos obtenidos correctamente',
            productos
        });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Crear un nuevo producto
app.post('/productos', validateToken, async (req, res) => {
    try {
        const { nombre, tipoProducto, descripcion, precio, stock, urlImagen } = req.body;
        if (!nombre || !precio || !stock) {
            return res.status(400).json({ message: 'Nombre, Precio y Stock son requeridos' });
        }
        const nuevoProducto = await Producto.create({ nombre, tipoProducto, descripcion, precio, stock, urlImagen });
        return res.status(201).json({
            message: 'Producto creado correctamente',
            producto: nuevoProducto });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Actualizar un producto por id
app.put('/productos/:id', validateToken, async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const { nombre, tipoProducto, descripcion, precio, stock, urlImagen } = req.body;
        if (nombre) {
            producto.nombre = nombre;
        }
        if (tipoProducto) {
            producto.tipoProducto = tipoProducto;
        }
        if (descripcion) {
            producto.descripcion = descripcion;
        }
        if (precio) {
            producto.precio = precio;
        }
        if (stock) {
            producto.stock = stock;
        }
        if (urlImagen) {
            producto.urlImagen = urlImagen;
        }
        await producto.save();
        return res.json({ 
            message: 'Producto actualizado correctamente',
            producto });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Eliminar un producto por id
app.delete('/productos/:id', validateToken, async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await producto.destroy();include
        return res.json({ message: 'Producto eliminado' });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//crear Venta
app.post('/ventas', validateToken, async (req, res) => {
    console.log('req.body', req.body);
    let detallesVenta = [];
    let totalVenta = 0;
    try {
        const { clienteId, detalles } = req.body;  // detalles es un array de objetos [{ productoId, cantidad, precioUnitario }]
        if (!clienteId || !detalles || !detalles.length) {
            return res.status(400).json({ message: 'Datos incompletos para crear la venta' });
        }
        for (let detalle of detalles) {
            totalVenta += detalle.cantidad * detalle.precioUnitario;
        
        }
        const nuevaVenta = await Venta.create({
            id_cliente: clienteId,
            totalVenta: totalVenta,
            fechaVenta: new Date()
            });
        for (let detalle of detalles) {

            detallesVenta.push( await DetalleVenta.create({
                id_venta: nuevaVenta.id,
                codigo_producto: detalle.productoId,
                cantidad: detalle.cantidad,
                precioVenta: detalle.precioUnitario,
                subtotal: detalle.cantidad * detalle.precioUnitario
            })
            
            );
            // Actualizar stock
            const producto = await Producto.findByPk(detalle.productoId);
            producto.stock -= detalle.cantidad;
            await producto.save();

        }
        return res.status(201).json({ message: 'Venta creada correctamente' });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Obtener todas las ventas
app.get('/ventas', validateToken, async (req, res) => {
    try {
        const ventas = await Venta.findAll();
        return res.json({ ventas });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Eliminar una venta por id
app.delete('/ventas/:id', validateToken, async (req, res) => {
    try {
        const venta = await Venta.findByPk(req.params.id);
        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        await venta.destroy();
        return res.json({ message: 'Venta eliminada' });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
);




// Obtener todas las compras
app.get('/compras', validateToken, async (req, res) => {
    try {
        const compras = await Compra.findAll({ include: DetalleCompra });
        return res.json({ compras });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Obtener una compra por id
app.get('/compras/:id', validateToken, async (req, res) => {
    try {
        const compra = await Compra.findByPk(req.params.id, { include: DetalleCompra });
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        return res.json({ compra });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Crear una nueva compra
app.post('/compras', validateToken, async (req, res) => {
    try {
        const { clienteId, total, detalles } = req.body;  // detalles es un array de objetos [{ productoId, cantidad, precioUnitario }]
        if (!clienteId || !total || !detalles || !detalles.length) {
            return res.status(400).json({ message: 'Datos incompletos para crear la compra' });
        }
        const nuevaCompra = await Compra.create({ clienteId, total, fecha: new Date() });
        for (let detalle of detalles) {
            await DetalleCompra.create({
                compraId: nuevaCompra.id,
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario
            });
        }
        return res.status(201).json({ compra: nuevaCompra });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Actualizar una compra por id
app.put('/compras/:id', validateToken, async (req, res) => {
    try {
        const compra = await Compra.findByPk(req.params.id);
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        const { clienteId, total } = req.body;
        if (clienteId) {
            compra.clienteId = clienteId;
        }
        if (total) {
            compra.total = total;
        }
        await compra.save();
        return res.json({ compra });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Eliminar una compra por id
app.delete('/compras/:id', validateToken, async (req, res) => {
    try {
        const compra = await Compra.findByPk(req.params.id);
        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        await compra.destroy();
        return res.json({ message: 'Compra eliminada' });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});




// 
sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión exitosa');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Modelos sincronizados');
        app.listen(port, '192.168.1.89',() => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error de conexión', error);
    });
