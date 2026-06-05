# Car Shop Service

## Informacion del Proyecto

| Matricula | Nombre | Carrera |
|-----------|--------|---------|
| 2177709 | Uziel Omar Flores Torres | ITS |
| 2102029 | Melissa Mayte Del Ángel Álvarez | ITS |
| 2099307 | Regino Alexander Martínez Alvarado | ITS |
| 2099485 | Maximiliano Juárez Gómez | ITS |
| 2132054 | Luis Enrique Ramírez Arellano | ITS |

**Materia:** Ingeniería de Dispositivos Móviles

**Profesor:** MA Sergio Plata Gutiérrez

**Grupo:** 001

**Equipo:** 7

**Brigada:** 2

---

## Descripcion del Proyecto

**Car Shop Service** es una aplicación móvil para gestionar las operaciones diarias del taller automotriz del mismo nombre, el cual además de prestar servicios mecánicos también vende refacciones, accesorios y productos para autos. La app está pensada para ser usada por el personal del taller bajo dos roles bien diferenciados:

- **Mecánico:** consulta únicamente las órdenes de servicio que tiene asignadas, registra el avance de cada servicio (Pendiente / En Progreso / Finalizado), agrega productos del inventario o servicios extra a la orden y la finaliza cuando termina el trabajo.
- **Recepcionista:** crea nuevas órdenes de servicio (cliente + vehículo + mecánico + servicios + fecha), administra el catálogo de clientes, vehículos y productos, ajusta el inventario y procesa ventas de mostrador de productos sueltos sin necesidad de generar una orden de taller.

El sistema usa **Firebase Authentication** (Email/Password) para validar la identidad del usuario y luego cruza ese UID contra **PostgreSQL** para obtener el rol y los datos del taller. Toda comunicación entre la app y el servidor pasa por una **API REST en Node.js/Express** protegida por un middleware que verifica el ID Token de Firebase en cada petición.

<p align="center">
    <img src="http://uziel.app/media/og_images/car-shop-service.jpg" alt="hero"  />
</p>

---

## Arquitectura

El repositorio está organizado como un monorepo con tres servicios independientes que se orquestan con Docker Compose:

```
Car-Shop-Service/
├── mobile/                 # App Expo / React Native (cliente)
├── backend/                # API REST Express + Firebase Admin (servidor)
├── nginx/                  # Reverse proxy + servidor estático del export web
├── database/               # Schema SQL inicial de PostgreSQL
├── docker-compose.yml      # Orquestación de los 3 contenedores + Postgres
├── .env / .env.example     # Variables compartidas para Docker Compose
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

### Diagrama lógico

```
┌──────────────┐   HTTPS    ┌──────────────────────────┐   HTTP    ┌─────────────┐
│  Expo Go /   │ ─────────► │   NGINX (carshop-nginx)  │ ────────► │  Express    │
│  Web bundle  │            │  - sirve /dist (web)     │           │ (carshop-   │
│  (mobile/)   │ ◄───────── │  - proxy /api → backend  │ ◄──────── │   backend)  │
└──────┬───────┘            └──────────────────────────┘           └──────┬──────┘
       │                                                                  │
       │ Firebase Auth (Email/Password)                                   │ pg
       ▼                                                                  ▼
