const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

const crearToken = (usuario,secreta, expiresIn) =>{
    const { id, email, nombre, apellido } = usuario;
    return jwt.sign( { id, email, nombre, apellido }, secreta, { expiresIn } )
}

//Resolvers
const resolvers = {
    Query: {
        //Querys Usuarios
        obtenerUsuario: async(_, { token }) => {
            try {
                const usuarioId = await jwt.verify(token,process.env.SECRETA);
                return usuarioId;
            } catch (error) {
                console.log(error);
            }
            
        },

        //Querys Producto
        obtenerProductos: async () => {
            try {
                const productos = await Producto.find({});
                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProducto: async (_, { id }) => {
            //revisar si existe o no
            const producto = await Producto.findById(id);

            if (!producto){
                throw new Error('Producto no encontrado')
            }

            return producto
        },
        //Querys Clientes
        obtenerClientes: async () => {
            try {
                const clientes = await Cliente.find({});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClientesVendedor: async (_, {}, ctx) => {
            try {
                const clientes = await Cliente.find({vendedor: ctx.usuario.id.toString()});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerCliente: async (_, { id }, ctx) => {
            // Revisar si existe o no
            const cliente = await Cliente.findById(id);
            if (!cliente){
                throw new Error('Cliente no encontrado')
            }
            // Quien lo creo puede verlo
            if (cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales')
            }
            return cliente
        },
    },

    Mutation: {
        //Mutation Usuarios

        nuevoUsuario: async (_, { input } ) => {
            
            const { email, password } = input

            //Revisar si el usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario) {
                throw new Error('El usuario ya esta registrado')
            }
            //Hashear su password
            const salt = bcryptjs.genSaltSync(10);
            input.password = bcryptjs.hashSync(password, salt);
            //Guardar en la DB
            try {
                const usuario = new Usuario(input);
                const resultado = await usuario.save(); //guardarlo
                return resultado;
            }catch (error) {
                console.log(error)
            }
        },
        autenticarUsuario: async (_, { input } ) => {

            const { email, password } = input;

            //Si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if (!existeUsuario) {
                throw new Error('El usuario no existe')
            }

            //Revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare( password, existeUsuario.password);
            if (!passwordCorrecto){
                throw new Error('La constraseña es incorrecta')
            }
            //Crear Token
            return{
                token: crearToken(existeUsuario, process.env.SECRETA,'24h')
            }

        },

        //Mutation Productos
        nuevoProducto: async(_, { input } ) => {
            try {
                const producto = new Producto(input);
                //Guardar en la bd
                const resultado = await producto.save(); //guardarlo
                return resultado;
            } catch (error) {
                console.log(error)
            }
        },
        actualizarProducto: async(_,{ id, input }) =>{
            //revisar si existe o no
            let producto = await Producto.findById(id);

            if (!producto){
                throw new Error('Producto no encontrado')
            }

            //Guardar en BD
            try {
                producto = await Producto.findOneAndUpdate({_id: id}, input, { new:true });
                return producto;
            } catch (error) {
                console.log(error);
            }
        },
        eliminarProducto: async (_, { id }) => {
            let producto = await Producto.findById(id);

            if (!producto){
                throw new Error('Producto no encontrado')
            }

            try {
                await Producto.findOneAndDelete({_id: id});
                return "Producto Eliminado"
            } catch (error) {
                console.log(error);
            }
        },

        //Mutation Clientes
        nuevoCliente: async (_, { input }, ctx ) => {

            const { email } = input

            // Verificar si el cliente ya esta registrado
            const cliente = await Cliente.findOne({ email });
            if (cliente){
                throw new Error('Ese cliente ya esta registrado')
            }

            const nuevoCliente = new Cliente(input);
            // Asignar el vendedor
            console.log(nuevoCliente)
            console.log(ctx.usuario.id)
            nuevoCliente.vendedor = ctx.usuario.id
            // Guardarlo en la BD
            try {
                //Guardar en la bd
                const resultado = await nuevoCliente.save(); //guardarlo
                return resultado;
            } catch (error) {
                console.log(error)
            }
        },
        actualizarCliente: async(_,{ id, input }, ctx) =>{
            //revisar si existe o no
            let cliente = await Cliente.findById(id);

            if (!cliente){
                throw new Error('Cliente no existe')
            }
            //Vendedor es quien edita
            if (cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales')
            }
            //Guardar en BD
            try {
                cliente = await Cliente.findOneAndUpdate({_id: id}, input, { new:true });
                return cliente;
            } catch (error) {
                console.log(error);
            }
        },
        eliminarCliente: async (_, { id }, ctx ) => {
            let cliente = await Cliente.findById(id);

            if (!cliente){
                throw new Error('Cliente no existe')
            }

            //Vendedor es quien edita
            if (cliente.vendedor.toString() !== ctx.usuario.id){
                throw new Error('No tienes las credenciales')
            }

            try {
                await Cliente.findOneAndDelete({_id: id});
                return "Cliente Eliminado"
            } catch (error) {
                console.log(error);
            }
        },
    }
}

module.exports = resolvers;