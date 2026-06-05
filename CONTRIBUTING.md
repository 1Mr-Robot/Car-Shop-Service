# Guía de Contribución — Car Shop Service

Esta guía cubre **todo** lo necesario para preparar el entorno, levantar el proyecto en sus dos modos de ejecución (local con Expo / Dockerizado), extenderlo con nuevas pantallas o endpoints, y diagnosticar los problemas más comunes.

> Para una visión general del producto, la arquitectura y los endpoints disponibles consulta [`README.md`](./README.md).

---

## Requisitos Previos

Necesitas tener instaladas las siguientes herramientas. Solo son obligatorias las que correspondan al modo en que vayas a trabajar.

### Comunes
- **Git** — para clonar el repositorio.
- Una cuenta de **Firebase** con un proyecto que tenga habilitado **Authentication → Email/Password** y una *service account* descargada (para el backend).

### Modo local (sin Docker)
- **Node.js 22 LTS** o superior.
- **pnpm 9+** (el proyecto usa `pnpm` y un `pnpm-lock.yaml` en cada paquete). Puedes instalarlo con `corepack enable && corepack prepare pnpm@latest --activate`.
- **PostgreSQL 14+** corriendo localmente (o accesible por red).
- **Expo Go** instalado en tu dispositivo físico, o un emulador de Android / simulador de iOS.

### Modo Docker
- **Docker Desktop** (incluye Docker Compose v2).
- Con esto basta: las imágenes incluyen Node 22, pnpm vía `corepack`, PostgreSQL 16 y Nginx Alpine.

---

## Estructura del Proyecto

```
Car-Shop-Service/
├── docker-compose.yml              # Orquesta db + backend + nginx
├── .env / .env.example             # Variables compartidas para Docker Compose
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── LICENSE
│
├── database/
│   └── schema.sql                  # Schema completo de PostgreSQL (V2.1)
│
├── nginx/
│   ├── Dockerfile                  # Multi-stage: builder Expo Web + nginx:alpine
│   └── default.conf                # SPA fallback + proxy_pass /api → backend:3000
│
├── backend/                        # Servidor Express + Firebase Admin
│   ├── server.js                   # Bootstrap de Express y montaje de rutas
│   ├── db.js                       # Pool de conexión a PostgreSQL
│   ├── Dockerfile                  # Imagen del backend (node:22-alpine + pnpm)
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── .env / .env.example         # Credenciales DB + Firebase Admin
│   ├── .dockerignore
│   │
│   ├── config/
│   │   └── firebase.js             # Inicialización singleton de Firebase Admin
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # Verifica ID Token y carga req.user
│   │   └── roleMiddleware.js       # authorizeRoles(...roles)
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── ordenRoutes.js          # /api/v1/ordenes
│   │   ├── catalogRoutes.js        # /api/v1/{servicios,productos}
│   │   ├── clienteRoutes.js        # /api/v1/clientes
│   │   ├── vehiculoRoutes.js       # /api/v1/vehiculos
│   │   ├── productoRoutes.js       # /api/v1/productos (CRUD inventario)
│   │   ├── usuarioRoutes.js        # /api/v1/usuarios
│   │   └── ventaRoutes.js          # /api/v1/ventas
│   │
│   └── controllers/
│       ├── authController.js
│       ├── ordenController.js
│       ├── catalogController.js
│       ├── clienteController.js
│       ├── vehiculoController.js
│       ├── productoController.js
│       ├── usuarioController.js
│       └── ventaController.js
│
└── mobile/                         # App Expo / React Native
    ├── App.js                      # Stack Navigator principal
    ├── index.js                    # Punto de entrada de Expo
    ├── app.json                    # Configuración de Expo
    ├── eas.json                    # Perfiles EAS (development/preview/production)
    ├── firebaseConfig.js           # SDK cliente de Firebase
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── .env / .env.example         # EXPO_PUBLIC_* (Firebase + API_URL)
    ├── .easignore
    │
    ├── assets/
    │   ├── adaptive-icon.png
    │   ├── icon.png
    │   ├── logo.png
    │   └── splash-icon.png
    │
    ├── components/
    │   ├── BottomNav.js            # Barra inferior (rol Mecánico)
    │   ├── BottomNavReceptionist.js# Barra inferior (rol Recepcionista)
    │   ├── OrderCard.js
    │   ├── VehicleCard.js
    │   └── Service.js
    │
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── HomeScreen.js           # Home del Mecánico
    │   ├── OrdersScreen.js
    │   ├── AgendaScreen.js
    │   ├── OrderDetailsScreen.js
    │   ├── NextServiceScreen.js
    │   ├── LastServiceScreen.js
    │   ├── PastRepairsScreen.js
    │   ├── AddServiceScreen.js
    │   ├── AddProductScreen.js
    │   ├── CreateOrderScreen.js    # Home del Recepcionista
    │   ├── CreateClientScreen.js
    │   ├── CreateVehicleScreen.js
    │   ├── CreateProductScreen.js
    │   ├── InventoryScreen.js
    │   ├── CartScreen.js
    │   └── SalesHistoryScreen.js
    │
    └── services/
        ├── apiClient.js            # Cliente HTTP con Bearer Token automático
        ├── OrderService.js
        ├── CatalogService.js
        ├── AdminService.js
        └── SalesService.js
```