┌──────────────┐                                                   ┌─────────────┐
│   Firebase   │  ◄────── verifyIdToken (Firebase Admin SDK) ─────►│ PostgreSQL  │
│     Auth     │                                                   │ (carshop-db)│
└──────────────┘                                                   └─────────────┘
```

### Frontend — Aplicación Móvil (`mobile/`)

Aplicación Expo / React Native con navegación basada en stack. Cada pantalla consume el backend exclusivamente a través de las clases de `services/`, las cuales delegan en un `ApiClient` central que inyecta automáticamente el ID Token de Firebase en cada petición.

```
mobile/
├── App.js                          # Stack Navigator con todas las pantallas
├── index.js                        # Registro de root component para Expo
├── app.json                        # Configuración de Expo (slug, icons, plugins)
├── eas.json                        # Perfiles de build de EAS (dev/preview/prod)
├── firebaseConfig.js               # Inicialización del SDK cliente de Firebase
├── package.json                    # Dependencias del cliente
├── pnpm-lock.yaml / pnpm-workspace.yaml
├── .env / .env.example             # EXPO_PUBLIC_* (Firebase + API_URL)
├── .easignore
│
├── assets/                         # Iconos, splash y logo
│
├── components/                     # Componentes reutilizables
│   ├── BottomNav.js                # Barra inferior del rol Mecánico
│   ├── BottomNavReceptionist.js    # Barra inferior del rol Recepcionista
│   ├── OrderCard.js                # Tarjeta resumen de una orden de servicio
│   ├── VehicleCard.js              # Tarjeta resumen de un vehículo
│   └── Service.js                  # Item individual de servicio
│
├── screens/                        # Pantallas (cada una se registra en App.js)
│   ├── LoginScreen.js
│   ├── HomeScreen.js               # Home del Mecánico (activas/próximas/completadas)
│   ├── OrdersScreen.js             # Listado completo de órdenes del mecánico
│   ├── AgendaScreen.js             # Calendario con órdenes próximas
│   ├── OrderDetailsScreen.js       # Detalle interactivo de una orden activa
│   ├── NextServiceScreen.js        # Vista previa de una orden por iniciar
│   ├── LastServiceScreen.js        # Vista de una orden finalizada
│   ├── PastRepairsScreen.js        # Historial de órdenes completadas
│   ├── AddServiceScreen.js         # Agrega servicios del catálogo a una orden
│   ├── AddProductScreen.js         # Agrega productos del inventario a una orden
│   ├── CreateOrderScreen.js        # Home del Recepcionista (alta de órdenes)
│   ├── CreateClientScreen.js       # Alta de cliente
│   ├── CreateVehicleScreen.js      # Alta de vehículo ligado a un cliente
│   ├── CreateProductScreen.js      # Alta de producto al inventario
│   ├── InventoryScreen.js          # Consulta y ajuste de stock
│   ├── CartScreen.js               # Carrito para ventas de mostrador
│   └── SalesHistoryScreen.js       # Historial de ventas del taller
│
└── services/                       # Capa REST que consume el backend
    ├── apiClient.js                # Cliente HTTP con Bearer Token automático
    ├── OrderService.js             # Endpoints de /ordenes
    ├── CatalogService.js           # Endpoints de /servicios y /productos (catálogo)
    ├── AdminService.js             # Endpoints de clientes, vehículos, productos, usuarios, ventas
    └── SalesService.js             # Listado de ventas históricas
```

### Backend — API REST (`backend/`)

Servidor Node.js + Express 5 que expone los endpoints REST, valida ID Tokens de Firebase usando **Firebase Admin SDK** y persiste todo en PostgreSQL mediante `pg` con un pool de conexiones.

```
backend/
├── server.js                       # Arranque de Express, CORS y montaje de rutas
├── db.js                           # Pool de conexiones a PostgreSQL
├── Dockerfile                      # Imagen del backend (node:22-alpine + pnpm)
├── package.json                    # Dependencias del backend
├── pnpm-lock.yaml / pnpm-workspace.yaml
├── .env / .env.example             # Credenciales de PostgreSQL y Firebase Admin
├── .dockerignore
│
├── config/
│   └── firebase.js                 # Inicialización singleton de Firebase Admin
│
├── middleware/
│   ├── authMiddleware.js           # Verifica ID Token y carga el perfil en req.user
│   └── roleMiddleware.js           # Autorización por rol (Mecánico / Recepcionista)
│
├── routes/                         # Definición de endpoints (Express Router)
│   ├── authRoutes.js               # /api/auth/*
│   ├── ordenRoutes.js              # /api/v1/ordenes/*
│   ├── catalogRoutes.js            # /api/v1/{servicios,productos} (catálogos)
│   ├── clienteRoutes.js            # /api/v1/clientes
│   ├── vehiculoRoutes.js           # /api/v1/vehiculos
│   ├── productoRoutes.js           # /api/v1/productos (CRUD de inventario)
│   ├── usuarioRoutes.js            # /api/v1/usuarios/{mecanicos,yo}
│   └── ventaRoutes.js              # /api/v1/ventas
│
└── controllers/                    # Lógica de negocio (incluye transacciones SQL)
    ├── authController.js
    ├── ordenController.js
    ├── catalogController.js
    ├── clienteController.js
    ├── vehiculoController.js
    ├── productoController.js
    ├── usuarioController.js
    └── ventaController.js
