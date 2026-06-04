# Guia de Contribucion — Car Shop Service

Este documento describe en detalle todos los aspectos tecnicos del proyecto y como ponerlo en marcha en un entorno de desarrollo local.

---

## Requisitos Previos

Antes de comenzar, asegurate de tener instaladas las siguientes herramientas:

- **Node.js** (version 18 o superior recomendada)
- **npm** (viene incluido con Node.js)
- **PostgreSQL** (version 14 o superior recomendada)
- **Git** (para clonar el repositorio)

---

## Estructura del Proyecto

```
Car-Shop-Service/
├── App.js                           # Navegacion principal (Stack Navigator)
├── app.json                         # Configuracion de la app Expo
├── index.js                         # Punto de entrada Expo
├── package.json                     # Dependencias del frontend
├── package-lock.json                # Lockfile de dependencias frontend
├── tsconfig.json                    # Configuracion de TypeScript
├── .env
├── .gitignore
├── .easignore
├── CONTRIBUTING.md                  # Guia de contribucion
├── README.md                        # Documentacion del proyecto
├── LICENSE                          # Licencia del proyecto
├── eas.json                         # Configuracion de EAS Build
├── firebaseConfig.js                # Configuracion de Firebase
│
├── assets/                          # Imagenes y recursos estaticos
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   ├── logo.png
│   └── splash-icon.png
│
├── components/                      # Componentes reutilizables
│   ├── BottomNav.js                 # Barra de navegacion (mecanico)
│   ├── BottomNavReceptionist.js     # Barra de navegacion (recepcionista)
│   ├── OrderCard.js                 # Tarjeta de orden de servicio
│   ├── Service.js                   # Componente de servicio
│   └── VehicleCard.js               # Tarjeta de vehiculo
│
├── screens/                         # Pantallas de la aplicacion
│   ├── AddProductScreen.js          # Agregar producto al inventario
│   ├── AddServiceScreen.js          # Agregar servicio a una orden
│   ├── AgendaScreen.js              # Agenda de servicios
│   ├── CartScreen.js                # Carrito de compras
│   ├── CreateClientScreen.js        # Crear nuevo cliente
│   ├── CreateOrderScreen.js         # Crear orden de servicio
│   ├── CreateProductScreen.js       # Crear nuevo producto
│   ├── CreateVehicleScreen.js       # Registrar nuevo vehiculo
│   ├── HomeScreen.js                # Pantalla principal
│   ├── InventoryScreen.js           # Inventario de productos
│   ├── LastServiceScreen.js         # Ultimo servicio del vehiculo
│   ├── LoginScreen.js               # Pantalla de inicio de sesion
│   ├── NextServiceScreen.js         # Proximo servicio programado
│   ├── OrderDetailsScreen.js        # Detalles de orden de servicio
│   ├── OrdersScreen.js              # Lista de ordenes (mecanico)
│   ├── PastRepairsScreen.js         # Historial de reparaciones
│   └── SalesHistoryScreen.js        # Historial de ventas
│
├── services/                        # Capa de acceso a la API
│   ├── AdminService.js              # Servicios para admins
│   ├── apiClient.js                 # Cliente HTTP configurado
│   ├── CatalogService.js            # Servicios de catalogos
│   ├── OrderService.js              # Servicios de ordenes
│   └── SalesService.js              # Servicios de ventas
│
├── database/
│   └── schema.sql                   # Schema completo de PostgreSQL
│
└── backend/                         # Servidor Express
    ├── server.js                    # Punto de entrada del servidor
    ├── db.js                        # Pool de conexion a PostgreSQL
    ├── package.json                 # Dependencias del backend
    ├── package-lock.json            # Lockfile de dependencias backend
    ├── .env                         # Variables de entorno (NO compartir)
    ├── .env.example                 # Ejemplo de variables de entorno
    ├── .dockerignore
    ├── Dockerfile                   # Imagen Docker del backend
    ├── docker-compose.yml           # Configuracion de contenedores
    ├── nginx.conf                   # Configuracion de Nginx
    │
    ├── config/
    │   └── firebase.js              # Configuracion de Firebase Admin
    │
    ├── controllers/                 # Logica de negocio
    │   ├── authController.js        # Autenticacion
    │   ├── catalogController.js     # Catalogos del sistema
    │   ├── clienteController.js     # Gestion de clientes
    │   ├── ordenController.js       # Gestion de ordenes
    │   ├── productoController.js    # Gestion de productos
    │   ├── usuarioController.js     # Gestion de usuarios
    │   ├── vehiculoController.js    # Gestion de vehiculos
    │   └── ventaController.js       # Gestion de ventas
    │
    ├── middleware/                   # Middleware de Express
    │   ├── authMiddleware.js         # Verificacion de token JWT
    │   └── roleMiddleware.js         # Control de roles (mecanico/recepcionista)
    │
    └── routes/                      # Definicion de rutas API
        ├── authRoutes.js            # Rutas de autenticacion
        ├── catalogRoutes.js         # Rutas de catalogos
        ├── clienteRoutes.js         # Rutas de clientes
        ├── ordenRoutes.js           # Rutas de ordenes
        ├── productoRoutes.js        # Rutas de productos
        ├── usuarioRoutes.js         # Rutas de usuarios
        ├── vehiculoRoutes.js        # Rutas de vehiculos
        └── ventaRoutes.js           # Rutas de ventas
```