> **Nota:** Las carpetas `node_modules/`, `.expo/`, `dist/`, `web-build/` y los archivos `.env` están excluidos por `.gitignore` y `.easignore`.

---

## Esquema de la Base de Datos

El proyecto utiliza **PostgreSQL** (versión 14+ en local, 16-alpine en Docker). El archivo de referencia es [`database/schema.sql`](./database/schema.sql). A continuación se describen las tablas, sus campos y reglas de integridad:

### 1. Tablas Independientes (Catálogos)

```
rol                           # Roles de usuario en el sistema
├── id (PK)                   # Identificador único del rol
└── nombre                    # Nombre del rol (ej: 'Mecánico', 'Recepcionista')

cliente                       # Clientes del taller
├── id (PK)
├── nombre                    # Nombre(s) del cliente
├── apellido_paterno
├── apellido_materno          # (opcional)
├── rfc                       # RFC del cliente (UNIQUE, opcional)
├── celular                   # Teléfono celular (UNIQUE, requerido)
├── correo                    # Correo electrónico (UNIQUE, opcional)
└── direccion                 # Texto libre (opcional)

producto                      # Productos y piezas en inventario
├── id (PK)
├── sku                       # Código SKU (UNIQUE, requerido)
├── codigo_barras             # Código de barras (UNIQUE, opcional)
├── nombre
├── vehiculos_compatibles     # Texto libre con vehículos compatibles
├── descripcion
├── marca
├── activo                    # BOOLEAN, default TRUE
├── cantidad_stock            # INTEGER, default 0
├── precio_compra             # NUMERIC(10,2) — costo al proveedor
└── precio_venta              # NUMERIC(10,2) — precio al cliente

servicio                      # Servicios que ofrece el taller
├── id (PK)
├── nombre
├── descripcion
├── precio_mano_obra          # NUMERIC(10,2), default 0.00
└── activo                    # BOOLEAN, default TRUE
```

### 2. Tablas Dependientes (Nivel 1)

```
usuario                       # Mecánicos y recepcionistas
├── id (PK)
├── firebase_uid              # UID de Firebase Authentication (UNIQUE, requerido)
├── id_rol (FK → rol)         # ON DELETE RESTRICT
├── nombre
├── apellido_paterno
├── apellido_materno          # (opcional)
├── rfc                       # UNIQUE, opcional
├── curp                      # UNIQUE, opcional
├── celular                   # UNIQUE, requerido
└── correo                    # UNIQUE, requerido

vehiculo                      # Vehículos registrados de los clientes
├── id (PK)
├── id_cliente (FK → cliente) # ON DELETE CASCADE
├── marca
├── modelo
├── anio                      # INTEGER
├── color
├── matricula                 # UNIQUE, requerido
└── niv                       # 17 dígitos, UNIQUE, opcional
```

### 3. Tablas Dependientes (Nivel 2)

```
orden                         # Órdenes de servicio del taller
├── id (PK)
├── id_vehiculo (FK → vehiculo)   # ON DELETE RESTRICT
├── id_mecanico (FK → usuario)    # ON DELETE RESTRICT, rol = Mecánico
├── notas_cliente             # TEXT
├── kilometraje               # INTEGER, requerido
├── fecha_inicio              # TIMESTAMP, requerido
├── fecha_fin                 # TIMESTAMP, NULL hasta que se finaliza
└── total_orden               # NUMERIC(10,2), default 0.00

venta                         # Ventas de mostrador (solo Recepcionista)
├── id (PK)
├── id_usuario (FK → usuario) # ON DELETE RESTRICT, recepcionista que cobró
├── total                     # NUMERIC(10,2)
└── fecha                     # TIMESTAMP, default CURRENT_TIMESTAMP
```