```

### Reverse Proxy y Web Build — `nginx/`

`nginx/` empaqueta el bundle web de la app móvil (generado con `expo export --platform web`) y lo sirve de forma estática, redirigiendo cualquier petición a `/api/` hacia el contenedor del backend. Es el único contenedor que se publica al exterior.

```
nginx/
├── Dockerfile                      # Multi-stage: builder Expo + nginx:alpine
└── default.conf                    # SPA fallback + proxy_pass a backend:3000
```

### Base de Datos — PostgreSQL (`database/`)

El schema se encuentra en `database/schema.sql` y se carga automáticamente la primera vez que arranca el contenedor `carshop-db` (Docker lo monta en `/docker-entrypoint-initdb.d/`). El modelo está estructurado en cuatro niveles de dependencias:

1. **Tablas independientes (catálogos):** `rol`, `cliente`, `producto`, `servicio`
2. **Tablas dependientes nivel 1:** `usuario` (vinculada a Firebase via `firebase_uid` y a `rol`), `vehiculo` (vinculada a `cliente`)
3. **Tablas dependientes nivel 2:** `orden` (vinculada a `vehiculo` y a `usuario` como mecánico asignado), `venta` (vinculada al `usuario` recepcionista)
4. **Tablas de detalle / intermedias:** `orden_servicio`, `orden_producto`, `detalle_venta`

> El detalle campo por campo de cada tabla, incluyendo `CHECK constraints`, `UNIQUE` y reglas de eliminación, está documentado en [`CONTRIBUTING.md`](./CONTRIBUTING.md#esquema-de-la-base-de-datos).

---

## Tecnologias Utilizadas

### Frontend (`mobile/`)
| Tecnologia | Version | Proposito |
|-----------|---------|-----------|
| Expo | ~54.0.33 | Plataforma de desarrollo y build de React Native |
| React Native | 0.81.5 | UI nativa multiplataforma |
| React | 19.1.0 | Librería base |
| React Navigation (native + native-stack) | 7.x | Navegación basada en stack |
| Firebase JS SDK | 12.9.0 | Autenticación con Email/Password en el cliente |
| @expo/vector-icons | 15.0.3 | Iconografía (Feather, Ionicons, MaterialCommunityIcons) |
| expo-router | 6.0.23 | Soporte de routing/linking (registrado como plugin en `app.json`) |
| expo-navigation-bar | 5.0.10 | Personalización de la barra de navegación de Android |
| expo-checkbox | 5.0.8 | Checkboxes en formularios |
| expo-linking | 8.0.11 | Deep linking |
| expo-status-bar | 3.0.9 | Control de la status bar |
| react-native-web | 0.21.0 | Bundle web que sirve `nginx/` |
| eas-cli | 18.10.0 | Builds reproducibles con EAS |

### Backend (`backend/`)
| Tecnologia | Version | Proposito |
|-----------|---------|-----------|
| Node.js | 22 (en Docker) | Runtime |
| Express | ^5.2.1 | Framework HTTP |
| pg | ^8.18.0 | Cliente PostgreSQL con pool |
| firebase-admin | ^13.8.0 | Verificación de ID Tokens emitidos por Firebase Auth |
| cors | ^2.8.6 | Política de CORS |
| dotenv | ^17.3.1 | Carga de variables de entorno |
| nodemon | ^3.1.14 | Auto-reload en desarrollo |

### Infraestructura
| Componente | Version | Proposito |
|-----------|---------|-----------|
| PostgreSQL | 16-alpine | Motor relacional persistente (volumen `postgres_data`) |
| Nginx | alpine | SPA + reverse proxy hacia el backend |
| Docker / Docker Compose | — | Orquestación local y despliegue |
| pnpm | corepack en `node:22-alpine` | Gestor de paquetes en ambos servicios |

---

## Flujo de Autenticación y Autorización (RBAC)

1. El usuario ingresa correo y contraseña en `LoginScreen`.
2. `signInWithEmailAndPassword` (Firebase Auth, SDK cliente) valida las credenciales y devuelve un `idToken`.
3. El cliente envía `{ firebase_uid }` a `POST /api/auth/verify` (ruta **pública**), que busca el usuario en la tabla `usuario` cruzándolo con `rol`.
4. Si existe, el backend responde con el perfil del usuario (`id`, `nombre`, `apellido_paterno`, `correo`, `rol`).
5. El cliente decide la pantalla destino según el rol:
   - `Mecánico` → `HomeScreen`.
   - `Recepcionista` → `CreateOrderScreen` (alias de ruta `HomeReceptionist`).
6. A partir de ese momento, **todas** las peticiones a `/api/v1/*` viajan con el header `Authorization: Bearer <idToken>`. El cliente lo agrega de forma transparente desde `services/apiClient.js`.
7. `middleware/authMiddleware.js` verifica criptográficamente el token con Firebase Admin (`admin.auth().verifyIdToken`), busca al usuario y su rol en PostgreSQL e inyecta `req.user = { id, firebase_uid, nombre, apellido_paterno, rol }`.
8. Algunos controladores aplican RBAC adicional:
   - `ordenController.getOrdenes` filtra órdenes por `id_mecanico` cuando el rol es `Mecánico`.
   - `ordenController.verifyOrderOwnership` impide que un mecánico modifique órdenes que no le pertenecen.
   - `ventaController.createVenta` solo permite el alta de ventas a usuarios con rol `Recepcionista`.
   - `middleware/roleMiddleware.js` (`authorizeRoles(...roles)`) está disponible para nuevas rutas que requieran control explícito por rol.

---

## API Endpoints

Todas las rutas viven bajo el prefijo `/api`. Las que están bajo `/api/v1/*` requieren `Authorization: Bearer <idToken>`. Las respuestas de éxito siguen el formato `{ data, meta? }` y las de error `{ error }`.

### Salud y autenticación
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/test` | Pública | Prueba de conectividad a PostgreSQL (`SELECT NOW()`) |
| POST | `/api/auth/verify` | Pública | Verifica el `firebase_uid` contra la tabla `usuario` y devuelve el perfil (incluye `rol`) |

### Órdenes (`/api/v1/ordenes`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Lista órdenes con paginación y filtros (`mecanico_id`, `estatus_servicio`, `sort`, `limit`, `page`). Si el usuario es `Mecánico`, automáticamente se filtra por su `id` |
| POST | `/` | Crea una nueva orden maestra (vehículo, mecánico, kilometraje, fecha, notas, servicios iniciales, total) — transaccional |
| GET | `/:id/servicios` | Lista los servicios asociados a la orden |
| POST | `/:id/servicios` | Agrega uno o varios servicios del catálogo a la orden (rechaza duplicados) |
| POST | `/:id/servicios-personalizados` | Agrega un servicio personalizado (`descripcion_personalizada` + `precio_personalizado`) y actualiza `total_orden` — transaccional |
| PATCH | `/:id/servicios/:servicioId` | Cambia el estatus de un servicio (`Pendiente` / `En Progreso` / `Finalizado`) |
| PUT | `/:id/iniciar` | Pone en `En Progreso` todos los servicios pendientes de la orden |
| GET | `/:id/productos` | Lista los productos consumidos en la orden |
| POST | `/:id/productos` | Agrega productos a la orden, descuenta stock y actualiza `total_orden` — transaccional |
| PATCH | `/:id/finalizar` | Cierra la orden estableciendo `fecha_fin` (zona horaria `America/Mexico_City`) |

### Catálogo (`/api/v1`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/servicios` | Catálogo de servicios estandarizados, con paginación (`page`, `limit`, `activo`) |
| GET | `/productos` | Inventario para selección (paginado). Soporta `inStock=true` para excluir productos sin existencias |

### Clientes (`/api/v1/clientes`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Lista clientes con sus vehículos anidados (`vehicles[]`) |
| POST | `/` | Alta de cliente (valida unicidad de RFC y celular) |

### Vehículos (`/api/v1/vehiculos`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/` | Alta de vehículo ligado a un cliente (valida unicidad de matrícula y NIV) |

### Productos / Inventario (`/api/v1/productos`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Lista productos para administración (incluye campos completos: SKU, código de barras, marca, precios, stock) |
| POST | `/` | Alta de producto (SKU único) |
| PUT | `/:id` | Actualiza dinámicamente `cantidad_stock`, `precio_compra`, `precio_venta` o `activo` |
| PUT | `/:id/stock` | Ajuste rápido de stock |

### Usuarios (`/api/v1/usuarios`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/mecanicos` | Lista de mecánicos disponibles para asignar a órdenes |
| GET | `/yo` | Devuelve el `nombre` y `apellido_paterno` del usuario autenticado (basado en `req.user.id`) |

### Ventas (`/api/v1/ventas`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/` | Registra una venta de mostrador (solo `Recepcionista`). Verifica stock, crea `venta` + `detalle_venta` y descuenta inventario — transaccional |
| GET | `/` | Historial completo de ventas con los productos vendidos en cada una |

---

## Modos de Ejecución

El proyecto soporta dos flujos:

| Modo | Cuándo usarlo | Cómo levantarlo |
|------|---------------|-----------------|
| **Local (dev)** | Desarrollo activo de la app con hot reload (Expo Go o emulador) | `pnpm install` en `backend/` y `mobile/`, levantar el backend con `nodemon` y la app con `expo start` (ver [CONTRIBUTING.md](./CONTRIBUTING.md#ejecucion-en-modo-local-desarrollo)) |
| **Docker Compose** | Levantar la app web + API + BD en un solo comando, listo para QA o despliegue | Configurar el `.env` de la raíz y ejecutar `docker compose up --build` (ver [CONTRIBUTING.md](./CONTRIBUTING.md#ejecucion-con-docker-compose)) |

En modo Docker, la aplicación móvil se compila como **bundle web** (`expo export --platform web`) y se sirve estática desde Nginx; la API queda accesible bajo `/api/` del mismo origen, por lo que el cliente no necesita `EXPO_PUBLIC_API_URL`.

---

## Variables de Entorno

Existen tres archivos `.env` con propósitos distintos. Sus respectivos `.env.example` son la referencia oficial.

| Archivo | Quién lo consume | Variables principales |
|---------|------------------|------------------------|
| `./.env` | `docker-compose.yml` (raíz). Combina todo lo necesario para los tres contenedores | `DB_*`, `PORT` (host público de Nginx), `EXPO_PUBLIC_FIREBASE_*` (se inyectan como `ARG` al build del frontend), `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` |
| `backend/.env` | Express cuando se corre fuera de Docker | `DB_USER`, `DB_PASSWORD`, `DB_HOST` (`localhost` en local, `db` en Docker), `DB_PORT`, `DB_NAME`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` |
| `mobile/.env` | Expo cuando se corre fuera de Docker | `EXPO_PUBLIC_FIREBASE_*` y `EXPO_PUBLIC_API_URL` (apunta al backend local, p. ej. `http://localhost:3000`) |

> ⚠️ Los archivos `.env` reales **no se versionan** (`.gitignore` los excluye). Nunca subas claves privadas de Firebase ni contraseñas de la base de datos al repositorio.

---

## Documentación Adicional

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — Guía completa para preparar el entorno, levantar el proyecto, agregar pantallas / endpoints, convenciones de código y resolución de problemas.
- [`LICENSE`](./LICENSE) — Licencia MIT del proyecto.