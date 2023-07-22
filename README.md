# APLICACIÓN PARA AUTENTICACION DE USUARIO (MEDIANTE EXPRESS SESSION)

A traves de este código, se pretende realizar la autentiación de un usuario usando su correo electrónico y su contraseña. Existe la opción de un enlace para realizar un registro de usuario a través de un formulario donde se solicitará al usuario:

    - Nombre
    - Apellido
    - Correo electrónico
    - Contraseña

Una vez hecho el registro de usuario se redigirá al mismo hacia pagina de incio que es una ruta en **http://localhost:8080/**, donde se encuantra la página de login de usuarios.

Posteriormente, ya que el usuario se haya autentificado con su correo electrónico y contraseña,se redigirá hacia la página de products.

Nota: Se crea un middlware que verifica si el usuario se encuentra en sesion para hacer el direccionamiento hacia la página de products, si se encuentra dentro de la sesión, podra ser direccionado a la ruta **http://localhost:8080/products**. En caso de que la sesion del usuario no esté activa, a pesar de que escriba en el navegador la ruta de productos NO podrá acceder a esta, y lo redigirá hacia la vista de login.

## EXPRESS SESSION

Para poder realizar el manejo de la sesión, se ocupa express-session, habilitando el middleware mediante app.use, usando el siguiente código en el index.js

```javascript

app.use(session({
    secret: 'secrecto de encriptación',
    resave: true,
    saveUninitialized: true
}))

```

La persistencia de la sesión se realiza con la dependencia connect-mongo.

## CONNECT-MONGO

La persistencia de la sesión se realza medniante la conexión a la base de datos mongoDB, en la colección por defecto **sessions**, por lo que al objeto que se usa como parámentro de session, se agrega el key store

```javascript

app.use(session({
     store: MongoStore.create({
        mongoUrl: 'URL de la base de datos en MongoDB ',
    }),
    secret: 'secrecto de encriptación',
    resave: true,
    saveUninitialized: true
}))

```

## HANDLEBARS

Mediante el uso de express-handlebars, se realizaran todas las vista:

- Login. Se usa formulario con método POST hacia el endpoint de **/authLogin**, que verifica si el usuario está registrado en la base de datos
    
- Registro de usuario. De igual forma se usa un formulario con método POST hacia el endpoint de **/authRegistration**, donde se hace el registro de usuario hacia la base de datos
    
- Vista de productos. Una vez que el usuario se auntentifica, se dirige a la vista de productos, donde aparece su nombre de usuario y el rol de usuario. Para el caso de que el administrador se autentifique, apareca con el rol de admin. En caso de que no haya un usuario en sesión, si se quiere saltar la autentificación escribiendo en la barra del navegador el enlace hacia la vista de productos http://localhost:8080/products, no podra acceder y lo redigirá hacia la vista de login. Esta vista realiza un fetch hacia el endpoint http://localhost:8080/api/products, mediante el método GET. Una vez obtenidos los productos, se realiza el render de la tarjetas de productos, y se agrega un boton para el logout (salir)

y mediante CSS y JAVASCRIPT, se hace el manejo de los elementos html, datos, request y fetch hacia los endpoints

## EXPRESS ROUTER

A través de exprress router, se realiza el ruteo de las vistas y los endpoints.

1. Ruta de vistas. Se cuenta con la siguientes rutas de vistas:

- Cuatro rutas GET para renderizar las vista generadas por el motor de plantillas handlebars, hacia el registro de usuarios, login, logout y products.

2. Un router de auth para los endpoints para validar el registro de usuarios, login, y logout. En el endpoint de registro de usuario se realiza el registro de la información del usuario emplenado el siguiente modelo hacia la colección users:

```javascript

userName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    userMail: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    userPassword: {
        type: String,
        trim: true,
        required: true,
    },
    userRoll : {
        type: String,
        required: true,
    }

```

Un endpoint de login, que hace la interacción con la colección de users para buscar al usuario y con la colección sessions, para el almacenamiento de los datos del usuario mediante la persitencia en MongoDB. Una vez hecha la confirmación del usuario en la base de datos, se hace el direccionamiento hacia la vista de products

3. Un router para el endpoint de products con el método GET, para descargar todos los productos de la base de datos en MongoDB. Mediante la vista de produtos se hace un fetch hacia este endpoint.

## FIN