> **Nota:** Las carpetas `.expo/`, `dist/`, `node_modules/` y `.git/` han sido excluidas de esta estructura.

---

## Esquema de la Base de Datos

El proyecto utiliza **PostgreSQL** como base de datos. A continuacion se describe cada tabla y sus campos:

### 1. Tablas Independientes (Catalogos)

```
rol                           # Roles de usuario en el sistema
├── id                        # Identificador unico del rol (PK)
└── nombre                    # Nombre del rol (ej: 'Mecanico', 'Recepcionista')

cliente                       # Clientes del taller
├── id                        # Identificador unico del cliente (PK)
├── nombre                    # Nombre(s) del cliente
├── apellido_paterno          # Apellido paterno del cliente
├── apellido_materno          # Apellido materno del cliente
├── rfc                       # RFC del cliente (opcional, unico)
├── celular                   # Numero de telefono celular (unico, requerido)
├── correo                    # Correo electronico (unico, opcional)
└── direccion                 # Direccion del cliente (texto libre)

producto                      # Productos y piezas en inventario
├── id                        # Identificador unico del producto (PK)
├── sku                       # Codigo SKU del producto (unico, requerido)
├── codigo_barras             # Codigo de barras (unico, opcional)
├── nombre                    # Nombre del producto
├── vehiculos_compatibles     # Texto con vehiculos compatibles (opcional)
├── descripcion               # Descripcion detallada del producto
├── marca                     # Marca del producto
├── activo                    # Si el producto esta disponible (default TRUE)
├── cantidad_stock            # Cantidad en inventario (default 0)
├── precio_compra             # Costo de compra al proveedor
└── precio_venta              # Precio de venta al cliente

servicio                      # Servicios que ofrece el taller
├── id                        # Identificador unico del servicio (PK)
├── nombre                    # Nombre del servicio (ej: 'Cambio de aceite')
├── descripcion               # Descripcion del servicio
├── precio_mano_obra          # Costo de la mano de obra (default 0.00)
└── activo                    # Si el servicio esta disponible (default TRUE)
```

### 2. Tablas Dependientes (Nivel 1)

