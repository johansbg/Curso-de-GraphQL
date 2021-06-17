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

    type Query {
        # Usuarios
        obtenerUsuario(token: String!): Usuario
        #Productos
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto
        #Clientes
        obtenerClientes: [Cliente]
        obtenerClientesVendedor: [Cliente]
        obtenerCliente(id: ID!): Cliente
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
        actualizarCliente(id: ID!, input:ClienteInput): Cliente
        eliminarCliente(id: ID!): String
    }
`;

module.exports = typeDefs;