### 4. Tablas de Detalle (Nivel 3)

```
orden_servicio                # Servicios asociados a una orden
├── id (PK)
├── id_orden (FK → orden)         # ON DELETE CASCADE
├── id_servicio (FK → servicio)   # ON DELETE RESTRICT (NULL si es personalizado)
├── estatus                   # CHECK IN ('Pendiente', 'En Progreso', 'Finalizado')
├── descripcion_personalizada # Solo si es un servicio al vuelo
└── precio_personalizado      # NUMERIC(10,2), sobrescribe el del catálogo

orden_producto                # Productos consumidos en una orden
├── id (PK)
├── id_orden (FK → orden)         # ON DELETE CASCADE
├── id_producto (FK → producto)   # ON DELETE RESTRICT
├── cantidad                  # INTEGER, CHECK (> 0)
├── precio_unitario           # NUMERIC(10,2) al momento de agregar
└── subtotal                  # cantidad * precio_unitario

detalle_venta                 # Productos vendidos en una venta de mostrador
├── id_venta (FK → venta)         # ON DELETE CASCADE
├── id_producto (FK → producto)   # ON DELETE RESTRICT
├── cantidad                  # INTEGER, CHECK (> 0)
├── precio_unitario           # NUMERIC(10,2) al momento de la venta
├── subtotal                  # cantidad * precio_unitario
└── PRIMARY KEY (id_venta, id_producto)
```

### Relaciones entre tablas

- **rol** (1) ──── (N) **usuario**
- **cliente** (1) ──── (N) **vehiculo** *(CASCADE al eliminar)*
- **vehiculo** (1) ──── (N) **orden**
- **usuario** (1) ──── (N) **orden** *(como mecánico asignado)*
- **orden** (1) ──── (N) **orden_servicio** *(CASCADE al eliminar)*
- **orden** (1) ──── (N) **orden_producto** *(CASCADE al eliminar)*
- **servicio** (1) ──── (N) **orden_servicio**
- **producto** (1) ──── (N) **orden_producto**
- **usuario** (1) ──── (N) **venta** *(como recepcionista)*
- **venta** (1) ──── (N) **detalle_venta** *(CASCADE al eliminar)*
- **producto** (1) ──── (N) **detalle_venta**

---

## Configuración del Entorno

### 1. Clonar el Repositorio

```bash
git clone https://github.com/1Mr-Robot/Car-Shop-Service.git
cd Car-Shop-Service
```

### 2. Configurar Firebase