```
usuario                       # Usuarios del sistema (mecanicos/recepcionistas)
├── id                        # Identificador unico del usuario (PK)
├── firebase_uid             # UID de Firebase Authentication (unico, requerido)
├── id_rol                    # FK hacia rol (requerido, no eliminable)
├── nombre                    # Nombre(s) del usuario
├── apellido_paterno          # Apellido paterno del usuario
├── apellido_materno          # Apellido materno del usuario
├── rfc                       # RFC del usuario (unico, opcional)
├── curp                      # CURP del usuario (unico, opcional)
├── celular                   # Numero de telefono (unico, requerido)
└── correo                    # Correo electronico (unico, requerido)

vehiculo                      # Vehiculos registrados por los clientes
├── id                        # Identificador unico del vehiculo (PK)
├── id_cliente                # FK hacia cliente (required, CASCADE al eliminar)
├── marca                     # Marca del vehiculo (ej: 'Toyota')
├── modelo                    # Modelo del vehiculo (ej: 'Corolla')
├── anio                      # Anio del vehiculo
├── color                     # Color del vehiculo
├── matricula                 # Placas del vehiculo (unico, requerido)
└── niv                       # Numero de identificacion vehicular (17 digitos, unico)
```

### 3. Tablas Dependientes (Nivel 2)

```
orden                        # Ordenes de servicio
├── id                       # Identificador unico de la orden (PK)
├── id_vehiculo              # FK hacia vehiculo (requerido, no eliminable)
├── id_mecanico              # FK hacia usuario (mecanico asignado, no eliminable)
├── notas_cliente            # Notas o instrucciones del cliente
├── kilometraje              # Kilometraje actual del vehiculo
├── fecha_inicio             # Fecha de inicio de la orden (requerido)
├── fecha_fin                # Fecha de finalizacion (nullable)
└── total_orden              # Total de la orden (default 0.00)

venta                        # Ventas de productos
├── id                       # Identificador unico de la venta (PK)
├── id_usuario               # FK hacia usuario (recepcionista que realizo la venta)
├── total                    # Total de la venta
└── fecha                    # Fecha de la venta (default CURRENT_TIMESTAMP)
```

### 4. Tablas de Detalle (Nivel 3)

```
orden_servicio               # Servicios asociados a una orden
├── id                       # Identificador unico (PK)
├── id_orden                 # FK hacia orden (CASCADE al eliminar)
├── id_servicio              # FK hacia servicio (no eliminable)
├── estatus                  # Estado del servicio en la orden
│   ├── Pendiente           # Servicio asignado pero no iniciado
│   ├── En Progreso         # Servicio en ejecucion
│   └── Finalizado          # Servicio completado
├── descripcion_personalizada # Notas especificas para este servicio
└── precio_personalizado    # Precio especial (nullable, sobrescribe el de servicio)

orden_producto              # Productos utilizados en una orden
├── id                       # Identificador unico (PK)
├── id_orden                 # FK hacia orden (CASCADE al eliminar)
├── id_producto             # FK hacia producto (no eliminable)
├── cantidad                # Cantidad de productos usados (> 0)
├── precio_unitario         # Precio unitario al momento de agregar
└── subtotal                # cantidad * precio_unitario

detalle_venta               # Productos vendidos en una venta
├── id_venta                # FK hacia venta (CASCADE al eliminar)
├── id_producto             # FK hacia producto (no eliminable)
├── cantidad                # Cantidad de productos vendidos (> 0)
├── precio_unitario         # Precio unitario al momento de la venta
├── subtotal                # cantidad * precio_unitario
└── PRIMARY KEY (id_venta, id_producto)  # Clave compuesta
```

### Relaciones entre tablas

- **rol** (1) ──────── (N) **usuario**
- **cliente** (1) ──────── (N) **vehiculo**
- **usuario** (1) ──────── (N) **orden** (como mecanico)
- **vehiculo** (1) ──────── (N) **orden**
- **orden** (1) ──────── (N) **orden_servicio**
- **orden** (1) ──────── (N) **orden_producto**
- **usuario** (1) ──────── (N) **venta**
- **venta** (1) ──────── (N) **detalle_venta**

---

## Configuracion del Entorno

### 1. Clonar el Repositorio

```bash
git clone https://github.com/1Mr-Robot/Car-Shop-Service.git
cd ProyectoMoviles
```

### 2. Configurar Variables de Entorno

El proyecto utiliza variables de entorno para almacenar credenciales sensibles. Necesitas crear los siguientes archivos:

#### Backend — `backend/.env`

