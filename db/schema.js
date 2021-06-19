const {gql} = require('apollo-server');

//Schema 
const typeDefs = gql`

    # Usuario Types
    type Usuario { 
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }

    type Token {
        token: String
    }

    type TopVendedor {
        total: Float
        vendedor: [Usuario]
    }

    # Productos Types

    type Producto {
        id: ID
        nombre: String
        existencia: Int
        precio: Float
        creado: String
    }

    # Cliente Type
    type Cliente {
        id: ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        telefono: String
        vendedor: ID
    }

    type TopCliente {
        total: Float
        cliente: [Cliente]
    }

    # Pedido Type
    type Pedido {
        id: ID
        pedido: [PedidoGrupo]
        total: Float
        cliente: ID
        vendedor: ID
        estado: EstadoPedido
    }

    type PedidoGrupo {
        id: ID
        cantidad: Int
    }

    # Usuarios Input

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    input AutenticarInput {
        email: String!
        password: String!
    }

    # Productos Input
    input ProductoInput {
        nombre: String!
        existencia: Int!
        precio: Float!
    }

    # Clientes Input
    input ClienteInput {
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        telefono: String
    }

    # Pedidos Input
    input PedidoProductoInput{
        id: ID
        cantidad: Int
        nombre: String
        precio: Float
    }

    input PedidoInput {
        pedido: [PedidoProductoInput]
        total: Float
        cliente: ID
        estado: EstadoPedido
    }

    # Enum Pedidos
    enum EstadoPedido {
        PENDIENTE
        COMPLETADO
        CANCELADO
    }
    
    type Query {
        # Usuarios
        obtenerUsuario(token: String!): Usuario
        # Productos
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto
        # Clientes
        obtenerClientes: [Cliente]
        obtenerClientesVendedor: [Cliente]
        obtenerCliente(id: ID!): Cliente
        # Pedidos
        obtenerPedidos: [Pedido]
        obtenerPedidosVendedor: [Pedido]
        obtenerPedido(id: ID!): Pedido
        obtenerPedidosEstado(estado: String!): [Pedido]
        # Busquedas Avanzadas
        mejoresClientes: [TopCliente]
        mejoresVendedores: [TopVendedor]
        buscarProducto(texto: String!) : [Producto]
    }

    type Mutation {
        # Usuarios
        nuevoUsuario(input: UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token
        # Productos
        nuevoProducto(input: ProductoInput): Producto
        actualizarProducto(id: ID!, input:ProductoInput): Producto
        eliminarProducto(id: ID!): String
        # Clientes
        nuevoCliente(input: ClienteInput): Cliente
        actualizarCliente(id: ID!, input: ClienteInput): Cliente
        eliminarCliente(id: ID!): String
        # Pedidos
        nuevoPedido(input: PedidoInput): Pedido
        actualizarPedido(id: ID!, input: PedidoInput ) : Pedido
        eliminarPedido(id: ID!) : String
    }
`;

module.exports = typeDefs;