1. Entra a la [Consola de Firebase](https://console.firebase.google.com/) y crea (o selecciona) un proyecto.
2. En **Authentication → Sign-in method**, habilita **Email/Password**.
3. En **Project Settings → General → Your apps**, registra una **app web** y copia el bloque de configuración (apiKey, authDomain, projectId, etc.). Esos valores van en las variables `EXPO_PUBLIC_FIREBASE_*`.
4. En **Project Settings → Service accounts → Generate new private key**, descarga el JSON. De ese archivo necesitarás `project_id`, `client_email` y `private_key` para las variables `FIREBASE_*` del backend.
5. En **Authentication → Users**, crea al menos un usuario de prueba para poder iniciar sesión.
6. Inserta manualmente en PostgreSQL un registro en `usuario` cuyo `firebase_uid` coincida con el UID del usuario creado, con el `id_rol` correspondiente al rol que quieras probar.

### 3. Configurar Variables de Entorno

El proyecto tiene tres archivos `.env`, cada uno con un propósito específico. Sus respectivos `.env.example` son la referencia.

#### `backend/.env` (modo local sin Docker)

```env
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_password_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carshop_service

FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@tu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

> El `\n` dentro de `FIREBASE_PRIVATE_KEY` **debe** quedar como texto literal (no como salto de línea real). `config/firebase.js` se encarga de reemplazarlo por saltos reales al inicializar el SDK.

#### `mobile/.env` (modo local sin Docker)

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
EXPO_PUBLIC_API_URL=http://localhost:3000
```

> **Importante:** Las variables `EXPO_PUBLIC_*` se incrustan en el bundle del cliente y son visibles para cualquiera que lo descompile. Esto está bien para Firebase API Key (su seguridad depende de las reglas del proyecto), pero **nunca** pongas allí secretos del backend.
>
> En emulador Android usa `http://10.0.2.2:3000`. En un dispositivo físico usa la IP de tu máquina en la LAN (p. ej. `http://192.168.1.50:3000`).

#### `./.env` (raíz, solo para Docker Compose)

```env
DB_USER=user
DB_PASSWORD=tu_password
DB_HOST=db
DB_PORT=5432
DB_NAME=carshop_service

PORT=3000

EXPO_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id

FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@tu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

Notas del `.env` de la raíz:
- `DB_HOST=db` apunta al nombre del servicio definido en `docker-compose.yml` (no a `localhost`).
- `PORT` es el **puerto del host** que Nginx expone hacia el exterior (mapeo `${PORT}:80`).
- No se incluye `EXPO_PUBLIC_API_URL`: en modo Docker, Nginx sirve la app y el backend desde el mismo origen, por lo que `apiClient.js` cae al fallback relativo `/api/v1`.
- Las variables `EXPO_PUBLIC_*` se pasan como `ARG` al build del frontend dentro de `nginx/Dockerfile`, así que si las cambias necesitas reconstruir la imagen: `docker compose build nginx`.

> ⚠️ Ninguno de los `.env` reales se sube a Git (`.gitignore` los excluye). Nunca commitees credenciales reales.

---

## Ejecución en modo Local (desarrollo)

Recomendado mientras estás desarrollando la app o debugeando el backend.

### Paso 1 — Preparar PostgreSQL

```bash
# Crear la base de datos
psql -U tu_usuario -c "CREATE DATABASE carshop_service;"

# Cargar el schema
psql -U tu_usuario -d carshop_service -f database/schema.sql
```

Luego inserta los catálogos mínimos para poder operar (ejemplos):

```sql
INSERT INTO rol (nombre) VALUES ('Mecánico'), ('Recepcionista');

INSERT INTO usuario (firebase_uid, id_rol, nombre, apellido_paterno, celular, correo)
VALUES ('UID_DE_FIREBASE_AQUI', 1, 'Juan', 'Pérez', '8111111111', 'juan@carshop.com');
```

### Paso 2 — Instalar dependencias

Desde la raíz, instala en cada paquete por separado:

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../mobile
pnpm install
```

> Si por alguna razón no puedes usar pnpm, también funciona `npm install` (no rompe los lockfiles, pero genera un `package-lock.json` que no debes commitear).

### Paso 3 — Levantar el backend

```bash
cd backend
pnpm exec nodemon server.js -c
```

- `nodemon` recarga el servidor al guardar cambios en cualquier `.js`.
- El flag `-c` limpia la pantalla en cada reinicio.
- Por defecto el backend escucha en `http://localhost:3000`.
- Prueba la conectividad con la BD entrando a `http://localhost:3000/api/test` — debes ver `{"message":"Conexion a la base de datos exitosa!", ...}`.

### Paso 4 — Levantar la app móvil

En otra terminal:

```bash
cd mobile
pnpm exec expo start
```

En la interfaz de Expo (terminal + navegador):

| Tecla | Acción |
|-------|--------|
| `i` | Abrir en simulador iOS (solo macOS con Xcode) |
| `a` | Abrir en emulador Android |
| `w` | Abrir en navegador web |
| `r` | Recargar el bundle |
| `j` | Abrir DevTools |

#### Usar Expo Go (dispositivo físico)
1. Instala **Expo Go** desde la Play Store / App Store.
2. Escanea el QR que muestra Expo en la terminal.
3. La app se recargará en caliente al guardar cambios.

> Si la app no logra alcanzar al backend desde un dispositivo físico, revisa que `EXPO_PUBLIC_API_URL` apunte a la IP de tu máquina en la LAN (no a `localhost`) y que tu firewall permita conexiones entrantes al puerto 3000.

---

## Ejecución con Docker Compose

Ideal para QA, demos o cuando quieres replicar el comportamiento de producción.

### 1. Asegúrate de tener `./.env` en la raíz

Copia `.env.example` y completa los valores (ver sección [Configurar Variables de Entorno](#3-configurar-variables-de-entorno)):

```bash
cp .env.example .env
# edita .env con tus valores
```

### 2. Construye y levanta los servicios

```bash
docker compose up --build
```

Esto levanta tres contenedores:

| Servicio | Imagen | Rol |
|----------|--------|-----|
| `carshop-db` | `postgres:16-alpine` | PostgreSQL con `schema.sql` autocargado y volumen persistente `postgres_data` |
| `carshop-backend` | Build de `backend/Dockerfile` | Express en el puerto interno `3000` |
| `carshop-nginx` | Build de `nginx/Dockerfile` | Nginx Alpine sirviendo el bundle web + proxy `/api → backend:3000`. Se expone en el host en el puerto `${PORT}` |

Accede a la app web en `http://localhost:${PORT}` (por defecto `http://localhost:3000`).

### 3. Comandos útiles

```bash
# Levantar en segundo plano
docker compose up -d --build

# Ver logs en vivo
docker compose logs -f backend
docker compose logs -f nginx

# Detener manteniendo los datos
docker compose stop

# Detener y borrar contenedores (la BD se conserva en el volumen)
docker compose down

# Borrar TODO, incluyendo el volumen de la BD (resetea el schema)
docker compose down -v

# Reconstruir solo un servicio (ej. tras cambiar EXPO_PUBLIC_*)
docker compose build nginx
docker compose up -d nginx
```

### Notas importantes del modo Docker
- El **bundle web** del frontend se compila durante el build de `nginx`, así que cualquier cambio en `mobile/` requiere `docker compose build nginx` para reflejarse.
- Las variables `EXPO_PUBLIC_*` se inyectan en build-time (no en runtime). Si las cambias, también necesitas reconstruir `nginx`.
- El backend lee `.env` de la raíz mediante `env_file` en `docker-compose.yml`.
- PostgreSQL no expone puerto al host (solo `expose: "5432"` en la red interna `carshop`). Si quieres conectarte con un cliente como DBeaver, agrega temporalmente `ports: ["5432:5432"]` al servicio `db`.

---

## Flujo de Desarrollo

### Agregar una nueva pantalla (frontend)

1. Crea el archivo en `mobile/screens/`, por ejemplo `MiPantallaScreen.js`. Usa PascalCase y sufijo `Screen`.
2. Implementa el componente. Importa los servicios que necesites desde `mobile/services/` (nunca llames a `fetch` directamente: usa `ApiClient` o crea un nuevo servicio).
3. Registra la pantalla en `mobile/App.js` agregando un `<Stack.Screen>` dentro del `Stack.Navigator`. Mantén `options={{ headerShown: false }}` para conservar el estilo del proyecto.
4. Navega hacia ella desde cualquier otra pantalla con `navigation.navigate("MiPantalla", { ...params })`.
5. Si la pantalla pertenece a una de las dos barras inferiores, agrega su botón en `components/BottomNav.js` (mecánico) o `components/BottomNavReceptionist.js` (recepcionista).

### Agregar un nuevo endpoint (backend)

1. Define la ruta en el archivo correspondiente de `backend/routes/`, o crea uno nuevo si introduces un recurso distinto. Sigue el patrón `recursoRoutes.js`.
2. Implementa la lógica en `backend/controllers/recursoController.js`. Si la operación toca más de una tabla, usa una **transacción** con `pool.connect()` + `BEGIN/COMMIT/ROLLBACK` (revisa `ordenController.addProducts` o `ventaController.createVenta` como referencia).
3. Registra el router en `backend/server.js`:
   ```js
   const recursoRoutes = require("./routes/recursoRoutes");
   app.use("/api/v1/recursos", authenticateToken, recursoRoutes);
   ```
4. Si el recurso debe estar restringido por rol, encadena `roleMiddleware`:
   ```js
   const authorizeRoles = require("./middleware/roleMiddleware");
   app.use("/api/v1/recursos", authenticateToken, authorizeRoles("Recepcionista"), recursoRoutes);
   ```
5. Expón el nuevo endpoint en el frontend creando o ampliando un servicio en `mobile/services/`. Mantén las respuestas con el formato estándar `{ data, meta? }` para errores `{ error }`.

### Modificar el schema de la base de datos

1. Edita `database/schema.sql` reflejando los cambios.
2. **En desarrollo local:** vuelve a ejecutar el schema (esto recrea las tablas; pierdes los datos):
   ```bash
   psql -U tu_usuario -d carshop_service -f database/schema.sql
   ```
   Si quieres conservar los datos, en su lugar usa `ALTER TABLE` directamente.
3. **En Docker:** el schema solo se ejecuta la primera vez que se crea el volumen `postgres_data`. Para que se vuelva a ejecutar:
   ```bash
   docker compose down -v   # ⚠️ borra todos los datos
   docker compose up --build
   ```

### Builds de la app (EAS)

`mobile/eas.json` define tres perfiles:

| Perfil | Distribución | Uso |
|--------|--------------|-----|
| `development` | `internal`, con `developmentClient` | Builds con dev client para testers internos |
| `preview` | `internal`, Android `apk` | APKs para QA / clientes |
| `production` | Por defecto, `autoIncrement: true` | Submission a stores |

Comandos típicos (requieren `eas-cli` instalado y sesión iniciada):

```bash
cd mobile
pnpm exec eas build --platform android --profile preview
pnpm exec eas build --platform ios --profile production
pnpm exec eas submit --platform ios --profile production
```

---

## Convenciones de Código

### Frontend (React Native)

- Pantallas en PascalCase con sufijo `Screen`: `OrderDetailsScreen.js`.
- Componentes reutilizables en PascalCase: `OrderCard.js`.
- Servicios en PascalCase con sufijo `Service`: `OrderService.js`.
- Hooks y utilidades en camelCase.
- Constantes de estilo (colores, fuentes, espaciados) declaradas al final del archivo de la pantalla / componente.
- Estilo visual estandarizado: fondo oscuro `#0F1115`, tarjetas `#1A1D23`, acento amarillo `#FFD43B`, peligro `#FF4D4D`, éxito `#22C55E`.
- Todas las llamadas HTTP pasan por `services/apiClient.js`; nunca uses `fetch` directo en pantallas.
- Usa `document.title = '...';` al inicio de cada pantalla para mejorar la versión web.

### Backend (Node.js / Express)

- **CommonJS** (`require` / `module.exports`).
- Rutas RESTful con los métodos HTTP estándar (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- Parámetros de ruta en camelCase si son compuestos (`:servicioId`).
- Query params en snake_case (`mecanico_id`, `estatus_servicio`) por consistencia con la BD.
- Respuestas: `{ data, meta? }` en éxito, `{ error: "mensaje" }` en error.
- Códigos HTTP correctos: `200` lecturas, `201` creaciones, `400` validación, `401` no autenticado, `403` sin permisos, `404` no encontrado, `500` error interno.
- Toda operación con varias escrituras debe ir en una **transacción** explícita (`BEGIN/COMMIT/ROLLBACK`).
- Logs prefijados con el módulo: `console.error("[Venta Controller] ...")`.

### Base de Datos (PostgreSQL)

- Nombres de tablas en singular y minúsculas: `usuario`, `orden`, `producto`.
- Llaves foráneas con el prefijo `id_` referenciando la tabla original: `id_cliente`, `id_mecanico`.
- Timestamps con tipo `TIMESTAMP` (la app maneja la zona `America/Mexico_City` al finalizar órdenes).
- `CHECK` constraints para valores cerrados como `estatus` u `cantidad > 0`.
- Borrado en cascada solo cuando la dependencia es total (ej. `orden_servicio` cuando se elimina la orden); en lo demás se usa `RESTRICT` para conservar integridad histórica.

### Git

- Mensajes de commit en español, en una sola línea, descriptivos. Ejemplos del histórico:
  - `Creación de iconos de app`
  - `Funcionalidad a AgendaScreen`
  - `BugFix al scroll de la pantalla CreateOrder`
  - `Cambio de la app a la carpeta mobile/ y Cambio de npm a pnpm`
- No hagas commit de archivos `.env`, lockfiles ajenos al gestor (`package-lock.json` si usas pnpm) ni claves de Firebase.

---

## Seguridad

- **Nunca** subas credenciales reales: los `.env` ya están en `.gitignore`, mantenlo así.
- El `.env` del frontend (`EXPO_PUBLIC_*`) acaba en el bundle del cliente. Esto es aceptable para el SDK de Firebase porque su seguridad real está en las reglas del proyecto y en los dominios autorizados.
- **Todas** las rutas bajo `/api/v1/*` requieren `Authorization: Bearer <idToken>`. Las únicas rutas públicas son `/api/test` (diagnóstico) y `/api/auth/verify` (alta de sesión).
- El backend valida el token con Firebase Admin SDK en cada request (`authMiddleware.js`). Si el token expiró devuelve `401 auth/id-token-expired` para que el cliente fuerce un re-login.
- Los `Mecánicos` solo pueden ver y modificar órdenes asignadas a ellos (`verifyOrderOwnership` en `ordenController`).
- Solo los `Recepcionistas` pueden registrar ventas de mostrador (`ventaController.createVenta`).
- Todas las consultas usan **parámetros preparados** (`pool.query(sql, [valores])`), por lo que están protegidas contra SQL injection. Mantén esa práctica en cualquier endpoint nuevo.

---

## Resumen de Comandos

| Comando | Ubicación | Descripción |
|---------|-----------|-------------|
| `pnpm install` | `backend/` y `mobile/` | Instalar dependencias |
| `pnpm exec nodemon server.js -c` | `backend/` | Iniciar el backend con auto-reload |
| `pnpm exec expo start` | `mobile/` | Iniciar Expo dev server |
| `pnpm exec expo export --platform web` | `mobile/` | Generar el bundle web estático |
| `pnpm exec eas build --platform android --profile preview` | `mobile/` | Generar APK con EAS |
| `psql -U user -d carshop_service -f database/schema.sql` | Cualquier terminal | Cargar o resetear el schema |
| `docker compose up --build` | Raíz | Levantar todo el stack |
| `docker compose down -v` | Raíz | Bajar el stack y borrar el volumen de la BD |
| `docker compose logs -f backend` | Raíz | Logs del backend en vivo |

---

## Resolución de Problemas Comunes

### `Firebase Auth not initialized`
Asegúrate de que `mobile/firebaseConfig.js` se importe correctamente y que las variables `EXPO_PUBLIC_FIREBASE_*` estén definidas en `mobile/.env`. Recuerda que **Expo no recarga `.env` en caliente**: detén el dev server y vuelve a ejecutar `pnpm exec expo start --clear`.

### `Faltan credenciales de Firebase Admin en backend/.env`
El backend abortó al iniciar porque le faltan `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` o `FIREBASE_PRIVATE_KEY`. Verifica el `.env` correspondiente y que `FIREBASE_PRIVATE_KEY` esté entre comillas dobles con los `\n` literales.

### `Connection refused` al backend desde la app
- En **modo local**: revisa que el backend esté corriendo (`http://localhost:3000/api/test`). En emulador Android usa `http://10.0.2.2:3000`; en dispositivo físico, la IP LAN de tu máquina. Apunta `EXPO_PUBLIC_API_URL` a esa dirección.
- En **modo Docker**: comprueba con `docker compose ps` que `carshop-backend` está `healthy` y revisa logs con `docker compose logs backend`.

### `Database connection failed` en `/api/test`
PostgreSQL no responde. En local valida que el servicio esté arriba y que `DB_HOST`, `DB_PORT`, `DB_USER` y `DB_PASSWORD` sean correctos. En Docker espera unos segundos al primer `up`: el backend usa `depends_on: db: condition: service_healthy`, así que si el healthcheck falla, el backend no arrancará.

### Error de CORS
El backend ya monta `cors()` sin restricciones de origen. Si pese a eso ves errores, asegúrate de no haber añadido un proxy intermedio que sobrescriba los headers. En Docker, el frontend y el backend comparten origen vía Nginx, así que CORS no debería aparecer.

### `Stock insuficiente`
Es una validación del backend en `addProducts` y `createVenta`. Significa que la `cantidad` solicitada excede `producto.cantidad_stock`. Actualiza el stock desde la pantalla **Inventario** del recepcionista o con `PUT /api/v1/productos/:id/stock`.

### `Todos los servicios seleccionados ya existen en esta orden`
`ordenController.addServices` rechaza servicios duplicados. Quita los servicios ya añadidos antes de enviar la lista.

### Cambios en `mobile/` no se reflejan al usar Docker
El frontend se construye en build-time dentro de `nginx`. Tras modificar código de la app o variables `EXPO_PUBLIC_*`, reconstruye:
```bash
docker compose build nginx
docker compose up -d nginx
```

### Módulos no encontrados
Asegúrate de haber ejecutado `pnpm install` en `backend/` **y** en `mobile/`. Si alternas entre `npm` y `pnpm`, borra `node_modules/` y reinstala con un único gestor para evitar lockfiles cruzados.

### `Acceso denegado. Usuario autenticado, pero no tiene perfil registrado en el sistema del taller.`
El usuario existe en Firebase Authentication pero no está dado de alta en la tabla `usuario` de PostgreSQL. Inserta manualmente la fila con el `firebase_uid` correcto y el `id_rol` deseado.