Crea el archivo `backend/.env` en la raiz del directorio `backend/` con el siguiente contenido:

```env
PORT=3000
DB_USER=tu_usuario_postgresql
DB_PASSWORD=tu_password_postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carshop_db
```

> **Nota:** No subas este archivo a git. Ya esta ignorado por `.gitignore`, pero asegurate de nunca hacer commit de credenciales reales.

### Frontend — Variables de Entorno de Expo

Expo utiliza el prefijo `EXPO_PUBLIC_` para exponer variables en el cliente. Crea un archivo `.env` en la raiz del proyecto (junto a `package.json`) con:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

> **Importante:** Estas variables son accesibles en el bundle de la app. Para proyectos en produccion, utiliza un backend intermedio o reglas de seguridad de Firebase para protegerlas.

### 3. Configurar la Base de Datos PostgreSQL

#### Crear la base de datos

```bash
psql -U tu_usuario -c "CREATE DATABASE carshop_db;"
```

#### Ejecutar el schema

```bash
psql -U tu_usuario -d carshop_db -f database/schema.sql
```

Esto creara todas las tablas, secuencias y relaciones descritas en el modelo de datos.

#### Datos iniciales sugeridos

Puedes insertar datos de prueba en las tablas de catalogos (`rol`, `cliente`, `servicio`, `producto`) para que el sistema funcione. Consulta el archivo `database/schema.sql` para ver la estructura exacta de cada tabla.

### 4. Configurar Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/).
2. Crea un nuevo proyecto o selecciona uno existente.
3. En **Authentication**, habilita el metodo **Email/Password**.
4. En **Project Settings**, copia los valores de configuracion a tu archivo `.env` del frontend.
5. Registra al menos un usuario de prueba en **Authentication > Users** para poder iniciar sesion en la app.

---

## Instalacion de Dependencias

### Frontend

Desde la raiz del proyecto:

```bash
npm install
```

### Backend

Desde el directorio `backend/`:

```bash
cd backend
npm install
```

---

## Ejecucion del Proyecto

### 1. Iniciar el Servidor Backend

Abre una terminal en el directorio `backend/` y ejecuta:

```bash
cd backend
npx nodemon server.js -c
```

- `npx nodemon` detecta cambios en los archivos `.js` y reinicia automaticamente el servidor.
- El flag `-c` es para limpiar la pantalla en cada reinicio (estetico).
- El servidor estara disponible en `http://localhost:3000`.
- Para verificar la conexion a la base de datos, visita `http://localhost:3000/api/test`.

### 2. Iniciar el Servidor de Desarrollo Expo

Desde la raiz del proyecto (en una terminal separada):

```bash
npx expo start
```

Esto abrira la interfaz de desarrollo de Expo en el navegador con un codigo QR y opciones para elegir el entorno:

| Tecla | Accion |
|-------|--------|
| `i` | Abrir en simulador de iOS (requiere Xcode en macOS) |
| `a` | Abrir en emulador de Android |
| `w` | Abrir en navegador web |
| `q` | Mostrar codigo QR para Expo Go |

#### Usar Expo Go

1. Descarga **Expo Go** desde la App Store (iOS) o Google Play (Android).
2. Escanea el codigo QR que aparece en la terminal.
3. La app se recargara automaticamente cuando guardes cambios en el codigo.

#### Usar Emulador/Simulador

- **Android:** Usa `adb` para conectar un dispositivo fisico o configura Android Studio como emulador. Presiona `a` en la terminal de Expo.
- **iOS:** Solo disponible en macOS con Xcode instalado. Presiona `i`.

---

## Flujo de Desarrollo

### Agregar una Nueva Pantalla

1. Crea el archivo en `screens/`, por ejemplo `MiPantallaScreen.js`.
2. Implementa el componente usando React Native y los estilos del proyecto.
3. Registra la pantalla en `App.js` agregando un `<Stack.Screen>` dentro del `Stack.Navigator`.
4. Navega a ella desde cualquier otra pantalla usando `navigation.navigate("MiPantalla")`.

### Agregar un Nuevo Endpoint en el Backend

