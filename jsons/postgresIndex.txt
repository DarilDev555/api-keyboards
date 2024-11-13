import express from "express";
import { sequelize } from './connection.mjs';
import { Cliente, Producto, Compra, DetalleCompra } from './models.mjs';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Keyboard Store API!');
});

// Obtener todos los clientes
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        return res.json({ clientes });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Crear un nuevo cliente
app.post('/clientes', async (req, res) => {
    try {
        const { nombre, correoElectronico, direccion, telefono } = req.body;
        if (!nombre || !correoElectronico) {
            return res.status(400).json({ message: 'Nombre y Correo Electrónico son requeridos' });
        }
        const nuevoCliente = await Cliente.create({ nombre, correoElectronico, direccion, telefono });
        return res.status(201).json({ cliente: nuevoCliente });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Actualizar un cliente por id
app.put('/clientes/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        const { nombre, correoElectronico, direccion, telefono } = req.body;
        if (nombre) {
            cliente.nombre = nombre;
        }
        if (correoElectronico) {
            cliente.correoElectronico = correoElectronico;
        }
        if (direccion) {
            cliente.direccion = direccion;
        }
        if (telefono) {
            cliente.telefono = telefono;
        }
        await cliente.save();
        return res.json({ cliente });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Eliminar un cliente por id
app.delete('/clientes/:id', async (req, res) => {
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
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.findAll();
        return res.json({ productos });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Crear un nuevo producto
app.post('/productos', async (req, res) => {
    try {
        const { nombre, tipoProducto, descripcion, precio, stock } = req.body;
        if (!nombre || !precio || !stock) {
            return res.status(400).json({ message: 'Nombre, Precio y Stock son requeridos' });
        }
        const nuevoProducto = await Producto.create({ nombre, tipoProducto, descripcion, precio, stock });
        return res.status(201).json({ producto: nuevoProducto });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Actualizar un producto por id
app.put('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const { nombre, tipoProducto, descripcion, precio, stock } = req.body;
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
        await producto.save();
        return res.json({ producto });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Eliminar un producto por id
app.delete('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await producto.destroy();
        return res.json({ message: 'Producto eliminado' });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Obtener todas las compras
app.get('/compras', async (req, res) => {
    try {
        const compras = await Compra.findAll({ include: DetalleCompra });
        return res.json({ compras });
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Obtener una compra por id
app.get('/compras/:id', async (req, res) => {
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
app.post('/compras', async (req, res) => {
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
app.put('/compras/:id', async (req, res) => {
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
app.delete('/compras/:id', async (req, res) => {
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
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error de conexión', error);
    });