1. Define la ruta en el archivo correspondiente de `routes/`, por ejemplo `routes/miRecursoRoutes.js`.
2. Implementa la logica del controlador en `controllers/miRecursoController.js`.
3. Registra las nuevas rutas en `server.js` con `app.use("/api/v1/miRecurso", miRecursoRoutes)`.

### Modificar el Schema de la Base de Datos

1. Edita `database/schema.sql` para reflejar los cambios.
2. Vuelve a ejecutar el schema en PostgreSQL:

```bash
psql -U tu_usuario -d carshop_db -f database/schema.sql
```

> **Advertencia:** Esto recreara todas las tablas. Si necesitas hacer cambios incrementales, usa `ALTER TABLE` en lugar de recrear todo.

---

## Convenciones de Codigo

### Frontend (React Native)

- Se usa **Prettier** para formateo automatico (configuracion en `.prettierrc`).
- Los archivos de pantallas van en PascalCase: `OrderDetailsScreen.js`.
- Los componentes van en PascalCase: `OrderCard.js`.
- Los servicios van en PascalCase con el sufijo `Service`: `OrderService.js`.
- Los hooks y utilidades van en camelCase.
- Colores, fuentes y espaciados deben definirse como constantes al final del archivo de cada pantalla para mantener consistencia.

### Backend (Node.js / Express)

- Se usa **CommonJS** (`require`/`module.exports`).
- Rutas RESTful con los metodos HTTP correspondientes (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`).
- Parametros de URL en kebab-case: `:order-id`.
- Query parameters en snake_case: `mecanico_id`, `estatus_servicio`.
- Respuestas consistentes: `{ data, meta }` para exitos (200/201) y `{ error }` para errores.

### Base de Datos (PostgreSQL)

- Nombres de tablas en singular: `usuario`, `orden`, `producto`.
- Llaves primarias con sufijo `_id` referenciadas en las tablas dependientes.
- Timestamps para `fecha_inicio` y `fecha_fin`.
- Check constraints para valores cerrados como `estatus`.

---

## Seguridad

- **Nunca** guardes credenciales reales en archivos committed. Usa `.env` y asegurate de que este en `.gitignore`.
- El `.env` del frontend contiene claves de Firebase. En produccion, restrinje el acceso a la API de Firebase por dominio.
- Todas las rutas del backend (excepto `/api/test`) esperan un token de Firebase en el header `Authorization: Bearer <token>`.
- Valida y sanitiza todas las entradas del usuario antes de usarlas en consultas SQL (el backend usa `pg` con parametros preparados para prevenir SQL injection).

---

## Resumen de Comandos

| Comando | Ubicacion | Descripcion |
|---------|-----------|-------------|
| `npm install` | Raiz | Instalar dependencias del frontend |
| `cd backend && npm install` | Raiz | Instalar dependencias del backend |
| `npx nodemon server.js -c` | `/backend/` | Iniciar servidor backend con auto-reload |
| `npx expo start` | Raiz | Iniciar servidor de desarrollo Expo |
| `psql -U user -d db -f schema.sql` | Consola | Ejecutar/resetear schema de BD |

---

## Resolucion de Problemas Comunes

### `Firebase Auth not initialized`
Asegurate de que `firebaseConfig.js` este exportando correctamente el modulo `app` y que las variables `EXPO_PUBLIC_FIREBASE_*` esten definidas en tu `.env`.

### `Connection refused` al backend desde la app
Verifica que el backend este corriendo en `http://localhost:3000` y que la variable `EXPO_PUBLIC_API_URL` en el `.env` del frontend apunte a esa direccion. En emuladores Android, `localhost` puede no funcionar; usa `10.0.2.2` para Android Studio emulator o la IP de tu maquina para dispositivos reales.

### Error de CORS
El backend ya tiene `cors` configurado en `server.js`. Si tienes problemas, verifica que el origen de la peticion este permitido.

### Modulos no encontrados
Asegurate de haber ejecutado `npm install` tanto en la raiz como en `/backend/`.